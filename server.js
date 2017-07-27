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
var express = require('express');
var mongo = require('mongodb').MongoClient;
var mongoose = require('mongoose');
var app = express();

var uri = process.env.MONGODB_URI;

const GoogleImages = require('google-images');
 
const client = new GoogleImages('006396959488029172989:gcybejxuaka', process.env.APIKEY);

var Schema = mongoose.Schema;

var imgSchema = new Schema({
  searchTerm  :  {
    type: String,
    max: 6,
    required: [true, 'please specify search term']
  },
  imgUrl      : String,
  altText     : String,
  pageUrl     : String,
  _imgId      : Schema.Types.ObjectId
});

var imgModel = mongoose.model('imgModel', imgSchema);
 
app.use(express.static('public'));

app.get("/img/:imgsrch/:offset", function (req, res) {
  
  console.log(req.params.imgsrch, req.params.offset)
  
  mongoose.connect(uri);
  
  var db = mongoose.connection;
  
  db.on('error', console.error.bind(console, 'MongoDB connection error'));
  
  var newSearch = client.search(req.imgsrch)
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
  // paginate results 
  client.search('Steve Angello', {page: req.offset});
  res.send(newSearch);
});

// listen for requests :)
var listener = app.listen("3000", function () {
  console.log('Your app is listening on port ' + listener.address().port);
});