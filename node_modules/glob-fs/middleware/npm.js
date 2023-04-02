'use strict';

// this is a temporary
module.exports = function (options) {
  options = options || {};

  return function (file) {
    if (this.disabled('node_modules')) {
      return file;
    }
    var orig = this.pattern.original;
    var pattern = this.pattern.glob;
    if (/node_modules/.test(orig) || /node_modules/.test(pattern)) {
      return file;
    }
    if (/node_modules/.test(file.path)) {
      file.exclude = true;
    }
    return file;
  };
};
