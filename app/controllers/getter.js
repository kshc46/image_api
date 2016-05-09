'use strict';

function getter(app, db){
    var collection = db.collection('urls');
    
    app.route('/:URLarg')
        .get(checkShort)
        
    app.get('/new/:URLarg*', checkDB);
    
    
}

module.exports = getter;