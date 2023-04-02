'use strict';

var lazy = require('lazy-cache')(require);
var get = lazy('get-value');
var mm = lazy('micromatch');

module.exports = function (app) {
  app.cache = app.cache || {};

  app.visit('mixin', {
    restore: function (name) {
      var res = get()(this.cache, name);
      res.__proto__ = this;
      return res;
    },

    stash: function(name, fp, glob, opts) {
      this.cache[name] = this.cache[name] || [];
      if (mm().isMatch(fp, glob, opts)) {
        this.cache[name].push(fp);
      }
      return this;
    },

    filter: function(name, fn) {
      if (!this.cache[name]) return this;
      var res = this.cache[name].filter(fn);
      res.__proto__ = this;
      return res;
    },

    flush: function() {
      this.files = [];
      return this;
    }
  });
};
