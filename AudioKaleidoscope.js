/* start own code */
function AudioKaleidoscope() {
  this.name = "audio kaleidoscope";

  // Independent rotation values allow different elements of the
  // visualisation to rotate at different speeds and directions.
  this.rotationA = 0;
  this.rotationB = 0;
  this.rotationC = 0;

  this.baseRadius = 170;
  this.maxRadius = 250;

  // Number of radial guide lines used to create the kaleidoscope pattern.
  this.slices = 18;

  // Smoothed frequency values reduce sudden changes in the music,
  // producing smoother animation throughout the visualisation.
  this.smoothBass = 0;
  this.smoothMid = 0;
  this.smoothTreble = 0;

  this.onResize = function () {
    // Scale the visualisation according to the canvas size so it
    // remains proportional on different screen resolutions.
    this.baseRadius = min(width, height) * 0.18;
    this.maxRadius = min(width, height) * 0.34;
  };

  this.onResize();

  this.drawRing = function (wave, radius, colour, rot, glow) {
    push();

    // Rotates each ring independently to create layered motion.
    rotate(rot);

    noFill();

    // Draws multiple transparent outlines behind the main ring.
    // Increasing the stroke weight while lowering the opacity
    // produces a soft glow without requiring blur effects.
    for (var g = glow; g >= 1; g--) {
      stroke(red(colour), green(colour), blue(colour), 18);
      strokeWeight(g * 2);

      beginShape();

      // Maps waveform samples into polar coordinates so the
      // waveform wraps around a circle instead of a straight line.
      for (var i = 0; i < wave.length; i += 3) {
        var angle = map(i, 0, wave.length, 0, TWO_PI);
        var offset = map(wave[i], -1, 1, -32, 32);
        var r = radius + offset;

        vertex(cos(angle) * r, sin(angle) * r);
      }

      endShape(CLOSE);
    }

    stroke(colour);
    strokeWeight(2);

    beginShape();

    // Draws the main waveform ring over the glow effect.
    // The waveform continuously reshapes the ring to match
    // the current audio signal.
    for (var i = 0; i < wave.length; i += 3) {
      var angle = map(i, 0, wave.length, 0, TWO_PI);
      var offset = map(wave[i], -1, 1, -32, 32);
      var r = radius + offset;

      vertex(cos(angle) * r, sin(angle) * r);
    }

    endShape(CLOSE);

    pop();
  };

  this.drawSpokes = function (radius) {
    stroke(255, 40);
    strokeWeight(1);

    // Evenly spaced radial lines reinforce the symmetrical
    // kaleidoscope appearance of the visualisation.
    for (var i = 0; i < this.slices; i++) {
      var a = (i * TWO_PI) / this.slices;

      line(cos(a) * 30, sin(a) * 30, cos(a) * radius, sin(a) * radius);
    }
  };

  this.drawOrbiters = function (radius, rot, size) {
    push();

    // Rotates the entire group of particles together.
    rotate(rot);

    noStroke();

    fill(255, 180);

    // Creates evenly spaced particles that orbit around the centre.
    for (var i = 0; i < 12; i++) {
      var a = (i * TWO_PI) / 12;

      ellipse(cos(a) * radius, sin(a) * radius, size, size);
    }

    pop();
  };

  this.draw = function () {
    background(bgVal);

    // Updates the FFT analysis before retrieving waveform and
    // frequency data for the current animation frame.
    fourier.analyze();

    var wave = fourier.waveform();

    var bass = fourier.getEnergy("bass");
    var mid = fourier.getEnergy("mid");
    var treble = fourier.getEnergy("treble");

    // Uses linear interpolation to smooth frequency values,
    // preventing rapid flickering caused by sudden peaks.
    this.smoothBass = lerp(this.smoothBass, bass, 0.08);
    this.smoothMid = lerp(this.smoothMid, mid, 0.08);
    this.smoothTreble = lerp(this.smoothTreble, treble, 0.08);

    // Each rotating layer moves independently to give the
    // visualisation a more dynamic kaleidoscope effect.
    this.rotationA += 0.003;
    this.rotationB -= 0.002;
    this.rotationC += 0.0015;

    push();

    // Draw everything relative to the centre of the canvas.
    translate(width / 2, height / 2);

    // Bass frequencies control the overall scale, making the
    // entire visualisation pulse with the music.
    var pulse = map(this.smoothBass, 0, 255, 0.95, 1.12);

    scale(pulse);

    noFill();

    // Draws several background circles to create depth and
    // frame the animated waveform rings.
    for (var r = 0; r < 7; r++) {
      stroke(0, 229, 255, 20);
      strokeWeight(1);

      ellipse(0, 0, this.maxRadius * 2 + r * 45, this.maxRadius * 2 + r * 45);
    }

    this.drawSpokes(this.maxRadius + map(this.smoothBass, 0, 255, 0, 45));

    this.drawOrbiters(this.maxRadius + 25, this.rotationA, 5);
    this.drawOrbiters(this.maxRadius - 15, this.rotationB, 3);

    // Draws three waveform rings that respond to different
    // frequency ranges and rotate independently.
    this.drawRing(wave, this.baseRadius, color(0, 229, 255), this.rotationA, 7);

    this.drawRing(
      wave,
      this.baseRadius + 45 + map(this.smoothMid, 0, 255, 0, 25),
      color(255, 80, 200),
      this.rotationB,
      6,
    );

    this.drawRing(
      wave,
      this.baseRadius + 95 + map(this.smoothTreble, 0, 255, 0, 30),
      color(255, 220, 0),
      this.rotationC,
      5,
    );

    push();

    rotate(-this.rotationA * 2);

    stroke(255, 255, 255, 50);
    strokeWeight(1.5);
    noFill();

    var flowerRadius =
      this.baseRadius * 0.45 + map(this.smoothMid, 0, 255, 0, 25);

    // Creates a rotating flower-like pattern by repeatedly
    // drawing the same petal shape around the centre.
    for (var i = 0; i < 24; i++) {
      var a = (i * TWO_PI) / 24;

      push();

      rotate(a);

      beginShape();

      vertex(0, 0);
      vertex(flowerRadius, -8);
      vertex(flowerRadius + 18, 0);
      vertex(flowerRadius, 8);

      endShape(CLOSE);

      pop();
    }

    pop();

    push();

    rotate(this.rotationB * 3);

    stroke(0, 229, 255);
    strokeWeight(2);
    noFill();

    // Draws a rotating hexagon to provide another animated
    // geometric layer near the centre.
    beginShape();

    for (var i = 0; i < 6; i++) {
      var a = (i * TWO_PI) / 6;

      vertex(cos(a) * 55, sin(a) * 55);
    }

    endShape(CLOSE);

    pop();

    noStroke();

    // Layered centre circles respond to bass and treble,
    // creating a glowing focal point.
    fill(255, 255, 255, 35);

    ellipse(
      0,
      0,
      map(this.smoothBass, 0, 255, 85, 115),
      map(this.smoothBass, 0, 255, 85, 115),
    );

    fill(0, 229, 255, 170);

    ellipse(
      0,
      0,
      map(this.smoothBass, 0, 255, 45, 70),
      map(this.smoothBass, 0, 255, 45, 70),
    );

    fill(255);

    ellipse(
      0,
      0,
      map(this.smoothTreble, 0, 255, 10, 20),
      map(this.smoothTreble, 0, 255, 10, 20),
    );

    noStroke();

    fill(255, 120);

    var outerRadius = this.maxRadius + map(this.smoothBass, 0, 255, 10, 45);

    // Small particles rotate around the outside of the visual,
    // emphasising the overall circular motion.
    for (var i = 0; i < 36; i++) {
      var a = (i * TWO_PI) / 36 + this.rotationC;

      ellipse(cos(a) * outerRadius, sin(a) * outerRadius, 4, 4);
    }

    stroke(255, 35);
    strokeWeight(1);

    // Finishing crosshair lines help frame the centre and
    // reinforce the symmetrical layout.
    line(-this.maxRadius - 40, 0, this.maxRadius + 40, 0);
    line(0, -this.maxRadius - 40, 0, this.maxRadius + 40);

    pop();
  };
}
/* end own code */