# angular-video-background
> light module for using any video as background with many options

### [DEMO](https://codekraft-studio.github.io/angular-video-background/)

## Getting started:
Download the module using npm package manager:
```bash
npm install angular-video-background
```
with bower package manager:
```bash
bower install --save angular-videos-background
```
or download it directly from GitHub.

Add the style to your header:
```html
<link rel="stylesheet" href="angular-video-background.min.css">
```

Add the script to your body:
```html
<script type="text/javascript" src="angular-video-background.min.js"></script>
```

and than add the module to your application dependencies:
```javascript
angular.module('app', ['video-background'])
```
and you can start to use the directive __video-background__ it in your application.

---

## Basic usage:
The directive most important attribute that must be specified in order to work correctly. The attribute is __source__, that specify the object with the source/s of the video in the format __type__: "source".
```javascript
// example source object
$scope.myVideo = {
  mp4: "public/myvideo.mp4",
  ogg: "public/myvideo.ogg"
}
```
__Note:__ you must pass a object to the __source__ attribute.
```html
<video-background source="myVideo"></video-background>
<video-background source="{ mp4: 'path/to/video.mp4' }"></video-background>
```

You can optionally bind keyboard press to video controls by using __key-controls__ attribute.

---

## Directive attributes:
* __source__: the object containing the video source/s
* __autoplay__: set the video auto play attribute (default true)
* __volume__: an number value from 0 to 1 to set the initial volume
* __autopause__: autopause the video in case of seeking
* __key-controls__: if the attribute is specified will bind keyboard controls
* __show-time__: enable or disable the current time view
* __on-firstplay__: a callback to run when the video play for the first time
* __on-firstend__: a callback to run when the video ends for the first time
* __start-time__: specify a custom start time for the video (expressed in int/float es: 1.50)
* __end-time__: specify a custom end time for the video (expressed in int/float es: 17.25)

---

## Examples:

### source
The object containing the source/s of the video to show. __This attribute is necessary for the directive to work.__
```html
<video-background source="{
  mp4: 'mySource.mp4',
  ogg: 'mySource.ogg',
  webm: 'mySource.webm'
}"></video-background>
```

### auto-play
The autoplay attribute will start the video when it's ready to play. (like the normal html autoplay attribute)

### start-time
Specify a custom start time for the video, pass a number, can be a float.
```html
<video-background source="myVideo" start-time="3.75"></video-background>
```

### end-time
Specify a custom end time for the video, pass a number, can be a float.
```html
<video-background source="myVideo" end-time="15.35"></video-background>
```

### initial volume
Start the video with initial volume of 0
```html
<video-background source="myVideo" volume="0"></video-background>
```

### autoplay & autopause
Specify a custom end time for the video, pass a number, can be a float.
```html
<video-background source="myVideo" autoplay autopause></video-background>
```

### enable keyboard controls
Specify a custom end time for the video, pass a number, can be a float.
```html
<video-background source="myVideo" key-controls="true"></video-background>
```
