// Container that manages all visualisations and handles switching between them.
function Visualisations() {

  // Stores all available visualisation objects (Spectrum, WavePattern, etc.)
  this.visuals = [];

  // Currently active visualisation (null until first one is added)
  this.selectedVisual = null;

  // Add a new visualisation to the system.
  // If it's the first one, automatically select it as the active view.
  this.add = function (vis) {
    this.visuals.push(vis);

    // Auto-select first loaded visualisation so something is always displayed.
    if (this.selectedVisual == null) {
      this.selectVisual(vis.name);
    }
  };

  // Switch the active visualisation based on its name property.
  this.selectVisual = function (visName) {
    for (var i = 0; i < this.visuals.length; i++) {

      // Match name string to find the correct visualisation object.
      if (visName == this.visuals[i].name) {
        this.selectedVisual = this.visuals[i];
      }
    }
  };
}