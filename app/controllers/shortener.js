'use strict';

function shortener(app, db){
    var collection = db.collection('urls');
    
    app.route('/:URLarg')
        .get(checkShort)
        
    app.get('/new/:URLarg*', checkDB);
    
    //If URL argument is a shortened code, it checks to see if it is in the database.
    function checkShort(req, res) {
        var findNum = Number(req.params.URLarg);
        collection.find({number: findNum}).toArray( function (err, result) {
            if (err) {
                console.log(err);
            }
            console.log(result);
            if(result.length === 0){
                res.send("This doesn't exist!");
            } else {
                res.redirect(result[0].url);
            }
        });
    }
    
    //Checks the db to see if the url has already been added
    function checkDB (req,res) {
        var input = req.url.slice(5);
        collection.find({url: input}).toArray( function(err, result) {
            if (err) {
                console.log(err);
            }
            if (result.length === 0) {
                var insertNum = Math.floor(Math.random() * 10000);
                numCheck(req,res,insertNum);
            } else {
                res.send({number: result[0].number, url:input})
            }
        })
    }
    
    //Inserts the url into the database
    function insertURL(req,res,insertNum) {
        var URLarg = req.url.slice(5);
        collection.insert({number: insertNum, url: URLarg});
        res.send({number: insertNum, url:URLarg});
    }
    
    //Checks the db to verify the random number hasn't been assigned already, else
    //it makes a new insert number
    function numCheck (req,res,insertNum) {
        collection.find({number: insertNum}).toArray( function(err,result){
            if (err) {
                console.log(err);
            }
            if (result.length === 0) {
                insertURL(req,res,insertNum);
            } else {
                insertNum = Math.floor(Math.random() * 10000);
                numCheck(req,res,insertNum);
            }
            
        })
    }

}

module.exports = shortener;