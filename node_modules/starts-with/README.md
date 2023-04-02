# [starts-with][author-www-url] [![npmjs.com][npmjs-img]][npmjs-url] [![The MIT License][license-img]][license-url] 

> Returns `true` if the given string or array starts with prefix using strict equality for comparisons. Using fastest implementation.

[![code climate][codeclimate-img]][codeclimate-url] [![standard code style][standard-img]][standard-url] [![travis build status][travis-img]][travis-url] [![coverage status][coveralls-img]][coveralls-url] [![dependency status][david-img]][david-url]


## Install
```
npm i starts-with --save
npm test
```


## Usage
> For more use-cases see the [tests](./test.js)

```js
var startsWith = require('starts-with')

startsWith('abcdefghi', 'abcd') //=> true
startsWith(['abc', 'def', 'ghi'], 'abc') //=> true
startsWith(['abc', 'def', 'ghi'], ['abc']) //=> false
startsWith(['cab', 'cdf', 'cef'], 'c') //=> false
startsWith([57, 'a', 'b'], 57) //=> true
startsWith([57, 'a', 'b', 'c'], '57') //=> false
startsWith(['57', 'a', 'b', 'c'], '57') //=> true
```


## Related
- [ends-with](https://github.com/jonschlinkert/ends-with): Returns `true` if the given `string` or `array` ends with `suffix` using strict equality for comparisons.
- [each-string-index](https://github.com/jonschlinkert/each-string-index): Get the index for each occurrence of a string, in a string. Much faster than regex, and useful for doing simple find and replace operations for specific strings.
- [starts-with-any](https://github.com/jonschlinkert/starts-with-any): Returns true if the given string or array begins with any of the given substrings.


## Contributing
Pull requests and stars are always welcome. For bugs and feature requests, [please create an issue](https://github.com/tunnckoCore/starts-with/issues/new).  
But before doing anything, please read the [CONTRIBUTING.md](./CONTRIBUTING.md) guidelines.


## [Charlike Make Reagent](http://j.mp/1stW47C) [![new message to charlike][new-message-img]][new-message-url] [![freenode #charlike][freenode-img]][freenode-url]

[![tunnckocore.tk][author-www-img]][author-www-url] [![keybase tunnckocore][keybase-img]][keybase-url] [![tunnckoCore npm][author-npm-img]][author-npm-url] [![tunnckoCore twitter][author-twitter-img]][author-twitter-url] [![tunnckoCore github][author-github-img]][author-github-url]


[npmjs-url]: https://www.npmjs.com/package/starts-with
[npmjs-img]: https://img.shields.io/npm/v/starts-with.svg?label=starts-with

[license-url]: https://github.com/tunnckoCore/starts-with/blob/master/LICENSE.md
[license-img]: https://img.shields.io/badge/license-MIT-blue.svg


[codeclimate-url]: https://codeclimate.com/github/tunnckoCore/starts-with
[codeclimate-img]: https://img.shields.io/codeclimate/github/tunnckoCore/starts-with.svg

[travis-url]: https://travis-ci.org/tunnckoCore/starts-with
[travis-img]: https://img.shields.io/travis/tunnckoCore/starts-with.svg

[coveralls-url]: https://coveralls.io/r/tunnckoCore/starts-with
[coveralls-img]: https://img.shields.io/coveralls/tunnckoCore/starts-with.svg

[david-url]: https://david-dm.org/tunnckoCore/starts-with
[david-img]: https://img.shields.io/david/tunnckoCore/starts-with.svg

[standard-url]: https://github.com/feross/standard
[standard-img]: https://img.shields.io/badge/code%20style-standard-brightgreen.svg


[author-www-url]: http://www.tunnckocore.tk
[author-www-img]: https://img.shields.io/badge/www-tunnckocore.tk-fe7d37.svg

[keybase-url]: https://keybase.io/tunnckocore
[keybase-img]: https://img.shields.io/badge/keybase-tunnckocore-8a7967.svg

[author-npm-url]: https://www.npmjs.com/~tunnckocore
[author-npm-img]: https://img.shields.io/badge/npm-~tunnckocore-cb3837.svg

[author-twitter-url]: https://twitter.com/tunnckoCore
[author-twitter-img]: https://img.shields.io/badge/twitter-@tunnckoCore-55acee.svg

[author-github-url]: https://github.com/tunnckoCore
[author-github-img]: https://img.shields.io/badge/github-@tunnckoCore-4183c4.svg

[freenode-url]: http://webchat.freenode.net/?channels=charlike
[freenode-img]: https://img.shields.io/badge/freenode-%23charlike-5654a4.svg

[new-message-url]: https://github.com/tunnckoCore/messages
[new-message-img]: https://img.shields.io/badge/send%20me-message-green.svg
