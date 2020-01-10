// Created by CunjunWang on 2020/1/1

const express = require('express');
const tourController = require('./../controllers/tourController');
const router = express.Router();

// parameter middleware
// router.param('id', tourController.checkID);

router
  .route('/top-5-cheap')
  .get(tourController.aliasTopTours, tourController.getAllTours);

router
  .route('/')
  .get(tourController.getAllTours)
  .post(tourController.createTour);

router
  .route('/:id')
  .get(tourController.getTourWithID)
  .patch(tourController.updateTour)
  .delete(tourController.deleteTour);

module.exports = router;
