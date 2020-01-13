// Created by CunjunWang on 2020/1/12

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
