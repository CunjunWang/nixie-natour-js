// Created by CunjunWang on 2020/1/1

const Tour = require('./../models/tourModels');

exports.getAllTours = (req, res) => {
  // res.status(200).json({
  //   status: 'success',
  //   results: tours.length,
  //   data: {
  //     tours
  //   }
  // });
};

exports.getTourWithID = (req, res) => {
  // ':id?' to make it optional
  // const id = req.params.id * 1;
  // const tour = tours.find(el => el.id === id);
  //
  // res.status(200).json({
  //   status: 'success',
  //   data: {
  //     tour
  //   }
  // });
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
