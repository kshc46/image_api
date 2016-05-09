'use strict';

var shortener = require(process.cwd() + '/app/controllers/shortener.js');

module.exports = function (app, db) {
    
    app.route('/')
        .get(function (req, res) {
            res.sendFile(process.cwd() + '/public/index.html');
        });
        
    app.route('/new')
        .get(function(req,res){
            res.sendFile(process.cwd() + '/public/index.html', {
                err: "Error: Need a proper URL"
            });
        });

    app.route('/google')
        .get(function (req, res) {
            res.sendFile(process.cwd() + '/public/test.html');
        });
};