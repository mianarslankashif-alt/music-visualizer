function Needles() {
  this.name = "needles";

  var minAngle = PI + PI / 10;
  var maxAngle = TWO_PI - PI / 10;

  this.plotsAcross = 2;
  this.plotsDown = 2;

  this.frequencyBins = ["bass", "lowMid", "highMid", "treble"];

  /* start own code */
  this.onResize = function () {
    // Recalculate the gauge layout whenever the canvas size changes.
    this.panelGap = 40;

    this.plotWidth = width * 0.38;
    this.plotHeight = height * 0.34;

    this.dialRadius = 145;
  };
  /* end own code */

  this.onResize();

  /* start own code */
  this.draw = function () {
    background(bgVal);

    fourier.analyze();

    var currentBin = 0;

    push();

    fill(18, 18, 18);
    stroke(0, 229, 255);
    strokeWeight(2);

    var totalWidth = this.plotWidth * 2 + this.panelGap;
    var totalHeight = this.plotHeight * 2 + this.panelGap;

    // Calculate the starting position so the four gauges remain centred.
    var startX = (width - totalWidth) / 2;
    var startY = (height - totalHeight) / 2;

    // Draw a separate gauge for each major frequency band.
    for (var i = 0; i < this.plotsDown; i++) {
      for (var j = 0; j < this.plotsAcross; j++) {
        var x = startX + j * (this.plotWidth + this.panelGap);
        var y = startY + i * (this.plotHeight + this.panelGap);

        var w = this.plotWidth;
        var h = this.plotHeight;

        rect(x, y, w, h, 18);

        var gaugeY = y + h - 85;

        this.ticks(x + w / 2, gaugeY, this.frequencyBins[currentBin]);

        // Read the energy of the current frequency band and update its needle.
        var energy = fourier.getEnergy(this.frequencyBins[currentBin]);

        this.needle(energy, x + w / 2, gaugeY);

        currentBin++;
      }
    }

    pop();
  };
  /* end own code */

  /* start own code */
  this.needle = function (energy, centreX, bottomY) {
    push();

    translate(centreX, bottomY);

    // Convert the audio energy value into the corresponding needle angle.
    var theta = map(energy, 0, 255, minAngle, maxAngle);

    var needleLength = this.dialRadius * 0.9;

    var x = needleLength * cos(theta);
    var y = needleLength * sin(theta);

    // Draw two overlapping lines to give the needle a glowing appearance.
    stroke(0, 180, 255, 70);
    strokeWeight(8);
    line(0, 0, x, y);

    stroke(0, 255, 255);
    strokeWeight(3);
    line(0, 0, x, y);

    noStroke();
    fill(0, 229, 255);
    ellipse(0, 0, 14);

    pop();
  };
  /* end own code */

  /* start own code */
  this.ticks = function (centreX, bottomY, freqLabel) {
    var nextTickAngle = minAngle;

    push();

    translate(centreX, bottomY);

    stroke(0, 229, 255);
    strokeWeight(2);

    noFill();
    arc(0, 0, 30, 30, PI, TWO_PI);

    // Evenly space the tick marks across the gauge's range of motion.
    for (var i = 0; i < 9; i++) {
      var outerRadius = this.dialRadius;
      var innerRadius = this.dialRadius * 0.95;

      var x = outerRadius * cos(nextTickAngle);
      var y = outerRadius * sin(nextTickAngle);

      var x1 = innerRadius * cos(nextTickAngle);
      var y1 = innerRadius * sin(nextTickAngle);

      line(x, y, x1, y1);

      nextTickAngle += PI / 10;
    }

    // Display the name of the frequency band for each gauge.
    noStroke();
    fill(235);
    textAlign(CENTER);
    textStyle(BOLD);
    textSize(16);
    text(freqLabel.toUpperCase(), 0, -18);

    pop();
  };
  /* end own code */
}