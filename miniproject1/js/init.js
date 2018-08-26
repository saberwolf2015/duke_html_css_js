/**
 * Init filers action for this page
 */
(function(filters) {
  document.addEventListener("DOMContentLoaded", ready);
  function ready() {
    var btn_gray = document.querySelector("#btn_gray");
    var btn_red = document.querySelector("#btn_red");
    var btn_rainbow = document.querySelector("#btn_rainbow");
    var btn_reset = document.querySelector("#btn_reset");
    var btn_window_pane = document.querySelector("#btn_window_pane");
    var btn_shark = document.querySelector("#btn_shark");
    var btn_file = document.querySelector("#btn_file");
    btn_file.onchange = function(event) {
      loadImage(event);
    };
    //btn_gray.disabled = true;
    disableButtons(true);

    //alert("ME REAdy");
    btn_gray.onclick = function () {
      filters.grayscale();
    }
    btn_red.onclick = function () {
      filters.red();
    }
    btn_rainbow.onclick = function () {
      filters.rainbow();
    }
    btn_reset.onclick = function () {
      filters.reset();
    }
    btn_window_pane.onclick = function () {
      filters.windowPane(3,3,5);;
    }
    btn_shark.onclick = function () {
      filters.shark();
    }
  }
  function loadImage(e) {
    console.log("Load Image");
    var context = document.getElementById('canvas').getContext('2d');
    //var img = new Image();
    var img = document.createElement('img');
    img.onload = function() {
        var canvas = document.getElementById('canvas');
        canvas.width  = img.width;
        canvas.height = img.height;
        // canvas.style.width  = '800px';
        // canvas.style.height = '600px';

        context.drawImage(img, 0,0);
        console.log("w: ",img.width,"h:", img.height);
        //alert('the image is drawn');
        var x = 0;
        var y = 0;
        var width = img.width;
        var height = img.height;
        var imgd = context.getImageData(x, y, width, height);
        var pix = imgd.data;
        //pass image to filters
        filters.sourceImage = imgd;
        //endble buttons
        disableButtons(false);
    }
    img.src = URL.createObjectURL(e.target.files[0]);
  };
  function disableButtons(disabled) {
    if(!disabled) disabled = false;
    btn_gray.disabled = disabled;
    btn_red.disabled = disabled;
    btn_rainbow.disabled = disabled;
    btn_reset.disabled = disabled;
    btn_window_pane.disabled = disabled;
    btn_shark.disabled = disabled;
  }
})(window.filters);
