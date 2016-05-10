'use strict';

var express = require('express'),
    mongo = require('mongoskin'),
    routes = require('./app/routes/index.js'),
    getter = require('./app/controllers/getter.js'),
    pass = require(process.cwd() + '/public/pass.js');

var app = express();
var password = pass();


var db = mongo.db(process.env.MONGODB_URI || password[2]);

app.use('/public', express.static(process.cwd() + '/public'));
app.use('/controllers', express.static(process.cwd() + '/app/controllers'));

db.createCollection("imageCollection", {
    capped: true,
    size: 5242880,
    max: 5000
});

db.createCollection("searchCollection", {
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
    
