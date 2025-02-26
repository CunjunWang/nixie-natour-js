// Created by CunjunWang on 2020/1/17

const User = require('./../models/userModel');
const Tour = require('./../models/tourModel');
const Booking = require('./../models/bookingModel');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');

exports.getOverview = catchAsync(async (req, res, next) => {
  // 1. Get tour data from the collection
  const tours = await Tour.find();

  // 2. build template
  // 3. render that template using tour data
  res.status(200).render('overview', {
    title: 'All Tours',
    tours
  });
});

exports.getTour = catchAsync(async (req, res, next) => {
  // 1. get the data, for the requested tour
  const tour = await Tour.findOne({ slug: req.params.slug })
    .populate({
      path: 'reviews',
      fields: 'review rating user'
    });

  if (!tour)
    return next(new AppError(`There is no tour with name \"${req.params.slug}\"`, 404));

  // 2. build template
  // 3. render template using the data
  res.status(200).render('tour', {
    title: `${tour.name} Tour`,
    tour
  });
});

exports.getLoginForm = (req, res) => {
  res.status(200).render('login', {
    title: 'Log in to your account'
  });
};

exports.getAccount = (req, res) => {
  res.status(200).render('account', {
    title: 'Your account'
  });
};

exports.updateUserData = catchAsync(async (req, res, next) => {
  const updatedUser = await User.findByIdAndUpdate(req.user.id, {
    name: req.body.name,
    email: req.body.email
  }, {
    new: true,
    runValidators: true
  });

  res.status(200).render('account', {
    title: 'Your account',
    user: updatedUser
  });
});

exports.getMyTours = catchAsync(async (req, res, next) => {
  // 1. find all bookings
  const bookings = await Booking.find({
    user: req.user.id
  });

  // 2. find tours with the returned ids
  const tourIds = bookings.map(el => el.tour);
  const tours = await Tour.find({
    _id: { $in: tourIds }
  });

  res.status(200).render('overview', {
    title: 'My Tours',
    tours
  });
});
