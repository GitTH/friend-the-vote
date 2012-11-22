
    // Load the SDK Asynchronously
      (function(d){
         var js, id = 'facebook-jssdk', ref = d.getElementsByTagName('script')[0];
         if (d.getElementById(id)) {return;}
         js = d.createElement('script'); js.id = id; js.async = true;
         js.src = "//connect.facebook.net/en_US/all.js";
         ref.parentNode.insertBefore(js, ref);
       }(document));

      // Init the SDK upon load
      window.fbAsyncInit = function() {
        FB.init({
          appId      : '290049794441717', // App ID
          channelUrl : '//'+window.location.hostname+'/channel', // Path to your Channel File
          status     : true, // check login status
          cookie     : true, // enable cookies to allow the server to access the session
          xfbml      : true  // parse XFBML
        });


        // user info
        var userName;
        var userId;
        var userLocation;
        var userState;
        var profileImageURL;

        // listen for and handle auth.statusChange events
        FB.Event.subscribe('auth.statusChange', function(response) {
            if (response.authResponse) {
                // user has auth'd your app and is logged into Facebook
                FB.api('/me', function(me){
                    userInfo(me);
                    $('#start-button').addClass('logged-in-start');
                    $('.loggedout').hide();
                    $('.loggedin').show();
                });
            
        } else {
            // user has not auth'd your app, or is not logged into Facebook
                $('.loggedout').show();
                $('.loggedin').hide();
                $('#start').removeClass('logged-in-start');
            }
        });

        // respond to clicks on the login and logout links
        /*
        $('.login-start').on('click', function(e){
            e.preventDefault();
            facebookLogin();
        });
        */
        $('#auth-logoutlink').on('click', function(e){
            e.preventDefault();
            FB.logout();
        }); 
      } 