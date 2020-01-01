// Created by CunjunWang on 2020/1/1

const express = require('express');
const userController = require('./../controllers/userController');
const router = express.Router();

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
