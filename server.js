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
    app = express(),
    imgRoutes = require('./imgRoutes');
    
app.use('/img/:term', imgRoutes);

app.get('/img/:term:offset', (req, res) => {
  
});

app.get('/img/recent/', (req, res) => {
  // search for most recent 
});

app.listen(3000);