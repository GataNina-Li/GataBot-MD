# ffmpeg-probe

> Wrapper around [ffprobe](https://www.ffmpeg.org/ffprobe.html) for getting info about media files such as width, height, and duration.

[![NPM](https://img.shields.io/npm/v/ffmpeg-probe.svg)](https://www.npmjs.com/package/ffmpeg-probe) [![Build Status](https://travis-ci.com/transitive-bullshit/ffmpeg-probe.svg?branch=master)](https://travis-ci.com/transitive-bullshit/ffmpeg-probe) [![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

## Install

```bash
npm install --save ffmpeg-probe
# or
yarn add ffmpeg-probe
```

## Usage

```js
const ffmpeg = require('fluent-ffmpeg')
const probe = require('ffmpeg-probe')

const info = await probe('input.mp4')

// info = {
//   width: 640,
//   height: 360,
//   duration: 4000,
//   fps: 25,
//   streams: [ ... ],
//   format: { ... }
// }
```

## API

### probe(input)

Returns a `Promise` for the [probe](https://www.ffmpeg.org/ffprobe.html) information augmented with the first stream's `width`, `height`, and `duration` in milliseconds.

#### input

Type: `String`

Path or URL to a media file.

## Related

- [fluent-ffmpeg](https://github.com/fluent-ffmpeg/node-fluent-ffmpeg)
- [awesome-ffmpeg](https://github.com/transitive-bullshit/awesome-ffmpeg) - A curated list of awesome ffmpeg resources with a focus on JavaScript.

## License

MIT © [Travis Fischer](https://github.com/transitive-bullshit)
