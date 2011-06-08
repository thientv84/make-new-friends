// Program: friendwall_facebook.js
// Author: Greg Wientjes
// Date: 5-15-11
// Purpose: Functions focused on creation of the Facebook friend wall on SUtalk, part of the Facebook javascript library.

onlineFriendsFql =  "SELECT name, uid, first_name, profile_url, pic_square " +
							      "FROM user WHERE online_presence " +
							      "IN ('active','idle') AND uid IN " +
							      "(SELECT uid2 FROM friend WHERE uid1=me()" +
							      "ORDER BY rand()" + ")";

friendsRandomFql =  "SELECT name, uid, first_name, profile_url, pic_square " + 
										"FROM user  " +
										"WHERE uid IN (SELECT uid2 FROM friend WHERE uid1 = me()" +
										"ORDER BY rand()" + ")";

// Display the friend photos on the Friend Wall
function friendPhotos(){
	var friendPhotos = document.getElementById('friendPhotos');	
	var query = FB.Data.query( friendsRandomFql );

	query.wait(function(rows) {
		displayFriendPanel(rows, 6, friendPhotos);
	});	
}

// Display online friends on the Friend Wall.
function onlineFriends(){
	var onlineFriendsPhotos = document.getElementById('onlineFriendsPhotos');
	
	var query = FB.Data.query( onlineFriendsFql );

	query.wait(function(rows) {
		displayFriendPanel(rows, 15, onlineFriendsPhotos);
	});
}

function displayFriendPanel(friends, max, targetDiv){
	var markup = '';
	var numFriends = friends ? Math.min(max, friends.length) : 0;
																							//Array elements now scrambled
	if (numFriends > 0) {
	 	for (var i=0; i<numFriends; i++) {
			markup += person( friends[i] );
	 	}
	}
  targetDiv.innerHTML = markup;	
}

// Photo of a person
function photo(id){
  src = "http://graph.facebook.com/" + id + "/picture?type=square";
	img = "<img src='" + src + "' alt='friend' class='round friendWallPhoto' data-facebook-uid='" + id + "'>";
	return img;
}

// Name of a person, linked to facebook profile
function nameLinked( person ){
	name = person.name;
	nameArray = name.split(' ');
	name = nameArray[0].substring(0, 8);
	link = "http://www.facebook.com/profile.php?id=" + person.uid;
	nameResult = "<a href='" + link + "' target='_blank'>" + name + "</a>";
	return nameResult;
}

// Person, a single Facebook user
function person( person ){
	pic = photo( person.uid );
	name = nameLinked( person );
  user = "<div class='online_friend'>" + pic + "<br />" + name + "</div>";
	return user;
}


