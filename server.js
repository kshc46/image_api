'use strict';

var express = require('express'),
    mongo = require('mongoskin'),
    routes = require('./app/routes/index.js'),
    getter = require('./app/controllers/getter.js');

var app = express();

var db = mongo.db(process.env.MONGODB_URI);

app.use('/public', express.static(process.cwd() + '/public'));
app.use('/controllers', express.static(process.cwd() + '/app/controllers'));

db.createCollection("searchCollection", {
    capped: true,
    size: 5242880,
    max: 10
});

routes(app, db);
getter(app, db);

var port = Number(process.env.PORT || 8080);
app.listen(port, function () {
    console.log('Listening on port' + port);
});
    
