// Created by CunjunWang on 2020/1/1

const express = require('express');
const userController = require('./../controllers/userController');
const authController = require('./../controllers/authController');

const router = express.Router();

// The following actions are available to every public user
router.post('/signUp', authController.signUp);
router.post('/login', authController.login);
router.get('/logout', authController.logout);
router.post('/forgotPassword', authController.forgotPassword);
router.patch('/resetPassword/:token', authController.resetPassword);

// The following actions should be performed by logged in users
router.use(authController.protect);

router.get('/me', userController.getMe, userController.getUserWithID);
router.patch('/updateMyPassword', authController.updatePassword);
router.patch('/updateMe', userController.uploadUserPhoto, userController.updateMe);
router.delete('/deleteMe', userController.deleteMe);

// The following actions should be performed only by admin
router.use(authController.restrictTo('admin'));

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
