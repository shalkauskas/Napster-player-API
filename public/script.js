//jshint esversion:6
var API_KEY = 'NTY1NmMxYWQtNWMzOC00OGI0LTliYzMtZmYxYzQ2YWY2ZTZl';

      function refresh(callback) {
        $.ajax({
          url: '/reauthorize',
          method: 'GET',
          data: { refreshToken: Napster.member.refreshToken },
          success: function(data) {
            Napster.member.set({
              accessToken: data.access_token,
              refreshToken: data.refresh_token
            });

            if (callback) {
              callback(data);
            }
          }
        });
      }

      function getParameters() {
        var query = window.location.search.substring(1);
        var parameters = {};

        if (query) {
          query.split('&').forEach(function(item) {
            var param = item.split('=');
            parameters[param[0]] = param[1];
          });
        }

        return parameters;
      }

      $(document).ready(function() {
        if (typeof Napster === 'undefined') {
          $('body').html("There has been an error while loading Napster.js. Please check the console for errors.");
          return;
        }
        var currentTrack;
        Napster.init({ consumerKey: API_KEY, isHTML5Compatible: true });

        Napster.player.on('ready', function(e) {
          // Uncomment to know when The Napster Player is ready
          console.log('initialized');

          var params = getParameters();
          if (params.accessToken) {
            Napster.member.set(params);
          }

          Napster.api.get(false, '/tracks/top', function(data) {
            var tracks = data.tracks;
            Napster.player.clearQueue();
            tracks.forEach(function(track, i) {
              var $t = $('<div class="track" data-track="' + track.id + '">' +
                           '<div class="album-art"></div>' +
                           '<div class="track-info">' +
                             '<div class="progress-bar"></div>' +
                             '<div class="name">' + track.name + '</div>' +
                             '<div class="artist">' + track.artistName + '</div>' +
                             '<div class="duration">' + Napster.util.secondsToTime(track.playbackSeconds) + '</div>' +
                             '<div class="current-time">' + Napster.util.secondsToTime(track.playbackSeconds) + '</div>' +
                           '</div>' +
                          '</div>');

              $t.click(function() {
                var id = track.id.charAt(0).toUpperCase() + track.id.slice(1);
                //TODO: make everything downcase this is a hack so i can debug my queue stuff
                if (Napster.player.currentTrack === id) {
                if (Napster.player.playing){
                  Napster.player.pause();
                }  else {
                  Napster.player.resume(id);
                }
                }
                else {
                  $('[data-track="' + id + '"] .progress-bar').width(0);
                  $('[data-track="' + id + '"] .current-time').html($('[data-track="' + id + '"] .duration').html());

                  Napster.player.play(id);
                }
              });

              $t.appendTo('#tracks');
              Napster.player.queue(track.id.charAt(0).toUpperCase() + track.id.slice(1));

              Napster.api.get(false, '/albums/' + track.albumId + '/images', function(data) {
                var images = data.images;
                $('[data-track="' + track.id + '"] .album-art')
                  .append($('<img>', { src: images[0].url }));
              });
            });
          });
        });

        $( "#next" ).click(function() {
          Napster.player.next();
        });
        $( "#previous" ).click(function() {
          Napster.player.previous();
        });
        $( "#clear" ).click(function() {
          Napster.player.clearQueue();
        });
        $( "#repeat" ).click(function() {
          Napster.player.toggleRepeat();
        });
        $( "#shuffle" ).click(function() {
          Napster.player.toggleShuffle();
        });
        $( "#pause" ).click(function() {
          Napster.player.pause();
        });
        $( "#resume" ).click(function() {
          Napster.player.resume();
        });
        Napster.player.on('playevent', function(e) {
          var playing = e.data.playing;
          var paused = e.data.paused;
          var currentTrack = e.data.id;

          $('[data-track]').removeClass('playing paused');
          $('[data-track="' + currentTrack + '"]').toggleClass('playing', playing).toggleClass('paused', paused);
        });

        Napster.player.on('playtimer', function(e) {
          var id = currentTrack;
          var current = e.data.currentTime;
          var total = e.data.totalTime;
          var width = $("[data-track='" + id + "'] .track-info").width();

          $("[data-track='" + id + "']").addClass("playing");
          $("[data-track='" + id + "'] .progress-bar").width(parseInt((current / total) * width).toString() + "px");
          $("[data-track='" + id + "'] .current-time").html(Napster.util.secondsToTime(total - current));
        });

        Napster.player.on('error', console.log);
      });

$(document).ready(function(){

// Default popup for unsued icons
  let popup = () => {
     if ($('img').hasClass('onclick')) {
       setTimeout(function() {
         alert('You have no permission to do this!');
       }, 200);
     }};

// let addPlayer = () => {
//   $('desktop').append('<iframe id="player-frame" src="" width="100px" height="100px">Player</iframe>');
// };

// effect on icon click
  $('img').on('click', function(){
    $(this).addClass('onclick');
let iconClass = this.id;
let icons = ['my-computer', 'bin', 'internet-explorer'];
let matchCheck = icons.find(x => x == iconClass);
console.log(matchCheck);
  if (iconClass == matchCheck){
    // enables popup for unsued icons and removes effect
    popup();
    setTimeout(function() {
           $('img').removeClass('onclick');
         }, 600);
  } else {
    // for others removes effect
    setTimeout(function() {
           $('img').removeClass('onclick');
         }, 200);
         addPlayer();
  }
});




});
