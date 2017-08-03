/*
 * Copyright (c) 2016 ObjectLabs Corporation
 * Distributed under the MIT license - http://opensource.org/licenses/MIT
 *
 * Written with: mongodb@2.1.3
 * Documentation: http://mongodb.github.io/node-mongodb-native/
 * A Node script connecting to a MongoDB database given a MongoDB Connection URI.
*/

// server.js
// where your node app starts

'use strict'

// init project
var express = require('express'),
    mongo = require('mongodb').MongoClient,
    app = express(),
    google = require(;

var uri = process.env.MONGODB_URI;

const GoogleImages = require('google-images');
 
const client = new GoogleImages(process.env.CSEID, process.env.APIKEY);
 
// app.use(express.static('public'));

app.get('/', (req, res) => {
  res.send('enter a search term in url');
});


app.get('/img/:term', function (req, res) {

  mongo.connect(uri, function(err, db) {
    if (err) throw err;
    
    console.log('connected');
    
    var collection = db.collection('imgmodels')
   
    client.search('Steve Angello')
	    .then(images => {
        console.log(images);
      }).catch(err => {
        if (err) return err;
      });
        
    asyncInsert((data) => {
      // console.log(data);
    });
    
    function asyncInsert(callback) {
      collection.insertOne({
        term : req.params.term
      }, (err, doc) => {
        require('assert').equal(null, err);
        callback(doc);
      });
    }
    
//     asyncSearch((data) => {
      
//       var results = {
//         searchTerm: req.params.term,
//         imgUrl: data.url,
//         altText: '',
//         pageUrl: data.url
//       }; 
//       res.send(data);      
//     })

//     function asyncSearch(callback) {
//       var newSearch = client.search(req.params.term);           
//       newSearch.then((doc) => {
//         console.log('here is search result: ' + doc);
//         callback(doc);
//       });
//     }
    

    
    db.close();
    
  });
  // // paginate results 
  // client.search('Steve Angello', {page: req.offset});
  // res.send(newSearch);
});

app.get('/recent/', (req, res) => {
  
});

app.listen(3000);