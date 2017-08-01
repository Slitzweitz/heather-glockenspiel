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

// init project
var express = require('express'),
    mongo = require('mongodb').MongoClient,
    app = express();

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
    
    asyncSearch(function(data) {
      
      res.send(data);
      
    });

    function asyncSearch(callback) {
    
      var newSearch = client.search(req.params.term);
      
      var results = new imgModel({
        searchTerm: req.params.term,
        imgUrl: newSearch.url,
        altText: '',
        pageUrl: newSearch.url
      });
      
      var insertPromise = results.save();
      
      insertPromise.then((doc) => {
        console.log('inserted document' + doc);
      })
      
      callback(newSearch);
    }
    
    db.close();
    
  });

        /*
        [{
            "url": "http://steveangello.com/boss.jpg",
            "type": "image/jpeg",
            "width": 1024,
            "height": 768,
            "size": 102451,
            "thumbnail": {
                "url": "http://steveangello.com/thumbnail.jpg",
                "width": 512,
                "height": 512
            }
        }]
         */
 
  
  //  To this model:
  // searchTerm  :  {
  //   type: String,
  //   max: 6,
  //   required: [true, 'please specify search term']
  // },
  // imgUrl      : String,
  // altText     : String,
  // pageUrl     : String,
  // _imgId      : Schema.Types.ObjectId
   
  console.log(req.params);

  res.send('instance of the model that was passed into db');
  
  // // paginate results 
  // client.search('Steve Angello', {page: req.offset});
  // res.send(newSearch);
});

app.get('/recent/', (req, res) => {
  
});

app.listen(3000);