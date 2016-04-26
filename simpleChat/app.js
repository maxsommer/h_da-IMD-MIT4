var app 		= require('express')();
var express		=require('express');
var http 		= require('http').Server(app);
var io 		= require('socket.io')(http);
if( process.argv[2] != undefined && process.argv[2] % 1 === 0 )
	var port 	= process.argv[2];
else
	var port 	= 80;

var userCounter = 0;

var wordBlacklist = 	[
					[ "fuck", "duck" ],
					[ "retard", "human" ],
					[ "idiot", "man" ],
					[ "fu", "please listen to my constructive argument" ],
					[ "egghead", "great individual" ]
				];


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
		msg.name 		= msg.name.replace(/<(?:.|\n)*?>/gm, '');
		msg.message 	= msg.message.replace(/<(?:.|\n)*?>/gm, '');

		msg.name 		= checkBlacklist( msg.name );
		msg.message 	= checkBlacklist( msg.message );

		io.emit('message', msg);
  	});

  	socket.on('namechange', function(msg){
	  	console.log(msg.before + " changed his name to " + msg.new);
		msg.before 		= msg.before.replace(/<(?:.|\n)*?>/gm, '');
		msg.new 		= msg.new.replace(/<(?:.|\n)*?>/gm, '');

		msg.new 		= checkBlacklist( msg.new );

		io.emit('namechange', msg);
  	});

});

function checkBlacklist( str ){
	wordBlacklist.forEach(function(element){
		str = str.replace( element[0], element[1] );
	});
	return str;
}

http.listen(port, function(){
	console.log("Chatserver started on port " + port);
});
