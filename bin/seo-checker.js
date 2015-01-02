#!/usr/bin/env node

/**
 * seochecker
 *
 * This script will eventually become the CLI
 * to the seo-checker library. Right now it
 * is not useful except for testing so do not
 * use it. Use the library directly instead.
 */

'use strict';

var seochecker = require(__dirname + '/../src/index');

var args = process.argv.slice(2);

if (args[0] === 'crawl') {
  var results = seochecker.crawl('https://cleverwebdesign.net', {htmlOnly: true});
} else if (args[0] === 'another') {
  var a = seochecker.another('hello');
  console.log(a);
} else {
  console.warn('Command not found.');
}
