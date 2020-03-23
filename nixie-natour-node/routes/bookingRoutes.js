// Created by CunjunWang on 2020/3/23

const express = require('express');
const bookingController = require('./../controllers/reviewController');
const authController = require('./../controllers/authController');

const router = express.Router({
  mergeParams: true
});

router.get('/checkout-session/:tourId',
  authController.protect,
  bookingController.getCheckoutSession);

module.exports = router;
