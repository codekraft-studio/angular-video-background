angular.module('video-background')

.directive('videoBackground', function($log, $timeout, $document) {

  function _link(scope, elem, attrs) {

    // check if valid object has been passed
    if( !scope.source || !angular.isObject(scope.source) || !Object.keys(scope.source).length ) {
      $log.warn('VideoBg: Expected a valid object, received:', scope.source);
      return;
    }

    // allowed source types
    var sourceTypes = ['mp4', 'webm', 'ogg'];

    // get the video rich element
    var videoEl = elem.children().eq(0);

    // get the control bar container
    var controlBox = elem.children().eq(1);

    // get the video DOM element
    var $video = videoEl[0];

    // the video controls box
    var controlBoxTimeout;

    // init custom flags
    $video.firstPlay = true;
    $video.firstEnd = true;
    $video.autopause = ( typeof attrs.autopause !== 'undefined' && attrs.autopause !== "false" );
    $video.loop = ( typeof attrs.loop !== 'undefined' && attrs.loop !== "false" );
    $video.volume = ( attrs.volume && ( 0 <= attrs.volume && attrs.volume <= 1 ) ) ? attrs.volume : 1;
    $video.defaultPlaybackRate = ( attrs.playbackRate ) ? attrs.playbackRate : 1;

    // hide video element by default
    videoEl.addClass('ng-hide');

    // hide control box by default
    controlBox.addClass('ng-hide');

    // add directive class
    videoEl.addClass('video-background');

    // add source elements to html5 video
    for( var key in scope.source ) {

      // if property name is allowed create source element
      if( scope.source.hasOwnProperty(key) && sourceTypes.indexOf(key) > -1 ) {

        // create element
        var tmp = document.createElement('source');
        // add source and type
        tmp.src = scope.source[key];
        tmp.type = "video/" + key;
        // append source element
        $video.appendChild( tmp );

      } else {
        $log.warn('videoBg: You passed a type', key, 'that is not valid, must be one of theese: [mp4,webm,ogg]');
      }

    }

    // key bindings
    function onKeyUp(e) {

      // if esc key stop and reset the video
      if( e.which === 27 ) {
        $video.pause();
        $video.currentTime = 0;
      }

      // if space bar and video is not ended
      if( e.which === 32 && !$video.endend ) {
        // toggle video state
        if( $video.paused ) {
          $video.play();
        } else {
          $video.pause();
        }
      }

      // if key up increase volume
      if( e.which === 38 ) {
        $video.volume = (($video.volume + 0.1) < 1) ? ($video.volume + 0.1) : 1;
      }

      // if key down decrease volume
      if( e.which === 40 ) {
        $video.volume = (($video.volume - 0.1) > 0) ? ($video.volume - 0.1) : 0;
      }

    }

    function keySeek(e) {

      // left arrow key
      if( e.which === 37 ) {
        e.preventDefault();

        // Auto pause the video
        if( !$video.paused && $video.autopause ) {
          $video.pause();
        }

        // if is not at the very start
        if($video.currentTime > 0 && $video.currentTime >= 2 ) {
          $video.currentTime -= 2;
        } else {
          $video.currentTime = 0;
        }

      }

      // ight arrow key
      if( e.which === 39 ) {
        e.preventDefault();

        // Auto pause the video
        if( !$video.paused && $video.autopause ) {
          $video.pause();
        }

        // if is not at the very bottom
        if($video.currentTime < $video.duration) {
          $video.currentTime += 2;
        } else {
          $video.currentTime = $video.duration;
        }

      }

    }

    /**
     * On first end run callback if specified
     */
    $video.onended = function() {

      if( $video.firstEnd ) {
        // Turn off the flag
        $video.firstEnd = false;
        // run the callback if specified
        return angular.isFunction(scope.onFirstend) ? scope.$apply(scope.onFirstend()) : true;
      }

    };

    /**
     * When video data is loaded
     */
    $video.onloadeddata = function() {

      // set starting time from attribute or zero
      $video.currentTime = attrs.startTime ? attrs.startTime : 0;

      // init video time
      scope.currentTime = $video.currentTime;

      // if key controls options is enabled
      if( typeof attrs.keyControls !== 'undefined' && attrs.keyControls !== "false"  ) {

        // add some key bindings
        $document.on('keydown', keySeek);
        $document.on('keyup', onKeyUp);

        // on destroy remove any event handler or watch
        scope.$on('$destroy', function() {
          $document.off('keydown', keySeek);
          $document.off('keyup', onKeyUp);
        });

      }

      // remove hide class once the video is ready
      videoEl.removeClass('ng-hide');

      // if autoplay is set and is not false
      if( typeof attrs.autoplay !== 'undefined' && attrs.autoplay !== "false" ) {
        // start the video
        return $video.play();
      }

    };

    /**
     * Update scope time variable
     */
    $video.ontimeupdate = function() {

      if( attrs.endTime && attrs.endTime <= $video.currentTime ) {
        scope.currentTime = attrs.endTime;
        return $video.currentTime = $video.duration;
      }

      scope.$apply(function() {
        return scope.currentTime = $video.currentTime;
      });

    };

    /**
     * Catch the first play
     */
    $video.onplay = function() {

      if( $video.firstPlay ) {
        // set flag
        $video.firstPlay = false;
        // run the callback if specified
        return angular.isFunction(scope.onFirstplay) ? scope.$apply(scope.onFirstplay()) : true;
      }

    };

    // by default show the control box
    // if not specified
    if( attrs.controlBox !== 'false' ) {

      /**
      * When the user start seeking
      * show the control box
      */
      $video.onseeking = function() {

        if( attrs.showTime !== 'false' ) {

          // show controls box
          scope.$apply(function() {
            return controlBox.removeClass('ng-hide');
          });

        }

      };

      /**
      * When the seek is finished
      * hide again the control box
      */
      $video.onseeked = function() {

        // cancel privous timeout
        $timeout.cancel(controlBoxTimeout);
        // hide the control box
        controlBoxTimeout = $timeout(function() {

          scope.$apply(function() {
            controlBox.addClass('ng-hide');
          });

        }, 2000);

      };

      /**
      * Show the video controls box
      */
      $video.onpause = function() {

        // cancel privous timeout
        $timeout.cancel(controlBoxTimeout);

        if( attrs.showTime !== 'false' ) {

          // show element for a while
          controlBox.removeClass('ng-hide');

          // TODO: Introduce the mode 'auto' and 'true' show-time true will always show time
          // while auto will set the timeout like now
          //
          // Set the timeout to hide the control box
          controlBoxTimeout = $timeout(function() {

            // hide the control box
            scope.$apply(function() {
              controlBox.addClass('ng-hide');
            });

          }, 2000);

        }

      };

    }

  }

  var _scope = {
    source: '=',
    onFirstplay: '&',
    onFirstend: '&'
  };

  var directive = {
    restrict: 'E',
    scope: _scope,
    templateUrl: 'angular-video-background/main.html',
    link: _link
  };

  return directive;

});
