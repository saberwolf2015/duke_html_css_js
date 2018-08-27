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
    //window pane elements
    var pane_w_count = document.querySelector("#pane_w_count");
    var pane_h_count = document.querySelector("#pane_h_count");
    var pane_border = document.querySelector("#pane_border");
    var pane_color = document.querySelector("#pane_color");
    //частота зубов
    var shark_teeth = document.querySelector("#shark_teeth");
    //высота зуба
    var shark_teeth_height = document.querySelector("#shark_teeth_height");
    //высота десны
    var shark_teeth_gum = document.querySelector("#shark_teeth_gum");

    var btn_rainbow_challenge = document.querySelector("#btn_rainbow_challenge");
    var btn_blur_challenge = document.querySelector("#btn_blur_challenge");


    btn_file.onchange = function(event) {
      loadImage(event);
    };
    //btn_gray.disabled = true;
    disableButtons(true);

    //alert("ME REAdy");
    btn_gray.onclick = function() {
      filters.grayscale();
    }
    btn_red.onclick = function() {
      filters.red();
    }
    btn_rainbow.onclick = function() {
      filters.rainbow();
    }
    btn_reset.onclick = function() {
      filters.reset();
    }

    btn_rainbow_challenge.onclick = function() {
      filters.rainbowChallenge();
    }
    btn_blur_challenge.onclick = function() {
      filters.blurChallenge();
    }
    btn_window_pane.onclick = function() {
      console.log("pane_w_count.value", pane_w_count.value);
      console.log("pane_h_count.value", pane_h_count.value);
      console.log("pane_border.value", pane_border.value);
      console.log("pane_color.value", pane_color.value);
      //filters.windowPane(3,3,5);
      filters.windowPane(pane_w_count.value, pane_h_count.value, pane_border.value, pane_color.value);
    }
    btn_shark.onclick = function() {

      filters.shark(shark_teeth.value, shark_teeth_height.value, shark_teeth_gum.value);
    }
  }

  function loadImage(e) {
    console.log("Load Image");
    var context = document.getElementById('canvas').getContext('2d');
    //var img = new Image();
    var img = document.createElement('img');
    img.onload = function() {
      var canvas = document.getElementById('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      // canvas.style.width  = '800px';
      // canvas.style.height = '600px';

      context.drawImage(img, 0, 0);
      console.log("w: ", img.width, "h:", img.height);
      var x = 0;
      var y = 0;
      var width = img.width;
      var height = img.height;
      var imgd = context.getImageData(x, y, width, height);
      filters.loadImage(imgd);
      //endble buttons
      disableButtons(false);
      shark_teeth_gum.max = height;
      shark_teeth_height.max = height / 2;
    }
    img.src = URL.createObjectURL(e.target.files[0]);
  };

  function disableButtons(disabled) {
    if (!disabled) disabled = false;
    btn_gray.disabled = disabled;
    btn_red.disabled = disabled;
    btn_rainbow.disabled = disabled;
    btn_reset.disabled = disabled;
    btn_window_pane.disabled = disabled;
    btn_shark.disabled = disabled;
    pane_w_count.disabled = disabled;
    pane_h_count.disabled = disabled;
    pane_border.disabled = disabled;

    shark_teeth.disabled = disabled;
    shark_teeth_height.disabled = disabled;
    shark_teeth_gum.disabled = disabled;

    btn_rainbow_challenge.disabled = disabled;
    btn_blur_challenge.disabled = disabled;
  }
})(window.filters);
