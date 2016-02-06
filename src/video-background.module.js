angular.module('video-background', [])

.directive('videoBackground', function($log,$timeout,$document) {

  var _scope = {
    source: '=',
    onFirstplay: '&',
    onFirstend: '&'
  }

  var directive = {
    restrict: 'E',
    replace: true,
    scope: _scope,
    template: '<div>' +
                '<video></video>' +
                '<div class="video-controls">' +
                  '<span ng-bind="currentTime | number: 2"></span>' +
                '</div>' +
              '</div>',
    link: _link
  }

  return directive;

  function _link(scope, elem, attrs) {

    // check if valid object has been passed
    if( !scope.source || !angular.isObject(scope.source) || !Object.keys(scope.source).length ) {
      $log.warn('VideoBg: Expected a valid object, received:', scope.source);
      return;
    }

    var firstPlay = true, firstEnd = true;

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

    // hide video element by default
    videoEl.addClass('ng-hide');
    // add custom class
    videoEl.addClass('video-background');

    controlBox.addClass('ng-hide');

    // add source elements
    for( var key in scope.source ) {
      // if property name is allowed
      // create source element
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

    // set the volume
    $video.volume = ( attrs.volume && ( 0 <= attrs.volume && attrs.volume <= 1 ) ) ? attrs.volume : 1;

    // set playback rate
    $video.defaultPlaybackRate = ( attrs.playbackRate ) ? attrs.playbackRate : 1;

    // set loop attribute
    $video.loop = ( typeof attrs.loop !== 'undefined' && attrs.loop !== "false" ) ? true : false;

    // key bindings
    function onKeyUp(e) {

      // if esc key reset the video
      if( e.which == 27 ) {
        // stop the video and reload it
        $video.pause();
        $video.currentTime = 0;
      }

      // if space bar and video is not ended
      if( e.which == 32 && !$video.endend ) {
        // toggle video state
        $video.paused ? $video.play() : $video.pause();
      }

      // left arrow key
      if( e.which == 37 ) {
        e.preventDefault();
        // if is not at the very start
        if($video.currentTime > 0 && $video.currentTime >= 2) {
          $video.currentTime -= 2;
        }
      }

      // ight arrow key
      if( e.which == 39 ) {
        e.preventDefault();
        // if is not at the very bottom
        if($video.currentTime < $video.duration) {
          $video.currentTime += 2;
        }
      }

    }

    /**
     * On first end run callback if specified
     */
    $video.onended = function() {

      if( firstEnd ) {
        firstEnd = false;
        // run the callback if specified
        return angular.isFunction(scope.onFirstend) ? scope.$apply(scope.onFirstend()) : true;
      }

    }

    /**
     * When video data is loaded
     */
    $video.onloadeddata = function() {

      // init video time
      scope.currentTime = $video.currentTime;

      // if key controls options is enabled
      if( typeof attrs.keyControls !== 'undefined' && attrs.keyControls !== "false"  ) {

        // add some key bindings
        $document.on('keydown', onKeyUp);

        // on destroy remove any event handler
        // or scope watcher
        scope.$on('$destroy', function(e) {
          // remove document keypress handler
          $document.off('keypress', onKeyUp);
        })

      }

      // remove hide class once the video is ready
      videoEl.removeClass('ng-hide');

      // if autoplay is set and is not false
      if( typeof attrs.autoplay !== 'undefined' && attrs.autoplay !== "false" ) {
        // start the video
        return $video.play();
      }

    }

    /**
     * Update scope time variable
     */
    $video.ontimeupdate = function() {
      scope.$apply(function() {
        return scope.currentTime = $video.currentTime;
      })
    }

    /**
     * Catch the first play
     */
    $video.onplay = function() {

      if( firstPlay ) {
        // set flag
        firstPlay = false;
        // run the callback if specified
        return angular.isFunction(scope.onFirstplay) ? scope.$apply(scope.onFirstplay()) : true;
      }
    }

    // by default show the control box
    // if not specified
    if( attrs.controlBox != 'false' ) {

      /**
      * When the user start seeking
      * show the control box
      */
      $video.onseeking = function() {
        // show controls box
        scope.$apply(function() {
          return controlBox.removeClass('ng-hide');
        })
      }

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
          })
        }, 2000)
      }

      /**
      * Show the video controls box
      */
      $video.onpause = function() {
        // cancel privous timeout
        $timeout.cancel(controlBoxTimeout);
        // show element for a while
        controlBox.removeClass('ng-hide');
        controlBoxTimeout = $timeout(function() {
          // hide the control box
          scope.$apply(function() {
            controlBox.addClass('ng-hide');
          })
        }, 2000)
      }

    }

  }

})
