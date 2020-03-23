// Created by CunjunWang on 2020/1/8

const fs = require('fs');
const mongoose = require('mongoose');

const env = require('dotenv');
env.config({ path: './config.env' });

const Tour = require('../../models/tourModel');
const User = require('../../models/userModel');
const Review = require('../../models/reviewModel');

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
}).catch(err => {
  console.error(`Failed to connect to database ${DB}`);
  console.log(err);
});

// Read Json file
const tours = JSON.parse(fs.readFileSync(`${__dirname}/tours.json`, 'utf-8'));
const users = JSON.parse(fs.readFileSync(`${__dirname}/users.json`, 'utf-8'));
const reviews = JSON.parse(fs.readFileSync(`${__dirname}/reviews.json`, 'utf-8'));

// import data to DB
const importData = async () => {
  try {
    console.log('Importing tour data...');
    await Tour.create(tours);
    console.log('Tour data finished');
    console.log('Importing user data...');
    await User.create(users, { validateBeforeSave: false });
    console.log('User data finished');
    console.log('Importing review data...');
    await Review.create(reviews);
    console.log('Review data finished');
    process.exit();
  } catch (err) {
    console.log(err);
  }
};

// delete data from Collection
const deleteData = async () => {
  try {
    await Tour.deleteMany();
    await User.deleteMany();
    await Review.deleteMany();
    console.log('Data deleted');
    process.exit();
  } catch (err) {
    console.log(err);
  }
};

if (process.argv[2] === '--import')
  importData();
else if (process.argv[2] === '--delete')
  deleteData();
