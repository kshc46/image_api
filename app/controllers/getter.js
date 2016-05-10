'use strict';

function getter(app, db){
    var imageCollection = db.collection('imageCollection');
    var searchCollection = db.collection('searchCollection');
    var pass = require(process.cwd() + '/public/pass.js');
        
    app.get('/api/imagesearch/:URLarg*', getParameterByName);
    
    function imageAPICall(){
        var password = pass();
        var offset = getParameterByName('offset');
        var query = getParameterByName('search');
        searchAdd(query)
        $.getJSON("https://www.googleapis.com/customsearch/v1?key=" + password[0] + "&cx=" + password[1] + "&searchType=image&q=" + query + "&start=" + offset, function(data) {
            
            
            $(".condition").html(data.weather[0].main)
            $(".location").html(data.name)
            $(".temp").html(Math.floor(data.main.temp) + '&deg; ' + showUnit[unitID])
            $(".pic").attr('src', 'http://openweathermap.org/img/w/' + data.weather[0].icon + '.png').show()
        });
    };
    
    //Get parameters from URL, http://stackoverflow.com/questions/901115/how-can-i-get-query-string-values-in-javascript
    function getParameterByName(req, name) {
        var url = req.URL;
        name = name.replace(/[\[\]]/g, "\\$&");
        var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
            results = regex.exec(url);
        if (!results) return null;
        if (!results[2]) return '';
        return decodeURIComponent(results[2].replace(/\+/g, " "));
    }
    
    //Write image results to DB
    function write(data){
        
    }
    
    //Write search to DB
    function searchAdd(query){
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