'use strict';

var fs = require('fs');
var path = require('path');
var async = require('async');
var lazy = require('lazy-cache')(require);
var mixin = require('mixin-object');
var through = lazy('through2');
var promise = lazy('bluebird');
var filter = require('./filter');

module.exports = function (app) {
  app.visit('mixin', {

    iteratorAsync: function(dir, cb) {
      var self = this;

      setImmediate(function () {
        fs.exists(dir, function(exists) {
          if (!exists) {
            return cb(null, []);
          }
          return walk(dir, cb);
        });
      });

      function walk(dir, cb) {
        fs.readdir(dir, function(err, files) {
          if (err) return cb(err);

          async.each(files, function(segment, next) {
            var fp = path.join(dir, segment);
            var file = self.createFile({
              dirname: dir,
              segment: segment,
              path: fp
            });

            self.realpath(file, function(err, res) {
              if (err) return next(err);

              mixin(file, res);
              file.parse(self.pattern.cwd);

              var isDir = file.isDirectory();

              // handle middleware
              self.emit('file', file);
              self.handle(file);

              // emit directory
              if (isDir) self.emit('dir', file);

              // emit excluded file
              if (file.exclude === true) {
                self.emit('exclude', file);
                return next();
              }

              // emit included file
              if (file.include === true) {
                self.emit('include', file);
                self.files.push(file.relative);
              }

              if (file.recurse !== false && isDir) {
                return walk(fp, next);
              }
              next();
            });

          }, cb);
        });
      }
      return this;
    },

    iteratorSync: function(dir) {
      var self = this;
      var files = fs.readdirSync(dir);
      var len = files.length, i = -1;

      while (++i < len) {
        var segment = files[i];
        var fp = path.join(dir, segment);
        var file = self.createFile({
          dirname: dir,
          segment: segment,
          path: fp
        });

        var res = self.realpathSync(file);
        mixin(file, res);

        file.parse(this.pattern.cwd);
        var isDir = file.isDirectory();

        // handle middleware
        self.emit('file', file);
        self.handle(file);

        // emit directory
        if (isDir) self.emit('dir', file);

        // emit excluded file
        if (file.exclude === true) {
          self.emit('exclude', file);
          continue;
        }

          // console.log(file.path)
        // emit included file
        if (file.include === true) {
          self.emit('include', file);
          self.files.push(file.relative);
        }

        if (file.recurse !== false && isDir) {
          this.iteratorSync(fp);
        }
      }
      return this;
    },

    iteratorStream: function(dir) {
      var self = this;
      var stream = through().obj();
      var pass = through().obj();

      setImmediate(function () {
        fs.exists(dir, function(exists) {
          if (!exists) return;

          walk(dir, function (err) {
            if (err) {
              stream.emit('error', err);
              return;
            }
            stream.end();
          });
        });
      });

      function walk(dir, cb) {
        fs.readdir(dir, function(err, files) {
          if (err) {
            stream.emit('error', err);
            return;
          }

          async.each(files, function(segment, next) {
            var fp = path.join(dir, segment);
            var file = self.createFile({
              dirname: dir,
              segment: segment,
              path: fp
            });

            self.realpath(file, function(err, res) {
              if (err) return next(err);
              mixin(file, res);

              file.parse(self.pattern.cwd);
              var isDir = file.isDirectory();

              // handle middleware
              self.emit('file', file);
              self.handle(file);

              if (isDir) self.emit('dir', file);
              if (file.exclude === true) {
                self.emit('exclude', file);
                return next();
              }

              if (file.include === true) {
                self.emit('include', file);
                self.files.push(file.relative);
                stream.write(file);
              }

              if (file.recurse !== false && isDir) {
                return walk(fp, next);
              }
              next();
            });
          }, cb);
        });
      }
      stream = stream.pipe(pass);
      return stream;
    },

    iteratorPromise: function(dir) {
      var Promise = promise();
      var readdir = Promise.promisify(fs.readdir);
      var realpath = Promise.promisify(this.realpath);
      var self = this;

      return readdir(dir)
        .map(function (segment) {
          var fp = path.join(dir, segment);
          var file = self.createFile({
            dirname: dir,
            segment: segment,
            path: fp
          });

          return realpath(file)
            .then(function (res) {
              mixin(file, res);

              file.parse(self.pattern.cwd);
              var isDir = file.isDirectory();

              // handle middleware
              self.emit('file', file);
              self.handle(file);

              // emit directory
              if (isDir) self.emit('dir', file);

              // emit excluded file
              if (file.exclude === true) {
                self.emit('exclude', file);
                return file.path;
              }

              // emit included file
              if (file.include === true) {
                self.emit('include', file);
                self.files.push(file.relative);
              }

              if (file.recurse !== false && isDir) {
                return self.iteratorPromise(fp);
              }
              return file.path;
            });
        })

        .reduce(function (acc, files) {
          return acc.concat(files);
        }, []);
    },

  });
};
