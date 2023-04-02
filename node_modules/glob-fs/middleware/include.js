'use strict';

var path = require('path');
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

  return function include(file) {
    if (this.pattern.hasTrailingSlash && file.isFile()) {
      return file;
    }


    if (isMatch(file.path)) {
      file.include = true;
      return file;
    }

    if (this.pattern.hasParent()) {

      if (isMatch(file.relative)) {
        file.include = true;
        return file;
      }

      var cwd = this.pattern.options.cwd || '.';
      var re = this.pattern.regex;

      if (re.test(path.join(cwd, file.relative))) {
        file.include = true;
        return file;
      }

      if (re.test(file.segment) || re.test(file.relative)) {
        file.include = true;
        return file;
      }
    }
    return file;
  };
};
