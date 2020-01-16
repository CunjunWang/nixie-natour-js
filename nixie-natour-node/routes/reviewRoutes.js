// Created by CunjunWang on 2020/1/15

const express = require('express');
const reviewController = require('./../controllers/reviewController');
const authController = require('./../controllers/authController');

const router = express.Router({
  mergeParams: true
});

// The following actions should be performed only by logged in users
router.use(authController.protect);

router.route('/')
  .get(reviewController.getAllReviews)
  .post(
    authController.restrictTo('user'),
    reviewController.setTourUserIds,
    reviewController.createReview);

router
  .route('/:id')
  .get(reviewController.getReviewWithId)
  .patch(
    authController.restrictTo('admin', 'user'),
    reviewController.updateReview)
  .delete(
    authController.restrictTo('admin', 'user'),
    reviewController.deleteReview);

module.exports = router;
