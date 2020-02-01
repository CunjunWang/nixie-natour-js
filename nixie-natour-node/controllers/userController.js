// Created by CunjunWang on 2020/1/1

const multer = require('multer');
const sharp = require('sharp');
const User = require('./../models/userModel');
const AppError = require('./../utils/appError');
const catchAsync = require('./../utils/catchAsync');
const factory = require('./handlerFactory');

// const multerStorage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, 'public/img/users');
//   },
//   filename: (req, file, cb) => {
//     // user-id-timestamp.jpeg
//     const ext = file.mimetype.split('/')[1];
//     cb(null, `user-${req.user.id}-${Date.now()}.${ext}`);
//   }
// });
const multerStorage = multer.memoryStorage();

// test if the file is an image
const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image'))
    cb(null, true);
  else
    cb(new AppError('Not an image! Please upload only images', 400), false);
};

const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter
});

exports.uploadUserPhoto = upload.single('photo');

exports.resizeUserPhoto = catchAsync(async (req, res, next) => {
  if (!req.file)
    return next();

  req.file.filename = `user-${req.user.id}-${Date.now()}.jpeg`;

  // image resizing
  await sharp(req.file.buffer)
    .resize(500, 500)
    .toFormat('jpeg')
    .jpeg({ quality: 90 })
    .toFile(`public/img/users/${req.file.filename}`);

  next();
});

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
  console.log(req.body);
  const filterBody = filterObject(req.body, 'name', 'email');

  if (req.file)
    filterBody.photo = req.file.filename;

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
