// Created by CunjunWang on 2020/1/12

const { promisify } = require('util');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const User = require('./../models/userModel');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');
const Email = require('./../utils/email');

const signToken = id => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRATION
  });
};

const createAndSendToken = (user, statusCode, res) => {
  const token = signToken(user._id);

  const cookieOptions = {
    expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRATION * 24 * 3600 * 1000),
    httpOnly: true
  };

  if (process.env.NODE_ENV === 'production')
    cookieOptions.secure = true;

  res.cookie('jwt', token, cookieOptions);

  // remove password from output
  user.password = undefined;

  res.status(statusCode).json({
    status: 'success',
    token,
    data: {
      user
    }
  });
};

exports.signUp = catchAsync(async (req, res, next) => {
  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm
  });

  const url = `${req.protocol}://${req.get('host')}/me`;

  await new Email(newUser, url).sendWelcome();

  createAndSendToken(newUser, 201, res);
});

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  // 1. check if email and password exist
  if (!email || !password)
    return next(new AppError('Please provide email and password', 400));

  // 2. check if the user exists & if the password is correct
  const user = await User.findOne({ email }).select('+password');
  if (!user)
    return next(new AppError(`Incorrect email or password`, 401));

  const correct = await user.correctPassword(password, user.password);
  if (!correct)
    return next(new AppError(`Incorrect email or password`, 401));

  // 3. send the JWT to client
  createAndSendToken(user, 200, res);
});

exports.logout = (req, res) => {
  res.cookie('jwt', 'logged out', {
    expires: new Date(Date.now() * 10 * 1000),
    httpOnly: true
  });

  res.status(200).json({
    status: 'success'
  });
};

exports.protect = catchAsync(async (req, res, next) => {
  let token;

  // 1. get the token and check if it exists
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer'))
    token = req.headers.authorization.split(' ')[1];
  else if (req.cookies.jwt)
    token = req.cookies.jwt;

  if (!token)
    return next(new AppError('You are not logged in!', 401));

  // 2. validate the token
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

  if (!decoded)
    return next(new AppError('Invalid token, please login!', 401));

  // 3. check if the user still exists
  const freshUser = await User.findById(decoded.id);
  if (!freshUser)
    return next(new AppError('The token belongs to an invalid user!', 401));

  // 4. check if user changed password after the JWT is issued
  const changed = freshUser.changedPasswordAfter(decoded.iat);
  if (changed)
    return next(new AppError('User password has changed, please login again!', 401));

  // 5. if not any problem, pass protection, grant access to the next route.
  req.user = freshUser;
  res.locals.user = freshUser;
  next();
});

exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    // roles is an arbitrary length array
    if (!roles.includes(req.user.role))
      return next(new AppError('You do not have permission to this action', 403));

    next();
  };
};

exports.forgotPassword = catchAsync(async (req, res, next) => {
  // 1. get user based on email
  const user = await User.findOne({ email: req.body.email });
  if (!user)
    return next(new AppError('There is no user with that email', 404));

  // 2. generate the random reset token
  const resetToken = user.createPasswordResetToken();
  await user.save({ validateBeforeSave: false });

  // 3. send it to user's email
  const resetUrl = `${req.protocol}://${req.get('host')}/api/v1/users/resetPassword/${resetToken}`;
  const message = `Forgot your password? Submit your new password and confirm to: ${resetUrl}\nIf you did not forget your password, ignore this message.`;

  try {
    // await sendEmail({
    //   email: user.email,
    //   subject: 'Your password reset token (valid for 10 minutes)',
    //   message
    // });

    res.status(200).json({
      status: 'success',
      message: 'Token sent to email!'
    });
  } catch (err) {
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save({ validateBeforeSave: false });
    return next(new AppError('An error sending the email. Try again later', 500));
  }
});

exports.resetPassword = catchAsync(async (req, res, next) => {
  // 1. get user based on the token
  const hashedToken = crypto.createHash('sha256')
    .update(req.params.token).digest('hex');

  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: {
      $gt: Date.now()
    }
  });

  if (!user)
    return next(new AppError('Token is invalid or has expired', 400));

  // 2. if token not expired, set the new password
  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  await user.save();

  // 3. update changedPasswordAt property
  // done in middleware

  // 4. log the user in
  createAndSendToken(user, 200, res);
});

exports.updatePassword = catchAsync(async (req, res, next) => {
  // 1. get the user from collection
  const user = await User.findById(req.user.id).select('+password');

  if (!user)
    return next(new AppError('Token is invalid or has expired', 400));

  // 2. check if the posted password is correct
  const isCorrect = await user.correctPassword(req.body.passwordCurrent, user.password);

  if (!isCorrect)
    return next(new AppError('Your current password is wrong.', 401));

  // 3. if so, update password
  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  await user.save();

  // why not use User.findByIdAndUpdate() ?
  // (1). The validator only works for create() and save(), see
  // the mongoose document and comment in the code
  // (2). The pre save middle-wares are defined only on save()

  // 4. log the user in, send JWT
  createAndSendToken(user, 200, res);
});

// Only for render pages, no errors
exports.isLoggedIn = async (req, res, next) => {
  const token = req.cookies.jwt;
  if (token) {
    try {
      // 1. verify the token
      const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

      // 2. check if the user still exists
      const currentUser = await User.findById(decoded.id);
      if (!currentUser)
        return next();

      // 3. check if user changed password after the JWT is issued
      const changed = currentUser.changedPasswordAfter(decoded.iat);
      if (changed)
        return next();

      // 4. if not any problem, pass protection, grant access to the next route.
      res.locals.user = currentUser;
      return next();
    } catch (err) {
      return next();
    }
  }

  next();
};
