'use strict';

var warning = lazyCache(require)('ansi-yellow');

function lazyCache(fn) {
  var cache = {};
  return function (name) {
    return function () {
      if (cache.hasOwnProperty(name)) {
        return cache[name];
      }
      try {
        return (cache[name] = fn(name));
      } catch (err) {
        console.log(warning()(err));
        return;
      }
    };
  };
}

/**
 * Expose `lazyCache`
 */

module.exports = lazyCache;
