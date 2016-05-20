'use strict';

// shim layer with setTimeout fallback
window.requestAnimFrame = (function(){
  return  window.requestAnimationFrame       ||
          window.webkitRequestAnimationFrame ||
          window.mozRequestAnimationFrame    ||
          function( callback ){
            window.setTimeout(callback, 1000 / 60);
          };
})();

// Set up the canvas
var canvas = document.querySelector('canvas')
  ,	ctx = canvas.getContext('2d')
  ,	width = window.innerWidth
  , height = window.innerHeight;

canvas.height = height;
canvas.width = width;

// Config
var maxArrows = 10
  ,	directions = ['topRight', 'bottomLeft'];

// Arrow class
var Arrow = function (direction) {
  this.x = Math.round(20 + (Math.random() * (width - 20)));
  this.y = Math.round(20 + (Math.random() * (height - 20)));
  this.opacity = 0; // Invisible at first
  this.direction = direction;
  this.hasAppeared = false;
  this.velocity = 0.5

  this.img = new Image();
  this.img.src = (this.direction === 'topRight') ? 'images/arrow-top-right.png' : 'images/arrow-bottom-left.png';

  this.draw = function () {
    ctx.save();
    ctx.globalAlpha = this.opacity;
    ctx.drawImage(this.img, this.x, this.y, 15, 15);
    ctx.restore();
  };

  this.animate = function () {
    this.draw();

    // Make it appear (fade in)
    if (this.direction === 'topRight') {
      this.x += this.velocity;
      this.y -= this.velocity;
    }

    if (this.direction === 'bottomLeft') {
      this.x -= this.velocity;
      this.y += this.velocity;
    }

    if (!this.hasAppeared) {
      this.opacity += 0.02;

      if (this.opacity >= 1) {
        this.hasAppeared = true;
      }
    }

    if (this.hasAppeared) {
      this.opacity -= 0.005
    }

    if (this.opacity <= 0)
      return true;
    else
      return false;

  }
}

var arrows = [];

var index = 0;
var pusher = setInterval(function () {
  var direction = (Math.random() < 0.5) ? directions[0] : directions[1];
  arrows.push(new Arrow(direction));
  index++;

  if (index === maxArrows) clearInterval(pusher);
}, 200)

var render = function () {
  // console.log(arrows.length);
  ctx.clearRect(0, 0, width, height);
  for (var i = 0; i < arrows.length; i++) {
    var arrow = arrows[i];
    var hasEnded = arrow.animate();

    if (hasEnded) {
      arrows[i] = new Arrow((Math.random() < 0.5) ? directions[0] : directions[1]);
    }
  }
}

function animloop(){
  requestAnimFrame(animloop);
  render();
};

animloop();


// Show content after 1.5s
setTimeout(function () {
  document.querySelector('.main').className = 'main';
}, 1500)
