const express = require('express');
const morgan = require('morgan');
const fs = require("fs");
const {Pool, Client} = require('pg');
const bodyParser = require('body-parser');

const contents = fs.readFileSync("user.json");
const jsonContent = JSON.parse(contents);

const app = express();
const port = 3000;

app.use(morgan('short'));

app.use(bodyParser.urlencoded({extended: false}));
app.use(express.static('./public'));

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

app.post('/car_create', (req, res) => {
    const make = req.body.create_make;
    const model = req.body.create_model;

    client.query(`INSERT INTO cars (make, model) VALUES ($1, $2) RETURNING car_id , "make", "model"`, [make, model], (error, results) => {
        if (error) {
            throw error
        }
        // res.status(201).send(`Car added with ID: ${res};`);
        console.log(`Make ${results.make} and ${results.model}`);
        res.status(201).send(`${results.make}`);
        // console.log(results.rows);
        res.end();
    });
});

// pool.query('SELECT * FROM user', (err, res) => {
//     pool.end()
// });


app.get('/car/:id', (req, res) => {
    console.log('Fetching car with id: ' + req.params.id);

    const car_id = req.params.id;
    const queryString = `SELECT * FROM cars WHERE car_id= ${car_id}`;

    // callback
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

    // const getUsers = (request, response) => {
    //     client.query('SELECT * FROM nodeTest ORDER BY id ASC', (error, results) => {
    //         if (error) {
    //             throw error
    //         }
    //         response.status(200).json(results.rows)
    //     })
    // }

    // res.end();
});

app.get('/', (req, res) => {
    console.log('Responging to root route');
    res.send('Hello from Root');
});

app.get('/users', (req, res) => {
    res.send(jsonContent);
});

app.listen(port, () => {
    console.log(`Server is up and listening on port ${port}`)
});
