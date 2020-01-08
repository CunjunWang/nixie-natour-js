// Created by CunjunWang on 2020/1/1

const Tour = require('./../models/tourModels');

exports.getAllTours = async (req, res) => {
  try {
    const tours = await Tour.find();
    res.status(200).json({
      status: 'success',
      results: tours.length,
      data: {
        tours
      }
    });
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err
    });
  }
};

exports.getTourWithID = async (req, res) => {
  try {
    // ':id?' to make it optional;
    const tour = await Tour.findById(req.params.id);
    res.status(200).json({
      status: 'success',
      data: {
        tour
      }
    });
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err
    });
  }
};

exports.createTour = async (req, res) => {
  try {
    console.log('run here in creating new tours');
    const newTour = await Tour.create(req.body);
    // 201: created
    res.status(201).json({
      status: 'success',
      data: {
        tour: newTour
      }
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err
    });
  }
};

exports.updateTour = (req, res) => {
  // res.status(200).json({
  //   status: 'success',
  //   data: {
  //     tour: 'Updated tour here...'
  //   }
  // });
};

exports.deleteTour = (req, res) => {
  // 204: no content
  // res.status(204).json({
  //   status: 'success',
  //   data: null
  // });
};
