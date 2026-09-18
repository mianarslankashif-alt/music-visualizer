function RadialVisualizer() {
  this.name = "radialvisualizer";

  this.draw = function () {
    background(bgVal);

    push();
    translate(width / 2, height / 2);

    // Get both the frequency spectrum and waveform for this frame.
    var spectrum = fourier.analyze();
    var wave = fourier.waveform();

    // Slowly rotate the entire visual to give constant motion.
    rotate(frameCount * 0.0015);

    strokeWeight(2);

    // Draw frequency bars radiating from the centre.
    // Higher amplitudes produce longer lines.
    for (var i = 0; i < spectrum.length / 2; i += 6) {
      var angle = map(i, 0, spectrum.length / 2, 0, TWO_PI);
      var amp = spectrum[i];

      var innerRadius = 225;
      var outerRadius = innerRadius + map(amp, 0, 255, 15, 255);

      var x1 = innerRadius * cos(angle);
      var y1 = innerRadius * sin(angle);
      var x2 = outerRadius * cos(angle);
      var y2 = outerRadius * sin(angle);

      // Increase the blue channel as the audio becomes louder.
      var blue = map(amp, 0, 255, 170, 255);

      stroke(0, 200, blue);
      line(x1, y1, x2, y2);
    }

    noFill();
    stroke(120, 180, 255, 180);
    strokeWeight(3);

    // Build a circular waveform by converting waveform samples
    // into polar coordinates (angle + radius).
    beginShape();

    var waveStartAngle = 0;
    var waveStartRadius = 195 + wave[0] * 120;

    // Duplicate the first point so curveVertex closes smoothly.
    curveVertex(
      waveStartRadius * cos(waveStartAngle),
      waveStartRadius * sin(waveStartAngle),
    );

    for (var i = 0; i < wave.length / 2; i += 8) {
      var angle = map(i, 0, wave.length / 2, 0, TWO_PI);
      var radius = 195 + wave[i] * 120;

      var x = radius * cos(angle);
      var y = radius * sin(angle);

      curveVertex(x, y);
    }

    curveVertex(
      waveStartRadius * cos(waveStartAngle),
      waveStartRadius * sin(waveStartAngle),
    );

    endShape(CLOSE);

    noStroke();
    fill(0, 140, 255, 90);

    // Create a soft centre blob using frequency amplitudes.
    // Loud frequencies push the shape further outwards.
    beginShape();

    var blobStartAngle = 0;
    var blobStartRadius = 142 + map(spectrum[0], 0, 255, -12, 82);

    curveVertex(
      blobStartRadius * cos(blobStartAngle),
      blobStartRadius * sin(blobStartAngle),
    );

    for (var i = 0; i < spectrum.length / 2; i += 4) {
      var angle = map(i, 0, spectrum.length / 2, 0, TWO_PI);
      var amp = spectrum[i];
      var radius = 142 + map(amp, 0, 255, -12, 82);

      curveVertex(radius * cos(angle), radius * sin(angle));
    }

    // Repeat the first point to keep the blob seamless.
    curveVertex(
      blobStartRadius * cos(blobStartAngle),
      blobStartRadius * sin(blobStartAngle),
    );

    endShape(CLOSE);

    // Draw the glowing centre of the visual.
    fill(0, 220, 255, 120);
    ellipse(0, 0, 105);

    fill(255);
    ellipse(0, 0, 18);

    pop();
  };
}