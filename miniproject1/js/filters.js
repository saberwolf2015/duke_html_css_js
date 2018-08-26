/**
 * Task for 4-th week https://www.coursera.org/learn/duke-programming-web/
 *
 */
(
  function(window) {

    var filters = {
      sourceImage : null,
    };
    //found this method here
    //https://stackoverflow.com/questions/32470555/javascript-algorithm-function-to-generate-rgb-values-for-a-color-along-the-visib
    //2018.08.20
    function HSVtoRGB(h, s, v) {
        var r, g, b, i, f, p, q, t;
        if (arguments.length === 1) {
            s = h.s, v = h.v, h = h.h;
        }
        i = Math.floor(h * 6);
        f = h * 6 - i;
        p = v * (1 - s);
        q = v * (1 - f * s);
        t = v * (1 - (1 - f) * s);
        switch (i % 6) {
            case 0: r = v, g = t, b = p; break;
            case 1: r = q, g = v, b = p; break;
            case 2: r = p, g = v, b = t; break;
            case 3: r = p, g = q, b = v; break;
            case 4: r = t, g = p, b = v; break;
            case 5: r = v, g = p, b = q; break;
        }
        return {
            r: Math.round(r * 255),
            g: Math.round(g * 255),
            b: Math.round(b * 255)
        };
    }

    filters.rainbow = function() {
      if(filters.sourceImage == null) {
        return;
      }
      var newImage = new ImageData(new Uint8ClampedArray(filters.sourceImage.data),filters.sourceImage.width, filters.sourceImage.height);
      var pix = newImage.data;
      var width = newImage.width;
      var height = newImage.height;

      var step = height/100;
      var colors = [];
      for(var i = 0; i< 100; i++) {
        var rgb = HSVtoRGB(i/100.0*0.85, 1.0, 1.0);
        colors.push(rgb);
      }
      console.log("colors",colors);
      console.log("step",step);
      var rowNum = 0;
      for (var i = 0, n = pix.length; i < n; i += 4) {
        if(i/4 % width == 0) rowNum++;

        var pos = Math.round(rowNum /step);
        if(pos >= colors.length) pos = colors.length-1;
        //console.log("pos", pos, "rowNum", rowNum, " step", step);
        //console.log(" color ", colors[pos].r,colors[pos].g,colors[pos].b);
        var avg = (pix[i  ] + pix[i+1] + pix[i+2])/3;
        if(avg < 127)  {
            //пробуем пропорционально всё ументшить
            var percent = avg/127;
            pix[i] = colors[pos].r*percent;
            pix[i+1] = colors[pos].g*percent;
            pix[i+2] = colors[pos].b*percent;
        } else {
          pix[i] = colors[pos].r;
          pix[i+1] = colors[pos].g;
          pix[i+2] = colors[pos].b;
        }
      }
      var context = document.getElementById('canvas').getContext('2d');
      // Draw the ImageData at the given (x,y) coordinates.
      var x = 0;
      var y = 0;
      //context.putImageData(filters.sourceImage, x, y);
      context.putImageData(newImage,x,y);
    }

    filters.grayscale = function() {
      if(filters.sourceImage == null) {
        return;
      }
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
    filters.shark = function(shark_teeth, shark_teeth_height,shark_teeth_gum) {
      shark_teeth = parseInt(shark_teeth);
      shark_teeth_height = parseInt(shark_teeth_height);
      shark_teeth_gum = parseInt(shark_teeth_gum);

      console.log(" shark_teeth ", shark_teeth, " shark_teeth_height ",shark_teeth_height,"shark_teeth_gum",shark_teeth_gum);
      if(filters.sourceImage == null) {
        return;
      }
        var newImage = new ImageData(filters.sourceImage.width, filters.sourceImage.height);
        newImage.data.set(new Uint8ClampedArray(filters.sourceImage.data));
        var pix = newImage.data;
        var w = newImage.width;
        var h = newImage.height;
        var sine_w = Math.round(w/shark_teeth);

        //период синусоиды 2ПИ
        //столько пи в ширине картинки
        var piCount = w/Math.PI;
        console.log("piCount", piCount);
        //var period = 5;//5;//3;
        var period = shark_teeth;
        if(piCount > period) sine_w = 1/(piCount/period);

        console.log("sine_w ", sine_w);
        var rowNum = 0;
        var x = 0;
        for (var i = 0, n = pix.length; i < n; i += 4) {
          //console.log("rowNum", rowNum);
          if(i/4 % w == 0) {
            rowNum++;
            x = 0;
          }
          //make blue
          var r = pix[i];
          var g = pix[i+1];
          var b = pix[i+2];
          var avg = (pix[i  ] + pix[i+1] + pix[i+2])/3;
          if(avg < 127) {
            pix[i] = 0;
            pix[i+1] = 0;
            pix[i+2] = avg*2;
          } else {
            pix[i] = avg*2-255;
            pix[i+1] = avg*2-255;
            pix[i+2] = 255;
          }

          if(rowNum < shark_teeth_gum || rowNum > h-shark_teeth_gum) {
            pix[i  ] = 0; // red
            pix[i+1] = 191; // green
            pix[i+2] = 255; // blue
          } else {
              //top sinusoid
              var y = shark_teeth_height+ shark_teeth_gum+ shark_teeth_height*Math.sin(sine_w*x);

              //console.log("x ", x, " y" , y, " rowNum", rowNum);
              if(rowNum < y) {
                pix[i  ] = 0; // red
                pix[i+1] = 191; // green
                pix[i+2] = 255; // blue
              }
              //bottom sinusoid
              y = h - shark_teeth_height- shark_teeth_gum + shark_teeth_height*Math.sin(sine_w*x);
              //console.log("x ", x, " y" , y, " rowNum", rowNum);
              if(rowNum > y) {
                pix[i  ] = 0; // red
                pix[i+1] = 191; // green
                pix[i+2] = 255; // blue
              }
          }
          x++;
        }
        var context = document.getElementById('canvas').getContext('2d');
        // Draw the ImageData at the given (x,y) coordinates.
        var x = 0;
        var y = 0;
        context.putImageData(newImage,x,y);
    };
    filters.red = function() {
      if(filters.sourceImage == null) {
        return;
      }
      var newImage = new ImageData(new Uint8ClampedArray(filters.sourceImage.data),filters.sourceImage.width, filters.sourceImage.height);
      var pix = newImage.data;
      for (var i = 0, n = pix.length; i < n; i += 4) {
        var r = pix[i];
        var g = pix[i+1];
        var b = pix[i+2];
        var avg = (pix[i  ] + pix[i+1] + pix[i+2])/3;
        if(avg < 127) {
          pix[i] = avg*2;
          pix[i+1] = 0;
          pix[i+2] = 0;
        } else {
          pix[i] = 255;
          pix[i+1] = avg*2-255;
          pix[i+2] = avg*2-255;
        }
      }
      var context = document.getElementById('canvas').getContext('2d');
      // Draw the ImageData at the given (x,y) coordinates.
      var x = 0;
      var y = 0;
      //context.putImageData(filters.sourceImage, x, y);
      context.putImageData(newImage,x,y);
    }
    //ДОДЕЛАТЬ ЭТОТ ФИЛЬТР
    /**
     * wCount - сколько линий по ширине
     * hCount - сколько линий по высоте
     * lineWidth - ширина линии
     */
    filters.windowPane = function(wCount, hCount, lineWidth, hexColor) {
      console.log("windowPane(wCount = " + wCount + ", hCount= " + hCount + ", lineWidth = " + lineWidth +")");
      color = filters.fromHexToRgb(hexColor);
      wCount = parseInt(wCount);
      hCount = parseInt(hCount);
      lineWidth = parseInt(lineWidth);
      if(filters.sourceImage == null) {
        return;
      }
      var newImage = new ImageData(new Uint8ClampedArray(filters.sourceImage.data),filters.sourceImage.width, filters.sourceImage.height);
      var pix = newImage.data;
      var w = newImage.width;
      var h = newImage.height;
      console.log("w ", w, "h" , h);
      var offset2 = 0;
      var wSpace = Math.round((w-lineWidth*wCount)/(wCount-1));
      console.log(" w ", w, " lineWidth ", lineWidth, " wCount ", wCount, " wSpace", wSpace);
      //по всей высоте
      for(var k = 0; k < h; k++) {
        var offset = 0;
        //берём линию по ширине
        for(var i = 0; i < wCount; i++) {
          //console.log(" offset " , offset);
          //рисуем части горизонтальных полос
          for(var j = 0; j < lineWidth*4; j+=4) {
            //console.log(offset*4+j);
            pix[offset2+offset*4+j] = color.r;//255;
            pix[offset2+offset*4+j+1] = color.g;//0;
            pix[offset2+offset*4+j+2] = color.b;//0;
          }
          //offset+=wSpace;
          offset+=(lineWidth+wSpace);
        }
        offset2+=w*4;
      }

      //горизонтальные линии

      var offset2 = 0;
      //var hSpace = Math.round((h-lineWidth*(hCount-2))/(hCount-1));
      var hSpace = Math.round((h-lineWidth*hCount)/(hCount-1));
      console.log(" w ", w, " lineWidth ", lineWidth, " hCount ", hCount, " hSpace", hSpace);
        var offset = 0;
        //по всей высоте
        for(var i = 0; i < hCount; i++) {
          //console.log(" offset " , offset, " i " , i);
          //рисуем горизонтальые линии по заданной ширине
          for(var j = 0; j < w*lineWidth*4; j+=4) {
            //console.log(offset*4+j);
            pix[offset*w*4+j] = color.r;
            pix[offset*w*4+j+1] = color.g;
            pix[offset*w*4+j+2] = color.b;
            // if(i == 0) {
            //   pix[offset*w*4+j] = 255;
            // } else if(i == 1) {
            //   pix[offset*w*4+j+1] = 255;
            // } else {
            //   pix[offset*w*4+j+2] = 255;
            // }
          }
          //после делаем смещение
          offset+=(lineWidth+hSpace);
          //console.log("offset = ",offset, " " , (lineWidth+hSpace));
        }

      var context = document.getElementById('canvas').getContext('2d');
      // Draw the ImageData at the given (x,y) coordinates.
      var x = 0;
      var y = 0;
      //context.putImageData(filters.sourceImage, x, y);
      context.putImageData(newImage,x,y);
    }
    filters.reset = function() {
      var context = document.getElementById('canvas').getContext('2d');
      var x = 0;
      var y = 0;
      context.putImageData(filters.sourceImage, x, y);
    }
    filters.fromHexToRgb = function(hexColor) {
      var arr = hexColor.match(/[A-Za-z0-9]{2}/g).map(function(v) { return parseInt(v, 16) });
      var ret = {
        r: 0,
        g: 0,
        b: 0
      };
      if(arr.length >= 3) {
        ret.r = arr[0];
        ret.g = arr[1];
        ret.b = arr[2];
      }
      return ret;
    };
    window.filters = filters;
  }
)(window);
