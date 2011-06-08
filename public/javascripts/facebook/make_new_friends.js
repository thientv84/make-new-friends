// Program: make_new_friends.js
// Author: Phong Nguyen-Hoai
// Date: May 23, 2011

//activeSIDs = [];
//recentSIDs = [];

function makeNewFriends() {
	if (TB.checkSystemRequirements() != TB.HAS_REQUIREMENTS) {
		alert('Minimum System Requirements not met!');
		return ;
	}
	// Retrieve rooms from SUTalk database (sessionIDs)
	var rooms = retrieveRooms();
//	activeSIDs = [];
//	recentSIDs = [];
	// Add original session of user
//	rooms.push({ sessionId: sessionId, token: token, time: 0})
	$.each(rooms, function(index, room) {
		console.log("sessionId = " + room.sessionId);
		init(room.sessionId);
		// Mark original session of user
//		session.original = (index == rooms.length - 1);
		session.interval = (new Date() - new Date(room.time)) / 1000;
		session.connect(apiKey, room.token);
	});
	initOpenTok();
}

function retrieveRooms() {
	var rooms = [];
	$.ajax({
		url: "/pages/rooms.json",
		dataType: "json",
		async: false,
		data: {
			session_id: sessionId
		},
		success: function(data) {
			rooms = data;
		}
	});
	return rooms;
}

function getRandomSID(currentSession, streams) {
	console.log("getRandomSID");
//	if (currentSession.original) {
//		currentSession.original = false;
//		alert("No active video broadcasts available. " + 
//			    "Please try again in a few minutes.")
//		return ;
//	}
	
	// Active SIDs
	if (0 < streams.length && streams.length < 6) {
//		console.log("Add activeSIDs: " + currentSession.sessionId);
//		activeSIDs.push(currentSession.sessionId);
		var pos = Math.round(Math.random() * (streams.length - 1));
		subscribeToStream(currentSession, streams[pos]);
		return ;
	}
	
  // Recent SIDs: SID created < 10 seconds
	if (currentSession.interval < 10 && streams.length > 0) { 
//		console.log("Add recentSIDs: " + currentSession.sessionId);
//		recentSIDs.push(currentSession.sessionId);
		var pos = Math.round(Math.random() * (streams.length - 1));
		subscribeToStream(currentSession, streams[pos]);
		return ;
	}
}

function subscribeToStream(currentSession, stream) {
	console.log("subscribeToStream");
	var div = document.createElement('div');
	var divId = stream.streamId;
	div.setAttribute('id', divId);

	var subscribersContainer = document.getElementById('subscribersStartDiv');
	subscribersContainer.appendChild(div);

	var divProps = {width: 264, height: 198, audioEnabled:true}
	subscribers[stream.streamId] = currentSession.subscribe(stream, divId, divProps);
}

function otherSessionConnectedHandler(event) {
	console.log("Session Connected.");
	getRandomSID(event.target, event.streams);
}

function init(sid) {
	// OpenTok Initialization
	console.log("Initing new session.");
  // Initialize session
	session = TB.initSession(sid); 
	// Add event listeners to the session
	session.addEventListener('sessionConnected', otherSessionConnectedHandler);
	session.addEventListener('sessionDisconnected', sessionDisconnectedHandler);
	session.addEventListener('connectionCreated', connectionCreatedHandler);
	session.addEventListener('connectionDestroyed', connectionDestroyedHandler);
	session.addEventListener('streamCreated', streamCreatedHandler);
	session.addEventListener('streamDestroyed', streamDestroyedHandler);
}
