const express = require('express');
const app = express();
// const path = require('path');
let cors = require('cors');
let bodyParser = require('body-parser'); 



app.use(cors())
let api = require('./routes/api');

//Sending a GET to localhost:8080/dummy should return this
app.get('/', (req, res) => res.send('Larissa Hirata - ST IT Cloud - Development Test LV. 3'))

app.listen(3000);

app.use(function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header(
        'Access-Control-Allow-Headers',
        'Origin, X-Requested-With, Content-Type, Accept'
    );
    next();
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/api', api);
console.log("Server running on 3000")


app.use(express.static('./public/index.html'));

module.exports = app;