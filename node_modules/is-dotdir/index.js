/*!
 * is-dotdir <https://github.com/jonschlinkert/is-dotdir>
 *
 * Copyright (c) 2015, Jon Schlinkert.
 * Licensed under the MIT License.
 */

'use strict';

var re = require('dotdir-regex');

module.exports = function (str) {
  return re().test(str);
};
