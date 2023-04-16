/*!
 * starts-with <https://github.com/tunnckoCore/starts-with>
 *
 * Copyright (c) 2015 Charlike Mike Reagent <@tunnckoCore> (http://www.tunnckocore.tk)
 * Released under the MIT license.
 */

'use strict'

/**
 * String or array starts with the given prefix
 *
 * @name  startsWith
 * @param {String|Array} `str`
 * @param {String} `needle`
 * @return {Boolean}
 * @api public
 */

module.exports = function startsWith (str, needle) {
  if (Array.isArray(str)) {
    return str[0] === needle
  }

  var len = needle.length
  var i = -1
  while (++i < len) {
    if (str.charAt(i) !== needle.charAt(i)) {
      return false
    }
  }
  return true
}
