var istari = require('../');

var router = istari.Router();


var middleware = function(evt, data, next) {
  console.log('middleware called\n\n');
  // console.log(this);
  next();
}

var handlerSync = function(evt, data, next) {
  if (data.awesome) {
    data.awesome += 1
  }
  next();
}

var handlerAsync = function(evt, data, next) {
  // works for
  setTimeout(function() {
    data.asyncDone = 'yiss!'
    next();
  }, 3000);
}



var handlerOneTime = function(evt, data, next) {
  let router = this;
  // add an event that only gets fired once
  router.many('funky', 1, function(evt) {
    console.log('funky was called and we can move on');
    console.log('===========================================')
  });

  next();
}


var handlerEmit = function(evt, data, next) {
  var router = this;
  data.sendingFunky = true;
  router.emit('funky', {});
  next();
}
//calling use will cause this function to be called for any route.
router.use(middleware);

//this attaches a handler to a route.
router.route('hello::world', handlerSync);

router.route('hello:also', handlerAsync, handlerSync);

router.route('hello:once', handlerOneTime, handlerEmit);

router.emit('hello::world');
router.emit('hello:also', {});
router.emit('hello:once', handlerOneTime, handlerEmit);


// router.use(middleware);

// router.route('hello', ghello);
// router.route('another', another);

// router.emit('hello', {awesome: 1})
// router.emit('another');


// var ghello = function(evt, data, next) {
//   data.awesome += 1;

//   // add an async event that only gets fired once
//   // on the fly
//   this.many('funky', 1, function(evt) {
//     console.log('funky was called and we can move on');
//     console.log('===========================================')
//     return next();
//   });

// }

// var another = function (evt, data, next) {
//   console.log('awesomeness hit!!!');
//   var self = this;
//   setTimeout(function() {
//     self.emit('funky');
//     next();
//   }, 3000);
// }