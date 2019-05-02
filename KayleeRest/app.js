var https = require('https');
var fs = require('fs');
const vehicles = require('./routes/vehicles');
const reports = require('./routes/reports');
var cors = require('cors');
var express = require('express');
var app = express();
app.use(cors());
app.use(cors({
  origin: 'https://www.superiortechnologysolutions.net'
}));
app.use('/reports', reports);
app.use('/vehicles', vehicles);
app.use(express.json());
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, PUT, POST, DELETE, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  res.setHeader('Content-Type', 'application/json');
  next();
});
var options = {
  key: fs.readFileSync('certs/privateKey.key'),
  cert: fs.readFileSync('certs/certificate.crt')
};

https.createServer(options, app, function (req, res) {
  res.writeHead(200);
  res.end("hello world!");
}).listen(3000);

console.log("listening to port 3000");
