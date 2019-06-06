//will contain all of my user related routes
const express = require('express');
const {Pool, Client} = require('pg');
const router = express.Router();

const client = new Client({
    user: 'postgres',
    host: '127.0.0.1',
    database: 'nodeTest',
    password: 'u2u2u2',
    port: 5432,
});

client.connect();

const pool = new Pool({
    user: 'postgres',
    host: '127.0.0.1',
    database: 'nodeTest',
    password: 'u2u2u2',
    port: 5432,
});


router.get('/message', (req, res) => {
    console.log('Show some message or whatever..');
    res.end();
});

router.get('/cars', (req, res) => {
    const querySelect = "SELECT * FROM cars";
    client.query(querySelect, (err, rows, fields) => {
        if (err) {
            console.log(err)
            res.sendStatus(500);
            return
        }
        res.json(rows);
    });
});

router.post('/car_create', (req, res) => {
    const make = req.body.create_make;
    const model = req.body.create_model;

    client.query(`INSERT INTO cars (make, model) VALUES ($1, $2) RETURNING car_id , "make", "model"`, [make, model], (error, results) => {
        if (error) {
            throw error
        }
        // res.status(201).send(`Car added with ID: ${res};`);
        console.log();
        res.status(201).send(`Car ID is : ${results.rows[0].car_id} <br/> Make : ${results.rows[0].make} <br/> Model : ${results.rows[0].model}`);
        // console.log(results.rows);
        res.end();
    });
});

router.get('/car/:id', (req, res) => {
    console.log('Fetching car with id: ' + req.params.id);

    const car_id = req.params.id;
    const queryString = `SELECT * FROM cars WHERE car_id= ${car_id}`;

    client.query(queryString, (err, result, fields) => {
        if (err) {
            console.log(err.stack);
            res.sendStatus(500);
            res.end();
        } else {

            const car = result.rows.map((row) => {
                return {"Car ID": row.car_id, "Make": row.make, "Model": row.model}
            });

            res.json(car);
            console.log(car);
        }
    });
});

router.get('/', (req, res) => {
    console.log('Responging to root route');
    res.send('Hello from Root');
});


router.get('/users', (req, res) => {
    res.send(jsonContent);
});

module.exports = router;
