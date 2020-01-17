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

exports.getTour = (req, res) => {
  res.status(200).render('tour', {
    title: 'The Forest Hiker Tour'
  });
};
