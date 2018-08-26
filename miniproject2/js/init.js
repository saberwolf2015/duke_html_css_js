/**
 * Init filers action for this page
 */
(function() {
  document.addEventListener("DOMContentLoaded", ready);
  function ready() {
    var data = {
      image_to_hide: null,
      image_origin : null
    };

    var btn_file = document.querySelector("#btn_file");
    var btn_file2 = document.querySelector("#btn_file2");
    var start_btn = document.querySelector("#start_btn");
    disableButtons(true);
    btn_file.onchange = function(event) {
      loadImage(event,"image_to_hide");
    };
    btn_file2.onchange = function(event) {
      loadImage(event,"image_origin");
    };
    start_btn.onclick = function() {
      run();
    }

  function loadImage(e,canvasId) {
    console.log("Load Image ", canvasId);
    var context = document.getElementById(canvasId).getContext('2d');
    //var img = new Image();
    var img = document.createElement('img');
    img.onload = function() {
        var canvas = document.getElementById(canvasId);
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
        if(canvasId == "image_to_hide") {
          data.image_to_hide = imgd;
        } else if(canvasId == "image_origin") {
          data.image_origin = imgd;
        }
        if(data.image_origin != null && data.image_to_hide != null) {
          //endble buttons
          disableButtons(false);
        }
    }
    img.src = URL.createObjectURL(e.target.files[0]);
  };
  function disableButtons(disabled) {
    if(!disabled) disabled = false;
    start_btn.disabled = disabled;
  }
  function run() {
    var x = 0;
    var y = 0;
    var img_to_hide_prepared = prepareImage(data.image_to_hide,chopToHide,data.image_origin.width, data.image_origin.height);
    // Draw the ImageData at the given (x,y) coordinates.
    var canvas = document.getElementById('image_to_hide2');
    canvas.width  = img_to_hide_prepared.width;
    canvas.height = img_to_hide_prepared.height;
    var context = canvas.getContext('2d');
    context.putImageData(img_to_hide_prepared, x, y);

    var img_origin_prepared = prepareImage(data.image_origin,offsetToHide,data.image_origin.width, data.image_origin.height);
    canvas = document.getElementById('image_origin2');
    canvas.width  = img_origin_prepared.width;
    canvas.height = img_origin_prepared.height;
    context = document.getElementById('image_origin2').getContext('2d');
    context.putImageData(img_origin_prepared, x, y);
  }
  function prepareImage(img, func, w, h) {
    if(img == null) {
      return;
    }
    console.log("w ", w, " h ", h);
      //var newImage = Object.assign({}, filters.sourceImage);
      //var newImage = JSON.parse(JSON.stringify(filters.sourceImage));
      //var newImage = new ImageData(img.width, img.height);
      var newImage = new ImageData(w, h);
      console.log(newImage);
      //newImage.data.set(new Uint8ClampedArray(img.data));
      newImage.data.set(new Uint8ClampedArray(w*h*4));
      console.log(newImage);
      //var pix = filters.sourceImage.data;
      var pix = newImage.data;
      var offset = 0;
      var c = 0;
      for(var i = 0; i < h; i++) {
        for(var j =0; j < w*4; j+=4) {
          var r = func(img.data[offset + j]);
          var g = func(img.data[offset + j+1]);
          var b = func(img.data[offset + j+2]);
          var a = img.data[offset + j+3];
          pix[c] = r;
          pix[c+1] = g;
          pix[c+2] = b;
          pix[c+3] = a;
          c+=4;
        }
        offset += img.width*4;
      }
      /*
      for (var i = 0, n = pix.length; i < n; i += 4) {
        var r = func(pix[i]);
        var g = func(pix[i+1]);
        var b = func(pix[i+2]);
        pix[i] = r;
        pix[i+1] = g;
        pix[i+2] = b;
      }*/
      //var context = document.getElementById('canvas').getContext('2d');
      // Draw the ImageData at the given (x,y) coordinates.
      //var x = 0;
      //var y = 0;
      //context.putImageData(filters.sourceImage, x, y);
      //context.putImageData(newImage,x,y);
      return newImage;
  };
  function chopToHide(value) {
    //console.log("chopToHide was", value, "now ", value%16);
    return (value%16);
  }
  function offsetToHide(value) {
    //console.log("offsetToHide was", value, "now ", Math.floor(value/16)*16);
    return Math.floor(value/16)*16;
  }
}
}
)();
