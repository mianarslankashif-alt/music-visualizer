function ControlsAndInput() {
  this.menuDisplayed = false;

  this.playbackButton = new PlaybackButton();

  /* start own code */
  this.mousePressed = function () {
    this.playbackButton.hitCheck();
  };

  this.keyPressed = function (keycode) {
    console.log(keycode);

    // Keyboard controls allow the user to play/pause audio, switch
    // between visualisations and toggle fullscreen mode.
    if (keycode == 32) {
      if (sound.isPlaying()) {
        sound.pause();
        this.playbackButton.playing = false;
        this.menuDisplayed = true;
      } else {
        sound.loop();
        this.playbackButton.playing = true;
        this.menuDisplayed = false;
      }

      return;
    }

    // Number keys select the corresponding visualisation from the menu.
    // Bounded to the actual number of visualisations so an unused
    // number key (e.g. 9, when there are only 8) is ignored instead
    // of crashing on an out-of-range array access.
    if (keycode > 48 && keycode < 58) {
      var visNumber = keycode - 49;
      if (visNumber < vis.visuals.length) {
        vis.selectVisual(vis.visuals[visNumber].name);
      }
    }

    // Pressing F switches between windowed and fullscreen mode.
    if (keycode == 70) {
      let fs = fullscreen();
      fullscreen(!fs);

      return;
    }
  };
  /* end own code */

  /* start own code */
  this.draw = function () {
    push();

    this.playbackButton.draw();

    // Display a centred menu overlay whenever playback is paused.
    if (this.menuDisplayed) {
      var panelWidth = 660;
      // Slightly taller than the original 500 so the 9th visualisation
      // entry (added alongside AudioBars) still fits inside the panel.
      var panelHeight = 540;
      var panelX = width / 2 - panelWidth / 2;
      var panelY = height / 2 - panelHeight / 2;

      noStroke();
      fill(0, 230);
      rect(0, 0, width, height);

      fill(25, 25, 25);
      stroke(accentColor[0], accentColor[1], accentColor[2]);
      strokeWeight(3);
      rect(panelX, panelY, panelWidth, panelHeight, 20);

      fill(35, 35, 35);
      noStroke();
      rect(panelX + 15, panelY + 15, panelWidth - 30, panelHeight - 30, 16);

      noStroke();
      textAlign(CENTER);
      textFont("Trebuchet MS");

      textSize(42);

      fill(accentColor[0], accentColor[1], accentColor[2], 70);
      text("MUSIC VISUALIZER", width / 2 + 2, panelY + 62);

      fill(accentColor[0], accentColor[1], accentColor[2]);
      text("MUSIC VISUALIZER", width / 2, panelY + 65);

      stroke(accentColor[0], accentColor[1], accentColor[2]);
      strokeWeight(2);
      line(panelX + 60, panelY + 95, panelX + panelWidth - 60, panelY + 95);

      noStroke();
      fill(180);
      textSize(18);
      text("Choose a Visualization", width / 2, panelY + 130);

      this.menu();

      textAlign(LEFT);
      textSize(15);
      fill(120);
      text("By Mian Arslan Kashif", 25, height - 25);

      textAlign(LEFT);
      textSize(15);
      fill(120);
      text("Press F for fullscreen mode", 200, height - 25);
    }

    pop();
  };
  /* end own code */

  /* start own code */
  this.menu = function () {
    textAlign(CENTER);
    textFont("Trebuchet MS");

    var startY = height / 2 - 60;

    // Generate the visualisation list automatically from the array so
    // new visualisations appear in the menu without extra code.
    for (var i = 0; i < vis.visuals.length; i++) {
      fill(255);

      textSize(18);

      text(
        i + 1 + "   " + vis.visuals[i].name.toUpperCase(),
        width / 2,
        startY + i * 40,
      );
    }

    textSize(16);
    fill(accentColor[0], accentColor[1], accentColor[2]);

    // Positioned relative to the last menu item (not a fixed height-90
    // offset) so adding more visualisations to the list can't make
    // this collide with the last item's text.
    var hintY = startY + vis.visuals.length * 40 + 25;
    text("SPACE  -  PLAY / PAUSE", width / 2, hintY);
  };
  /* end own code */
}