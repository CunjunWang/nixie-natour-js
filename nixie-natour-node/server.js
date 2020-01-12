// Created by CunjunWang on 2020/1/1

const mongoose = require('mongoose');
const env = require('dotenv');

process.on('uncaughtException', err => {
  console.log('Uncaught Exception. Shutting down......');
  console.log(err.name, err.message);
  process.exit(1);
});

env.config({ path: './config.env' });
const app = require('./app');

const DB = process.env.DATABASE_URL
  .replace('<USERNAME>', process.env.DATABASE_USERNAME)
  .replace('<PASSWORD>', process.env.DATABASE_PASSWORD)
  .replace('<HOST>', process.env.DATABASE_HOST)
  .replace('<DATABASE>', process.env.DATABSE);

console.log(`Connecting to database ${DB}`);

mongoose.connect(DB, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true
}).then(() => {
  console.log(`Connected to database ${DB}`);
  console.log('DB connection successful!');
});

const port = process.env.PORT || 3000;
const server = app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});

process.on('unhandledRejection', err => {
  console.log('Unhandled Rejection. Shutting down......');
  console.log(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});
