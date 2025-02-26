// Created by CunjunWang on 2020/1/16

const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');
const APIFeatures = require('./../utils/apiFeatures');

exports.deleteOne = Model =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.findByIdAndDelete(req.params.id);

    if (!doc)
      return next(new AppError('No document found with that ID', 404));

    // 204: no content
    res.status(204).json({
      status: 'success',
      data: null
    });
  });

exports.updateOne = Model =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    if (!doc)
      return next(new AppError('No document found with that ID', 404));

    res.status(200).json({
      status: 'success',
      data: {
        data: doc
      }
    });
  });

exports.createOne = Model => catchAsync(async (req, res, next) => {
  const doc = await Model.create(req.body);

  // 201: created
  res.status(201).json({
    status: 'success',
    data: {
      data: doc
    }
  });
});

exports.getOne = (Model, populateOptions) => catchAsync(async (req, res, next) => {
  let query = Model.findById(req.params.id);

  if (populateOptions)
    query = query.populate(populateOptions);

  const doc = await query;

  if (!doc)
    return next(new AppError('No document found with that ID', 404));

  res.status(200).json({
    status: 'success',
    data: {
      data: doc
    }
  });
});

exports.getAll = Model => catchAsync(async (req, res, next) => {

  // To allow for nested get reviews on tour
  let filter = {};
  if (req.params.tourId)
    filter = { tour: req.params.tourId };

  // Build the query
  // 1. filtering
  // 2. sorting
  // 3. field limiting / projecting
  // 4. paging
  const features = new APIFeatures(Model.find(filter), req.query)
    .filter().sort().limitFields().paginate();

  // Execute the query
  const docs = await features.query.explain();

  // Send response
  res.status(200).json({
    status: 'success',
    results: docs.length,
    data: {
      data: docs
    }
  });
});
