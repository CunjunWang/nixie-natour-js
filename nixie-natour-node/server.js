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

mongoose.connect(DB, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false
}).then(() => {
  console.log('DB connection successful!');
});

const tourSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'A tour must have a name'],
    unique: true
  },
  rating: {
    type: Number,
    default: 4.5
  },
  price: {
    type: Number,
    required: [true, 'A tour must have a price']
  }
});

const Tour = mongoose.model('Tour', tourSchema);

const testTour = new Tour({
  name: 'The Parker Camper',
  rating: 4.7,
  price: 497
});

testTour.save().then(doc => {
  console.log(doc);
}).catch(err => {
  console.log('ERROR: ', err);
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});
