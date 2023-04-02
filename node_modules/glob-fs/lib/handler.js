'use strict';

var util = require('util');
var Emitter = require('component-emitter');
var define = require('./utils').defineProp;

function Handler(app) {
  define(this, 'app', app);
  Emitter.call(this);
  this.fns = [];
}

util.inherits(Handler, Emitter);

Handler.prototype.use = function(fn) {
  this.fns.push(fn);
  return this;
};

Handler.prototype.handle = function(file) {
  this.fns = this.fns.filter(Boolean);
  var len = this.fns.length, i = -1;
  this.app.track(file);

  while (++i < len) {
    this.fns[i].call(this.app, file);
    this.app.track(file);

    if (file.include === true || file.exclude === true) {
      break;
    }
  }
};

/**
 * Expose `Handler`
 */

module.exports = Handler;
