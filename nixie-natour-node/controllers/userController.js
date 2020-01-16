// Created by CunjunWang on 2020/1/1

const User = require('./../models/userModel');
const AppError = require('./../utils/appError');
const catchAsync = require('./../utils/catchAsync');
const factory = require('./handlerFactory');

const filterObject = (obj, ...allowedFields) => {
  const newObj = {};
  Object.keys(obj).forEach(el => {
    if (allowedFields.includes(el))
      newObj[el] = obj[el];
  });
  return newObj;
};

exports.createUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'Please use sign up instead'
  });
};

exports.updateMe = catchAsync(async (req, res, next) => {
  // 1. create error if user post password data
  if (req.body.password || req.body.passwordConfirm)
    return next(new AppError('This route is not for password updates', 400));

  // 2. filter fields not allowed to update
  const filterBody = filterObject(req.body, 'name', 'email');

  // 3. update user document
  const updatedUser = await User.findByIdAndUpdate(req.user.id,
    filterBody, {
      new: true,
      runValidators: true
    });

  res.status(200).json({
    status: 'success',
    data: {
      user: updatedUser
    }
  });
});

// user use to inactivate his account
exports.deleteMe = catchAsync(async (req, res, next) => {
  await User.findByIdAndUpdate(req.user.id, {
    active: false
  });

  res.status(204).json({
    status: 'success',
    data: null
  });
});

exports.getMe = (req, res, next) => {
  req.params.id = req.user.id;
  next();
};

exports.getAllUsers = factory.getAll(User);

exports.getUserWithID = factory.getOne(User);

exports.updateUser = factory.updateOne(User);

// admin use to delete a user
exports.deleteUser = factory.deleteOne(User);
