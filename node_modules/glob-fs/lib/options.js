'use strict';

var extend = require('extend-shallow');
var set = require('set-value');
var get = require('get-value');
var utils = require('./utils');

module.exports = function (app) {
  app.visit('mixin', {

    setDefaults: function () {
      var args = [].slice.call(arguments);
      var opts = [{}].concat(this.options);
      return extend.apply(extend, opts.concat(args));
    },

    /**
     * Set or get an option.
     *
     * ```js
     * glob.option('foo.bar', 'baz');
     * glob.option('foo');
     * //=> { bar: 'baz' }
     * ```
     *
     * @param {String} `key` Dot notation may optionally be used.
     * @param {any} `value`
     * @return {Object} `Options` to enable chaining
     * @api public
     */

    option: function(key, val) {
      var len = arguments.length;
      if (len === 1 && typeof key === 'string') {
        return this.getOption(key);
      }
      if (utils.isObject(key)) {
        this.visit('option', key);
        return this;
      }
      set(this.options, key, val);
      this.emit('option', key, val);
      return this;
    },

    /**
     * Get an option.
     *
     * @param  {String} `prop` Dot notation may optionally be used.
     * @return {any}
     */

    getOption: function (prop) {
      if (prop.indexOf('.') === -1) {
        return this.options[prop];
      }
      return get(this.options, prop);
    },

    /**
     * Enable `key`.
     *
     * ```js
     * glob.enable('a');
     * ```
     * @param {String} `key`
     * @return {Object} `Glob` instance, to enable chaining
     * @api public
     */

    enable: function(key) {
      this.option(key, true);
      return this;
    },

    /**
     * Disable `key`.
     *
     * ```js
     * glob.disable('a');
     * ```
     *
     * @param {String} `key` The option to disable.
     * @return {Object} `Glob` instance, to enable chaining
     * @api public
     */

    disable: function(key) {
      this.option(key, false);
      return this;
    },

    /**
     * Check if `key` is enabled (truthy).
     *
     * ```js
     * glob.enabled('a');
     * //=> false
     *
     * glob.enable('a');
     * glob.enabled('a');
     * //=> true
     * ```
     *
     * @param {String} `key`
     * @return {Boolean}
     * @api public
     */

    enabled: function(key) {
      return this.options[key] === true;
    },

    /**
     * Check if `key` is disabled (falsey).
     *
     * ```js
     * glob.disabled('a');
     * //=> true
     *
     * glob.enable('a');
     * glob.disabled('a');
     * //=> false
     * ```
     *
     * @param {String} `key`
     * @return {Boolean}
     * @api public
     */

    disabled: function(key) {
      return this.options[key] === false;
    }
  });
};
