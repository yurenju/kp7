/* global document */

document.addEventListener('DOMContentLoaded', function(e) {
  'use strict';

  $.material.init();

  $("#zoom-slider").noUiSlider({
    start: 0,
    step: 1,
    range: {
      min: 0,
      max: 100
    }
  });

  $("#move-slider").noUiSlider({
    start: 50,
    step: 1,
    range: {
      min: 0,
      max: 100
    }
  });

  var canvas = document.getElementById('canvas');
  var ctx = canvas.getContext('2d');
  var holder = document.getElementById('holder');
  var save = document.getElementById('save');
  var zoom = document.getElementById('zoom');
  var img;

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

  save.onclick = function() {
    canvas.toBlob(function(blob) {
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
        0, 0, 250 * ratio, 500 * ratio);
    };

    img = new Image();
    img.onload = function () {
      originWidth = this.width;
      sx = (this.width * 2 - this.height) / 4;
      sy = 0;
      sWidth = this.height / 2;
      sHeight = this.height;
      draw();

      $('#zoom-slider').on('slide', function(){
        percent = (100 - parseInt($('#zoom-slider').val())) / 100;
        draw();
      });

      $('#move-slider').on('slide', function(){
        var pos = $('#move-slider').val();
        sx = (originWidth - sWidth) * (parseInt(pos) / 100);
        draw();
      });
    };
    img.src = event.target.result;
  };

  holder.ondrop = function(e) {
    e.preventDefault();
    var file = e.dataTransfer.files[0];
    var reader = new FileReader();

    reader.onload = function (event) {
      setupImage(event);
    };
    reader.readAsDataURL(file);
    return false;
  };

  ctx.fillStyle = '#43A8B1';
  ctx.fillRect(0, 0, 500, 500);

  ctx.font = 'bold 70pt Helvetica, Arial, sans-serif';
  ctx.fillStyle = 'black';
  ctx.fillText('7', 350, 400);

});
