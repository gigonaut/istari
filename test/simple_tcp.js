var istari = require('../');

var app = istari();
var routes = istari.Router();

routes.use(function(evt, data, next) {
  console.log('middleware awesome!');
  next();
});

routes.route('hello::world', function(evt, data, next) {
  console.log('hello world');
});

app.use(routes);

app.start();
