// Program: application.js
// Author: Greg Wientjes
// Date: May 15, 2011
// Purpose: Javascript used in the SUtalk app.

$(document).ready(function(){
	
	
	// ================================
	// SUtalk 
	// ================================
	startOpenTok();
	
	
	// Event Bindings
	
  $(".sutalkLink").click(function(event){
		$(this).focus();
		$(this).select();
  });
	
	// ================================
	// OpenTok 
	// ================================
	
	
										// opentok controls
  $("#connectLink").click(function(event){
		connect(); 
		event.preventDefault();
  });
  
  $("#publishLink").click(function(event){
  		publish(); 
  		event.preventDefault();
  });
  
  $("#unpublishLink").click(function(event){
  		unpublish(); 
  		event.preventDefault();
  });
  	
  $("#connectInstructions").click(function(event){
  		connect(); 
  		event.preventDefault();
  });
  
  $("#publishInstructions").click(function(event){
  		publish(); 
  		event.preventDefault();
  });
	
	
	// ================================
	// Facebook 
	// ================================

	// Invite 
	$("#invite_link").click(function(event){
		onlineFriendsInvite();
		event.preventDefault();
  });
  
  // Make new friends
  $("#newFriendsTitle").click(function(event){
    makeNewFriends();
    event.preventDefault();
  });

	// Online Friends
  $("#onlineFriendsTitle").click(function(event){
		onlineFriendsInvite();
		event.preventDefault();
  });
 

	// Click a friend wall photo and launch the invite request dialogue for a single friend.
	$('.friendWallPhoto').live('click', function() {
		inviteSingle($(this).data("facebook-uid"));				
	});
	
});


	
	// ================================
	// SUtalk - Helper Javascript
	// ================================

// Start SUtalk.  Javascript to launch when SUtalk first opens.
function startOpenTok(){
	initOpenTok();
	connect();
}

// Initialize OpenTok Javascript object, TB.  Check for system requirements.  Add event listeners, initialize an opentok session.
function initOpenTok(){
			// OpenTok Initialization
	if (TB.checkSystemRequirements() != TB.HAS_REQUIREMENTS) {
		alert('Minimum System Requirements not met!');
	} else {
		session = TB.initSession(sessionId);	// Initialize session

		// Add event listeners to the session
		session.addEventListener('sessionConnected', sessionConnectedHandler);
		session.addEventListener('sessionDisconnected', sessionDisconnectedHandler);
		session.addEventListener('connectionCreated', connectionCreatedHandler);
		session.addEventListener('connectionDestroyed', connectionDestroyedHandler);
		session.addEventListener('streamCreated', streamCreatedHandler);
		session.addEventListener('streamDestroyed', streamDestroyedHandler);
	}
}

function startFacebook(){
	onlineFriends();
	friendPhotos();
	expandCanvas()		
}

function expandCanvas(){
	FB.Canvas.setSize({ height: 1400 });		
}


