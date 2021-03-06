'use strict'

var express = require('express'),
    router = express.Router(),
    mongo = require('mongodb').MongoClient,
    google = require('googleapis'),
    dbFind = require('./dbFind'),
    customsearch = google.customsearch('v1'),
    uri = process.env.MONGODB_URI;

// middleware that is specific to this router
router.use(function timeLog (req, res, next) {
  console.log('Time: ', Date.now())
  next()
})
// define the home page route
router.get('/', (req, res) => {
  res.send({
    'Step1': 'Enter a search term(s) in url at /img/:term <html></ br></html>',
    'Step2': 'Optionally use ?offset=# to paginate through responses. Only 100 responses are returned, so offset=9 is maximum (for free)',
    'Step3': 'Go to /img/recent/ to see 10 most recent queries'
  });
});
// define the recent route

router.get('/img/recent/', (req, res) => {
  mongo.connect(uri, (err, db) => {
    var collection = db.collection('imgmodels');
  
    dbFind.getRecent(collection, (err, doc) => {
      if (err) {
        res.err(err);
      }
      else {
        res.send(doc);
      }
    });

    db.close(); 
    
  });
});

router.get('/img/:term', (req, res) => {
  
  mongo.connect(uri, (err, db) => {
    if (err) throw err;
    // console.log('connected');
    var collection = db.collection('imgmodels');
    collection.insertOne({
        term : req.params.term
      });
    db.close();
  });   
    
    var final = [];
    
    if (req.query.offset) {
      var paginate = req.query.offset * 10;
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
          console.log('An error occured, probably tried to request more than 100 results (offset=>10)', err);
          return res.send('please do not request more than 100 results (offset=>10)'); 
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
  };
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