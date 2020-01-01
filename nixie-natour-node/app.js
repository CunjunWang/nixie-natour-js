// Created by CunjunWang on 2020/1/1

const express = require('express');
const morgan = require('morgan');

const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');

const app = express();

// ================== MIDDLE-WARES ===================
// the order of middleware matters
// all routes are also middleware in express
app.use(morgan('dev'));

app.use(express.json());

app.use((req, res, next) => {
    console.log('Hello from the middleware');
    // must call the next() function in middle-ware
    next();
});

app.use((req, res, next) => {
    req.requestTime = new Date().toISOString();
    next();
});

// =================== ROUTING ====================
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);

// ================== SERVER =================
module.exports = app;
