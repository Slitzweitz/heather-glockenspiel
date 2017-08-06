var express = require('express')
var router = express.Router()

// middleware that is specific to this router
router.use(function timeLog (req, res, next) {
  console.log('Time: ', Date.now())
  next()
})
// define the home page route
router.get('/', function (req, res) {
  res.send('Birds home page')
})
// define the about route
router.get('/about', function (req, res) {
  res.send('About birds')
})

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