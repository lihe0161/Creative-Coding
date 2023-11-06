// Collection of single hexagon instances
let graphicalList = []
// Scaling factor
let scalePub = 1

// Add audio variable
let song;
let amplitude;
let fft;

// Load the audio in the setup function and initialize the analyzer
function setup() {
  createCanvas(windowWidth, windowHeight);
  colorMode(HSB, 360, 100, 100);
  updateGraphicalList();

  // Load audio
  song = loadSound('assets/121.mp3');

  // Create a new amplitude analyzer
  amplitude = new p5.Amplitude();

  // Create an FFT analysis object
  fft = new p5.FFT();
}

class Graphical {
  constructor(x = 0, y = 0) {
    this.W = 250
    this.H = 290
    this.x = x
    this.y = y
    this.color = {}
    this.scaleFactor = 1; // Variable to control size
    this.alphaValue = 255; // Variable to control opacity
    this.rotation = 0; // Variable to control rotation
  }
  // deep color
  getPart1Color(index) {
    if (!this.color[index]) {
      this.color[index] = color(random(360), 90, random(20, 50))
    }
    return this.color[index]
  }
  // light color
  getPart2Color(index) {
    if (!this.color[index]) {
      this.color[index] = color(random(360), 12, random(80, 90))
    }
    return this.color[index]
  }
  // deep, high saturation
  getPart3Color(index) {
    if (!this.color[index]) {
      this.color[index] = color(random(360), 90, random(20, 50))
    }
    return this.color[index]
  }
  
  // Draw a group of darkest small circles in the center area
  createdCenterMiniEllipseGroup() {
    for (let i = 0; i < 9; i++) {
      fill(this.getPart2Color(i + 4))
      ellipse(0, 0, 140 - (i * 10), 140 - (i * 10))
    }
  }
  // Draw a group of light small circles in the center area
  createdCenterSmallEllipseGroup() {
    fill(this.getPart1Color(1))
    ellipse(0, 0, 54, 54)
    fill(this.getPart1Color(2))
    ellipse(0, 0, 36, 36)
    fill(this.getPart1Color(3))
    ellipse(0, 0, 24, 24)
  }
  // Draw a group of medium dark circles in the center area
  createdCnterMediumGroup() {
    fill(0, 0, 80)
    ellipse(0, 0, 240, 240)
    push()
    stroke(this.getPart3Color(13))
    strokeWeight(5);
    beginShape(POINTS);
    for (let a = 0; a < 360; a += 10) {
      for (let b = 5; b > 0; b--) {
      let angle = radians(a);
        vertex(cos(angle) * (124 - b * 10), sin(angle) * (124 - b * 10));
      }
    }
    endShape();
    pop()
  }
  // Draw the outer hexagon vertices and edges
  createdVertex() {

    let vertexPoints = {
      top: {},
      topLeft: {},
      bottomLeft: {},
      bottom: {},
      bottomRight: {},
      topRight: {},
    }
    vertexPoints.top.x = 0, vertexPoints.top.y = -this.H / 2
    vertexPoints.bottom.x = 0, vertexPoints.bottom.y = this.H / 2
    vertexPoints.topLeft.x = -this.W / 2, vertexPoints.topLeft.y = -this.H / 2 + 71
    vertexPoints.topRight.x = this.W / 2, vertexPoints.topRight.y = -this.H / 2 + 71
    vertexPoints.bottomLeft.x = -this.W / 2, vertexPoints.bottomLeft.y = this.H / 2 - 71
    vertexPoints.bottomRight.x = this.W / 2, vertexPoints.bottomRight.y = this.H / 2 - 71
    strokeWeight(4);
    stroke(27, 80, 91)
    noFill()
    beginShape();
    Object.values(vertexPoints).forEach(({ x, y }) => {
      vertex(x, y)
      push()
      noStroke()
      fill(256, 87, 52)
      ellipse(x, y, 28, 28)
      fill(0, 74, 70)
      ellipse(x, y, 18, 18)
      fill(227, 62, 26)
      ellipse(x, y, 12, 12)
      pop()
    });
    endShape(CLOSE);
    Object.values(vertexPoints).forEach(({ x, y }) => {
      push()
      noStroke()
      fill(256, 87, 52)
      ellipse(x, y, 28, 28)
      fill(0, 74, 70)
      ellipse(x, y, 18, 18)
      fill(227, 62, 26)
      ellipse(x, y, 12, 12)
      pop()
    });
  }
  // Modify the display function to utilize new variables
  display() {
    push();
    translate(this.x + this.W / 2 + 28, this.y + this.H / 2 + 28 + 11);
    rotate(this.rotation); // Apply rotation
    noStroke();
    this.createdCnterMediumGroup();
    scale(this.scaleFactor); // Apply scaling
    this.createdCenterMiniEllipseGroup();
    this.createdCenterSmallEllipseGroup();
    tint(255, this.alphaValue); // Apply opacity
    this.createdVertex();
    pop();
  }
}

// Obtain volume level within the draw function
function draw() {
  scale(scalePub);

  // Get the current volume (between 0 to 1)
  let level = amplitude.getLevel();

  // Fetch frequency domain data
  let spectrum = fft.analyze();

  // Choose a low-frequency energy (e.g., energy at index 10) to affect the background's Hue
  let lowFreqEnergy = spectrum[10];

  // Dynamically set background color using volume and frequency energy
  let hueValue = map(level, 0, 1, 0, 360); // Volume affects the color's hue
  let brightnessValue = map(lowFreqEnergy, 0, 255, 50, 90); // Low frequency affects the color's brightness

  // Apply the computed background color
  background(hueValue, 85, brightnessValue);

  // Render all hexagons
  graphicalList.forEach(item => {
    // Adjust graphical parameters based on volume levels
    item.scaleFactor = map(level, 0, 1, 0.5, 1.5); // Affect the size of the central small circle group
    item.alphaValue = map(level, 0, 1, 50, 255);   // Affect the opacity of the central medium dark circle group
    item.rotation = map(spectrum[10], 0, 255, 0, PI); // Rotate hexagon vertices based on low-frequency content
    item.display();
  });
}

function windowResized() {
  updateGraphicalList()
  resizeCanvas(windowWidth, windowHeight);
}


function updateGraphicalList() {
  // Calculate scaling ratio
  scalePub = map(windowWidth, 0, 1920, 0, 1)
  // Reset the collection
  graphicalList = []
  // Calculate how many rows of hexagons should be displayed based on the current page height
  let rowNum = ceil(windowHeight / 200 / scalePub)
  // Calculate how many columns and rows of hexagons should be displayed
  for (let i = 0; i < 9; i++) {
    for (let j = 0; j < rowNum; j++) {
      graphicalList.push(new Graphical(j % 2 ? (i * 250 -224) : (i * 250 - 100), j * 220 - 100))
    }
  }
}

// Add a user interaction event to start the audio
function mousePressed() {
  // If the audio is loaded and not already playing, then play the audio
  if (song.isLoaded() && !song.isPlaying()) {
    song.play();
    // Connect the input to the amplitude analyzer
    amplitude.setInput(song);
    amplitude.smooth(0.9);
    fft.setInput(song);
  }
}
