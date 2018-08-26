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
    //btn_gray.disabled = true;


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
})(window.filters);
