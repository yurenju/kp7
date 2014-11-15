/* global document */

document.addEventListener('DOMContentLoaded', function(e) {
  'use strict';

  var holder = document.getElementById('holder');
  var save = document.getElementById('save');
  var zoom = document.getElementById('zoom');
  var picker = document.getElementById('picker');
  var img;

  var canvasWidth = Math.min(
    ((window.innerWidth > 0) ? window.innerWidth : screen.width) * 0.9,
    500);

  var canvas = document.createElement('canvas');
  canvas.setAttribute('id', 'canvas');
  canvas.width = canvasWidth;
  canvas.height = canvasWidth;
  holder.appendChild(canvas);

  var ctx = canvas.getContext('2d');

  var getPixelRatio = function(context) {
      var backingStore = context.backingStorePixelRatio ||
            context.webkitBackingStorePixelRatio ||
            context.mozBackingStorePixelRatio ||
            context.msBackingStorePixelRatio ||
            context.oBackingStorePixelRatio ||
            context.backingStorePixelRatio || 1;

      return (window.devicePixelRatio || 1) / backingStore;
  };

  var ratio = getPixelRatio(ctx);

  var readFile = function(e) {
    e.preventDefault();
    var file;

    if (this.files && this.files.length > 0) {
      file = this.files[0];
    } else {
      file = e.dataTransfer.files[0];
    }

    var reader = new FileReader();

    reader.onload = function (event) {
      setupImage(event);
    };
    reader.readAsDataURL(file);
    ga('_trackEvent', 'Picture', 'Add');
    return false;
  };

  save.onclick = function() {
    canvas.toBlob(function(blob) {
      ga('_trackEvent', 'Picture', 'Download');
      saveAs(blob, 'profile.png');
    });
  };

  holder.ondragover = function () {
    this.classList.add('hover');
    return false;
  };
  holder.ondragend = function () {
    this.classList.remove('hover');
    return false;
  };

  var setupImage = function(event) {
    var sx, sy, sWidth, sHeight, originWidth, percent = 1;

    var draw = function() {
      ctx.drawImage(img, sx, sy, sWidth * percent, sHeight * percent,
        0, 0, canvasWidth / 2 * ratio, canvasWidth * ratio);
    };

    img = new Image();
    img.onload = function () {
      originWidth = this.width;
      sx = (this.width * 2 - this.height) / 4;
      sy = 0;
      sWidth = this.height / 2;
      sHeight = this.height;
      draw();

      zoom.oninput = function() {
        percent = (100 - parseInt(this.value)) / 100;
        draw();
      };

      move.oninput = function() {
        var pos = this.value;
        sx = (originWidth - sWidth) * (parseInt(pos) / 100);
        draw();
      };
    };
    img.src = event.target.result;
  };

  holder.ondrop = readFile;
  picker.onchange = readFile;

  var originalImage = new Image();
  originalImage.onload = function() {
    ctx.drawImage(this, 0, 0, this.width, this.height, 0, 0,
      canvasWidth * ratio, canvasWidth * ratio);
  };
  originalImage.src = "images/original.jpg";
});
