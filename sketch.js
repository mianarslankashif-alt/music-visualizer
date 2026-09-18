var controls = null;
var vis = null;
var sound = null;
var fourier;

/* start own code */
var fileInput;
var volume;
var button;
var mic;
var micButton;
var usingMic = false;

var progressX;
var progressY;
var progressWidth = 260;
var progressHeight = 8;

// Light/dark theme state, read by every visualisation's background()
// call so the whole app (not just the toolbar) responds to the toggle.
var isLightMode = false;
var bgVal = 0;
var fgVal = 255;
var themeButton;
var fullscreenButton;
var restartButton;

function updateTheme() {
  if (isLightMode) {
    bgVal = 245;
    fgVal = 20;
  } else {
    bgVal = 0;
    fgVal = 255;
  }
}

// Shared beat detector (see beatDetector.js), updated once per frame
// so it works no matter which visualisation is on screen.
var beat = null;
var beatFlash = 0;

var speedSlider;
var snapshotButton;
var accentButton;

// Accent colour, read by the toolbar buttons and the pause menu
// panel (controlsAndInput.js) so a single button can re-colour the
// app's UI chrome. The nine visualisations keep their own individually
// designed colour palettes rather than being forced onto one shared
// accent - that would be a much bigger rewrite than this feature is
// meant to be.
var accentPresets = [
  [0, 229, 255], // cyan (original)
  [255, 60, 180], // pink
  [120, 255, 120], // green
  [255, 170, 0], // orange
];
var accentIndex = 0;
var accentColor = accentPresets[0];

var toolbarButtons = [];

function applyAccentColor() {
  var c =
    "rgb(" + accentColor[0] + "," + accentColor[1] + "," + accentColor[2] + ")";
  var glow =
    "0 0 15px rgba(" +
    accentColor[0] +
    "," +
    accentColor[1] +
    "," +
    accentColor[2] +
    ",0.6)";

  for (var i = 0; i < toolbarButtons.length; i++) {
    toolbarButtons[i].style("background", c);
    toolbarButtons[i].style("box-shadow", glow);
  }
}

// Filename shown in the "now playing" HUD text; updated whenever a
// user-uploaded track loads.
var currentTrackName = "stomper_reggae_bit.mp3";
/* end own code */

