﻿'use strict';
const express = require('express');
const router = express.Router();
const dbF = require('../database.js');
const assert = require('assert');


/* GET users listing. */
router.post('/', function (req, res) {
    var MongoClient = require('mongodb').MongoClient;
    var url = 'mongodb://localhost:27017';
    const dbName = 'kaylee';
    MongoClient.connect(url, { useNewUrlParser: true }, function (err, client) {
        assert.equal(null, err);
        console.log("Vins connected successfully to server");

        const db = client.db(dbName);
        db.collection('vins').find({}).toArray(function (err, docs) {
            if (err) {
                console.log(err.message + " Failed to get vins.");
            } else {
                res.status(200).json(docs);
                client.close();
            }
        });
    })
});

module.exports = router;