# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/en/1.0.0/)
and this project adheres to [Semantic Versioning](http://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [1.0.1] 2018-12-03
### Changed
- Updated some dependencies to resolve security vulnerabilities reported by `npm audit`.

## [1.0.0] - 2018-10-15
### Added
- New API for getting frameInfo from gif (#9). Thanks [@Snelius30](https://github.com/Snelius30)!

### Changed
- Using `get-pixels` fork which fetches `frameInfo` from omggif.

## [0.4.1] - 2018-08-17
### Changed
- Updated some dependencies to resolve security vulnerabilities reported by `npm audit`.

## [0.4.0] - 2017-12-05
### Added
- `cumulative` option for computing frames by layering on top of prior frames

### Removed
- `path` import that was no longer being used

## [0.3.0] - 2017-07-13
### Added
- Unminified and minified [browser bundles](https://github.com/benwiley4000/gif-frames/blob/master/README.md#cdn-scripts) which will expose the library as a global called `gifFrames` - for those not using npm.

### Changed
- Now relying on (hopefully short-term) forks of [get-pixels](https://www.npmjs.com/package/get-pixels-jpeg-js-upgrade) and [save-pixels](https://www.npmjs.com/package/save-pixels-jpeg-js-upgrade), published to npm. These allow us to run UglifyJS for our minified build, and maintain compatibility with older browsers (the previous jpeg-js dependency [relied on ES2015+ features](https://github.com/eugeneware/jpeg-js/pull/26)).

## [0.2.4] - 2017-06-26
### Added
- This changelog
- Detailing of `getImage` and `frameIndex` in frame result object

### Changed
- GIF `type` specification for `get-pixels` in the browser (see [this issue](https://github.com/scijs/get-pixels/issues/33))
- Improved/actually correct browser usage example
- `getImageStream` in frame result object now called `getImage` (since it can return a `canvas` element *or* a stream)

## [0.2.3] - 2017-06-26
### Added
- npm registry badge in readme

### Changed
- `Promise` gets returned even if we bail during options validation

## [0.2.2] - 2017-06-26
### Added
- More terse intro code example included in readme

### Changed
- Passing `'all'` as `frames` option ***really*** works now (actually)

## [0.2.1] - 2017-06-26
### Changed
- Passing `'all'` as `frames` option actually works now (**almost! just kidding**)

## [0.2.0] - 2017-06-26
### Added
- `frames` option for specifying which frames we want
- `getFrames` returns a `Promise` if available in environment
- Callback and promise pass a data stream for each requested frame
- Dependency on `multi-integer-range`

### Changed
- Better browser usage example (**but it doesn't work!**)

### Removed
- File writing - users can do that themselves (helps with interoperability between Node / browser)

## 0.1.0 - 2017-06-25
### Added
- Initial module definition
- All GIF frames written to file with `fs`
- Accepts optional error callback
- Dependencies on `get-pixels` and `save-pixels`

[Unreleased]: https://github.com/benwiley4000/gif-frames/compare/v1.0.1...HEAD
[1.0.1]: https://github.com/benwiley4000/gif-frames/compare/v1.0.0...v1.0.1
[1.0.0]: https://github.com/benwiley4000/gif-frames/compare/v0.4.1...v1.0.0
[0.4.1]: https://github.com/benwiley4000/gif-frames/compare/v0.4.0...v0.4.1
[0.4.0]: https://github.com/benwiley4000/gif-frames/compare/v0.3.0...v0.4.0
[0.3.0]: https://github.com/benwiley4000/gif-frames/compare/v0.2.4...v0.3.0
[0.2.4]: https://github.com/benwiley4000/gif-frames/compare/v0.2.3...v0.2.4
[0.2.3]: https://github.com/benwiley4000/gif-frames/compare/v0.2.2...v0.2.3
[0.2.2]: https://github.com/benwiley4000/gif-frames/compare/v0.2.1...v0.2.2
[0.2.1]: https://github.com/benwiley4000/gif-frames/compare/v0.2.0...v0.2.1
[0.2.0]: https://github.com/benwiley4000/gif-frames/compare/v0.1.0...v0.2.0
