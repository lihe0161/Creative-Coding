// Collection of individual hexagon instances
let graphicalList = [];
// Global scaling factor
let scalePub = 1;

function setup() {
  createCanvas(windowWidth, windowHeight);
  colorMode(HSB, 360, 100, 100);
  updateGraphicalList();
}

class Graphical {
  constructor(x = 0, y = 0) {
    this.W = 250; // Width
    this.H = 290; // Height
    this.x = x; // X coordinate
    this.y = y; // Y coordinate
    this.color = {}; // Object for storing colors
  }
  // Randomly chosen deeper shades
  getPart1Color(index) {
    if (!this.color[index]) {
      this.color[index] = color(random(360), 90, random(20, 50));
    }
    return this.color[index];
  }
  // Randomly chosen lighter shades
  getPart2Color(index) {
    if (!this.color[index]) {
      this.color[index] = color(random(360), 12, random(80, 90));
    }
    return this.color[index];
  }
  // Random but deeper with higher saturation
  getPart3Color(index) {
    if (!this.color[index]) {
      this.color[index] = color(random(360), 90, random(20, 50));
    }
    return this.color[index];
  }
  
  // Drawing the central area's dark mini-circle group
  createdCenterMiniEllipseGroup() {
    for (let i = 0; i < 9; i++) {
      fill(this.getPart2Color(i + 4));
      ellipse(0, 0, 140 - (i * 10), 140 - (i * 10));
    }
  }
  // Drawing the central area's light small-circle group
  createdCenterSmallEllipseGroup() {
    fill(this.getPart1Color(1));
    ellipse(0, 0, 54, 54);
    fill(this.getPart1Color(2));
    ellipse(0, 0, 36, 36);
    fill(this.getPart1Color(3));
    ellipse(0, 0, 24, 24);
  }
  // Drawing the central area's medium dark-circle group
  createdCnterMediumGroup() {
    fill(0, 0, 100);
    ellipse(0, 0, 240, 240);
    push();
    stroke(this.getPart3Color(13));
    strokeWeight(5);
    beginShape(POINTS);
    for (let a = 0; a < 360; a += 10) {
      for (let b = 5; b > 0; b--) {
        let angle = radians(a);
        vertex(cos(angle) * (124 - b * 10), sin(angle) * (124 - b * 10));
      }
    }
    endShape();
    pop();
  }
  // Drawing the outermost hexagon vertices and edges
  createdVertex() {

    let vertexPoints = {
      top: {},
      topLeft: {},
      bottomLeft: {},
      bottom: {},
      bottomRight: {},
      topRight: {},
    };
    // Setting vertex positions
    vertexPoints.top.x = 0, vertexPoints.top.y = -this.H / 2;
    vertexPoints.bottom.x = 0, vertexPoints.bottom.y = this.H / 2;
    vertexPoints.topLeft.x = -this.W / 2, vertexPoints.topLeft.y = -this.H / 2 + 71;
    vertexPoints.topRight.x = this.W / 2, vertexPoints.topRight.y = -this.H / 2 + 71;
    vertexPoints.bottomLeft.x = -this.W / 2, vertexPoints.bottomLeft.y = this.H / 2 - 71;
    vertexPoints.bottomRight.x = this.W / 2, vertexPoints.bottomRight.y = this.H / 2 - 71;
    // Drawing vertices
    strokeWeight(4);
    stroke(27, 80, 91);
    noFill();
    beginShape();
    Object.values(vertexPoints).forEach(({ x, y }) => {
      vertex(x, y);
      push();
      noStroke();
      fill(256, 87, 52);
      ellipse(x, y, 28, 28);
      fill(0, 74, 70);
      ellipse(x, y, 18, 18);
      fill(227, 62, 26);
      ellipse(x, y, 12, 12);
      pop();
    });
    endShape(CLOSE);
  }
  display() {
    push();
    translate(this.x + this.W / 2 + 28, this.y + this.H / 2 + 28 + 11);
    noStroke();
    this.createdCnterMediumGroup();
    this.createdCenterMiniEllipseGroup();
    this.createdCenterSmallEllipseGroup();
    this.createdVertex();
    pop();
  }
}

function draw() {
  scale(scalePub);
  background(198, 85, 62);
  // Rendering all hexagons
  graphicalList.forEach(item => {
    item.display();
  });
}

function windowResized() {
  updateGraphicalList();
  resizeCanvas(windowWidth, windowHeight);
}

function updateGraphicalList() {
  // Calculate the scaling factor
  scalePub = map(windowWidth, 0, 1920, 0, 1);
  // Resetting the collection
  graphicalList = [];
  // Calculating how many rows of hexagons to display based on the current window height
  let rowNum = ceil(windowHeight / 200 / scalePub);
  // Calculating how many columns and rows of hexagons should be displayed
  for (let i = 0; i < 9; i++) {
    for (let j = 0; j < rowNum; j++) {
      graphicalList.push(new Graphical(j % 2 ? (i * 250 - 224) : (i * 250 - 100), j * 220 - 100));
    }
  }
}
