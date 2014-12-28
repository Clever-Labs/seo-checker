/**
 * SEO Checker Test Suite
 * This file is for pre-build tests
 */

// A basic smoke test to tell us NodeUnit is working
exports.testTest = function(test) {
  var a = true;
  test.equal(a, true);
  test.done();
};

// Load tests
module.exports = {
  setUp: function(callback) {
    this.seo = require('../src/index.js');
    callback();
  },
  smokeTest: function(test) {
    var a = true;
    test.equal(a, true);
    test.done();
  },
  loadHostTest: function(test) {
    var body = this.seo.load('cleverwebdesign.net', function(response) {
      if (!response) {
        console.log(response);
        test.expect(1);
        test.equal(typeof response, 'string');
        test.done();
        return false;
      }
      test.expect(1);
      test.equal(typeof response, 'string');
      test.done();
    });
  },
  parseMetaTest: function(test) {
    var meta = this.seo.meta;
    var result = this.seo.load('https://cleverwebdesign.net', function(response) {
      var page = meta(response);
      test.expect(1);
      test.equal(typeof page, 'object');
      test.done();
    });
  }
};
