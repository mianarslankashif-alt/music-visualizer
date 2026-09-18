/* start own code */
class Orbiter {
  constructor(radius, angle, speed) {
    this.radius = radius;
    this.angle = angle;
    this.speed = speed;
  }
}

function AudioOrbit() {
  this.name = "audio orbit";

  this.orbiters = [];
  this.totalOrbiters = 12;

  this.smoothBass = 0;
  this.smoothMid = 0;
  this.smoothTreble = 0;

  this.onResize = function () {
    this.orbiters = [];

    // Create orbiters with increasing orbit sizes and random starting positions.
    for (var i = 0; i < this.totalOrbiters; i++) {
      this.orbiters.push(
        new Orbiter(80 + i * 18, random(TWO_PI), random(0.003, 0.015)),
      );
    }
  };

  this.onResize();

  this.drawOrbit = function (radius) {
    noFill();
    stroke(255, 40);
    strokeWeight(1);

    ellipse(0, 0, radius * 2, radius * 2);
  };

  this.draw = function () {
    background(bgVal);

    fourier.analyze();

    var waveform = fourier.waveform();

    var bass = fourier.getEnergy("bass");
    var mid = fourier.getEnergy("mid");
    var treble = fourier.getEnergy("treble");

    // Smooth the FFT values so the animation reacts naturally instead of jittering.
    this.smoothBass = lerp(this.smoothBass, bass, 0.08);
    this.smoothMid = lerp(this.smoothMid, mid, 0.08);
    this.smoothTreble = lerp(this.smoothTreble, treble, 0.08);

    push();

    translate(width / 2, height / 2);

    this.orbiters.forEach(function (orbiter, index) {

      // Mid frequencies increase each orbiter's rotation speed.
      orbiter.angle +=
        orbiter.speed + map(this.smoothMid, 0, 255, 0.001, 0.012);

      // Bass controls how far each orbiter moves away from the centre.
      var radius = orbiter.radius + map(this.smoothBass, 0, 255, -10, 45);

      this.drawOrbit(radius);

      // Each orbiter samples a different part of the waveform to create unique movement.
      var waveOffset = waveform[(index * 18) % waveform.length] * 25;

      var x = cos(orbiter.angle) * (radius + waveOffset);
      var y = sin(orbiter.angle) * (radius + waveOffset);

      noStroke();

      fill(0, 229, 255, 180);

      // Treble controls the size of the moving orbiters.
      ellipse(
        x,
        y,
        map(this.smoothTreble, 0, 255, 8, 20),
        map(this.smoothTreble, 0, 255, 8, 20),
      );

      fill(255, 60);

      ellipse(
        x,
        y,
        map(this.smoothTreble, 0, 255, 16, 34),
        map(this.smoothTreble, 0, 255, 16, 34),
      );
    }, this);

    noFill();

    stroke(0, 229, 255, 80);
    strokeWeight(2);

    beginShape();

    // The waveform is wrapped into a circle to create a dynamic central ring.
    for (var i = 0; i < waveform.length; i += 6) {
      var angle = map(i, 0, waveform.length, 0, TWO_PI);
      var radius = 45 + waveform[i] * 25;

      vertex(cos(angle) * radius, sin(angle) * radius);
    }

    endShape(CLOSE);

    stroke(255, 40);
    strokeWeight(1);

    for (var i = 0; i < 24; i++) {
      var angle = (i * TWO_PI) / 24 + frameCount * 0.003;

      line(cos(angle) * 25, sin(angle) * 25, cos(angle) * 60, sin(angle) * 60);
    }

    noStroke();

    for (var i = 0; i < 6; i++) {
      fill(0, 229, 255, 12);

      ellipse(0, 0, 90 + i * 25, 90 + i * 25);
    }

    fill(255);

    ellipse(
      0,
      0,
      map(this.smoothBass, 0, 255, 26, 52),
      map(this.smoothBass, 0, 255, 26, 52),
    );

    fill(0, 229, 255);

    ellipse(
      0,
      0,
      map(this.smoothBass, 0, 255, 14, 34),
      map(this.smoothBass, 0, 255, 14, 34),
    );

    stroke(0, 229, 255, 70);
    strokeWeight(2);
    noFill();

    // Mid frequencies control the outer pulse surrounding the centre.
    ellipse(
      0,
      0,
      map(this.smoothMid, 0, 255, 120, 180),
      map(this.smoothMid, 0, 255, 120, 180),
    );

    pop();
  };
}
/* end own code */