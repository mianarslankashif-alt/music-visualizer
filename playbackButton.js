function PlaybackButton() {
  this.x = 20;
  this.y = 20;
  this.width = 20;
  this.height = 20;

  this.playing = false;

  this.draw = function () {
    /* start own code */
    // Keep the icon visible against either theme's background.
    fill(fgVal);
    noStroke();
    /* end own code */
    // Display a play or pause icon to reflect the current audio state.
    if (this.playing) {
      rect(this.x, this.y, this.width / 2 - 2, this.height);
      rect(
        this.x + (this.width / 2 + 2),
        this.y,
        this.width / 2 - 2,
        this.height,
      );
    } else {
      triangle(
        this.x,
        this.y,
        this.x + this.width,
        this.y + this.height / 2,
        this.x,
        this.y + this.height,
      );
    }
  };

  /* start own code */

  this.hitCheck = function () {
    // Check whether the mouse click occurred inside the playback button
    // before changing the audio state and menu visibility.
    if (
      mouseX > this.x &&
      mouseX < this.x + this.width &&
      mouseY > this.y &&
      mouseY < this.y + this.height
    ) {
      if (sound.isPlaying()) {
        sound.pause();
        this.playing = false;
        controls.menuDisplayed = true;
      } else {
        sound.loop();
        this.playing = true;
        controls.menuDisplayed = false;
      }

      return true;
    }

    return false;
  };
  /* end own code */
}