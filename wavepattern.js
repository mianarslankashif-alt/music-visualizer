function WavePattern() {
  this.name = "wavepattern";

  /* start own code*/
  this.draw = function () {
    push();

    background(bgVal);

    noFill();
    strokeWeight(3);

    // Retrieves the time-domain waveform. Unlike the FFT spectrum,
    // waveform() returns the instantaneous audio signal as values
    // between -1 and 1, allowing the original sound wave to be drawn.
    var wave = fourier.waveform();

    beginShape();

    // Converts each waveform sample into a screen coordinate.
    // The sample index determines the horizontal position while
    // the amplitude controls the vertical position, creating a
    // continuous waveform across the entire canvas.
    for (var i = 0; i < wave.length; i++) {
      var x = map(i, 0, wave.length, 0, width);
      var y = map(wave[i], -1, 1, height * 0.2, height * 0.8);

      // Gradually increases the green colour component from left
      // to right, producing a smooth cyan gradient across the wave.
      var c = map(i, 0, wave.length, 120, 255);

      stroke(0, c, 255);

      vertex(x, y);
    }

    // Connects all vertices into one continuous waveform.
    endShape();

    pop();
  };
}
/*end own code*/