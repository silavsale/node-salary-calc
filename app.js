const express = require('express');
const morgan = require('morgan');
const fs = require("fs");
// const {Pool, Client} = require('pg');
const bodyParser = require('body-parser');

const contents = fs.readFileSync("user.json");
const jsonContent = JSON.parse(contents);

const app = express();
const port = 3000;

app.use(morgan('short'));

app.use(bodyParser.urlencoded({extended: false}));
app.use(express.static('./public'));

const router = require('./routes/car');

app.use(router);

app.listen(port, () => {
    console.log(`Server is up and listening on port ${port}`)
});
