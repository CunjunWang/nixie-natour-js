// Created by CunjunWang on 2020/1/7

const mongoose = require('mongoose');
const slugify = require('slugify');

const tourSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'A tour must have a name'],
    unique: true,
    trim: true,
    maxlength: [40, 'A tour name must be less or equal than 40 characters'],
    minlength: [10, 'A tour name must be more or equal than 10 characters']
    // validate: [validator.isAlpha, 'A tour name must only contain characters']
  },
  slug: String,
  duration: {
    type: Number,
    required: [true, 'A tour must have a duration']
  },
  maxGroupSize: {
    type: Number,
    required: [true, 'A tour must have a group size']
  },
  difficulty: {
    type: String,
    required: [true, 'A tour must have a difficulty'],
    enum: {
      values: ['easy', 'medium', 'difficult'],
      message: 'Difficulty is either: easy, medium, difficulty'
    }
  },
  ratingsAverage: {
    type: Number,
    default: 4.5,
    min: [1, 'Rating must be above 1.0'],
    max: [5, 'Rating must be below 5.0']
  },
  ratingsQuantity: {
    type: Number,
    default: 0
  },
  price: {
    type: Number,
    required: [true, 'A tour must have a price']
  },
  priceDiscount: {
    type: Number,
    validate: {
      validator: function(val) {
        // 'this' only points to current document on NEW document creation
        // does not work for update method
        return this.price > val;
      },
      message: 'Discount price ({VALUE}) should be below the regular price'
    }
  },
  summary: {
    type: String,
    trim: true,
    required: [true, 'A tour must have a summary']
  },
  description: {
    type: String,
    trim: true
  },
  imageCover: {
    type: String,
    required: [true, 'A tour must have a image cover']
  },
  images: [String],
  createdAt: {
    type: Date,
    default: Date.now(),
    select: false
  },
  startDates: [Date],
  secretTour: {
    type: Boolean,
    default: false
  }
}, {
  toJSON: {
    virtual: true
  },
  toObject: {
    virtual: true
  }
});

tourSchema.virtual('durationWeeks').get(function() {
  return this.duration / 7;
});

// Document middleware,
// runs before the .save() and .create()
// not .insertMany()
tourSchema.pre('save', function(next) {
  // this: current processed document
  this.slug = slugify(this.name, { lower: true });
  next();
});

// tourSchema.pre('save', function(next) {
//   // this: current processed document
//   console.log('Will save document');
//   next();
// });
//
// // runs after the .save() and .create()
// tourSchema.post('save', function(doc, next) {
//   // this: current processed document
//   console.log(doc);
//   next();
// });

// Query middleware
tourSchema.pre(/^find/, function(next) {
  // this: current Query object
  this.find({ secretTour: { $ne: true } });
  this.start = Date.now();
  next();
});

tourSchema.post(/^find/, function(docs, next) {
  console.log(`Query took ${Date.now() - this.start} milliseconds`);
  next();
});

// Aggregation middleware
tourSchema.pre('aggregate', function(next) {
  this.pipeline().unshift({ $match: { secretTour: { $ne: true } } });
  next();
});

const Tour = mongoose.model('Tour', tourSchema);

module.exports = Tour;
