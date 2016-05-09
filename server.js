'use strict';

var express = require('express'),
    mongo = require('mongoskin'),
    routes = require('./app/routes/index.js'),
    shortener = require('./app/controllers/shortener.js'),
    http = require('http');
    
var app = express();

var db = mongo.db(process.env.MONGODB_URI || 'mongodb://tester:testerpass@ds017672.mlab.com:17672/short-url')

app.use('/public', express.static(process.cwd() + '/public'));
app.use('/controllers', express.static(process.cwd() + '/app/controllers'));

db.createCollection("urls", {
    capped: true,
    size: 5242880,
    max: 5000
});

routes(app, db);
shortener(app, db);

var port = Number(process.env.PORT || 8080);
app.listen(port, function () {
    console.log('Listening on port' + port);
});
    
