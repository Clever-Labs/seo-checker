# SEO Checker [![Build Status](https://travis-ci.org/Clever-Labs/seo-checker.svg?branch=master)](https://travis-ci.org/Clever-Labs/seo-checker)

> A library for checking basic SEO signals on a web page

## Usage

## Development

1. Clone the repository `git clone https://github.com/Clever-Labs/seo-checker.git && cd seo-checker`
2. Install dependencies `npm install`

Now you can develop!

## Tests

SEO Checker's tests are written with Nodeunit. Run `grunt nodeunit` or `npm test` to run them. All tests must pass in the `master` branch before we release new versions.

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

TODO: Finish instructions and set up build/test/deploy tasks
