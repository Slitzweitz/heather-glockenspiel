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
    mongoose = require('mongoose'),
    imgModel = require('./imgModel'),
    app = express();

var uri = process.env.MONGODB_URI;

const GoogleImages = require('google-images');
 
const client = new GoogleImages(process.env.CSEID, process.env.APIKEY);
 
// app.use(express.static('public'));

app.get('/img/:term', function (req, res) {
    
  // define a new instance of the model with the results of the img search as the values
  // first: get the img search results
  // next: create instance of model, with results as values
  // next: save instance into db
  // next: pass instance to res stream for display
  
  console.log(req.params, req.params.offset);
  
  mongoose.connect(uri, { useMongoClient: true });
  
  var db = mongoose.connection;
  
  db.on('error', console.error.bind(console, 'MongoDB connection error'));
    
  //  Map this object:
  var newSearch = client.search(req.params.term)
    .then(images => {
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
    });
  
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
  
    var results = new imgModel({
      searchTerm: req.params.term,
      imgUrl: newSearch.url,
      altText: '',
      pageUrl: newSearch.url
    });
  
  res.send(newSearch + 'instance of the model that was passed into db' + results);
  
  // // paginate results 
  // client.search('Steve Angello', {page: req.offset});
  // res.send(newSearch);
});

app.get('/recent/', (req, res) => {
  
});

app.listen(3000);