var app = require('express')();
var express=require('express');
var http = require('http').Server(app);
var io = require('socket.io')(http);

var userCounter = 0;

app.use(express.static('public'));


app.get('/', function(req, res){
	res.sendFile(__dirname + '/index.html');
});

io.on('connection', function(socket){

	userCounter++;
  	console.log('A user connected. ' + userCounter + ' people online right now.');
	io.emit('join', 'A user has joined the chat. ' + userCounter + ' people are online.');


  	socket.on('disconnect', function(){
		userCounter--;
    		console.log('A user disconnected. ' + userCounter + ' people online right now.');
		io.emit('leave', 'A user has left the chat. ' + userCounter + ' people are online.');
  	});

  	socket.on('message', function(msg){
	  	console.log(msg.name + ": \"" + msg.message + "\"");
		io.emit('message', msg);
  	});

  	socket.on('namechange', function(msg){
	  	console.log(msg.before + " changed his name to " + msg.new);
		io.emit('namechange', msg);
  	});

});

http.listen(3000, function(){
  console.log('listening on *:3000');
});
