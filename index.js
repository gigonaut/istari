const Router = require('./lib/router');
const R = require('ramda');
const EE = require('EventEmitter2');
var istari = module.exports = function () {
  this.use = function(thing) {
    console.log(thing);
  }
  this.start = function() {
    console.log('start me up');
  }
  this.join = function(url) {

  }
  return this;
}

istari.Router = Router;


