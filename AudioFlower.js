/*start own code*/
class Petal {
  constructor(angle) {
    // Stores the fixed angle of each petal around the centre
    // so that the flower remains evenly distributed.
    this.angle = angle;

    // Current petal length. This value is updated smoothly
    // every frame based on the bass frequencies.
    this.length = 100;
  }
}

function AudioFlower() {
  this.name = "audio flower";

  this.petals = [];

  // Total number of petals used to create the circular flower.
  // More petals produce a fuller, smoother appearance.
  this.totalPetals = 32;

  // Controls the continuous rotation of the entire flower.
  this.rotation = 0;

  // Smoothed frequency values prevent rapid changes caused by
  // fluctuating audio data, producing more natural animation.
  this.smoothBass = 0;
  this.smoothMid = 0;
  this.smoothTreble = 0;

  this.onResize = function () {
    this.petals = [];

    // Evenly spaces every petal around a full 360-degree circle.
    for (var i = 0; i < this.totalPetals; i++) {
      this.petals.push(new Petal((i * TWO_PI) / this.totalPetals));
    }
  };

  this.onResize();

  this.drawPetal = function (petal, widthValue) {
    push();

    // Rotates the drawing position so each petal is drawn
    // at its assigned angle around the centre.
    rotate(petal.angle);

    noStroke();

    fill(0, 229, 255, 170);

    // The main petal is drawn using an ellipse positioned
    // away from the centre, giving the appearance of a petal
    // extending outwards from the flower.
    ellipse(petal.length * 0.5, 0, petal.length, widthValue);

    // A larger transparent ellipse creates a subtle glow,
    // helping the petals blend together visually.
    fill(255, 50);

    ellipse(petal.length * 0.5, 0, petal.length + 12, widthValue + 12);

    pop();
  };

  this.draw = function () {
    background(bgVal);

    // Updates the FFT analysis so the latest frequency
    // information is available for this frame.
    fourier.analyze();

    var bass = fourier.getEnergy("bass");
    var mid = fourier.getEnergy("mid");
    var treble = fourier.getEnergy("treble");

    // Uses linear interpolation to smooth sudden changes in
    // frequency energy, making the animation appear fluid.
    this.smoothBass = lerp(this.smoothBass, bass, 0.08);
    this.smoothMid = lerp(this.smoothMid, mid, 0.08);
    this.smoothTreble = lerp(this.smoothTreble, treble, 0.08);

    // Mid frequencies gradually rotate the entire flower,
    // causing the visualisation to slowly spin with the music.
    this.rotation += map(this.smoothMid, 0, 255, 0.002, 0.02);

    // Bass controls how far each petal grows from the centre.
    var petalLength = map(this.smoothBass, 0, 255, 90, 220);

    // Treble controls the thickness of each petal, allowing
    // higher frequencies to create a fuller flower.
    var petalWidth = map(this.smoothTreble, 0, 255, 20, 70);

    push();

    // Moves the coordinate system to the centre of the canvas
    // so the flower expands equally in every direction.
    translate(width / 2, height / 2);

    rotate(this.rotation);

    this.petals.forEach(function (petal) {
      // Smoothly adjusts each petal length instead of changing
      // instantly, preventing sharp visual jumps.
      petal.length = lerp(petal.length, petalLength, 0.12);

      this.drawPetal(petal, petalWidth);
    }, this);

    noStroke();

    // Draws several transparent circles to create a soft glow
    // behind the flower and add depth to the visualisation.
    for (var i = 0; i < 6; i++) {
      fill(0, 229, 255, 12);

      ellipse(0, 0, 90 + i * 18, 90 + i * 18);
    }

    stroke(255, 50);
    strokeWeight(2);
    noFill();

    // Animated rings respond to the mid frequencies,
    // reinforcing the pulse of the music.
    ellipse(
      0,
      0,
      map(this.smoothMid, 0, 255, 70, 110),
      map(this.smoothMid, 0, 255, 70, 110),
    );

    ellipse(
      0,
      0,
      map(this.smoothMid, 0, 255, 120, 160),
      map(this.smoothMid, 0, 255, 120, 160),
    );

    noStroke();

    // Central circles expand with the bass, acting as the
    // core of the flower and highlighting low frequencies.
    fill(255);

    ellipse(
      0,
      0,
      map(this.smoothBass, 0, 255, 30, 60),
      map(this.smoothBass, 0, 255, 30, 60),
    );

    fill(0, 229, 255);

    ellipse(
      0,
      0,
      map(this.smoothBass, 0, 255, 18, 40),
      map(this.smoothBass, 0, 255, 18, 40),
    );

    fill(255);

    // Small orbiting particles rotate around the centre and
    // change orbit radius according to the treble energy.
    for (var i = 0; i < 8; i++) {
      var angle = (i * TWO_PI) / 8 + this.rotation * 2;

      var orbit = map(this.smoothTreble, 0, 255, 45, 70);

      ellipse(cos(angle) * orbit, sin(angle) * orbit, 8, 8);
    }

    stroke(0, 229, 255, 100);
    strokeWeight(1);

    // Radial guide lines subtly connect the flower centre
    // to each petal, improving symmetry and visual balance.
    for (var i = 0; i < this.totalPetals; i++) {
      var angle = (i * TWO_PI) / this.totalPetals;

      line(0, 0, cos(angle) * 70, sin(angle) * 70);
    }

    pop();
  };
}
/*end own code*/