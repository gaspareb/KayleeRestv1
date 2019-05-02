const https = require('https');
const fs = require('fs');
const vehicles = require('./routes/vehicles');
const reports = require('./routes/reports');
var checkip = require('check-ip-address');
var server;
var insecureServer;
var options;
var certsPath = path.join(__dirname, 'certs', 'server');
var caCertsPath = path.join(__dirname, 'certs', 'ca');

options = {
    key: fs.readFileSync(path.join(certsPath, 'my-server.key.pem'))
    // This certificate should be a bundle containing your server certificate and any intermediates
    // cat certs/cert.pem certs/chain.pem > certs/server-bundle.pem
  , cert: fs.readFileSync(path.join(certsPath, 'my-server.crt.pem'))
    // ca only needs to be specified for peer-certificates
  //, ca: [ fs.readFileSync(path.join(caCertsPath, 'my-root-ca.crt.pem')) ]
  , requestCert: false
  , rejectUnauthorized: true
  };
  
//
// Serve an Express App securely with HTTPS
//
server = https.createServer(options);
checkip.getExternalIp().then(function (ip) {
  var host = ip || 'local.helloworld3000.com';

  function listen(app) {
    server.on('request', app);
    server.listen(port, function () {
      port = server.address().port;
      console.log('Listening on https://127.0.0.1:' + port);
      console.log('Listening on https://local.helloworld3000.com:' + port);
      if (ip) {
        console.log('Listening on https://' + ip + ':' + port);
      }
    });
  }

  var publicDir = path.join(__dirname, 'public');
  var app = require('./app').create(server, host, port, publicDir);
  listen(app);
});

/*
const options = {
    key: fs.readFileSync('./certs/key.pem'),
    cert: fs.readFileSync('./certs/cert.pem')
};
*/
/*
const options = {
    key: fs.readFileSync('./certs/my-server.key.pem'),
    cert: fs.readFileSync('./certs/my-server.csr.pem'), 
    requestCert: false,
    rejectUnauthorized: true
};


const hostname = 'www.superiortechnologysolutions.net';

var express = require('express');
var app = express();
app.use('/reports', reports);
app.use('/vehicles', vehicles);

https.createServer(options, app, (req, res) => {
  res.writeHead(200);
  res.end('hello world\n');
}).listen(3000, hostname, function () {
    console.log('Listening on port 3000!')
});
*/
/*
const vehicles = require('./routes/vehicles');
const reports = require('./routes/reports');
//const hostname = '162.253.124.192';
const hostname = 'localhost';
const bodyParser = require("body-parser");
var express = require('express')
var fs = require('fs')
var https = require('https')
var app = express()
app.use('/reports', reports);
app.use('/vehicles', vehicles);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
https.createServer({
    key: fs.readFileSync('./certs/server.key'),
    cert: fs.readFileSync('./certs/server.cert')
}, app)
    .listen(3000, hostname, function () {
        console.log('Listening on port 3000!')
    })


'use strict';
const debug = require('debug');
const express = require('express');
const path = require('path');
const vehicles = require('./routes/vehicles');
const reports = require('./routes/reports');
const bodyParser = require("body-parser");
const app = express();
const hostname = '162.253.124.192';

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use('/reports', reports);
app.use('/vehicles', vehicles);

app.set('port', process.env.PORT || 3000);

app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET, PUT, POST, DELETE, OPTIONS");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.setHeader('Content-Type', 'application/json');
    next();
});

var server = app.listen(app.get('port'), hostname, function () {
    console.log('Express server listening on port ' + server.address().port);
    debug('Express server listening on port ' + server.address().port);
});
*/