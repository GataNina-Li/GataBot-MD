const os = require('node:os');
const path = require('node:path');
const process = require('node:process');

const verifyFile = require('./lib/verify-file.js');

const platform = process.env.npm_config_platform || os.platform();
const arch = process.env.npm_config_arch || os.arch();

const target = platform + '-' + arch;

const packageName = '@ffprobe-installer/' + target;

if (!require('./package.json').optionalDependencies[packageName]) {
	throw new Error('Unsupported platform/architecture: ' + target);
}

const binary = platform === 'win32' ? 'ffprobe.exe' : 'ffprobe';

const npm3Path = path.resolve(__dirname, '..', target);
const npm2Path = path.resolve(__dirname, 'node_modules', '@ffprobe-installer', target);

const npm3Binary = path.join(npm3Path, binary);
const npm2Binary = path.join(npm2Path, binary);

const npm3Package = path.join(npm3Path, 'package.json');
const npm2Package = path.join(npm2Path, 'package.json');

let ffprobePath;
let packageJson;

if (verifyFile(npm3Binary)) {
	ffprobePath = npm3Binary;
	packageJson = require(npm3Package);
} else if (verifyFile(npm2Binary)) {
	ffprobePath = npm2Binary;
	packageJson = require(npm2Package);
} else {
	throw new Error('Could not find ffprobe executable, tried "' + npm3Binary + '" and "' + npm2Binary + '"');
}

const version = packageJson.ffprobe || packageJson.version;
const url = packageJson.homepage;

module.exports = {
	path: ffprobePath,
	version,
	url,
};
