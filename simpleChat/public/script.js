(function(){

	var active = 2; // 1: chat, 2: settings
	var username = "user";
	var socket = io();


	/*
	/	Messages empfangen
	*/
	socket.on('message', function(msg){
    		$('#chat').append("<div class=\"message\"><b>"+msg.name+"</b>: "+msg.message+"</div>");
		updateScroll( document.getElementById('chat') );
  	});

	socket.on('leave', function(msg){
    		$('#chat').append("<div class=\"message system\"><i>"+msg+"</i></div>");
		updateScroll( document.getElementById('chat') );
  	});

	socket.on('join', function(msg){
    		$('#chat').append("<div class=\"message system\"><i>"+msg+"</i></div>");
		updateScroll( document.getElementById('chat') );
  	});

	socket.on('namechange', function(msg){
    		$('#chat').append("<div class=\"message system\"><i>"+msg.before+" changed his name to "+msg.new+"</i></div>");
		updateScroll( document.getElementById('chat') );
  	});
	socket.on('disconnect', function(){
		$('#chat').append("<div class=\"message system-warning\"><i>It seems like we've lost connection to the server :(</i></div>");
		updateScroll( document.getElementById('chat') );
  	});
	socket.on('connect', function(){
		$('#chat').append("<div class=\"message system\"><i>Connection to server astablished :)</i></div>");
		updateScroll( document.getElementById('chat') );
  	});


	/*
	/	Message senden
	*/
		$('#newMessage button').click(function(){
			sendChat();
		});
		$('#newMessage input').keypress(function(event){
	    		var keycode = (event.keyCode ? event.keyCode : event.which);
	    		if(keycode == '13'){
				if( active === 1 )
					sendChat();
	    		}
		});
		function sendChat(){
			var messagePackage = { name: username, message: $('#messageInput').val() };
	    		socket.emit('message', messagePackage);
	    		$('#messageInput').val('');
		}

	/*
	/	Name ändern
	*/
		$('#settings input').keypress(function(event){
			var keycode = (event.keyCode ? event.keyCode : event.which);
			if(keycode == '13'){
				if( active === 2 ){
					changeName();
					openChat();
				}
			}
		});
		$('#settings button').click(function(){
			changeName();
			openChat();
		});

		function changeName(){
			var messagePackage = { before: username, new: $('#settings input').val() };
			username = $('#settings input').val();
	    		socket.emit('namechange', messagePackage);
		}


	/*
	/	Navigation
	*/
		$('#navChat').click(function(){
			openChat();
		});
		$('#navSettings').click(function(){
			openSettings();
		});


		function openChat(){
			$('#settings').hide(250);

			$('#chat').show(250);
			$('#newMessage').show(250);

			$('#navSettings').removeClass("active");
			$('#navChat').addClass("active");

			active = 1;
		}
		function openSettings(){
			$('#chat').hide(250);

			$('#newMessage').hide(250);
			$('#settings').show(250);

			$('#navSettings').addClass("active");
			$('#navChat').removeClass("active");

			active = 2;
		}

	/*
	/	Scroll Position updaten
	*/

	function updateScroll(element){
    		element.scrollTop = element.scrollHeight;
	}

})();
