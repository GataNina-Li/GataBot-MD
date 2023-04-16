'use strict';

var findup = require('findup-sync');
var ignore = require('parse-gitignore');
var mm = require('micromatch');
var cwd = process.cwd();

function parseGitignore(opts) {
  opts = opts || {};

  var gitignoreFile = findup('.gitignore', {cwd: cwd});
  var ignorePatterns = ignore(gitignoreFile);

  var isMatch = function(fp) {
    return mm.any(fp, ignorePatterns, opts);
  };

  return function gitignore(file) {
    opts = this.setDefaults(this.pattern.options, opts);

    if (opts.dot || opts.dotfiles || opts.dotdirs) {
      if (file.isDotfile() || file.isDotdir()) {
        return file;
      }
    }

    if (opts.gitignore === false) {
      return file;
    }

    if (isMatch(file.relative)) {
      file.isIgnored = true;
      file.exclude = true;
    }
    return file;
  };
}

/**
 * Expose `parseGitignore`
 */

module.exports = parseGitignore;
