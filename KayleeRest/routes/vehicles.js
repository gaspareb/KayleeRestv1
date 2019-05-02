'use strict';
const express = require('express');
const router = express.Router();
const assert = require('assert');
const app = express();
var bodyParser = require('body-parser')
var jsonParser = bodyParser.json()
var dateFormat = require('dateformat');
var sql = require("mysql");
var pool = sql.createPool({
    connectionLimit: 100, //important
    host: 'localhost',
    port: '3306',
    user: 'superior_kaylee',
    password: 'pigQ5!45(+S3',
    database: 'superior_vehicles',
    debug: false
});
app.use(bodyParser.json({ type: 'application/*+json' }))
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET, PUT, POST, DELETE, OPTIONS");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.setHeader('Content-Type', 'application/json');
    next();
});

router.get('/', function (req, res) {
    pool.getConnection(function (err, connection) {
        if (err) {
            res.status(500).send({ message: err });
            return;
        }
        console.log('GET ALL Vehicles VINS connected successfully to server @ ' + Date());
        connection.query("select Distinct(VINNumber) from kayleevehicles order by VINNumber ASC;", function (err, rows) {
            connection.release();
            if (!err) {
                res.status(200).json(rows);
            }
        });
        connection.on('error', function (err) {
            res.status(500).send({ message: "${err}:" + err });
            return;
        });
    });
});

router.get('/:VINNumber', function (req, res) {
    const data = req.params.VINNumber;
    pool.getConnection(function (err, connection) {
        if (err) {
            res.status(500).send({ message: "${err}:" + err });
            return;
        }
        console.log("GET Vehicle " + data + " connected successfully to server @" + Date());
        connection.query("select VINNumber, Year, Make, Model, Color, AuctionDate, ClosingDate, RunNumber, LaborDescription, LaborCost, PartDescription, PartsCost, DateCreated from kayleevehicles WHERE VINNumber = '" + data + "';", function (err, rows) {
            connection.release();
            if (!err) {
                res.status(200).json(rows);
            }
        });
        connection.on('error', function (err) {
            res.status(500).send({ message: "${err}:" + err });
            return;
        });
    });
});

router.post('/add/',jsonParser, function (req, res) {
    var bodyData = req.body;
    var VINNumber = bodyData.VINNumber;
    var Year = bodyData.Year;
    var Make = bodyData.Make;
    var Model = bodyData.Model;
    var Color = bodyData.Color;
    var AuctionDate = dateFormat(bodyData.AuctionDate, "UTC:yyyy-mm-dd");
    var ClosingDate = dateFormat(bodyData.ClosingDate, "UTC:yyyy-mm-dd");
    var RunNumber = bodyData.RunNumber;
    var LaborDescription = bodyData.LaborDescription;
    var LaborCost = bodyData.LaborCost;
    var PartDescription = bodyData.PartDescription;
    var PartsCost = bodyData.PartsCost;
    var day = dateFormat(new Date(), "UTC:yyyy-mm-dd");
    var query = "insert into kayleevehicles (VINNumber, Year, Make, Model, Color, AuctionDate, ClosingDate, RunNumber, LaborDescription, LaborCost, PartDescription, PartsCost, DateCreated) values " +
        "('" + VINNumber + "','" + Year + "','" + Make + "','" + Model + "','" + Color + "','" + AuctionDate + "','" + ClosingDate + "','" + RunNumber + "','" + LaborDescription + "','" + LaborCost + "','" + PartDescription + "','" + PartsCost + "','" + day + "');";
    pool.getConnection(function (err, connection) {
        if (err) {
            res.status(500).send({ success: false, message: 'VINNumber ' + VINNumber + ' already exists!' });
            return;
        }
        console.log('ADD Vehicles VINS connected successfully to server @ ' + Date());
        connection.query(query, function (err, rows) {
            connection.release();
            if (!err) {
                res.status(200).send({ success: true, message: 'VINNumber ' + VINNumber + ' has been added!' });
            }
        });
        connection.on('error', function (err) {
            res.status(500).send({ success: false, message: 'VINNumber ' + VINNumber + ' already exists!' });
            return;
        });
    });
});

router.put('/update/', jsonParser, function (req, res) {
    var bodyData = req.body;
    var VINNumber = bodyData.VINNumber;
    var Year = bodyData.Year;
    var Make = bodyData.Make;
    var Model = bodyData.Model;
    var Color = bodyData.Color;
    var AuctionDate = bodyData.AuctionDate;
    var ClosingDate = bodyData.ClosingDate;
    var RunNumber = bodyData.RunNumber;
    var LaborDescription = bodyData.LaborDescription;
    var LaborCost = bodyData.LaborCost;
    var PartDescription = bodyData.PartDescription;
    var PartsCost = bodyData.PartsCost;
    var query = "UPDATE kayleevehicles SET Year='" + Year + "', Make='" + Make + "', Model='" + Model +
        "', Color='" + Color + "', AuctionDate='" + AuctionDate + "', ClosingDate='" + ClosingDate + "', RunNumber='" + RunNumber + "', LaborDescription='" + LaborDescription +
        "', LaborCost='" + LaborCost + "', PartDescription='" + PartDescription + "' , PartsCost='" + PartsCost +
        "'  WHERE VINNumber= '" + VINNumber + "';";
    pool.getConnection(function (err, connection) {
        if (err) {
            res.status(500).send({ success: false, message: 'VINNumber ' + req.body.VINNumber + ' failed to update!' });
            return;
        }
        console.log('UPDATE Vehicles VINS connected successfully to server @ ' + Date());
        connection.query(query, function (err, rows) {
            connection.release();
            if (!err) {
                res.status(200).send({ success: true, message: 'VINNumber ' + req.body.VINNumber + ' has been updated!' });
            }
        });
        connection.on('error', function (err) {
            res.status(500).send({ success: false, message: 'VINNumber ' + req.body.VINNumber + ' failed to update!' });
            return;
        });
    });

});

router.delete('/:VINNumber', function (req, res) {
    const data = req.params.VINNumber;
    pool.getConnection(function (err, connection) {
        if (err) {
            res.status(500).send({ success: false, message: 'Error deleting VINNumber ' + data + '!' });
            return;
        }
        console.log('DELETE  Vehicles VINS connected successfully to server @ ' + Date());
        connection.query("DELETE FROM kayleevehicles WHERE VINNumber = '" + data + "';", function (err, rows) {
            connection.release();
            if (!err) {
                res.status(200).json({ success: true, message: 'VINNumber ' + data + ' has been deleted!' });
            }
        });
        connection.on('error', function (err) {
            res.status(500).send({ success: false, message: 'Error deleting VINNumber ' + data + '!' });
            return;
        });
    });
});

module.exports = router; 