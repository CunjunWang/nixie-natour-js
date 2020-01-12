// Created by CunjunWang on 2020/1/12

const User = require('./../models/userModel');
const catchAsync = require('./../utils/catchAsync');

exports.signUp = catchAsync(async (req, res, next) => {
  const newUser = await User.create(req.body);

  res.status(201).json({
    status: 'success',
    data: {
      user: newUser
    }
  });
});
