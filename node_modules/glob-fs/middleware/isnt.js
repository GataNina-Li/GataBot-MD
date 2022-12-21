'use strict';

module.exports = function (re) {
  return function isnt(file) {
    if (re.test(file.path)) {
      file.exclude = true;
    }
    return file;
  };
};
