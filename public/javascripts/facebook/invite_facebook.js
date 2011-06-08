// Program: invite_facebook.js
// Author: Greg Wientjes
// Date: 5-15-11
// Purpose: Functions focused on invite requests on SUtalk, part of the Facebook javascript library.

// Invite message for the request dialogue
function inviteMessage(){
	var message = 'Please SUtalk video chat with me at ' + sutalkLink;
	return message;
}


// Invite a single friend to SUtalk video chat using a dialogue request
function inviteSingle(id){
	var message = inviteMessage();

	FB.ui({	method: 'apprequests',
					message: message,
					data: sessionId,        
					title: 'Invite Friend To SUtalk Video Chat',
					to: id
				},
				function(response) {

				}
	);
}


// Request dialogue for invite to all online friends.
function onlineFriendsInvite(){
	var onlineFriendsFql =  "SELECT uid " + 
								      		"FROM user WHERE online_presence " +
								      		"IN ('active','idle') AND uid IN " +
								      		"(SELECT uid2 FROM friend WHERE uid1=me()" + ")";

	var query = FB.Data.query( onlineFriendsFql );

	query.wait(function(rows) {
		var onlineFriendsArray = jsonToArrayOfValues(rows);
		var message = inviteMessage();
		
		FB.ui({	method: 'apprequests',
						message: message,
						title: 'Select Online Friends To SUtalk Video Chat',
						data: sessionId,        
						filters: [{name: 'Online Friends', user_ids: onlineFriendsArray}, 'all' ]
					},
					function(response) {
							feedInvite();
					}
		);
	});
}


// Feed invite, wall post dialogue
feedInvite = function feedInvite(){
	var message = inviteMessage();
	
	FB.ui(
	   {
	     method: 'feed',
	     name: 'Invite your friends to SUtalk video chat',
	     link: sutalkLink,
			 picture: 'http://sutalk.heroku.com/images/logo.png',
	     message: message
	   },
		 function(response) {
				// setCanvasHeight(CANVAS_HEIGHT_LARGE);
		 }
	 );
}


// Convert json object to an array of values
function jsonToArrayOfValues(json){
	var arr=new Array();
	for (i=0;i<json.length;i++){
		arr.push(json[i].uid);
	}

	return arr;
}