function preload() {
  // Load the default audio file before the sketch starts.
  sound = loadSound("assets/stomper_reggae_bit.mp3");
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  background(0);

  controls = new ControlsAndInput();

  // Create the FFT analyser used by every visualisation.
  fourier = new p5.FFT();
  fourier.setInput(sound);

  /* start own code */
  beat = new BeatDetector();
  /* end own code */

  /* start own code */

  // Create an invisible file input so the custom button can open
  // the operating system's file picker.
  fileInput = createFileInput(loadUserSong);

  fileInput.position(width - 240, 20);

  fileInput.attribute("accept", ".mp3,audio/*");
  fileInput.style("opacity", "0");
  fileInput.style("width", "220px");
  fileInput.style("height", "45px");
  fileInput.style("cursor", "pointer");
  fileInput.style("position", "absolute");
  fileInput.style("z-index", "10");

  // Custom upload button displayed to the user.
  button = createButton("Upload MP3");

  button.position(width - 235, 20);

  button.style("background", "rgb(0,229,255)");
  button.style("color", "white");
  button.style("border", "2px solid white");
  button.style("border-radius", "12px");
  button.style("padding", "10px 18px");
  button.style("font-family", "Trebuchet MS");
  button.style("font-size", "15px");
  button.style("font-weight", "bold");
  button.style("box-shadow", "0 0 15px rgba(0,229,255,0.6)");
  button.style("pointer-events", "none");
  toolbarButtons.push(button);

  // Create the microphone input.
  mic = new p5.AudioIn();

  micButton = createButton("Microphone");

  micButton.position(width - 420, 20);

  micButton.style("background", "rgb(0,229,255)");
  micButton.style("color", "white");
  micButton.style("border", "2px solid white");
  micButton.style("border-radius", "12px");
  micButton.style("padding", "10px 18px");
  micButton.style("font-family", "Trebuchet MS");
  micButton.style("font-size", "15px");
  micButton.style("font-weight", "bold");
  toolbarButtons.push(micButton);

  // Switch the FFT input between the uploaded song and the microphone.
  micButton.mousePressed(function () {
    if (!usingMic) {
      getAudioContext().resume();

      mic.start();

      fourier.setInput(mic);

      usingMic = true;

      if (sound.isPlaying()) {
        sound.pause();
      }

      controls.playbackButton.playing = false;
    } else {
      mic.stop();

      fourier.setInput(sound);

      usingMic = false;

      sound.loop();

      controls.playbackButton.playing = true;
    }
  });

  // Volume slider for audio file playback.
  volume = createSlider(0, 1, 0.5, 0.01);

  volume.position(width - 620, 20);

  volume.style("width", "150px");
  volume.style("cursor", "pointer");

  // Theme toggle button - swaps the canvas background/foreground
  // between dark and light mode.
  themeButton = createButton("Light / Dark");

  // Fixed, width-independent position (not "width - offset" like the
  // row above) so this row never gets pushed off-screen on smaller
  // windows - the same class of bug fixed earlier in this file.
  themeButton.position(20, 60);

  themeButton.style("background", "rgb(0,229,255)");
  themeButton.style("color", "white");
  themeButton.style("border", "2px solid white");
  themeButton.style("border-radius", "12px");
  themeButton.style("padding", "10px 18px");
  themeButton.style("font-family", "Trebuchet MS");
  themeButton.style("font-size", "15px");
  themeButton.style("font-weight", "bold");

  themeButton.mousePressed(function () {
    isLightMode = !isLightMode;
    updateTheme();
  });
  toolbarButtons.push(themeButton);

  // On-screen fullscreen button (in addition to the existing F key).
  fullscreenButton = createButton("Fullscreen");

  fullscreenButton.position(180, 60);

  fullscreenButton.style("background", "rgb(0,229,255)");
  fullscreenButton.style("color", "white");
  fullscreenButton.style("border", "2px solid white");
  fullscreenButton.style("border-radius", "12px");
  fullscreenButton.style("padding", "10px 18px");
  fullscreenButton.style("font-family", "Trebuchet MS");
  fullscreenButton.style("font-size", "15px");
  fullscreenButton.style("font-weight", "bold");

  fullscreenButton.mousePressed(function () {
    let fs = fullscreen();
    fullscreen(!fs);
  });
  toolbarButtons.push(fullscreenButton);

  // Restart button - jumps the current track back to the beginning.
  restartButton = createButton("Restart");

  restartButton.position(320, 60);

  restartButton.style("background", "rgb(0,229,255)");
  restartButton.style("color", "white");
  restartButton.style("border", "2px solid white");
  restartButton.style("border-radius", "12px");
  restartButton.style("padding", "10px 18px");
  restartButton.style("font-family", "Trebuchet MS");
  restartButton.style("font-size", "15px");
  restartButton.style("font-weight", "bold");

  restartButton.mousePressed(function () {
    if (!usingMic && sound && sound.isLoaded()) {
      sound.jump(0);
    }
  });
  toolbarButtons.push(restartButton);

  // Playback speed slider - reused as a rate multiplier for the
  // loaded track (1 = normal speed).
  speedSlider = createSlider(0.5, 2, 1, 0.1);

  speedSlider.position(20, 105);

  speedSlider.style("width", "150px");
  speedSlider.style("cursor", "pointer");

  // Snapshot button - saves the current canvas frame as a PNG using
  // p5's built-in saveCanvas(), no extra library needed.
  snapshotButton = createButton("Snapshot");

  snapshotButton.position(190, 100);

  snapshotButton.style("background", "rgb(0,229,255)");
  snapshotButton.style("color", "white");
  snapshotButton.style("border", "2px solid white");
  snapshotButton.style("border-radius", "12px");
  snapshotButton.style("padding", "10px 18px");
  snapshotButton.style("font-family", "Trebuchet MS");
  snapshotButton.style("font-size", "15px");
  snapshotButton.style("font-weight", "bold");

  snapshotButton.mousePressed(function () {
    saveCanvas("music-visualiser-snapshot", "png");
  });
  toolbarButtons.push(snapshotButton);

  // Accent colour button - cycles the toolbar/menu colour preset.
  accentButton = createButton("Accent Colour");

  accentButton.position(320, 100);

  accentButton.style("color", "white");
  accentButton.style("border", "2px solid white");
  accentButton.style("border-radius", "12px");
  accentButton.style("padding", "10px 18px");
  accentButton.style("font-family", "Trebuchet MS");
  accentButton.style("font-size", "15px");
  accentButton.style("font-weight", "bold");

  accentButton.mousePressed(function () {
    accentIndex = (accentIndex + 1) % accentPresets.length;
    accentColor = accentPresets[accentIndex];
    applyAccentColor();
  });
  toolbarButtons.push(accentButton);

  updateTheme();
  applyAccentColor();

  /* end own code */

  // Register every available visualisation.
  vis = new Visualisations();

  vis.add(new Spectrum());
  vis.add(new WavePattern());
  vis.add(new Needles());
  vis.add(new RadialVisualizer());
  vis.add(new AudioKaleidoscope());
  vis.add(new AudioFlower());
  vis.add(new AudioOrbit());
  vis.add(new CircularEqualizer());
  /* start own code */
  vis.add(new AudioBars());
  /* end own code */
}

