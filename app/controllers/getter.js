'use strict';

function getter(app, db){
    var searchCollection = db.collection('searchCollection');
    var pass = require(process.cwd() + '/public/pass.js');

    app.get('/api/imagesearch/', imageAPICall);
    app.get('/search/', searchHistory);
    app.get('/delete/', deleteSearch);
    
    function deleteSearch(req,res){
        searchCollection.remove();
        res.send('Done sucka!');
    }
    
    var request = require('request');
    
    //Calls API with client-specified query to get JSON from Google Custom Search (only images)
    function imageAPICall(req,res){
        var password = pass();
        var offset = getParameterByName(req,res,'offset');
        var query = getParameterByName(req,res,'search');
        if (offset > 91) {
            offset = 91;
        } else if (offset < 1) {
            offset = 1;
        }
        
        searchAdd(req,res,query);
        request("https://www.googleapis.com/customsearch/v1?key=" + password[0] + "&cx=" + password[1] + "&searchType=image&q=" + query + "&start=" + offset, function (error, response, body) {
            if (!error && response.statusCode == 200) {
                var data = JSON.parse(body);
                write(req,res,data);
            }
        });
    }
    
    //Get parameters from URL, http://stackoverflow.com/questions/901115/how-can-i-get-query-string-values-in-javascript
    function getParameterByName(req, res, name) {
        var url = req.url;
        name = name.replace(/[\[\]]/g, "\\$&");
        var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
            results = regex.exec(url);
        if (!results) return null;
        if (!results[2]) return '';
        return decodeURIComponent(results[2].replace(/\+/g, " "));
    }
    
    //Write the items to a variable, then display on screen
    function write(req,res,data){
        //First, delete
        var final = [];
        var entry;
        for (var each in data.items) {
            entry = {link: data.items[each].link, title: data.items[each].title, context: data.items[each].image.contextLink};
            final[each] = entry;
        }
        res.send(final);
    }
    
    //Write search to DB
    function searchAdd(req,res,query){
        var date = new Date();
        searchCollection.insert({term: query, when: date.toUTCString()});
    }
    
    //Display search history
    function searchHistory(req,res){
        searchCollection.find().toArray(function(err,data){
            if (err) {
                console.log("Error: ", err)
            };
            res.send(data)
        })
    }
}

module.exports = getter;