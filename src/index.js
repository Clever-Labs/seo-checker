/**
 * Turkey Gobbler
 *
 * A library to do some
 * basic SEO checks. 
 */
 
module.exports = function(url) {
  console.log('running');

  // Set up requires
  var cheerio = require('cheerio'),
      request = require('request');

  // Check if user input protocol
  if (url.indexOf('http:') < 0 || url.indexOf('https:') < 0) {
    url = 'http://' + url;
  }
  
  // Set ports based on the URL they enter
  var port = 80;
  if(url.indexOf('https:') > -1) {
    port = 443;
  }

  var page = {}; // Object to hold results

  // Make the HTTP request then parse the response
  request(url, function (error, response, body) {
    if (!error && response.statusCode == 200) {
      $ = cheerio.load(body);

      // Check title tags
      page.title       = $('title').text(),
      page.description = $('meta[name=description]').attr('content'),
      page.author      = $('meta[name=author]').attr('content'),
      page.keywords    = $('meta[name=keywords]').attr('content');

      console.log(page.title);
      console.log(page.description);
    } {
      return false;
    }
  });
};
    
