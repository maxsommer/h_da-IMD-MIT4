var app 		= require('express')();
var express		= require('express');
var http 		= require('http').Server(app);

if( process.argv[2] != undefined && process.argv[2] % 1 === 0 )
	var port 	= process.argv[2];
else
	var port 	= 80;

var userCounter = 0;



app.use(express.static('public'));
app.get('/', function(req, res){
	res.sendFile(__dirname + '/index.html');
});


http.listen(port, function(){
	console.log("Webserver started on port " + port);
});
