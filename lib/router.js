const EE = require('EventEmitter2');
const R = require('ramda');
var istari = module.exports = createRouter;

function createRouter() {
  var router = new EE();
  router.routes = [];
  router.middleware = [];
  router.use = function(fn) {
    use.call(this, fn);
  }
  router.route = function() {
    route.apply(this, R.values(arguments));
  };

  return router;
};

function use(fn) {
  var router = this;
  router.middleware.push(fn);
};

// sets up the route with its handler functions
function route() {
  var router = this;
  var args = Array.from(arguments);
  var evt = args.shift();

  var handlers = args;
  router.routes.push({evt: evt, handlers: handlers});
  // clear out any stacks that were there previously (this is important as otherwise
  // we are willy nilly adding listeners that WILL be fired)
  router.removeAllListeners(evt);
  // attach this arouter to its stacks

  function handler () {
    var data = arguments[0] || {};
    handle(this.event, router, data);
  };
  router.on(evt, handler)
}

// dispatches through the stacks of middleware and routeware
function handle(evt, router, data) {
  console.log('evtname: ', evt);
  // this shouldn't be happening but it is so this protects us for the time being
  if (R.contains(evt, ['removeListener', 'newListener'])) {
    return;
  }
  var routes = R.find(R.propEq('evt', evt))(router.routes);

  var middlewares = router.middleware;
  var stack = R.concat(middlewares, routes.handlers);
  function done () {
    console.log('done');
  }
  dispatch.call(router, evt, stack, data, done);
}

function dispatch(evt, stack, data, done) {
  var idx = -1; // the index of the stack member;
  var router = this;

  next();
  function next(err) {
    idx++;
    var layer = stack[idx];
    if (err) {
      return done();
    }
    // console.log(layer);
    if (layer) {
      layer.call(router, evt, data, next);
    } else {
      done();
    }
  }
};