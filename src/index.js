/**
 * SEO Checker
 * Copyright (c) 2014 Clever Labs / MIT Licensed (See License)
 * A library to do some basic SEO checks. 
 */

// Set up requires
var cheerio = require('cheerio'),
    request = require('request'),
    util    = require('util'),
    Q       = require('q');

module.exports = {
  // Make request and return response body
  load: function(url, callback) {
    // Check if user input protocol
    if (url.indexOf('http://') < 0 && url.indexOf('https://') < 0) {
      url = 'http://' + url;
    }

    console.log('URL ' + url);

    request.get(url, function(error, response, body) {
      if (!error && response.statusCode === 200) {
        return callback(body);
      }

      return callback(false);
    });
  },
  // Parse out the meta data
  meta: function(body) {
    var $     = cheerio.load(body),
        page  = {};

    page.title = $('title').text();
    page.description = $('meta[name=description]').attr('content') || null;
    page.author = $('meta[name=author]').attr('content') || null;
    page.keywords = $('meta[name=keywords]').attr('content') || null;

    var h1s = 0;
    $('h1').each(function() {
      h1s++;
    });
    page.heading1 = $('body h1:first-child').text();
    page.totalHeadings = h1s;
    console.log(util.inspect(page));
    return page;
  }
};

