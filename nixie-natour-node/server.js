// Created by CunjunWang on 2020/1/1

const mongoose = require('mongoose');

const env = require('dotenv');
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
}).catch(err => {
  console.error(`Failed to connect to database ${DB}`);
  console.log(err);
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});
