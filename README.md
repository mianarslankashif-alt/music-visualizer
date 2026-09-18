# Music Visualizer

**Live demo:** https://music-visualizer-mak-mian-arslan.vercel.app

A real-time, audio-reactive visualizer with nine distinct visualization modes, built on [p5.js](https://p5js.org/) and its Fast Fourier Transform (FFT) audio analysis.

## Features

- **9 visualization modes** — Spectrum, Wave Pattern, Needles, Radial, Kaleidoscope, Flower, Orbit, Circular Equalizer, and Bars — switchable from an in-app menu (press Space to pause and choose, number keys 1–9 to jump directly)
- **Live beat & BPM detection** — a dual moving-average detector flags beats from the bass band and estimates tempo in real time
- **Two audio sources** — play the bundled track, upload your own MP3, or switch to live microphone input
- **Playback controls** — volume, variable playback speed, restart, and a scrubbable progress bar
- **Customization** — light/dark theme toggle, four accent color presets, and one-click PNG snapshot export
- **Fullscreen support** and responsive canvas sizing

## Tech stack

Vanilla JavaScript and [p5.js](https://p5js.org/) / [p5.sound](https://p5js.org/reference/#/libraries/p5.sound) (loaded via CDN) — no framework, no build step, no dependencies to install.

## Running locally

Serve the folder with any static file server, e.g.:

```bash
npx serve .
```

## Origin

Started from a university coursework template (a 3-visualization audio analysis exercise) and substantially extended with six additional visualization modes, beat detection, microphone/file input, and the full UI/customization layer above.
