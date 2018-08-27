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
    var w = data.image_origin.width;
    var h = data.image_origin.height;
    if(data.image_to_hide.width < w) {
      console.log("w lesser");
      w = data.image_to_hide.width;
    }
    if(data.image_to_hide.height < h) {
      console.log("h lesser");
      h = data.image_to_hide.height;
    }
    console.log("data.image_origin.width", data.image_origin.width, "data.image_origin.height",data.image_origin.height);
    console.log("data.image_to_hide.width",data.image_to_hide.width,"data.image_to_hide.height", data.image_to_hide.height);
    console.log("w ",w," h", h);
    console.log("chopToHide");
    var img_to_hide_prepared = prepareImage(data.image_to_hide,chopToHide,w, h);
    // Draw the ImageData at the given (x,y) coordinates.
    var canvas = document.getElementById('image_to_hide2');
    canvas.width  = img_to_hide_prepared.width;
    canvas.height = img_to_hide_prepared.height;
    var context = canvas.getContext('2d');
    context.putImageData(img_to_hide_prepared, x, y);

    console.log("offsetToHide");
    var img_origin_prepared = prepareImage(data.image_origin,offsetToHide,w, h);
    canvas = document.getElementById('image_origin2');
    canvas.width  = img_origin_prepared.width;
    canvas.height = img_origin_prepared.height;
    context = canvas.getContext('2d');
    context.putImageData(img_origin_prepared, x, y);

    console.log("mixImage");
    var image_mix = mixImage(img_to_hide_prepared, img_origin_prepared);
    var canvas = document.getElementById('image_mix');
    canvas.width  = image_mix.width;
    canvas.height = image_mix.height;
    var context = canvas.getContext('2d');
    context.putImageData(img_origin_prepared, x, y);

    var image_extracted = extractImage(image_mix,recover);
    var canvas = document.getElementById('image_to_hide_extracted');
    canvas.width  = image_extracted.width;
    canvas.height = image_extracted.height;
    var context = canvas.getContext('2d');
    context.putImageData(image_extracted, x, y);

    var image_origin_extracted = extractImage(image_mix, function(value) {return (value/16)*16});
    var canvas = document.getElementById('image_origin_extracted');
    canvas.width  = image_origin_extracted.width;
    canvas.height = image_origin_extracted.height;
    var context = canvas.getContext('2d');
    context.putImageData(image_origin_extracted, x, y);

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

          if(c ==0 && j < 10) {
            console.log("prepare ", img.data[offset + j],r);
          }
          //var a = img.data[offset + j+3];
          //var a = func(img.data[offset + j+3]);
          var a = 255;
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
  function mixImage(img_to_hide, img_origin) {
    if(img_to_hide == null || img_origin == null) {
      return;
    }
    var w = img_to_hide.width;
    var h = img_to_hide.height;
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
      for (var i = 0, n = pix.length; i < n; i += 4) {
        var r = sumImage(img_origin.data[i],img_to_hide.data[i]);
        var g = sumImage(img_origin.data[i+1],img_to_hide.data[i+1]);
        var b = sumImage(img_origin.data[i+2],img_to_hide.data[i+2]);
        if(i < 10) {
          console.log("mix origin " , img_origin.data[i]," to_hide ", img_to_hide.data[i],"result", r);
        }
        //var a = img_origin.data[i+3];
        //var a = sumImage(img_origin.data[i+3],img_to_hide.data[i+3]);
        var a = 255;
        pix[i] = r;
        pix[i+1] = g;
        pix[i+2] = b;
        pix[i+3] = a;
      }
      return newImage;
  };

  function extractImage(img, func) {
      if(img == null) {
        return;
      }
      var w = img.width;
      var h = img.height;
      console.log("w ", w, " h ", h);
      console.log("w ", w, " h ", h);
        var newImage = new ImageData(w, h);
        console.log(newImage);
        //newImage.data.set(new Uint8ClampedArray(img.data));
        newImage.data.set(new Uint8ClampedArray(w*h*4));
        console.log(newImage);
        //var pix = filters.sourceImage.data;
        var pix = newImage.data;
        for (var i = 0, n = pix.length; i < n; i += 4) {
          var r = func(img.data[i]);
          var g = func(img.data[i+1]);
          var b = func(img.data[i+2]);
          if(i < 10) {
            console.log("recover ", img.data[i],r);
          }
          //var a = recover(img.data[i+3]);;//img.data[i+3];
          var a = 255;
          pix[i] = r;
          pix[i+1] = g;
          pix[i+2] = b;
          pix[i+3] = a;
        }
        return newImage;
  }
  function chopToHide(value) {
    //console.log("chopToHide was", value, "now ", value%16);
    //return (value%16);
    return  Math.floor(value/16);
  }
  function offsetToHide(value) {
    //console.log("offsetToHide was", value, "now ", Math.floor(value/16)*16);
    return Math.floor(value/16)*16;
  }
  function recover(value) {
    return (value%16)*16;
  }
  function sumImage(value_origin, value_to_hide) {
    var ret = value_origin + value_to_hide;
    if(ret > 255) console.log("too BIG SUM", ret);
    return ret;
  }
}
}
)();
