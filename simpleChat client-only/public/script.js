(function(){

	var active = 2; // 1: chat, 2: settings
	var username = "user";
	var socket = new WebSocket('ws://ws.epp.cloud:62633');
	var userlist = [];

	// Open the socket
	socket.onopen = function(event) {

		$('#chat').append("<div class=\"message system\"><i>Type /userlist for a list of all users online.</i></div>");

		// Listen for messages
		socket.onmessage = function(event) {

			var eventdata = JSON.parse(event.data);

			//	Nutzerliste aktualisieren
			//	Die Nutzerliste wird nur ausgegeben, wenn der Nutzer /userlist in das Messagefeld schreibt
			if( eventdata.type ===  "userlist" ){
				userlist = eventdata.value;
			}

			if( eventdata.type === "message" ){
				if( eventdata.value.message.message != undefined ){
					eventdata.value.user 			= eventdata.value.user.replace(/<(?:.|\n)*?>/gm, '');
					eventdata.value.message.message 	= eventdata.value.message.message.replace(/<(?:.|\n)*?>/gm, '');

					$('#chat').append("<div class=\"message\"><b>"+eventdata.value.user+"</b>: "+eventdata.value.message.message+"</div>");
				}
				else{
					eventdata.value.user 			= eventdata.value.user.replace(/<(?:.|\n)*?>/gm, '');
					eventdata.value.message 		= eventdata.value.message.replace(/<(?:.|\n)*?>/gm, '');
					$('#chat').append("<div class=\"message\"><b>"+eventdata.value.user+"</b>: "+eventdata.value.message+"</div>");
				}
				updateScroll( document.getElementById('chat') );
			}

			if( eventdata.type === "username" ){
				username = eventdata.value;
				$('#settings input').val(username);
				$('#chat').append("<div class=\"message system\"><i>The server has assigned the name "+ eventdata.value +" to you.</i></div>");
				updateScroll( document.getElementById('chat') );
			}

		};

		// Listen for socket closes
		socket.onclose = function(event) {
			console.log('Client notified socket has closed',event);
		};

	};


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
			var messagePackage = { type: "message", value: { user: username ,message: $('#messageInput').val()} };

				if( $('#messageInput').val() === "/userlist" ){
					var names = "";
					userlist.forEach( function(element, index, array){

						names += element;
						if( index < (userlist.length-2) ){
							names += ", ";
						}
						else if( index === (userlist.length-1) ){
						}
						else{
							names += " and ";
						}

					});
					$('#chat').append("<div class=\"message system\"><i>There are "+userlist.length+" people online.</i></div>");
					if( userlist.length != 0 )
					$('#chat').append("<div class=\"message system\"><i>"+names+" participate in this chat.</i></div>");
					updateScroll( document.getElementById('chat') );

				}
				else{
					socket.send(JSON.stringify( messagePackage ));
				}
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
			var messagePackage = { type: "username", value: $('#settings input').val() };
			username = $('#settings input').val();
			$('#chat').append("<div class=\"message system\"><i>You changed your name to "+username+"</i></div>");
			socket.send(JSON.stringify(messagePackage));
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
