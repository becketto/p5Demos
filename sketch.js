let circleY = 0;
let circleSpeed = 2;

function setup() {
  createCanvas(400, 400);
}

function draw() {
  background(220);

  // Draw the circle
  fill(255, 0, 0);
  circle(width / 2, circleY, 50);

  // Update the circle's position
  circleY += circleSpeed;

  // Reset the circle's position if it goes beyond the canvas
  if (circleY > height + 25) {
    circleY = -25;
  }
}