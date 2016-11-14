# ISTARI socket middleware and management things
Istari is a organized event driven server for whatever transport you see fit.
It behaves very similarly to the express router, except it listens for events.

It can be attached to any transport desired (soon).

## Getting Started
install the lib via npm or *yarn*
`npm install istari`

Then to use it you need to include it in your app/lib:
`var istari = require('../');`

An istari app is a decorated event emitter (it actually uses eventEmitter2).
To create an app simply call the top level function:

`var app = istari();`

An istari app understands two basic concepts, middleware and routes.
Conceptually, a route is an event listener attached to a specific event name, whereas middleware gets called prior to all events.

The goal here is to make event driven micorservicy systems more composable.

Each app can have a collection of events that they listen for as well as broadcast. Messages can have any structure and transport is completely separate.

### middleware example
This is an example middleware function:
```
var middleware = function(evt, data, next) {
  console.log('middleware called\n');
  console.log(evt);
  console.log(data);
  next();
}
```
Each handler function takes 3 arguments:
`evt` is the event that caused this function to be called.
`data` is the data payload passed down through the layers.
`next` called to continue through the route stack.

var ghello = function(evt, data, next) {
  data.awesome += 1;

  // add an async event that only gets fired once
  // on the fly
  this.many('funky', 1, function(evt) {
    console.log('funky was called and we can move on');
    console.log('===========================================')
    return next();
  });

}

var another = function (evt, data, next) {
  console.log('awesomeness hit!!!');
  var self = this;
  setTimeout(function() {
    self.emit('funky');
    next();
  }, 3000);
}

app.use(middleware);

app.route('hello', ghello);
app.route('another', another);

app.emit('hello', {awesome: 1})
app.emit('another');
