
/**
 * Module dependencies.
 */

var express = require('express')
    , io = require('socket.io');

var app = module.exports = express.createServer();

// Configuration

app.configure(function(){
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.static(__dirname + '/public'));
  app.use(app.router);
});

app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

app.configure('production', function(){
  app.use(express.errorHandler());
});

// Global counter
var counters= {};

// Sockets
var io = io.listen(app).set('log level', 1);

io.sockets.on('connection', function (socket) {
  socket.emit('update', counters);
  /*client.on('message', function (message) {
    if (message.event == 'homepage loaded') {
      client.broadcast('cool');
    }
  });*/
});

// Routes

app.get('/', function(req, res){
  res.render('index', {
    title: 'Live Stats',
    layout: 'stats_layout'
  });
});

app.get('/:name', function(req, res){
  var name = req.params.name;

  if (!counters[name]){
    var color = '#'+(Math.random()*0xFFFFFF<<0).toString(16); // random color

    counters[name] = {
      'color': color,
      'count': 0
    };
  }

  counters[name].count++;

  res.render('counter', {
    title: 'Counter: ' + name,
    counter: counters[name]
  });

  // Notify stats
  io.sockets.emit('update', counters);
});

app.listen(3000);
console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);

