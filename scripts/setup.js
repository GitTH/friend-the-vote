$.fn.scrollAmount = function() { 
    return this.scrollTop(); 
};


$(document).ready(function() {
    
    
    var $start   = $('#start');
    var $main    = $('#main');
    var $finish  = $('#finish');
    
    
    var $flag = $('.flag');
    
    $(window).bind('scroll',function(e){
      
        // how far did we go
        var scrolled = $(window).scrollAmount();
                
        // let the magic happen
        $flag.css('background-position', 'right ' + ((scrolled/3.5) - 300) + 'px');
         
    });

    $('a#finish-button').smoothScroll({ offset: 50 });
    
    // initial
    $('.page').not($start).hide();
       
    
    // start
    $('#start-button').on('click', function(e) {
        
        $this = $(this);
        
        e.preventDefault();
   
        if ($this.hasClass('logged-in-start')) {
            
            $start.fadeOut(500, function() {
                $main.slideDown(500);
                showFriends(pageState);
                
                if (pageCandidate === "default") {
                    publishStory("false");
                } else {
                    publishStory("true");
                }
                
            });
            
        } else {
            
            facebookLogin();
    
        }
        
    });
    
    $(document).on('click', '.friend', function() {
    
        var $this = $(this);
    
        $this.toggleClass('friend-selected');
        
        var friendID = $this.data('friend-id');
        var friendName = $this.data('friend-name');
        var firstName = $this.data("friend-first-name");
        
        if (pageCandidate === "default") {
            publishStoryFriend(friendID,firstName,"false");
        } else {
            publishStoryFriend(friendID,firstName,"true");
        }
        
    });
   
   
   // cross-domain to our database, so use FlyJSONP to make it easier
  // FlyJSONP.init({debug: false});
   
    // main
    $('#finish-button').on('click', function(e) {
        
        e.preventDefault();
        
        var friendTotalSelected = $('.friend-selected').length;
        
        /*
        if (friendTotalSelected.length) {
            
            var pageData = 'page=' + pageState + '&count=' + friendTotalSelected;
            
            FlyJSONP.post({
              url: 'http://tylerpearson.name/friendthevote/update.php',
              parameters: {
                state: pageState,
                count: friendTotalSelected
              },
              success: function(data) {
                $main.fadeOut(500, function() {
                    $finish.fadeIn(500);
                    console.log("posted");
                }); 
              }
            });
            
        } else {
        */
            
            $main.fadeOut(500, function() {
                $finish.fadeIn(500);
            });
        /* 
        }
        */
   
        
    });
     
    // logout
    $('#logout').on('click', function(e) {
    
        e.preventDefault();        
        // fbLogout();
        destroySession('290049794441717');    
            
    });

    
});