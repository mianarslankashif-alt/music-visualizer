/* start own code */
class EqualizerBar {
  constructor(angle) {
    this.angle = angle;
    this.height = 20;
  }
}

function CircularEqualizer() {
  this.name = "circular equalizer";

  this.bars = [];
  this.totalBars = 48;

  this.baseRadius = 130;

  this.rotation = 0;

  this.onResize = function () {
    this.baseRadius = min(width, height) * 0.18;

    this.bars = [];

    // Distribute the equalizer bars evenly around the circle.
    for (var i = 0; i < this.totalBars; i++) {
      this.bars.push(new EqualizerBar((i * TWO_PI) / this.totalBars));
    }
  };

  this.onResize();

  this.draw = function () {
    background(bgVal);

    fourier.analyze();

    var spectrum = fourier.analyze();

    var bass = fourier.getEnergy("bass");
    var treble = fourier.getEnergy("treble");

    // Bass energy gradually increases the rotation speed of the visual.
    this.rotation += map(bass, 0, 255, 0.001, 0.01);

    push();

    translate(width / 2, height / 2);

    rotate(this.rotation);

    this.bars.forEach(function (bar, index) {

      // Assign each bar to a different section of the frequency spectrum.
      var specIndex = floor(
        map(index, 0, this.totalBars - 1, 0, spectrum.length / 2),
      );

      var targetHeight = map(spectrum[specIndex], 0, 255, 20, 170);

      // Smoothly interpolate to the new height to avoid rapid flickering.
      bar.height = lerp(bar.height, targetHeight, 0.18);

      // Treble frequencies brighten the colour of the equalizer bars.
      stroke(0, map(treble, 0, 255, 180, 255), 255);
      strokeWeight(5);

      push();

      rotate(bar.angle);

      line(this.baseRadius, 0, this.baseRadius + bar.height, 0);

      strokeWeight(8);

      point(this.baseRadius + bar.height, 0);

      pop();
    }, this);

    noFill();

    stroke(255, 35);
    strokeWeight(2);

    ellipse(0, 0, this.baseRadius * 2, this.baseRadius * 2);
    ellipse(0, 0, (this.baseRadius + 35) * 2, (this.baseRadius + 35) * 2);

    stroke(255, 40);
    strokeWeight(1);

    // Draw rotating guide lines around the centre to enhance motion.
    for (var i = 0; i < 24; i++) {
      var angle = (i * TWO_PI) / 24 - this.rotation * 2;

      line(cos(angle) * 35, sin(angle) * 35, cos(angle) * 70, sin(angle) * 70);
    }

    noStroke();

    // Draw soft glowing circles behind the equalizer.
    for (var i = 0; i < 6; i++) {
      fill(0, 229, 255, 10);

      ellipse(0, 0, 70 + i * 20, 70 + i * 20);
    }

    fill(255);

    // Bass controls the size of the central pulse.
    ellipse(0, 0, map(bass, 0, 255, 24, 52), map(bass, 0, 255, 24, 52));

    fill(0, 229, 255);

    ellipse(0, 0, map(bass, 0, 255, 14, 30), map(bass, 0, 255, 14, 30));

    noStroke();

    fill(255, 120);

    // Draw particles orbiting around the outside of the equalizer.
    for (var i = 0; i < 32; i++) {
      var angle = (i * TWO_PI) / 32 + this.rotation;

      var radius = this.baseRadius + 140;

      ellipse(cos(angle) * radius, sin(angle) * radius, 4, 4);
    }

    noFill();
    stroke(0, 229, 255, 60);
    strokeWeight(1);

    ellipse(0, 0, (this.baseRadius + 140) * 2, (this.baseRadius + 140) * 2);

    pop();
  };
}
/* end own code */