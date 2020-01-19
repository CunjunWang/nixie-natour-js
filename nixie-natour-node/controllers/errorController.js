// Created by CunjunWang on 2020/1/10

const AppError = require('./../utils/appError');

const handleCastErrorDB = err => {
  const message = `Invalid ${err.path}: ${err.value}.`;
  return new AppError(message, 400);
};

const handleDuplicateFieldsDB = err => {
  const value = err.errmsg.match(/(["'])(\\?.)*?\1/)[0];
  const message = `Duplicate field value: ${value}. Please use another value.`;
  return new AppError(message, 400);
};

const handleValidationErrorDB = err => {
  const errors = Object.values(err.errors)
    .map(el => el.message);
  const message = `Invalid input data. ${errors.join('. ')}`;
  return new AppError(message, 400);
};

const handleJWTError = () => new AppError('Invalid token. Please login again', 401);

const sendErrorDev = (err, req, res) => {
  if (req.originalUrl.startsWith('/api'))
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
      error: err,
      stack: err.stack
    });
  else
    res.status(err.statusCode).render('error', {
      title: 'Something went wrong!',
      msg: err.message
    });
};

const sendErrorProd = (err, req, res) => {
  if (req.originalUrl.startsWith('/api'))
    // operation, trusted error
    if (err.isOperational)
      res.status(err.statusCode).json({
        status: err.status,
        message: err.message
      });
    else {
      // 1. log the error
      console.error('ERROR: ', err);

      // 2. send a generic message
      res.status(500).json({
        status: 'error',
        message: 'Something went wrong on server-side.'
      });
    }
  else if (err.isOperational)
    res.status(err.statusCode).render('error', {
      title: 'Something went wrong!',
      msg: err.message
    });
  else
    res.status(err.statusCode).render('error', {
      title: 'Something went wrong!',
      msg: 'Please try again later.'
    });
};

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  if (process.env.NODE_ENV === 'development')
    sendErrorDev(err, req, res);
  else if (process.env.NODE_ENV === 'production') {
    // hard copy of original err
    let error = { ...err };
    error.message = err.message;

    if (error.name === 'CastError')
      error = handleCastErrorDB(error);

    if (error.code === 11000)
      error = handleDuplicateFieldsDB(error);

    if (err.name === 'ValidationError')
      error = handleValidationErrorDB(error);

    if (err.name === 'JsonWebTokenError' || err.name === 'TokenExpiredError')
      error = handleJWTError();

    sendErrorProd(error, req, res);
  }
};
