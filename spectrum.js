function Spectrum() {
  this.name = "spectrum";

  /* start own code*/
  this.draw = function () {
    push();

    background(bgVal);

    // Get frequency amplitude data from FFT (0-255 values).
    var spectrum = fourier.analyze();

    var bars = 128;
    var barWidth = width / bars + 1;

    noStroke();

    for (var i = 0; i < bars; i++) {

      // Map visual bars (128) to FFT spectrum resolution (~256+ bins).
      var index = floor(map(i, 0, bars, 0, 256));

      var x = map(i, 0, bars, 0, width);

      // Convert amplitude into bar height.
      var h = map(spectrum[index], 0, 255, 0, height);

      // Draw each bar as multiple stacked segments to create a
      // smooth vertical gradient effect instead of a single rectangle.
      for (var y = 0; y < h; y += 4) {

        // Used to interpolate color from darker to brighter tones.
        var inter = map(y, 0, h, 0, 1);

        var r = 0;
        var g = lerp(140, 255, inter);
        var b = 255;

        stroke(r, g, b);
        strokeWeight(4);

        line(x, height - y, x + barWidth + 1, height - y);
      }
    }

    pop();
  };
  /*end own code*/
}