# angular-video-background
light module for using any video as background with many options

The idea came when I needed to use a video as background for one website and looking around on the web I saw: [Vide](https://github.com/VodkaBears/Vide) and it works very good, but uses jQuery and I didn't like the code too much so I decided to write my own.

## [DEMO](http://www.codekraft.it/demos/angular-video-background/)

## Getting started:
Download the package using npm package manager:
```bash
npm install angular-video-background
```
or clone it from github.


Add the script to your html page.
```html
<script type="text/javascript" src="video-background.module.js"></script>
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
myVideo = {
  mp4: public/myvideo.mp4,
  ogg: public/myvideo.ogg
}
```
__Note:__ you should pass a object to the attribute.
```html
<video-background source="myVideo"></video-background>
```

---

## Directive attributes:
* __source__: the object containing the video source/s
* __autoplay__: set the video auto play attribute (default true)
* __on-firstplay__: a callback to run when the video play for the first time
* __on-firstend__: a callback to run when the video ends for the first time


Coming soon many customization examples..
