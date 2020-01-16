// Created by CunjunWang on 2020/1/1

const express = require('express');
const userController = require('./../controllers/userController');
const authController = require('./../controllers/authController');
const reviewController = require('./../controllers/reviewController');
const router = express.Router();

router.post('/signUp', authController.signUp);
router.post('/login', authController.login);
router.post('/forgotPassword', authController.forgotPassword);
router.patch('/resetPassword/:token', authController.resetPassword);
router.patch('/updateMyPassword',
  authController.protect, authController.updatePassword);

router.patch('/updateMe',
  authController.protect, userController.updateMe);
router.delete('/deleteMe',
  authController.protect, userController.deleteMe);

router
  .route('/')
  .get(userController.getAllUsers)
  .post(userController.createUser);

router
  .route('/:id')
  .get(userController.getUserWithID)
  .patch(userController.updateUser)
  .delete(userController.deleteUser);

module.exports = router;
