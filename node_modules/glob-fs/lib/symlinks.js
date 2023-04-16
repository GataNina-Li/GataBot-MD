'use strict';

var path = require('path');
var fs = require('graceful-fs');

/**
 * Recursively resolve a filepath to get the real path for a
 * symlink.
 *
 * @param  {Object} file
 * @param  {NA} `enc` not used
 * @param  {Function} `cb` callback
 * @return {Object}
 */

module.exports = function (app) {
  app.visit('mixin', {

    realpath: function realpath(file, cb) {
      var self = this;

      fs.lstat(file.path, function (err, stats) {
        if (err) return cb(err);
        file.stat = stats;
        decorate(file);

        if (!file.isSymlink()) {
          return cb(null, file);
        }

        fs.realpath(file.path, function (err, fp) {
          if (err) return cb(err);

          file.base = path.dirname(fp);
          file.path = fp;

          // recurse to get real file stat
          self.realpath(file, cb);
        });
      });
    },

    realpathSync: function realpathSync(file) {
      var self = this;
      try {
        var stats = fs.lstatSync(file.path);
        file.stat = stats;
        decorate(file);

        if (!file.isSymlink()) {
          return file;
        }
      } catch(err) {
        throw new Error('fs.lstatSync error: ', err);
      }

      try {
        var fp = fs.realpathSync(file.path);
        file.base = path.dirname(fp);
        file.path = fp;

        // recurse to get real file stat
        return self.realpathSync(file);
      } catch (err) {
        throw new Error('fs.realpathSync Error: ', err);
      }
    }
  });
};

function decorate(file) {
  file.isDirectory = function () {
    return file.stat.isDirectory();
  };

  file.isFile = function () {
    return file.stat.isFile();
  };

  file.isSymlink = function () {
    return file.stat.isSymbolicLink();
  };
}
