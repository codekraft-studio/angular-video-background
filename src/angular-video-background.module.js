angular.module('video-background', [])

.run(function($templateCache) {

  var tmpl = '<video></video>' +
                '<div class="video-controls">' +
                  '<span ng-bind="currentTime | number: 2"></span>' +
                '</div>' +
              '</div>';

  $templateCache.put('angular-video-background/main.html', tmpl);

});
