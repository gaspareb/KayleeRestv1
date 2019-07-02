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
        connection.query("SELECT AuctionDate, COUNT(VINNumber) as VINS, Sum(LaborCost) as LaborSum, Sum(PartsCost + PartsCost1 + PartsCost2 + PartsCost3 + PartsCost4 + PartsCost5 + PartsCarryOver) as PartsSum, (Sum(LaborCost) + Sum(PartsCost + PartsCost1 + PartsCost2 + PartsCost3 + PartsCost4 + PartsCost5 + PartsCarryOver)) as TotalCost FROM kayleevehicles group by AuctionDate order by AuctionDate desc;", function (err, rows) {
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

router.get('/created', function (req, res) {
    pool.getConnection(function (err, connection) {
        if (err) {
            res.status(500).send({ message: "${err}:" + err })
            return;
        }
        console.log("REPORT created connected successfully to server @" + Date());
        connection.query("select Distinct(DateCreated) from kayleevehicles order by DateCreated DESC;", function (err, rows) {
                connection.release();
                if (!err) {
                    res.status(200).json(rows);
                }else{
                    res.status(500).send({ message: "${err}"  + err  });
                }
            });
        connection.on('error', function (err) {
            res.status(500).send({ message: "${err}"  + err  })
            return;
        });
    });
});

router.get('/created/:createdDate', function (req, res) {
    const data = req.params.createdDate;
    pool.getConnection(function (err, connection) {
        if (err) {
            res.status(500).send({ message: "${err}"  + err  })
            return;
        }
        console.log("REPORT createdDate " + data + " connected successfully to server @" + Date());
        connection.query("SELECT COUNT(VINNumber) as COUNT FROM kayleevehicles Where DateCreated = '" + data + "' ORDER BY DateCreated DESC;", function (err, rows) {
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
        connection.query("SELECT VINNumber, DateCreated, AuctionDate, (LaborCost + PartsCost + PartsCost1 + PartsCost2 + PartsCost3 + PartsCost4 + PartsCost5 + PartsCarryOver) as Total, Make, Model, Color, Year, RunNumber, LaborDescription, LaborCost, PartDescription, PartsCost, PartDescription1, PartsCost1, PartDescription2, PartsCost2, PartDescription3, PartsCost3, PartDescription4, PartsCost4, PartDescription5, PartsCost5 + PartsCarryOver AS PartsCost5 " +
                                    "FROM kayleevehicles Where AuctionDate = '" + data + "' " + 
                                    "GROUP BY VINNumber, DateCreated, AuctionDate, Make, Model, Color, Year, RunNumber, LaborDescription, LaborCost, PartDescription, PartsCost, PartDescription1, PartsCost1, PartDescription2, PartsCost2, PartDescription3, PartsCost3, PartDescription4, PartsCost4, PartDescription5, PartsCost5 ORDER BY VINNumber;", function (err, rows) {
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
        connection.query("SELECT VINNumber, DateCreated, AuctionDate,  (LaborCost + PartsCost + PartsCost1 + PartsCost2 + PartsCost3 + PartsCost4 + PartsCost5 + PartsCarryOver) as Total, Make, Model, Color, Year, RunNumber, LaborDescription, LaborCost, PartDescription, PartsCost, PartDescription1, PartsCost1, PartDescription2, PartsCost2, PartDescription3, PartsCost3, PartDescription4, PartsCost4, PartDescription5, PartsCost5 + PartsCarryOver AS PartsCost5 FROM kayleevehicles Where VINNumber IN (" + s + ") ORDER BY  VINNumber;", function (err, rows) {
            connection.release();
            if (!err) {
                res.status(200).json(rows);
            }else{
                console.log(err);
            }
        });
        connection.on('error', function (err) {            
            res.status(500).send({ message: "${err}"  + err  })
            return;
        });
    });
});

module.exports = router; 