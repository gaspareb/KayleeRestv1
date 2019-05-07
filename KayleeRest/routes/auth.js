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

router.post('/',jsonParser, function (req, res) {
    var bodyData = req.body;
    var email = bodyData.email;
    var password = bodyData.password;
    var query = "select password from authorization WHERE email = '" + email + "';"
    pool.getConnection(function (err, connection) {
        if (err) {
            res.status(500).send({ success: false, message: 'No NODE Connection error!' });
            return;
        }
        connection.query(query, function (err, rows) {
            connection.release();
            if (!err) {
                if(rows.length > 0){
                    if(rows[0].password == password){
                        res.status(200).send({ success: true, message: email + ' has access' });
                    } else {
                        res.status(200).send({ success: true, message: email + ' has access but you used an incorrect password!' });
                    }                        
                }else{
                    res.status(200).send({ success: false, message: email + ' does not have access to this site!' });
                }                
            }
        });
        connection.on('error', function (err) {
            res.status(500).send({ success: false, message: email + ' connection error in NODE!' });
            return;
        });
    });
});
module.exports = router; 