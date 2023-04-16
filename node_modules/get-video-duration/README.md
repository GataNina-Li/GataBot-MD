# get-video-duration

[![NPM version][npm-image]][npm-url]
![Build Status](https://github.com/caffco/get-video-duration/workflows/test/badge.svg)
[![Maintainability](https://api.codeclimate.com/v1/badges/d66b9477ad4f7a14b5c9/maintainability)](https://codeclimate.com/github/caffco/get-video-duration/maintainability)
[![Test Coverage](https://api.codeclimate.com/v1/badges/d66b9477ad4f7a14b5c9/test_coverage)](https://codeclimate.com/github/caffco/get-video-duration/test_coverage)
[![License][license-image]][license-url]
[![NPM bundle size (minified)][bundle-size-image]][npm-url]
[![Downloads][downloads-image]][downloads-url]

Get the duration of video files/streams with `ffprobe`.

# Install

```bash
$ npm install --save get-video-duration
```

# Usage

```js
const { getVideoDurationInSeconds } = require('get-video-duration')

// From a local path...
getVideoDurationInSeconds('video.mov').then((duration) => {
  console.log(duration)
})

// From a URL...
getVideoDurationInSeconds(
  'http://clips.vorwaerts-gmbh.de/big_buck_bunny.mp4'
).then((duration) => {
  console.log(duration)
})

// From a readable stream...

const fs = require('fs')
const stream = fs.createReadStream('video.mov')

getVideoDurationInSeconds(stream).then((duration) => {
  console.log(duration)
})

// If you need to customize the path to ffprobe...
getVideoDurationInSeconds('video.mov', '/path/to/ffprobe').then((duration) => {
  console.log(duration)
})
```

# License

MIT. Based on [get-video-dimensions](https://github.com/mgmtio/get-video-dimensions).

[npm-image]: https://img.shields.io/npm/v/get-video-duration.svg
[npm-url]: https://npmjs.org/package/get-video-duration
[bundle-size-image]: https://img.shields.io/bundlephobia/min/get-video-duration.svg
[license-image]: http://img.shields.io/npm/l/get-video-duration.svg
[license-url]: LICENSE
[downloads-image]: http://img.shields.io/npm/dm/get-video-duration.svg
[downloads-url]: https://npmjs.org/package/get-video-duration
