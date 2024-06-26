class Circle {
    constructor(x, y, radius, speedX, speedY, density, forceRadius) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.speedX = speedX;
        this.speedY = speedY;
        this.density = density;
        this.mass = density * Math.PI * radius * radius;
        this.forceRadius = forceRadius;
    }

    update() {

        this.x += this.speedX;
        this.y += this.speedY;
        this.speedY += 0.25;

        if (this.x <= this.radius || this.x >= width - this.radius) {
            this.speedX = -this.speedX * 0.8;
            this.x = Math.max(this.radius, Math.min(this.x, width - this.radius));
        }

        if (this.y >= height - this.radius) {
            this.y = height - this.radius;
            if (this.speedY > 1.5) {
                this.speedY = -this.speedY * 0.4;
            }
        }
    }

    draw() {
        fill(0, 8, 255);
        circle(this.x, this.y, this.radius * 2);
    }

    applyForce(other) {
        let distance = dist(this.x, this.y, other.x, other.y);
        if (distance < this.forceRadius + other.forceRadius) {
            let maxForceStrength = 2; // Set the maximum force strength
            let maxSpeed = 2; // Set the maximum speed

            let forceStrength = (1 / distance) * 20;
            forceStrength = min(forceStrength, maxForceStrength);
            let forceX = (this.x - other.x) * forceStrength;
            let forceY = (this.y - other.y) * forceStrength;

            let newSpeedX = this.speedX + forceX / this.mass;
            let newSpeedY = this.speedY + forceY / this.mass;
            let newSpeed = sqrt(newSpeedX * newSpeedX + newSpeedY * newSpeedY);

            if (newSpeed > maxSpeed) {
                let ratio = maxSpeed / newSpeed;
                newSpeedX *= ratio;
                newSpeedY *= ratio;
            }

            this.speedX = newSpeedX;
            this.speedY = newSpeedY;

            newSpeedX = other.speedX - forceX / other.mass;
            newSpeedY = other.speedY - forceY / other.mass;
            newSpeed = sqrt(newSpeedX * newSpeedX + newSpeedY * newSpeedY);

            if (newSpeed > maxSpeed) {
                let ratio = maxSpeed / newSpeed;
                newSpeedX *= ratio;
                newSpeedY *= ratio;
            }

            other.speedX = newSpeedX;
            other.speedY = newSpeedY;
        }
    }
}

let circles = [];

//initializes circles, add corresponding values
function setup() {
    createCanvas(900, 600);
    let numBalls = 500;

    for (let i = 0; i < numBalls; i++) {
        let x = random(50, width - 50);
        let y = random(50, height - 50);
        let radius = 3;
        // let speedX = random(-.5, .5);
        let speedX = 0;
        let speedY = random(-.5, .5);
        let density = 1;
        let forceRadius = 7

        let newCircle = new Circle(x, y, radius, speedX, speedY, density, forceRadius);

        // Check for overlaps with existing balls
        for (let j = 0; j < circles.length; j++) {
            checkOverlap(newCircle, circles[j]);
        }

        circles.push(newCircle);
    }
}

function checkOverlap(circle1, circle2) {
    let distance = dist(circle1.x, circle1.y, circle2.x, circle2.y);
    if (distance < circle1.radius + circle2.radius) {
        // Balls are overlapping, calculate the displacement vector
        let dx = circle2.x - circle1.x;
        let dy = circle2.y - circle1.y;
        let angle = atan2(dy, dx);
        let overlapDistance = circle1.radius + circle2.radius - distance;

        // Displace the balls along the displacement vector
        let displaceX = cos(angle) * overlapDistance;
        let displaceY = sin(angle) * overlapDistance;
        circle1.x -= displaceX;
        circle1.y -= displaceY;
        circle2.x += displaceX;
        circle2.y += displaceY;
    }
}

function draw() {
    background(220);
    for (let i = 0; i < circles.length; i++) {
        for (let j = i + 1; j < circles.length; j++) {
            // circles[i].checkCollision(circles[j]);
            circles[i].applyForce(circles[j]);
            checkOverlap(circles[i], circles[j]);
        }
        circles[i].update();
        circles[i].draw();
        // displayVariables(circles[i], i);
    }
    let fps = frameRate();
    fill(0);
    textAlign(LEFT, TOP);
    textSize(16);
    text("FPS: " + fps.toFixed(2), 10, 10);
}

function displayVariables(circle, index) {
    let xPos = width - 150;
    let yPos = 50 + index * 100;

    textSize(16);
    fill(0);
    text(`Circle ${index + 1}`, xPos, yPos);
    text(`X: ${circle.x.toFixed(2)}`, xPos, yPos + 20);
    text(`Y: ${circle.y.toFixed(2)}`, xPos, yPos + 40);
    text(`Speed X: ${circle.speedX.toFixed(2)}`, xPos, yPos + 60);
    text(`Speed Y: ${circle.speedY.toFixed(2)}`, xPos, yPos + 80);
}