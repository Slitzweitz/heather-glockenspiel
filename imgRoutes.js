'use strict'

var express = require('express'),
    router = express.Router(),
    mongo = require('mongodb').MongoClient,
    google = require('googleapis'),
    customsearch = google.customsearch('v1'),
    uri = process.env.MONGODB_URI;

// middleware that is specific to this router
router.use(function timeLog (req, res, next) {

  console.log('Time: ', Date.now())
  next()
})
// define the home page route
router.get('/', (req, res) => {
  res.send('enter a search term in url');
});
// define the recent route

router.get('/img/:term', (req, res) => {
  
  mongo.connect(uri, (err, db) => {
    if (err) throw err;
    
    console.log('connected');
    
    var collection = db.collection('imgmodels');
    var final = [];
    
    if (req.query.offset) {
      if (req.query.offset > 10) { var paginate = req.query.offset * 10; }
      if (req.query.offset <= 10) { var paginate = req.query.offset * 10; }      
      console.log(paginate);
      customsearch.cse.list({ 
      cx: process.env.CSEID, 
      q: req.params.term, 
      auth: process.env.APIKEY,
      searchType: 'image',
      start: paginate,
      fields: 'items(image/contextLink,link,snippet)'
      }, (err, resp) => {
        if (err) {
          return console.log('An error occured', err);
        }
        // Got the response from custom search
        console.log(resp.length);
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
    }
    else {
      customsearch.cse.list({ 
        cx: process.env.CSEID, 
        q: req.params.term, 
        auth: process.env.APIKEY,
        searchType: 'image',
        fields: 'items(image/contextLink,link,snippet)'
      }, (err, resp) => {
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
    }
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


module.exports = router


// var mongoose = require('mongoose');

// var Schema = mongoose.Schema;

// var imgModel = new Schema({
//   searchTerm  :  {
//     type: String,
//     max: 6,
//     required: [true, 'please specify search term']
//   },
//   imgUrl      : String,
//   altText     : String,
//   pageUrl     : String,
//   _imgId      : Schema.Types.ObjectId
// });

// module.exports = mongoose.model('imgModel', imgModel);


// router.get('/img/:term([\?])offset=:paginate', (req, res) => {
//   if (Number.isInteger(req.params.paginate)) {
//     mongo.connect(uri, (err, db) => {
//     if (err) throw err;
    
//     console.log('connected');
    
//     var final = [];
      
//     var startIndex = req.params.paginate;
//     console.log(startIndex);

//     customsearch.cse.list({ 
//       cx: process.env.CSEID, 
//       q: req.params.term, 
//       auth: process.env.APIKEY,
//       searchType: 'image',
//       start: startIndex,
//       fields: 'items(image/contextLink,link,snippet)'
//     }, (err, resp) => {
//       if (err) {
//         return console.log('An error occured', err);
//       }
//       // Got the response from custom search
//       resp.items.forEach((doc) => {
//         var dbForDoc = {
//           link : doc.link,
//           altText : doc.snippet,
//           pageUrl : doc.image.contextLink
//         };
//         final.push(dbForDoc);
//       })
//       //  still in search callback
//       res.send(final);
//     });
        
//     db.close();   
//   });
//   }
// });