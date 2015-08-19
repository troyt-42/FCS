var http = require('http');
var express = require('express');
var io = require('socket.io')(); //jshint ignore: line
var app = express();
var server = http.createServer(app);

io.listen(server);
app.use(express.static(__dirname + '/UI'));

io.on('connection', function(socket){
  console.log(socket.handshake.address + ' has connected! id: ' + socket.id);
  socket.on('test', function(message){
    console.log('meassge: ' + message);
    console.log('It works!');
  });
});

io.of('/testNameSpace').on('connection', function(socket){
  socket.on('test', function(message){
    console.log('meassge: ' + message);
    console.log('Namespace works!');
  });
});



server.listen(3000);
console.log('Express Server Is Listenning at 3000');
