'use strict';

function getter(app, db){
    var imageCollection = db.collection('imageCollection');
    var searchCollection = db.collection('searchCollection');
    var pass = require(process.cwd() + '/public/pass.js');
        
    app.get('/api/imagesearch/', imageAPICall);
    
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
        $.getJSON("https://www.googleapis.com/customsearch/v1?key=" + password[0] + "&cx=" + password[1] + "&searchType=image&q=" + query + "&start=" + offset, function(data) {
            write(req,res,data);
        });
    };
    
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
    
    //Write image results to DB, then print that shizzle
    function write(req,res,data){
        //First, delete
        imageCollection.remove({});
        for (var each in data.items) {
            imageCollection.insert({link: data.items[each].link, title: data.items[each].title, context: data.items[each].image.contextLink})
        }
        res.send(imageCollection);
    }
    
    //Write search to DB
    function searchAdd(req,res,query){
        var date = new Date();
        searchCollection.update(
           { _id: 1 },
           {
             $push: {
                search: {
                   $each: [ {term: query, when: date.toUTCString()} ],
                   $position: 0
                }
             }
           }
        )
        searchCollection.find({_id : 1}).toArray(function(err,data){
            if (err) {
                console.log("Error: ", err)
            };
            if (data.search.length > 10) {
                dbPop();
            }
        })
    }
    
    //Removes last from search db array if needed
    function dbPop() {
        searchCollection.update( { _id: 1 }, { $pop: { search: 9 } } ) // or search : 1???
    }

    
    
}

module.exports = getter;