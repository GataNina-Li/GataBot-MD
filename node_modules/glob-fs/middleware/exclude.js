'use strict';

var mm = require('micromatch');
var typeOf = require('kind-of');
var extend = require('extend-shallow');

function testPattern(pattern) {
  return function (fp) {
    return pattern.test(fp);
  }
}

module.exports = function (pattern, options) {
  var opts = extend({}, options);
  var type = typeOf(pattern);

  var isMatch = type !== 'regexp'
    ? mm.matcher(pattern, opts)
    : testPattern(pattern);

  return function exclude(file) {
    if (file.pattern.hasTrailingSlash && file.isFile()) {
      return file;
    }

    if (isMatch(file.path)) {
      file.exclude = true;
      return file;
    }

    if (file.pattern.hasParent()) {
      if (isMatch(file.relative)) {
        file.exclude = true;
        return file;
      }

      if (file.pattern.test(file.segment) || file.pattern.test(file.relative)) {
        file.exclude = true;
        return file;
      }
    }
    return file;
  };
};
