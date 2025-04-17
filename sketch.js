let gridSize = 2;
let shapes = [];
let secondLayerActive = false;
let secondLayerOrientation = 0; 
let toggleButton, cycleButton;

function setup() {
  // compute square side = min(left-half width, full height)
  const w = windowWidth / 2.5;
  const h = windowHeight;
  const s = min(w, h);

  // create the canvas inside #canvas-container
  const cnv = createCanvas(s, s);
  cnv.parent('canvas-container');

  ellipseMode(CORNER);
  frameRate(3);

  // init 2×2 grid
  for (let y = 0; y < gridSize; y++) {
    shapes[y] = [];
    for (let x = 0; x < gridSize; x++) {
      shapes[y][x] = floor(random(3));
    }
  }

  // add control buttons (they'll be appended to canvas-container)
  toggleButton = createButton('Toggle Overlay');
  toggleButton.parent('canvas-container');
  toggleButton.position(10, 10);
  toggleButton.mousePressed(() => {
    secondLayerActive = !secondLayerActive;
  });

  cycleButton = createButton('Switch');
  cycleButton.parent('canvas-container');
  cycleButton.position(150, 10);
  cycleButton.mousePressed(() => {
    secondLayerOrientation = (secondLayerOrientation + 1) % 4;
  });
}

function draw() {
  background(255);

  // draw 2×2 blue shapes
  let d = width / gridSize;
  noStroke();
  fill(0, 0, 255);
  for (let y = 0; y < gridSize; y++) {
    for (let x = 0; x < gridSize; x++) {
      let px = x * d, py = y * d;
      let s = shapes[y][x];
      if (s === 0)      circle(px, py, d);
      else if (s === 1) square(px, py, d);
      else              triangle(px, py, px + d, py + d, px, py + d);
    }
  }

  // draw inset‐stroke triangle overlay if active
  if (secondLayerActive) {
    stroke(0, 0, 255);
    noFill();
    let sw = 30;
    strokeWeight(sw);

    // define the 4 corners of this square
    let TL = { x: 0,    y: 0    };
    let TR = { x: width, y: 0    };
    let BR = { x: width, y: height };
    let BL = { x: 0,    y: height };

    switch (secondLayerOrientation) {
      case 0: drawInsetTriangle(TL, BR, BL, sw); break;
      case 1: drawInsetTriangle(TL, TR, BR, sw); break;
      case 2: drawInsetTriangle(TR, BR, BL, sw); break;
      case 3: drawInsetTriangle(TL, TR, BL, sw); break;
    }
  }

 
}

function mousePressed() {
  // cycle blue cell under the mouse
  let d = width / gridSize;
  let xi = floor(mouseX / d), yi = floor(mouseY / d);
  if (xi >= 0 && xi < gridSize && yi >= 0 && yi < gridSize) {
    shapes[yi][xi] = (shapes[yi][xi] + 1) % 3;
  }
}

function windowResized() {
  // keep left canvas square as window changes
  const w = windowWidth / 2;
  const h = windowHeight;
  const s = min(w, h);
  resizeCanvas(s, s);
}

// inset‐stroke triangle helper
function drawInsetTriangle(a, b, c, sw) {
  let cx = (a.x + b.x + c.x) / 3;
  let cy = (a.y + b.y + c.y) / 3;
  function inset(pt) {
    let d = dist(pt.x, pt.y, cx, cy);
    if (d < sw/2) return { x: cx, y: cy };
    let r = (d - sw/2) / d;
    return { x: cx + (pt.x - cx)*r, y: cy + (pt.y - cy)*r };
  }
  let p1 = inset(a), p2 = inset(b), p3 = inset(c);
  triangle(p1.x,p1.y, p2.x,p2.y, p3.x,p3.y);
}
