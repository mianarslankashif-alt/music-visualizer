/* start own code */
// New visualisation - a simple mirrored bar equaliser. Unlike
// CircularEqualizer (which arranges bars in a ring), this one keeps
// the classic straight-line bar layout, but mirrors each bar above
// and below a centre line so it reads differently from Spectrum too.
function AudioBars() {
  this.name = "audio bars";

  this.totalBars = 64;

  this.onResize = function () {
    this.barWidth = width / this.totalBars;
  };

  this.onResize();

  this.draw = function () {
    background(bgVal);

    var spectrum = fourier.analyze();

    var centerY = height / 2;

    noStroke();

    for (var i = 0; i < this.totalBars; i++) {
      // Spread the visible bars across roughly the first half of the
      // FFT range, where most audible energy sits.
      var specIndex = floor(map(i, 0, this.totalBars, 0, spectrum.length / 2));

      var amp = spectrum[specIndex];

      var barHeight = map(amp, 0, 255, 4, height * 0.4);

      var x = i * this.barWidth;

      // Brighter/louder bars get a slightly stronger fill.
      fill(0, 229, 255, map(amp, 0, 255, 120, 255));

      rect(x, centerY - barHeight, this.barWidth - 2, barHeight);
      rect(x, centerY, this.barWidth - 2, barHeight);
    }

    stroke(fgVal, 60);
    strokeWeight(1);
    line(0, centerY, width, centerY);
  };
}
/* end own code */
