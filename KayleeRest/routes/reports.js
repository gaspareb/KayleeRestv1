'use strict';
const express = require('express');
const router = express.Router();
const app = express();
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

app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET, PUT, POST, DELETE, OPTIONS");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

router.get('/summary', function (req, res) {
    pool.getConnection(function (err, connection) {
        if (err) {
            res.status(500).send({ message: "${err}:" + err })
            return;
        }
        console.log("REPORT GET SUMMARY connected successfully to server @" + Date());
        connection.query("SELECT AuctionDate, COUNT(VINNumber) as VINS, Sum(LaborCost) as LaborSum, Sum(PartsCost) as PartsSum, (Sum(LaborCost) + Sum(PartsCost)) as TotalCost FROM kayleevehicles group by AuctionDate order by AuctionDate desc;", function (err, rows) {
            connection.release();
            if (!err) {
                res.status(200).json(rows);
            }
        });
        connection.on('error', function (err) {
            res.status(500).send({ message: "${err}:" + err })
            return;
        });
    });
});

router.get('/auctionDates', function (req, res) {
    pool.getConnection(function (err, connection) {
        if (err) {
            res.status(500).send({ message: "${err}:" + err })
            return;
        }
        console.log("REPORT auctionDates connected successfully to server @" + Date());
        connection.query("select Distinct(AuctionDate) from kayleevehicles order by AuctionDate DESC;", function (err, rows) {
                connection.release();
                if (!err) {
                    res.status(200).json(rows);
                }
            });
        connection.on('error', function (err) {
            res.status(500).send({ message: "${err}"  + err  })
            return;
        });
    });
});

router.get('/itemized/:auctionDate', function (req, res) {
    const data = req.params.auctionDate;
    pool.getConnection(function (err, connection) {
        if (err) {
            res.status(500).send({ message: "${err}"  + err  })
            return;
        }
        console.log("REPORT getItemized " + data + " connected successfully to server @" + Date());
        connection.query("SELECT VINNumber, DateCreated, AuctionDate, (LaborCost + PartsCost) as Total, Make, Model, Color, Year, RunNumber, LaborDescription, LaborCost, PartDescription, PartsCost " +
                                    "FROM kayleevehicles Where AuctionDate = '" + data + "' " + 
                                    "GROUP BY VINNumber, DateCreated, AuctionDate, Make, Model, Color, Year, RunNumber, LaborDescription, LaborCost, PartDescription, PartsCost ORDER BY VINNumber;", function (err, rows) {
            connection.release();
            if (!err) {
                res.status(200).json(rows);
            }
        });
        connection.on('error', function (err) {
            res.status(500).send({ message: "${err}"  + err  })
            return;
        });
    });
});

router.get('/itemized/print/:vins', function (req, res) {
    var data = req.params.vins.split(',');
    var s = new String();
    for (var i = 0; i < data.length; i++) {
        s = s + "'" + data[i] + "'";
        if (i != data.length-1)
            s = s + ",";
    }
    pool.getConnection(function (err, connection) {
        if (err) {
            res.status(500).send({ message: "${err}"  + err  })
            return;
        }
        console.log("REPORT itemized connected successfully to server @" + Date());
        connection.query("SELECT VINNumber, DateCreated, AuctionDate,  (LaborCost + PartsCost) as Total, Make, Model, Color, Year, RunNumber, LaborDescription, LaborCost, PartDescription, PartsCost FROM kayleevehicles Where VINNumber IN (" + s + ") ORDER BY  VINNumber;", function (err, rows) {
            connection.release();
            if (!err) {
                res.status(200).json(rows);
            }
        });
        connection.on('error', function (err) {
            res.status(500).send({ message: "${err}"  + err  })
            return;
        });
    });
});

module.exports = router; 