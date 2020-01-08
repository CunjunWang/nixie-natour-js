// Created by CunjunWang on 2020/1/8

const fs = require('fs');
const mongoose = require('mongoose');

const env = require('dotenv');
env.config({ path: './config.env' });

const Tour = require('./../../models/tourModels');

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
const tours = JSON.parse(fs.readFileSync(`${__dirname}/tours-simple.json`, 'utf-8'));

// import data to DB
const importData = async () => {
  try {
    await Tour.create(tours);
    console.log('Data loaded');
    process.exit();
  } catch (err) {
    console.log(err);
  }
};

// delete data from Collection
const deleteData = async () => {
  try {
    await Tour.deleteMany();
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

