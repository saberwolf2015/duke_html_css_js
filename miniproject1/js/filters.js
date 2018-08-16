(
  function(window) {
    var filters = {
      sourceImage : null,
    };


    filters.loadImage = function(e) {
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
          filters.sourceImage = imgd;
          // // Loop over each pixel and invert the color.
          // for (var i = 0, n = pix.length; i < n; i += 4) {
          //     pix[i  ] = 255 - pix[i  ]; // red
          //     pix[i+1] = 255 - pix[i+1]; // green
          //     pix[i+2] = 255 - pix[i+2]; // blue
          //     // i+3 is alpha (the fourth element)
          // }

          // Draw the ImageData at the given (x,y) coordinates.
          //context.putImageData(imgd, x, y);

      }
      img.src = URL.createObjectURL(e.target.files[0]);
    };
    filters.grayscale = function() {
      console.log(filters.sourceImage);
        //var newImage = Object.assign({}, filters.sourceImage);
        //var newImage = JSON.parse(JSON.stringify(filters.sourceImage));
        var newImage = new ImageData(filters.sourceImage.width, filters.sourceImage.height);
        console.log(newImage);
        newImage.data.set(new Uint8ClampedArray(filters.sourceImage.data));
        console.log(newImage);
        //var pix = filters.sourceImage.data;
        var pix = newImage.data;
        for (var i = 0, n = pix.length; i < n; i += 4) {
          var r = pix[i];
          var g = pix[i+1];
          var b = pix[i+2];

          var avg = (pix[i  ] + pix[i+1] + pix[i+2])/3;
          if(i < 50) {
          console.log("["+i+"] ("+r+","+g+","+b+") avg = " + avg);
          }
          pix[i  ] = avg; // red
          pix[i+1] = avg; // green
          pix[i+2] = avg; // blue
            // pix[i  ] = 255 - pix[i  ]; // red
            // pix[i+1] = 255 - pix[i+1]; // green
            // pix[i+2] = 255 - pix[i+2]; // blue
            // i+3 is alpha (the fourth element)
        }
        var context = document.getElementById('canvas').getContext('2d');
        // Draw the ImageData at the given (x,y) coordinates.
        var x = 0;
        var y = 0;
        //context.putImageData(filters.sourceImage, x, y);
        context.putImageData(newImage,x,y);
    };
    filters.reset = function() {
      var context = document.getElementById('canvas').getContext('2d');
      var x = 0;
      var y = 0;
      context.putImageData(filters.sourceImage, x, y);
    }
    window.filters = filters;
  }
)(window);
