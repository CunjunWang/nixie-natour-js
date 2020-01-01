// Created by CunjunWang on 2020/1/1
const fs = require('fs');
const express = require('express');
const morgan = require('morgan');

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

// ================== ROUTE HANDLERS ===================

let filename = `${__dirname}/dev-data/data/tours-simple.json`;
const tours = JSON.parse(fs.readFileSync(filename));

const getAllTours = (req, res) => {
    res.status(200).json({
        status: 'success',
        results: tours.length,
        data: {
            tours
        }
    });
};

const getTourWithID = (req, res) => {
    // ':id?' to make it optional
    const id = req.params.id * 1;
    const tour = tours.find(el => el.id === id);

    if (!tour)
        return res.status(404).json({
            status: 'fail',
            message: 'Invalid ID'
        });

    res.status(200).json({
        status: 'success',
        data: {
            tour
        }
    });
};

const createTour = (req, res) => {
    // console.log(req.body);
    const newId = tours[tours.length - 1].id + 1;
    const newTour = Object.assign({id: newId}, req.body);

    tours.push(newTour);

    // don't use sync version of function in callback
    fs.writeFile(filename, JSON.stringify(tours), err => {
        // 201: created
        res.status(201).json({
            status: 'success',
            data: {
                tour: newTour
            }
        })
    });
};

const updateTour = (req, res) => {
    const id = req.params.id * 1;
    if (id > tours.length)
        return res.status(404).json({
            status: 'fail',
            message: 'Invalid ID'
        });

    res.status(200).json({
        status: 'success',
        data: {
            tour: 'Updated tour here...'
        }
    });
};

const deleteTour = (req, res) => {
    const id = req.params.id * 1;
    if (id > tours.length)
        return res.status(404).json({
            status: 'fail',
            message: 'Invalid ID'
        });

    // 204: no content
    res.status(204).json({
        status: 'success',
        data: null
    });
};

// =================== ROUTING ====================
// get all tours
// app.get('/api/v1/tours', getAllTours);
// create a new tour
// app.post('/api/v1/tours', createTour);

// get a tour with id
// app.get('/api/v1/tours/:id', getTourWithID);
// update a tour
// app.patch('/api/v1/tours/:id', updateTour);
// delete a tour
// app.delete('/api/v1/tours/:id', deleteTour);

app.route('/api/v1/tours')
    .get(getAllTours)
    .post(createTour);

app.route('/api/v1/tours/:id')
    .get(getTourWithID)
    .patch(updateTour)
    .delete(deleteTour);

// ================== SERVER =================

const port = 3000;
app.listen(port, () => {
    console.log(`App running on port ${port}...`);
});

