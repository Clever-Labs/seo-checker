# SEO Checker [![Build Status](https://travis-ci.org/Clever-Labs/seo-checker.svg?branch=master)](https://travis-ci.org/Clever-Labs/seo-checker)

> A library for checking basic SEO signals on a web page

## Usage

Install with npm `npm install seo-checker --save`

### Getting started

Require the library and then all the methods listed below will be made available to you.

```js
var seochecker = require('seo-checker');

var pageBody = seochecker.load('http://google.com');
```

### Parsing Pages

This library does not interpret SEO signals itself. It needs you to write the rules. What it does do is crawl and parse one or more web pages and returns an object or an array of object containing data you can use to determine the quality of a page's SEO.

#### Single page

To parse a single page use the `load` and `meta` methods in sequence. `load` will fetch the contents of a URL as a string and pass its result to the callback you specify. Call `meta` inside of your callback to parse the page data.

```js
var page = seochecker.load('https://google.com', function(response) {
  if(!response) { // response will be false on error
    // error
  } else {
    // Do stuff with response object. See below for properties
  }
});
```

#### Multiple Pages

You can crawl a website and gather SEO data on any number of pages at once before parsing the results and returning a result. The `crawl` method takes a URL, an options object, and an optional (recommended) callback function.

<!-- TODO: Document options -->

```js
seochecker.crawl('https://google.com', {htmlOnly: true}, function(pages) {
  var util = require('util');
  console.log(util.inspect(pages));
});
```

#### Return values

The object returned will look like the example below when using the `meta` or `crawl` methods. If you use the `crawl` method the value will be wrapped inside of an array you can iterate over otherwise only a single object with these properties are returned.

```js
// Example of response for a single page (not a crawl)
{ 
  title: 'Page title tag value',
  description: 'Meta description value from page',
  author: 'Meta author attribute',
  keywords: null, // Null when empty or the string contained in the <meta name="keywords" /> tag
  heading1: 'First H1 Tag on Page',
  totalHeadings: 1, // Number of H1 tags on the page
  imgAccessibility: 100 // Image accessibility score
}
```

Most of the items in the returned object are self explanatory. Here are the ones that may not be obvious:

* `heading1`: This is the text of the first H1 heading tag on the page
* `totalHeadings`: Counts how many H1 tags on a page
* `imgAccessibility` - This is the percentage of images on a page that have no `alt` or `title` attributes.

## Development

1. Clone the repository `git clone https://github.com/Clever-Labs/seo-checker.git && cd seo-checker`
2. Install dependencies `npm install`

Now you can develop!

## Tests

SEO Checker's tests are written with Nodeunit. Run `grunt nodeunit` or `npm test` to run them. All tests must pass in the `master` branch before we release new versions.

We would especially appreciate anyone who contributes more/better tests for the code that already exists.

## Contributing

Contributions are very welcome! This is a project we created to fulfill a pretty specific use case. Although we tried to make it as generic as possible we think we can improve. So if you want to expand on our work and make this library appeal to a broader range of use cases or platforms then please share your pull requests and we'll accept them.

__Branching__

We have two main branches we use for development; `master` and `develop`. `master` is our latest stable release and `develop` contains changes that'll make it to next release. When contributing, do not commit to either of these branches. Instead, create a branch off of the `develop` branch and make your changes there. After that we'll merge your changes into `develop` before finally releasing the next version by merging those changes into `master`. The `develop` branch is stable enough to use and develop against but the `master` branch is what you want if you only intend to use the library and not contribute.

__Requirements for pull requests__

* Create a new topic branch based off of `develop` (see above)
* Write tests for new functionality
* Make sure existing tests work when refactoring existing functionality
* Maintain the code styles we've set throughout the project. We have a `.editorconfig` file that'll get your 90% of the way there if your editor supports EditorConfig.

Broken or missing tests won't necessarily get a pull request rejected but it'll probably take quite a bit of time before we can fix it and merge it into the existing code.
