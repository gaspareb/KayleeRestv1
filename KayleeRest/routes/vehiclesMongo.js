'use strict';
const express = require('express');
const router = express.Router();
const dbF = require('../database.js');
const assert = require('assert');
const app = express();
const MongoClient = require('mongodb').MongoClient;
const url = 'mongodb://localhost:27017';
const dbName = 'kaylee';
const objectID = require('mongodb').ObjectId

app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET, PUT, POST, DELETE, OPTIONS");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

router.get('/:vinID', function (req, res) {
    const db = "";
    MongoClient.connect(url, { useNewUrlParser: true }, function (err, client) {
        assert.equal(null, err);
        console.log("Vehicle " + req.params.vinID + " connected successfully to server @" + Date());
        const db = client.db(dbName);
        db.collection('vehicles').find({ "VINNumber": req.params.vinID }).toArray(function (err, docs) {
            if (err) {
                console.log(err.message + " Failed to get vehicle " + req.params.vinID);
            } else {
                res.status(200).json(docs);
                client.close();
            }
        });
    })
});

router.post('/add/', function (req, res) {
    const data = req.body;
    MongoClient.connect(url, { useNewUrlParser: true }, function (err, client) {
        assert.equal(null, err);
        const db = client.db(dbName);
        console.log("/ADD/Vehicle " + data + " connected successfully to server @" + Date());
        db.collection('vehicles').insertOne(data, function (error, response) {
            if (error) {
                res.status(500).send({ success: false, message: 'VINNumber ' + data.VINNumber + ' already exists!' });
                console.log(error.message);
            } else {
                res.status(200).send({ success: true, message: 'VINNumber ' + data.VINNumber + ' has been added!' });
            }
        }); 
    })
});

router.put('/update/', function (req, res) {
    var bodyData = req.body;
    var item = {
        VINNumber: bodyData.VINNumber,
        Year: bodyData.Year,
        Make: bodyData.Make,
        Model: bodyData.Model,
        Color: bodyData.Color,
        AuctionDate: bodyData.AuctionDate,
        ClosingDate: bodyData.ClosingDate,
        RunNumber: bodyData.RunNumber,
        LaborDescription: bodyData.LaborDescription,
        LaborCost: bodyData.LaborCost,
        PartDescription: bodyData.PartDescription,
        PartsCost: bodyData.PartsCost
    };
    console.log("theID:" + bodyData.VINNumber);

    console.log("/UPDATE/Vehicle " + bodyData.VINNumber + " connected successfully to server @" + Date()); 

    MongoClient.connect(url, { useNewUrlParser: true }, function (err, client) {
        assert.equal(null, err);
        const db = client.db(dbName);
        db.collection('vehicles').updateOne({ '_id': objectID(req.body._id) }, { $set: item }, function (error, response) { 
            if (error) {
                res.status(500).send({ success: false, message: 'VINNumber ' + req.body.VINNumber + ' failed to update!' });
                console.log(error.message);
            } else {
                res.status(200).send({ success: true, message: 'VINNumber ' + req.body.VINNumber + ' has been updated!' });
            }
        });
    })
});

router.delete('/:VINNumber', function (req, res) {
    const db = "";
    const data = req.params.VINNumber;
    MongoClient.connect(url, { useNewUrlParser: true }, function (err, client) {
        assert.equal(null, err);
        console.log("DELETE Vehicle " + data + " connected successfully to server @" + Date());
        const db = client.db(dbName);
        db.collection('vehicles').deleteOne({ VINNumber: data }, function (error, obj) {
            if (obj.result.n == 0) {
                res.status(500).send({ success: false, message: 'Error deleting VINNumber ' + data + '!'});
            } else {
                res.status(200).send({ success: true, message: 'VINNumber ' + data + ' has been deleted!' });
            }
        });
    })
});

router.get('/', function (req, res) {
    MongoClient.connect(url, { useNewUrlParser: true }, function (err, client) {
        assert.equal(null, err);
        console.log('GET ALL Vehicles Mongo VINS connected successfully to server @ ' + Date());
        const db = client.db(dbName);
        db.collection('vehicles').distinct('VINNumber', { }, function (err, docs) {
            if (err) {
                console.log(err.message + ' Failed to get vehicle VINs.');
                res.status(500).send({ error: err.message });
            } else {
                res.status(200).json(docs);
                client.close();
            }
        });
    })
});

module.exports = router; 