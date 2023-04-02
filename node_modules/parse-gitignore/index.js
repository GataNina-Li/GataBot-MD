/*!
 * parse-gitignore <https://github.com/jonschlinkert/parse-gitignore>
 *
 * Copyright (c) 2015, Jon Schlinkert.
 * Licensed under the MIT License.
 */

'use strict';

var fs = require('fs');
var isGlob = require('is-glob');
var cache = {};


function gitignore(fp, patterns, options) {
  if (!fp || !fs.existsSync(fp)) return [];

  if (cache.hasOwnProperty(fp)) {
    return cache[fp];
  }

  if (typeof pattern !== 'string' && !Array.isArray(patterns)) {
    options = patterns;
    patterns = [];
  }

  var str = fs.readFileSync(fp, 'utf8');
  var lines = str.split(/\r\n?|\n/).concat(patterns || []);
  var res = gitignore.parse(lines, options || {});
  return (cache[fp] = res);
}

gitignore.parse = function parse(arr, opts) {
  arr = arrayify(arr);
  var len = arr.length, i = -1;
  var res = [];

  while (++i < len) {
    var str = arr[i];
    str = (str || '').trim();

    if (!str || str.charAt(0) === '#') {
      continue;
    }

    var parsed = gitignore.toGlob(str);
    addPattern(res, parsed.patterns, parsed.stats, opts);
  }
  return res;
};

gitignore.toGlob = function toGlob(str) {
  var parsed = {}, stats = {};

  stats.first = str.charAt(0);
  stats.last = str.slice(-1);

  stats.isNegated = stats.first === '!';
  stats.isGlob = isGlob(str);

  if (stats.isNegated) {
    str = str.slice(1);
    stats.first = str.charAt(0);
  }

  if (stats.first === '/') {
    str = str.slice(1);
  }

  if (/\w\/[*]{2}\/\w/.test(str)) {
    str += '|' + str.split('/**/').join('/');
  }

  if (/^[\w.]/.test(str) && /\w$/.test(str) && !stats.isGlob) {
    str += '|' + str + '/**';

  } else if (/\/$/.test(str)) {
    str += '**';
  }

  parsed.stats = stats;
  parsed.patterns = str.split('|');
  return parsed;
};

function addPattern(res, arr, stats, options) {
  arr = arrayify(arr);
  var len = arr.length, i = -1;
  while (++i < len) {
    var str = arr[i];
    if (stats.isNegated) {
      str = '!' + str;
    }
    if (options.invert) {
      str = invert(str);
    }
    if (res.indexOf(str) === -1) {
      res.push(str);
    }
  }
  return res;
}

function invert(str) {
  if (str.charAt(0) === '!') {
    return str.slice(1);
  }
  return '!' + str;
}

function arrayify(val) {
  return Array.isArray(val) ? val : [val];
}

/**
 * Expose `gitignore`
 */

module.exports = gitignore;
