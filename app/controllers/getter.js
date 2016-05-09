'use strict';

function getter(app, db){
    var collection = db.collection('imageStuff');
    var collection = db.collection('searchInfo');
        
    app.get('/api/imagesearch/:URLarg*', getParameterByName);
    
    function imageAPICall(){
        $.getJSON("http://api.openweathermap.org/data/2.5/weather?lat=" + lat + "&lon=" + lon + "&appid=449d7d0f088db31263496d4ed169f548&units=" + units[unitID] + "&format=json", function(data) {
            $(".condition").html(data.weather[0].main)
            $(".location").html(data.name)
            $(".temp").html(Math.floor(data.main.temp) + '&deg; ' + showUnit[unitID])
            $(".pic").attr('src', 'http://openweathermap.org/img/w/' + data.weather[0].icon + '.png').show()
        });
    };
    
    //Get parameters from URL
    function getParameterByName(name, url) {
        if (!url) url = window.location.href;
        name = name.replace(/[\[\]]/g, "\\$&");
        var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
            results = regex.exec(url);
        if (!results) return null;
        if (!results[2]) return '';
        return decodeURIComponent(results[2].replace(/\+/g, " "));
    }
    
    //Define search API parameters
    var foo = getParameterByName('foo');
    
    
}

module.exports = getter;