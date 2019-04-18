'use strict';
const debug = require('debug');
const express = require('express');
const path = require('path');
const vehicles = require('./routes/vehicles');
const vehiclesMongo = require('./routes/vehiclesMongo');
const reports = require('./routes/reports');
const mongoose = require('mongoose');
const bodyParser = require("body-parser");
const app = express();
const kayleeDBUrlPath = 'mongodb://localhost:27017';
const kayleeDBName = 'kaylee';

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use('/reports', reports);
app.use('/vehicles', vehicles);
app.use('/vehiclesMongo', vehiclesMongo);

app.set('port', process.env.PORT || 3000);

app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET, PUT, POST, DELETE, OPTIONS");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.setHeader('Content-Type', 'application/json');
    next();
});

var server = app.listen(app.get('port'), function () {
    console.log('Express server listening on port ' + server.address().port);
    debug('Express server listening on port ' + server.address().port);
});


