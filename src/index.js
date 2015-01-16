/**
 * SEO Checker
 * Copyright (c) 2014 - 2015 Clever Labs / MIT Licensed
 * A library to do some basic SEO checks. 
 */

// Set up requires
var cheerio = require('cheerio'),
    request = require('request'),
    Crawler = require('simplecrawler');

module.exports = {
  /**
   * Load HTML for a single URL
   *
   * Use this to fetch the contents of a single URL then
   * pass the result to the `meta` function or any other
   * code that can parse or transform the response body of 
   * an HTTP request.
   *
   * `url` [String] - URL of page to read
   * `callback` [Function] - Function to call on completion
   *
   * Returns the response body of an HTTP request as a string
   */
  load: function(url, callback) {
    // Check if user input protocol
    if (url.indexOf('http://') < 0 && url.indexOf('https://') < 0) { // TODO: Turn this into its own function
      url = 'http://' + url;
    }

    // Make request and fire callback
    request.get(url.toLowerCase(), function(error, response, body) {
      if (!error && response.statusCode === 200) {
        return callback(body);
      }

      return callback(false);
    });
  },
  
  /**
   * Parse meta data from an HTTP response body
   *
   * `body` [String] - The HTML of a web page to parse
   *
   * Returns an object containing data related to the SEO
   * signals of the page that was parsed. Pass the result to
   * another function to determine an "SEO score".
   */
  meta: function(body) {
    var $     = cheerio.load(body),
        page  = {};

    // Meta signals
    page.title = $('title').text() || null;
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
    return page;
  },
  
  /**
   * Generate SEO data for multiple pages of a site at once
   *
   * `url` [String] - The URL to begin the crawl
   * `options` [Object] - Options to pass to the crawler. Uses a subset of the `simplecrawler` lib's options:
   *  - `maxPages` [Number] - The max number of pages to crawl (defaults to 10)
   *  - `interval` [Number] - Delay between each request for a new page
   *  - `maxDepth` [Number] - Depth of crawl. See simplecrawler docs for an explanation
   *  - `maxConcurrency` [Number] - Number of processes to spawn at a time
   *  - `timeout` [Number] - Time to wait for a server response before moving on
   *  - `downloadUnsupported` [Boolean] - Determines whether crawler downloads files it cannot parse
   *  - `userAgent` [String] - The UA string to send with requests
   *  - `htmlOnly` [Boolean] - Tells crawler not to crawl any non-HTML text/html pages. This is a required option and has no default
   *
   * Returns an array of objects containing SEO data and URL. Example return value:
   *
   *    [{
   *      url: 'http://example.com/page1.html',
   *      results: { <results object identical to signature of this.meta()'s return value> }
   *    }]
   */
  crawl: function(url, options, callback) {
    var crawler       = Crawler.crawl(url.toLowerCase()),
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
    if (opts.htmlOnly === true) { // Being explicit about truthy values here
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
          parsedPages.push({url: page.url, results: seoParser(page.body)});
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

