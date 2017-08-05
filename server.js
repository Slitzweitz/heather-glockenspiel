/*
 * Distributed under the MIT license - http://opensource.org/licenses/MIT
 *
 * Written with: mongodb@2.1.3
 * Documentation: http://mongodb.github.io/node-mongodb-native/
 
User Story: I can get the image URLs, alt text and page urls for a set of images relating to a given search string.
User Story: I can paginate through the responses by adding a ?offset=2 parameter to the URL.
User Story: I can get a list of the most recently submitted search strings.
*/

// server.js
// where your node app starts

'use strict'

// init project
var express = require('express'),
    mongo = require('mongodb').MongoClient,
    app = express(),
    google = require('googleapis'),
    customsearch = google.customsearch('v1');

var uri = process.env.MONGODB_URI;

const GoogleImages = require('google-images');
 
const client = new GoogleImages(process.env.CSEID, process.env.APIKEY);
 
// app.use(express.static('public'));

app.get('/', (req, res) => {
  res.send('enter a search term in url');
});


app.get('/img/:term', function (req, res) {
  if (req.params.offset) {
    console.log(req.params.offset);
  }
  mongo.connect(uri, function(err, db) {
    if (err) throw err;
    
    console.log('connected');
    
    var collection = db.collection('imgmodels');
    var final = [];

    customsearch.cse.list({ 
      cx: process.env.CSEID, 
      q: req.params.term, 
      auth: process.env.APIKEY,
      searchType: 'image',
      fields: 'context,items(displayLink,formattedUrl,htmlSnippet,image(contextLink,thumbnailLink),labels,link,snippet),url'
    }, function (err, resp) {
      if (err) {
        return console.log('An error occured', err);
      }
      // Got the response from custom search
      resp.items.forEach((doc) => {
        var dbForDoc = {
          link : doc.link,
          altText : doc.snippet,
          pageUrl : doc.image.contextLink
        };
        final.push(dbForDoc);
      })   
      res.send(final);
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
    db.close();   
  });
  // // paginate results 
  // client.search('Steve Angello', {page: req.offset});
  // res.send(newSearch);
});

app.get('/img/:term?:offset', (req, res) => {
  
});

app.get('/img/recent/', (req, res) => {
  // search for most recent 
});

app.listen(3000);