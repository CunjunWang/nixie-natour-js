// Created by CunjunWang on 2020/1/1
const fs = require('fs');

const express = require('express');
const app = express();

app.use(express.json());

// app.get('/', (req, res) => {
//     res.status(200)
//         .json({message: 'Hello from the server side', app: 'Natour'});
// });
//
// app.post('/', (req, res) => {
//     res.send('You can post to this endpoint...');
// });

let filename = `${__dirname}/dev-data/data/tours-simple.json`;

const tours = JSON.parse(fs.readFileSync(filename));

// =================== ROUTING ====================

// get all tours
app.get('/api/v1/tours', (req, res) => {
    res.status(200).json({
        status: 'success',
        results: tours.length,
        data: {
            tours
        }
    });
});

// get a tour with id
app.get('/api/v1/tours/:id', (req, res) => {
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
});

// create a new tour
app.post('/api/v1/tours', (req, res) => {
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
});

// update a tour
app.patch('/api/v1/tours/:id', (req, res) => {
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
});

// delete a tour
app.delete('/api/v1/tours/:id', (req, res) => {
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
});

const port = 3000;
app.listen(port, () => {
    console.log(`App running on port ${port}...`);
});

