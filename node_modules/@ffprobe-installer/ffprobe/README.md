# node-ffprobe-installer
<!-- ALL-CONTRIBUTORS-BADGE:START - Do not remove or modify this section -->
[![All Contributors](https://img.shields.io/badge/all_contributors-5-orange.svg?style=flat-square)](#contributors-)
<!-- ALL-CONTRIBUTORS-BADGE:END -->

[![npm](https://img.shields.io/npm/dt/@ffprobe-installer/ffprobe.svg?style=flat-square)](https://www.npmjs.com/package/@ffprobe-installer/ffprobe) [![npm](https://img.shields.io/npm/v/@ffprobe-installer/ffprobe.svg?style=flat-square)](https://www.npmjs.com/package/@ffprobe-installer/ffprobe?activeTab=versions) [![xo](https://img.shields.io/badge/code%20style-XO-60CFBE.svg?longCache=true&style=flat-square&logo=)](https://github.com/xojs/xo)

[![Build Status](https://img.shields.io/github/actions/workflow/status/SavageCore/node-ffprobe-installer/npm-test.yml?branch=master)](https://github.com/SavageCore/node-ffprobe-installer/actions/workflows/npm-test.yml) [![Codecov](https://img.shields.io/codecov/c/github/SavageCore/node-ffprobe-installer.svg?style=flat-square)](https://codecov.io/gh/SavageCore/node-ffprobe-installer/)

Platform independent binary installer of [FFprobe](https://ffmpeg.org/) for node projects. Useful for tools that should "just work" in multiple environments.

Installs a standalone static binary of `ffprobe` for the current platform and provides a path and version. Supports Linux, Windows 7+, and MacOS 10.9+.

A combination of package.json fields `optionalDependencies`, `cpu`, and `os` lets the installer only download the binary for the current platform. See also [Warnings during install](https://github.com/SavageCore/node-ffprobe-installer/blob/master/README.md#warnings-during-install).

## Install

    npm install --save @ffprobe-installer/ffprobe

## Usage examples

```javascript
const ffprobe = require('@ffprobe-installer/ffprobe');
console.log(ffprobe.path, ffprobe.version);
```

### [process.spawn()](https://nodejs.org/api/child_process.html#child_process_child_process_spawn_command_args_options)

```javascript
const ffprobePath = require('@ffprobe-installer/ffprobe').path;
const spawn = require('child_process').spawn;
const ffprobe = spawn(ffprobePath, args);
ffprobe.on('exit', onExit);
```

### [fluent-ffmpeg](https://github.com/fluent-ffmpeg/node-fluent-ffmpeg)

```javascript
const ffprobePath = require('@ffprobe-installer/ffprobe').path;
const ffmpeg = require('fluent-ffmpeg');
ffmpeg.setFfprobePath(ffprobePath);
```

## Warnings during install

To automatically choose the binary to install, [optionalDependencies](https://docs.npmjs.com/files/package.json#optionaldependencies) are used. This currently outputs warnings in the console, an issue for that is [tracked by the npm team here](https://github.com/npm/npm/issues/9567).

## Known Issues

### AWS and/or Elastic Beanstalk

If you get permissions issues, try adding a .npmrc file with the following:

    unsafe-perm=true

See [node-ffmpeg-installer/issues/21](https://github.com/kribblo/node-ffmpeg-installer/issues/21)

### Wrong path under Electron with Asar enabled

It's a [known issue](https://github.com/electron-userland/electron-packager/issues/740) that Asar breaks native paths. As a workaround, if you use Asar, you can do something like this:

```javascript
const ffprobePath = require('@ffprobe-installer/ffprobe').path.replace(
	'app.asar',
	'app.asar.unpacked'
);
```

## The binaries

Downloaded from the sources listed at [ffmpeg.org](https://ffmpeg.org/download.html):

- Linux (armhf, arm64, ia32, x64) (20220910-c92edd9): https://www.johnvansickle.com/ffmpeg/
- macOS (x64) (103117-g1f58503013): https://evermeet.cx/ffmpeg/
- macOS (arm64) (4.4.1): contributed by [wongyiuhang](https://github.com/wongyiuhang)
- Windows 32-bit (20230213-f8d6d0f): https://github.com/sudo-nautilus/FFmpeg-Builds-Win32/
- Windows 64-bit (20210804-3b29864): https://www.gyan.dev/ffmpeg/builds/

For version updates, submit issue or pull request.

## Upload new versions

In every updated `platforms/*` directory:

    npm run upload

## See also

- [node-ffmpeg-installer](https://www.npmjs.com/package/@ffmpeg-installer/ffmpeg) - This project is a fork of ffmpeg-installer

## Contributors ✨

Thanks goes to these wonderful people ([emoji key](https://allcontributors.org/docs/en/emoji-key)):

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
<!-- prettier-ignore-start -->
<!-- markdownlint-disable -->
<table>
  <tr>
    <td align="center"><a href="https://jonasdautel.dev"><img src="https://avatars3.githubusercontent.com/u/16684499?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Jonas Dautel</b></sub></a><br /><a href="https://github.com/SavageCore/node-ffprobe-installer/commits?author=SNRSE" title="Code">💻</a></td>
    <td align="center"><a href="https://kikobeats.com"><img src="https://avatars2.githubusercontent.com/u/2096101?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Kiko Beats</b></sub></a><br /><a href="https://github.com/SavageCore/node-ffprobe-installer/commits?author=Kikobeats" title="Code">💻</a></td>
    <td align="center"><a href="https://github.com/kaandok"><img src="https://avatars0.githubusercontent.com/u/472836?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Kaan Ozdokmeci</b></sub></a><br /><a href="https://github.com/SavageCore/node-ffprobe-installer/commits?author=kaandok" title="Documentation">📖</a></td>
    <td align="center"><a href="https://github.com/sw360cab"><img src="https://avatars0.githubusercontent.com/u/777866?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Sergio Maria Matone</b></sub></a><br /><a href="https://github.com/SavageCore/node-ffprobe-installer/commits?author=sw360cab" title="Code">💻</a></td>
    <td align="center"><a href="https://github.com/xemle"><img src="https://avatars.githubusercontent.com/u/261850?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Sebastian</b></sub></a><br /><a href="https://github.com/SavageCore/node-ffprobe-installer/commits?author=xemle" title="Code">💻</a></td>
  </tr>
</table>

<!-- markdownlint-restore -->
<!-- prettier-ignore-end -->

<!-- ALL-CONTRIBUTORS-LIST:END -->

This project follows the [all-contributors](https://github.com/all-contributors/all-contributors) specification. Contributions of any kind are welcome!
