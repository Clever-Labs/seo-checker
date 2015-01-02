/**
 * SEO Checker
 * Copyright (c) 2014 Clever Labs / MIT Licensed (See License)
 * A library to do some basic SEO checks. 
 */

// Set up requires
var cheerio = require('cheerio'),
    request = require('request'),
    util    = require('util'), // TODO: Remove in production
    Crawler = require('simplecrawler');

module.exports = {
  // Make request and return response body
  load: function(url, callback) {
    // Check if user input protocol
    if (url.indexOf('http://') < 0 && url.indexOf('https://') < 0) { // TODO: Turn this into its own function
      url = 'http://' + url;
    }

    // Make request and fire callback
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

    // Meta signals
    page.title = $('title').text();
    page.description = $('meta[name=description]').attr('content') || null;
    page.author = $('meta[name=author]').attr('content') || null;
    page.keywords = $('meta[name=keywords]').attr('content') || null;

    // Heading signals
    var h1s = 0;
    $('h1').each(function() {
      h1s++;
    });
    page.heading1 = $('body h1:first-child').text().trim().replace('\n', '');
    page.totalHeadings = h1s;

    // Accessibility signals
    var totalImgs       = 0,
        accessibleImgs  = 0;
    $('img').each(function(index) {
      totalImgs++;
      if ($(this).attr('alt') || $(this).attr('title')) {
        accessibleImgs++;
      }
    });
    page.imgAccessibility = (accessibleImgs / totalImgs) * 100;
    //console.log(util.inspect(page)); // TODO: Remove console.log calls
    return page;
  },
  // Crawl multiple pages of a website
  crawl: function(url, options, callback) {
    var crawler       = Crawler.crawl(url),
        opts          = options || {},
        maxPages      = opts.maxPages || 10,
        parsedPages   = [],         // Store parsed pages in this array
        seoParser     = this.meta,  // Reference to `meta` method to call during crawl
        crawlResults  = [];         // Store results in this array and then return it to caller

    // Crawler settings
    crawler.interval            = opts.interval || 250;         // Time between spooling up new requests
    crawler.maxDepth            = opts.depth || 2;              // Maximum deptch of crawl
    crawler.maxConcurrency      = opts.concurrency || 2;        // Number of processes to spawn at a time
    crawler.timeout             = opts.timeout || 1000;         // Milliseconds to wait for server to send headers
    crawler.downloadUnsupported = opts.unsupported || false;    // Save resources by only downloading files Simple Crawler can parse
                                                                // The user agent string to provide - Be cool and don't trick people
    crawler.userAgent           = opts.useragent || 'SEO Checker v1 (https://github.com/Clever-Labs/seo-checker)';

    // Only fetch HTML! You should always set this option unless you have a good reason not to
    if (opts.htmlOnly === true) { // Being explicit about truthy values
      var htmlCondition = crawler.addFetchCondition(function(parsedURL) {
        return !parsedURL.path.match(/\.jpg|jpeg|png|gif|js|txt|css|pdf$/i);
      });
    }

    crawler.on('fetchcomplete', function(queueItem, responseBuffer, response) {
      if (queueItem.stateData.code === 200) {
        crawlResults.push({ url: queueItem.url, body: responseBuffer.toString() });
      }
      if (crawlResults.length >= maxPages) {
        this.stop(); // Stop the crawler
        crawlResults.forEach(function(page, index, results) {
          parsedPages.push(seoParser(page.body));
        });
        if (!callback) {
          return parsedPages;
        } else {
          callback(parsedPages);
        }
      }
    });
  }
};

