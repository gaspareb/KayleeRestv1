﻿'use strict';
const express = require('express');
const router = express.Router();
const dbF = require('../database.js');
const assert = require('assert');

router.get('/', function (req, res) {
    var MongoClient = require('mongodb').MongoClient;
    var url = 'mongodb://localhost:27017';
    const dbName = 'kaylee';

    MongoClient.connect(url, { useNewUrlParser: true }, function (err, client) {
        assert.equal(null, err);
        console.log("vehicles connected successfully to server");
        const db = client.db(dbName);
        db.collection('vehicles').find({}).toArray(function (err, docs) {
            if (err) {
                console.log(err.message + " Failed to get vehicles.");
            } else {
                res.status(200).json(docs);
                client.close();
            }
        });
    })
});

module.exports = router;