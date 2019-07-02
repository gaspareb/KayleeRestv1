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
        connection.query("select VINNumber, Year, Make, Model, Color, AuctionDate, ClosingDate, RunNumber, LaborDescription, LaborCost, PartDescription, PartsCost, PartDescription1, PartsCost1, PartDescription2, PartsCost2, PartDescription3, PartsCost3, PartDescription4, PartsCost4, PartDescription5, PartsCost5 + PartsCarryOver AS PartsCost5, DateCreated from kayleevehicles WHERE VINNumber = '" + data + "';", function (err, rows) {
            connection.release();
            if (!err) {
                if(rows.length > 0){
                    res.status(200).json(rows);
                }else{
                    res.status(500).send({ message: "VIN: " + data + " does not exist or is mistyped!" });
                }                
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
   
    if (bodyData.PartsCost > 0){
        var PartsCost = bodyData.PartsCost;
    }else{
        var PartsCost = 0;
    };
    //console.log(PartsCost);
    var PartDescription1 = bodyData.PartDescription1;
    if (bodyData.PartsCost1 > 0){
        var PartsCost1 = bodyData.PartsCost1;
    }else{
        var PartsCost1 = 0;
    };
    //var PartsCost1 = bodyData.PartsCost1;
    //console.log(PartsCost1);
    var PartDescription2 = bodyData.PartDescription2;
    if (bodyData.PartsCost2 > 0){
        var PartsCost2 = bodyData.PartsCost2;
    }else{
        var PartsCost2 = 0;
    };
    //var PartsCost2 = bodyData.PartsCost2;
    //console.log(PartsCost2);
    var PartDescription3 = bodyData.PartDescription3;
    if (bodyData.PartsCost3 > 0){
        var PartsCost3 = bodyData.PartsCost3;
    }else{
        var PartsCost3 = 0;
    };
    //var PartsCost3 = bodyData.PartsCost3;
    //console.log(PartsCost3);
    var PartDescription4 = bodyData.PartDescription4;
    if (bodyData.PartsCost4 > 0){
        var PartsCost4 = bodyData.PartsCost4;
    }else{
        var PartsCost4 = 0;
    };
    //var PartsCost4 = bodyData.PartsCost4;
    //console.log(PartsCost4);
    var PartDescription5 = bodyData.PartDescription5;
    if (bodyData.PartsCost5 > 0){
        var PartsCost5 = bodyData.PartsCost5;
    }else{
        var PartsCost5 = 0;
    };
    //var PartsCost5 = bodyData.PartsCost5;
   //console.log(PartsCost5);
    var day = dateFormat(new Date(), "UTC:yyyy-mm-dd");
    var query = "insert into kayleevehicles (VINNumber, Year, Make, Model, Color, AuctionDate, ClosingDate, RunNumber, LaborDescription, LaborCost, PartDescription, PartsCost, PartDescription1, PartsCost1, PartDescription2, PartsCost2, PartDescription3, PartsCost3, PartDescription4, PartsCost4, PartDescription5, PartsCost5, DateCreated) values " +
        "('" + VINNumber + "','" + Year + "','" + Make + "','" + Model + "','" + Color + "','" + AuctionDate + "','" + ClosingDate + "','" + RunNumber + "','" + LaborDescription + "','" + LaborCost + "','" + PartDescription + "','" + PartsCost + "','" + PartDescription1 + "','" + PartsCost1 + "','" + PartDescription2 + "','" + PartsCost2 + "','" + PartDescription3 + "','" + PartsCost3 + "','" + PartDescription4 + "','" + PartsCost4 + "','" + PartDescription5 + "','" + PartsCost5 + "','" + day + "');";
        //console.log('query' + query);
        pool.getConnection(function (err, connection) {
        if (err) {
            console.log('Connection error:' + err);
            res.status(500).send({ success: false, message: 'VINNumber ' + VINNumber + ' already exists!' });
            return;
        }
        console.log('ADD Vehicles VINS connected successfully to server @ ' + Date());
        connection.query(query, function (err, rows) {
            connection.release();
            if (!err) {
                res.status(200).send({ success: true, message: 'VINNumber ' + VINNumber + ' has been added!' });
            }else{
                res.status(500).send({ success: false, message: 'VINNumber ' + VINNumber + ' already exists!' });
                console.log('add error: ' + query);
            }
        });
        connection.on('error', function (err) {
            console.log('err3');
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
    var PartDescription1 = bodyData.PartDescription1;
    var PartsCost1 = bodyData.PartsCost1;
    var PartDescription2 = bodyData.PartDescription2;
    var PartsCost2 = bodyData.PartsCost2;
    var PartDescription3 = bodyData.PartDescription3;
    var PartsCost3 = bodyData.PartsCost3;
    var PartDescription4 = bodyData.PartDescription4;
    var PartsCost4 = bodyData.PartsCost4;
    var PartDescription5 = bodyData.PartDescription5;
    var PartsCost5 = bodyData.PartsCost5;
    var query = "UPDATE kayleevehicles SET Year='" + Year + "', Make='" + Make + "', Model='" + Model +
        "', Color='" + Color + "', AuctionDate='" + AuctionDate + "', ClosingDate='" + ClosingDate + "', RunNumber='" + RunNumber + "', LaborDescription='" + LaborDescription +
        "', LaborCost='" + LaborCost + 
        "', PartDescription='" + PartDescription + "' , PartsCost='" + PartsCost +
        "', PartDescription1='" + PartDescription1 + "' , PartsCost1='" + PartsCost1 +
        "', PartDescription2='" + PartDescription2 + "' , PartsCost2='" + PartsCost2 +
        "', PartDescription3='" + PartDescription3 + "' , PartsCost3='" + PartsCost3 +
        "', PartDescription4='" + PartDescription4 + "' , PartsCost4='" + PartsCost4 +
        "', PartDescription5='" + PartDescription5 + "' , PartsCost5='" + PartsCost5 +
        "'  WHERE VINNumber= '" + VINNumber + "';";
        //console.log(query);
    pool.getConnection(function (err, connection) {
        if (err) {
            console.log('Error A');
            res.status(500).send({ success: false, message: 'VINNumber ' + req.body.VINNumber + ' failed to update!' });
            return;
        }
        console.log('UPDATE Vehicles VINS connected successfully to server @ ' + Date());
        connection.query(query, function (err, rows) {
            connection.release();
            if (!err) {
                //console.log('B');
                res.status(200).send({ success: true, message: 'VINNumber ' + req.body.VINNumber + ' has been updated!' });
            }else{
                console.log('update error: ' + query);
                res.status(500).send({ success: false, message: 'VINNumber ' + req.body.VINNumber + ' failed to update!' });
            }
        });
        connection.on('error', function (err) {
            console.log('Error C');
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
                console.log(rows.affectedRows);
                if(rows.affectedRows > 0){
                    res.status(200).json({ success: true, message: 'VINNumber ' + data + ' has been deleted!' });
                }else{
                    res.status(500).send({ message: "Cannot delete VIN: " + data + ", does not exist or is mistyped!" });
                }                   
            }else{
                console.log('delete error: ' + "DELETE FROM kayleevehicles WHERE VINNumber = '" + data + "';");
                res.status(500).send({ message: "Cannot delete VIN: " + data + ", does not exist or is mistyped!" });
            }
        });
        connection.on('error', function (err) {
            res.status(500).send({ success: false, message: 'Error deleting VINNumber ' + data + '!' });
            return;
        });
    });
});

module.exports = router; 