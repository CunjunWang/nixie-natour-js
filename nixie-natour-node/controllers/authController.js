// Created by CunjunWang on 2020/1/12

const { promisify } = require('util');
const jwt = require('jsonwebtoken');
const User = require('./../models/userModel');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');

const signToken = id => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRATION
  });
};

exports.signUp = catchAsync(async (req, res, next) => {
  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm
  });

  const token = signToken(newUser._id);

  res.status(201).json({
    status: 'success',
    token,
    data: {
      user: newUser
    }
  });
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
  const token = signToken(user._id);

  res.status(200).json({
    status: 'success',
    token
  });
});

exports.protect = catchAsync(async (req, res, next) => {
  let token;

  // 1. get the token and check if it exists
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer'))
    token = req.headers.authorization.split(' ')[1];

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
