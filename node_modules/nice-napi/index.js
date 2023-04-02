'use strict';
const { nice } = require('node-gyp-build')(__dirname);
nice.nice = nice;
module.exports = nice;
