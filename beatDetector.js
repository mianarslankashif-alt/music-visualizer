/* start own code */
// New file. BeatDetector watches the bass energy band from the shared
// FFT object and flags a "beat" when it spikes well above its own
// recent overall level, using two moving averages of the bass energy:
// a "fast" one that reacts almost instantly to a hit, and a "slow"
// one that tracks the track's general loudness. A beat is flagged
// when the fast average jumps above the slow average by enough to be
// a genuine hit rather than just the normal sustained bass level -
// comparing a value only to its own average never separates from a
// steady bassline, which is why two averages are used instead of one.
function BeatDetector() {
  this.fastAvg = 0;
  this.slowAvg = 0;
  this.fastRate = 0.6;
  this.slowRate = 0.04;

  this.threshold = 1.15;
  this.minEnergy = 15;
  this.cooldownFrames = 10;
  this.framesSinceBeat = this.cooldownFrames;

  this.isBeat = false;
  this.bassEnergy = 0;

  // Recent beat timestamps (ms), used to estimate a live BPM reading
  // from the average time between the last few detected beats.
  this.beatTimes = [];
  this.maxBeatHistory = 8;
  this.bpm = 0;

  // Call once per frame, before anything reads fourier.getEnergy(),
  // since analyze() must run first for getEnergy() to return fresh
  // values for that frame.
  this.update = function () {
    fourier.analyze();
    this.bassEnergy = fourier.getEnergy("bass");

    this.fastAvg += (this.bassEnergy - this.fastAvg) * this.fastRate;
    this.slowAvg += (this.bassEnergy - this.slowAvg) * this.slowRate;

    this.framesSinceBeat++;
    this.isBeat = false;

    if (
      this.fastAvg > this.slowAvg * this.threshold &&
      this.fastAvg > this.minEnergy &&
      this.framesSinceBeat > this.cooldownFrames
    ) {
      this.isBeat = true;
      this.framesSinceBeat = 0;

      this.beatTimes.push(millis());
      if (this.beatTimes.length > this.maxBeatHistory) {
        this.beatTimes.shift();
      }
      this.updateBpm();
    }
  };

  // Averages the gaps between recent beats and converts that into a
  // beats-per-minute estimate. Only a rough, live estimate - not a
  // precise tempo analysis.
  this.updateBpm = function () {
    if (this.beatTimes.length < 2) {
      return;
    }

    var totalGap = 0;
    for (var i = 1; i < this.beatTimes.length; i++) {
      totalGap += this.beatTimes[i] - this.beatTimes[i - 1];
    }
    var avgGapMs = totalGap / (this.beatTimes.length - 1);

    this.bpm = 60000 / avgGapMs;
  };
}
/* end own code */
