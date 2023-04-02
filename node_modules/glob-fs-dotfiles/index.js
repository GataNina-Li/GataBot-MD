'use strict';

module.exports = function (opts) {
  opts = opts || {};

  return function dotfiles(file) {
    opts = this.setDefaults(this.pattern.options, opts);

    if (this.pattern.glob.charAt(0) === '.') {
      opts.dot = true;
    }

    var isDotfile = file.isDotfile() && file.relative !== '.git';
    var isDotdir = file.isDotdir() || file.relative === '.git';

    // dotfiles
    if (isDotfile && (opts.dot === true || opts.dotfiles === true)) {
      file.include = true;
      return file;
    }

    // dotdirs
    if (isDotdir && (opts.dot === true || opts.dotdirs === true)) {
      file.include = true;
      return file;
    }

    if ((isDotdir || isDotfile) && file.include !== true) {
      file.exclude = true;
    }
    return file;
  };
};
