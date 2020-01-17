// Created by CunjunWang on 2020/1/17

const Tour = require('./../models/tourModel');
const catchAsync = require('./../utils/catchAsync');

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

exports.getTour = catchAsync(async (req, res) => {
  // 1. get the data, for the requested tour
  const tour = await Tour.findOne({ slug: req.params.slug })
    .populate({
      path: 'reviews',
      fields: 'review rating user'
    });

  // 2. build template

  // 3. render template using the data
  res.status(200).render('tour', {
    title: 'The Forest Hiker Tour',
    tour
  });
});
