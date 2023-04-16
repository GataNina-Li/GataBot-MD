'use strict';

module.exports = function (re) {
  return function is(file) {
    if (re.test(file.path)) {
      file.include = true;
    }
    return file;
  };
};
