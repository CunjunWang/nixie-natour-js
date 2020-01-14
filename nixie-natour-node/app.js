// Created by CunjunWang on 2020/1/1

const express = require('express');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');

const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');
const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');

const app = express();

// ================== Global MIDDLE-WARES ===================
// the order of middleware matters
// all routes are also middleware in express
if (process.env.NODE_ENV === 'development')
  app.use(morgan('dev'));

// rate limiter
const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: 'Too many request from this IP. Please try again later'
});

app.use('/api', limiter);
app.use(express.json());
app.use(express.static(`${__dirname}/public`));

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  // console.log(req.headers);
  next();
});

// =================== ROUTING ====================
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);

// handle unmatched router
app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server`, 404));
});

app.use(globalErrorHandler);

// ================== SERVER =================
module.exports = app;
