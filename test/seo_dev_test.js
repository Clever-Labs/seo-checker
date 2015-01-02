/**
 * SEO Checker Test Suite
 * ----------------------
 * This file is for pre-build tests
 */

// A basic smoke test to tell us NodeUnit is working
exports.testTest = function(test) {
  var a = true;
  test.equal(a, true);
  test.done();
};

// Begin test definitions
module.exports = {
  /**
   * ## Setup method
   *
   * Creates a new instance of SEO Checker
   * to use in tests
   */
  setUp: function(callback) {
    this.seo = require('../src/index.js');
    callback();
  },
  /**
   * ## Smoke Test
   *
   * This is a test that should always pass. If it
   * ever fails then there is something wrong with your
   * environment or test code but not the application.
   */
  smokeTest: function(test) {
    var a = true;
    test.equal(a, true);
    test.done();
  },
  /**
   * Load HTML from Host
   *
   * Test the ability to load the contents of a URL
   * as a string so it can be passed to another function
   * for parsing.
   */
  loadHostTest: function(test) {
    var body = this.seo.load('cleverwebdesign.net', function(response) {
      if (!response) {
        console.log(response);
        test.expect(1);
        test.equal(typeof response, 'string');
        test.done();
        return false;
      } else {
        test.expect(1);
        test.equal(typeof response, 'string');
        test.done();
      }
    });
  },
  /**
   * ## Parse page metadata
   *
   * This test checks that the meta data of a page has been
   * parsed using a known file.
   */
  parseMetaTest: function(test) {
    var meta = this.seo.meta;
    var result = this.seo.load('https://cleverwebdesign.net', function(response) {
      var page = meta(response);
      test.expect(1);
      test.equal(typeof page, 'object');
      test.done();
    });
  },
  /**
   * ## Crawl multiple pages at once
   *
   * Tests crawl/parse combo functionality.
   * Expect an array of objects each containing
   * data identical to the `meta` function.
   */
   crawlTest: function(test) {
    var crawl = this.seo.crawl('https://cleverwebdesign.net', { htmlOnly: true }, function(page) {
      //test.expect(3);
      test.ok(page, 'Page object should exist in resulting array');

      page.forEach(function(seo) {
        test.equal(typeof seo.url, 'string', 'Results should return URL as a string');
        test.equal(seo.results.imgAccessibility, 100, 'Image accessibility score should be 100%');
      });

      test.equal(page.length, 10, '10 pages should have been tested');
      test.done();
    });
   }
};