function draw() {
  /* start own code */
  background(bgVal);
  beat.update();
  /* end own code */

  // Draw the currently selected visualisation.
  if (vis && vis.selectedVisual) {
    vis.selectedVisual.draw();
  }

  /* start own code */

  // Beat-reactive flash: a thin border around the canvas that pulses
  // brighter on every detected beat, then fades. Drawn after the
  // visualisation so it works the same way regardless of which one
  // is currently selected, without needing to edit all nine of them.
  if (beat.isBeat) {
    beatFlash = 160;
  }
  if (beatFlash > 0) {
    push();
    noFill();
    stroke(accentColor[0], accentColor[1], accentColor[2], beatFlash);
    strokeWeight(8);
    rect(4, 4, width - 8, height - 8);
    pop();
    beatFlash -= 10;
  }

  // Update the playback volume and speed while using audio files.
  // rate() also affects pitch, since this is a simple speed control
  // rather than a full time-stretching implementation.
  if (!usingMic && sound) {
    sound.setVolume(volume.value());
    sound.rate(speedSlider.value());
  }

  // "Now playing" / live BPM HUD, bottom-left corner.
  push();
  fill(fgVal);
  noStroke();
  textAlign(LEFT);
  textFont("Trebuchet MS");
  textSize(14);

  var nowPlayingLabel = usingMic
    ? "Now Playing: Microphone Input"
    : "Now Playing: " + currentTrackName;
  text(nowPlayingLabel, 20, height - 50);

  var bpmLabel = beat.bpm > 0 ? "BPM: ~" + nf(beat.bpm, 0, 0) : "BPM: --";
  text(bpmLabel, 20, height - 30);
  pop();

  // Draw a progress bar that shows the current playback position.
  if (!usingMic && sound && sound.isLoaded()) {
    progressX = width - 300;
    progressY = height - 35;

    // Convert the playback time into a percentage of the song.
    var percent = sound.currentTime() / sound.duration();

    stroke(100);
    strokeWeight(6);
    line(progressX, progressY, progressX + progressWidth, progressY);

    stroke(accentColor[0], accentColor[1], accentColor[2]);
    line(progressX, progressY, progressX + progressWidth * percent, progressY);

    noStroke();
    fill(255);

    ellipse(progressX + progressWidth * percent, progressY, 14, 14);
  }

  /* end own code */

  controls.draw();
}

function mouseClicked() {
  getAudioContext().resume();

  controls.mousePressed();

  /* start own code */

  // Jump to a different position when the progress bar is clicked.
  if (
    !usingMic &&
    sound &&
    sound.isLoaded() &&
    mouseX >= progressX &&
    mouseX <= progressX + progressWidth &&
    mouseY >= progressY - 10 &&
    mouseY <= progressY + 10
  ) {
    var t = map(
      mouseX,
      progressX,
      progressX + progressWidth,
      0,
      sound.duration(),
    );

    sound.jump(t);
  }

  /* end own code */
}

function keyPressed() {
  controls.keyPressed(keyCode);
}

/* start own code */

function windowResized() {
  // Resize the canvas and reposition the interface elements using the
  // same offsets they were originally placed with in setup(), so they
  // stay in the same relative spot instead of jumping off-screen.
  resizeCanvas(windowWidth, windowHeight);

  // Let the active visualisation recalculate its own layout (gauge
  // positions, ring radii, particle spacing, etc.) for the new canvas
  // size, the same way the original template did before this file
  // was rewritten.
  if (vis && vis.selectedVisual && vis.selectedVisual.onResize) {
    vis.selectedVisual.onResize();
  }

  if (fileInput) {
    fileInput.position(width - 240, 20);
  }

  if (button) {
    button.position(width - 235, 20);
  }

  if (micButton) {
    micButton.position(width - 420, 20);
  }

  if (volume) {
    volume.position(width - 620, 20);
  }

  // Theme/Fullscreen/Restart use fixed positions (see setup()), so
  // they don't need repositioning here - they never move.
}

function loadUserSong(file) {
  // Ignore files that are not recognised as audio.
  if (file.type !== "audio") {
    return;
  }

  getAudioContext().resume();

  if (sound) {
    sound.stop();
  }

  // Load the selected file and reconnect the FFT analyser so all
  // visualisations react to the new audio source immediately.
  loadSound(file.file, function (newSound) {
    sound = newSound;
    fourier.setInput(sound);
    sound.loop();
    controls.playbackButton.playing = true;
    controls.menuDisplayed = false;
    currentTrackName = file.name;
  });
}

/* end own code */