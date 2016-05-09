'use strict';

var express = require('express'),
    mongo = require('mongoskin'),
    routes = require('./app/routes/index.js'),
    getter = require('./app/controllers/getter.js'),
    http = require('http');
    
var app = express();

var db = mongo.db(process.env.MONGODB_URI || 'mongodb://USER:PASS@etc....')

app.use('/public', express.static(process.cwd() + '/public'));
app.use('/controllers', express.static(process.cwd() + '/app/controllers'));

db.createCollection("urls", {
    capped: true,
    size: 5242880,
    max: 5000
});

routes(app, db);
getter(app, db);

var port = Number(process.env.PORT || 8080);
app.listen(port, function () {
    console.log('Listening on port' + port);
});
    
