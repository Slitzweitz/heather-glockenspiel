# FCC Bonfire - Image Search Abstration Layer
This app fulfills the following user stories:
- Can get the image URLs, alt text and page urls for a set of images relating to a given search string.
- Can paginate through the responses by adding ?offset=2 parameter (only returns 100 results).
- Can get a list of the most recently submitted search strings.

The app was written using Express, the Google Custom Search API.

It's based on the [nodeSimpleExample.js example](https://github.com/mongolab/mongodb-driver-examples/blob/master/nodejs/nodeSimpleExample.js).

## Database hosted at mLab
Sign up for a a free hosted mongodb instance at [mLab](https://mlab.com)