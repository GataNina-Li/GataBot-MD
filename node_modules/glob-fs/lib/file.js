'use strict';

var path = require('path');
var relative = require('relative');

/**
 * Lazily required modules
 */

var lazy = require('lazy-cache')(require);
var parsePath = lazy('parse-filepath');
var startsWith = lazy('starts-with');
var endsWith = lazy('ends-with');
var isDotfile = lazy('is-dotfile');
var isDotdir = lazy('is-dotdir');

/**
 * Create a new `File` from the given `object`.
 *
 * @param {Object} `object`
 * @api public
 */

function File(file) {
  this.cache = new Map();
  this.history = [];
  this.pattern = file.pattern;
  this.recurse = file.recurse;
  this.dirname = file.dirname;
  this.segment = file.segment;
  this.path = file.path;
  this.orig = file.path;
}

/**
 * Parse the `file.path` to add additional path properties
 * to the `file` object. This is used in the iterators
 * before the middleware handler is called.
 *
 * @param  {String} `cwd`
 */

File.prototype.parse = function(cwd) {
  cwd = cwd || process.cwd();

  this.relative = relative(cwd, this.path);
  var parsed = parsePath()(this.path);
  for (var key in parsed) {
    if (parsed.hasOwnProperty(key)) {
      this[key] = parsed[key];
    }
  }
  if (this.isDirectory()) {
    if (this.pattern.endsWith('/') && !this.endsWith('/')) {
      this.relative += '/';
    }
  }
};

/**
 * Returns `true if the file give filepath or `file.path` looks like
 * a dotfile.
 *
 * @param  {String} `fp`
 * @return {Boolean}
 */

File.prototype.isDotfile = function(fp) {
  return isDotfile()(fp || this.path);
};

/**
 * Returns `true if the file give filepath or `file.path` looks like
 * a dot-directory.
 *
 * @param  {String} `fp`
 * @return {Boolean}
 */

File.prototype.isDotdir = function(fp) {
  return isDotdir()(fp || this.path);
};

/**
 * Return the absolute filepath based on the file's root path.
 *
 * @param  {String} `fp`
 * @return {String}
 */

File.prototype.toAbsolute = function(fp) {
  if (typeof fp === 'undefined') {
    fp = this.path;
  }
  if (this.startsWith('/', this.original)) {
    return path.join(this.root, fp);
  }
  if (this.isAbsolute || fp === '') {
    return fp;
  }
  return path.resolve(fp);
};

/**
 * Return `true` if the given `file.path` ends with the specified
 * `character`
 *
 * @param  {String} `character`
 * @param  {String} `fp` If no filepath is passed, the cached `file.path` is used.
 */

File.prototype.endsWith = function(ch, fp) {
  var key = 'endsWith:' + ch;
  if (this.cache.has(key)) return this.cache.get(key);

  if (typeof fp === 'undefined') {
    fp = this.relative || this.path;
  }

  var res = endsWith()(fp, ch);
  this.cache.set(key, res);
  return res;
};

/**
 * Return `true` if the given `filepath` starts with the specified
 * `character`
 *
 * @param  {String} `character`
 * @param  {String} `fp` If no filepath is passed, the cached `file.path` is used.
 */

File.prototype.startsWith = function(ch, fp) {
  var key = 'startsWith:' + ch;
  if (this.cache.has(key)) return this.cache.get(key);

  if (typeof fp === 'undefined') {
    fp = this.relative || this.path;
  }

  var res = startsWith()(fp, ch);
  this.cache.set(key, res);
  return res;
};


/**
 * Expose `File`
 */

module.exports = File;
