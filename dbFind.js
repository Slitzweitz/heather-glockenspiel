var mongo = require('mongodb').MongoClient,
    uri = process.env.MONGODB_URI;

var exports = module.exports = {};
    

exports.getRecent = (collection, callback) => {
  collection.find().sort({_id:-1}).limit(10).toArray(callback);
}

