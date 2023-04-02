/*!
 * dotdir-regex <https://github.com/regexps/dotdir-regex>
 *
 * Copyright (c) 2015 Jon Schlinkert, contributors.
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function dotdirRegex() {
  return /(?:^|[\\\/])(\.\w+)[\\\/]/;
};

