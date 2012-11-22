var user = [];

// login to Facebook
var facebookLogin = function() {

    FB.login(function(response) {
        if (response.authResponse) {
            FB.api('/me', function(response) {
                if (!response.error) {
        
                    $('#start').fadeOut(500, function() {
                        $('#main').slideDown(500, function() {
                            userInfo(response);
                            showFriends(pageState);     
                            if (pageCandidate === "default") {
                                publishStory("false");
                            } else {
                                publishStory("true");
                            }
                        });
                    });
                }
            });        
        } 
    }, {scope: 'user_location,friends_location'});

};


var userInfo = function(me) {
    
    user = me;
                    
    userName = me.name;
    userId = me.id;
    if (pageState === "current") { 
        userState = getState(me.location.name);
    } else {
        userState = pageState;
    }
            
    profileImageURL = 'http://graph.facebook.com/' + userId + '/picture';
                
    if (userName.length) {
        if (userState == "all") {
            $('.user-name').html('<p>' + userName + ' <span class="small">in the</span> United States of America</p>').fadeTo(750,'1');
        } else {
            $('.user-name').html('<p>' + userName + ' <span class="small">in</span> ' + userState + '</p>').fadeTo(750,'1');
        }
        // console.log(profileImageURL);
        $('.user-picture').attr('src',profileImageURL).fadeTo(750,'1');
        $('#start').addClass();
    }
    
};


// get just the friend's state, since Facebook returns as "City, State"
var getState = function(FBlocation) {
    
    var userState = FBlocation.substr(FBlocation.indexOf(", ") + 1);
                    
    // remove any space in front
    while(userState.charAt(0) === ' ') {
        userState = userState.substr(1);
    }
    
    return userState;
    
};


var friendsTargeted = [];
var allFriends = [];

var showFriends = function(setLocation) {

    FB.api('me/friends?fields=id,name,location,first_name', function(friendResponse) {
        
        friends = friendResponse.data.sort(sortByName);
        
        // console.log(friends);

        for (var k = 0; k < friends.length; k++) {
            
            var friend = friends[k];
            
            allFriends.push({
                id: friend.id,
                name: friend.name,
                first_name: friend.first_name
            });
            
            if (typeof friend.location === "undefined" || friend.location.name === null) {
                // the friend doesn't share their location            
            } else {
                        
                var friendName = friend.name;
                var friendState = getState(friend.location.name);
                    
                if(userState == friendState) {   
                    friendsTargeted.push({
                        id: friend.id,
                        name: friendName,
                        first_name: friend.first_name,
                        state: friendState
                    });       
                }
                  
            }
        }
        
        
        if (setLocation == "all") {
        
            if (allFriends.length) {
                $('#user-friends').removeClass('loading');
                $.each(allFriends, function(i,person) {
                    $('#user-friends').append('<li>' +
                        '<a class="friend" data-friend-name="' + person.name + '" data-friend-id="' + person.id + '"><div class="top-wrap"><div class="icon-ok pic-overlay"></div><article class="friend-inner" style="background-image: url(' + 'http://graph.facebook.com/' + person.id + '/picture?type=large' + ');"></div>' +
                        '</article>' +
                        '<h1>' + person.name + '</h1>' +
                        '</a></li>');
                });
            
            } else {     
                $('#user-friends').removeClass('loading').html('<h1>Looks like you don\'t have any friends currently in this state!</h1>');
            }
        
        } else {
            
            if (friendsTargeted.length) {
                $('#user-friends').removeClass('loading');
                $.each(friendsTargeted, function(i,person) {
                    $('#user-friends').append('<li>' +
                        '<a class="friend" data-friend-name="' + person.name + '" data-friend-first-name="' + person.first_name + '" data-friend-id="' + person.id + '"><div class="top-wrap"><div class="icon-ok pic-overlay"></div><article class="friend-inner" style="background-image: url(' + 'http://graph.facebook.com/' + person.id + '/picture?type=large' + ');"></div>' +
                        '</article>' +
                        '<h1>' + person.name + '</h1>' +
                        '</a></li>');
                });
            
            } else {     
                $('#user-friends').removeClass('loading').html('<h1>Looks like you don\'t have any friends currently in this state!</h1>');
            }
            
        }
    });
    
};

// sort alphabetical by first name so not by order joined
var sortByName = function(a, b) {
    var x = a.name.toLowerCase();
    var y = b.name.toLowerCase();
    return ((x < y) ? -1 : ((x > y) ? 1 : 0));
};

//Publish a story to the user's wall
var publishStory = function(candidate) {
    
    if (candidate === "true") {
    
        FB.ui({
            method: 'feed',
            name: 'I\'m voting for ' + pageCandidate,
            caption: 'FriendtheVote.com',
            description: 'I just committed to vote for ' + pageCandidate + '.  Election Day is November 6 &mdash; make a difference this year and join me in voting for ' + pageCandidate + '.',
            link: url,
            picture: fbImageUrl,
            actions: [{ name: 'Commit to vote', link: url }]
        }, 
        function(response) {
    
        });
        
    } else {
    
        FB.ui({
            method: 'feed',
            name: 'I just committed to vote this election!',
            caption: 'FriendtheVote.com',
            description: 'I just committed to vote this election. Election Day is November 6 &mdash; make a difference this year: join me, and encourage your friends to do the same.',
            link: url,
            picture: fbImageUrl,
            actions: [{ name: 'Commit to vote', link: url }]
        }, 
        function(response) {
    
        });
    
    }    
  
};

//Publish a story to the friend's wall
var publishStoryFriend = function(id,name,candidate) {
 
  var friendID = id;
  var friendName = name;
  
  if (candidate === "true") {
  
      FB.ui({
        method: 'feed',
        to: friendID,
        name: friendName + ', join me in supporting ' + pageCandidate + '!',
        caption: 'FriendtheVote.com',
        description: 'I just committed to vote for ' + pageCandidate + '. Election Day is November 6 &mdash; make a difference this year and join me in voting for ' + pageCandidate + '.',
        link: url,
        picture: fbImageUrl,
        actions: [{ name: 'Commit to vote too', link: url }],
        user_message_prompt: 'Tell your friends to vote for ' + pageCandidate
      }, 
      function(response) {
        // console.log('publishStoryFriend UI response: ', response);
      });
  
  } else {
      
      FB.ui({
        method: 'feed',
        to: friendID,
        name: friendName + ', join me in voting this election!',
        caption: 'FriendtheVote.com',
        description: friendName + ', I just committed to vote in this election. Election Day is November 6 &mdash; make a difference this year: join me, and encourage your friends to do the same.',
        link: url,
        picture: fbImageUrl,
        actions: [{ name: 'Commit to vote too', link: url }],
        user_message_prompt: 'Tell your friends to vote for ' + pageCandidate
      }, 
      function(response) {
        // console.log('publishStoryFriend UI response: ', response);
      });
      
  }
};