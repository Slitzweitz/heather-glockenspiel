var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var imgModel = new Schema({
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

module.exports = mongoose.model('imgModel', imgModel);