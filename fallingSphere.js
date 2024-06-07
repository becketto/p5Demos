class Circle {
    constructor(x, y, radius, speedX, speedY, density) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.speedX = speedX;
        this.speedY = speedY;
        this.density = density;
        this.mass = density * Math.PI * radius * radius;
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
            this.speedY = -this.speedY * 0.8;
        }
    }

    draw() {
        fill(255, 0, 0);
        circle(this.x, this.y, this.radius * 2);
    }


    //update this for vector

    /*
    Logic for collision vector: each circle has speed x, speed y (no mass yet). If collision, swap speeds
    Adding mass: Get the ratio of the circles, multiply speed by ratio
    */

    checkCollision(other) {
        let distance = dist(this.x, this.y, other.x, other.y);
        if (distance <= this.radius + other.radius) {
            // Collision detected

            // Calculate the normal vector between the circles
            let nx = (other.x - this.x) / distance;
            let ny = (other.y - this.y) / distance;

            // Calculate the tangent vector
            let tx = -ny;
            let ty = nx;

            // Calculate the dot products
            let dpTan1 = this.speedX * tx + this.speedY * ty;
            let dpTan2 = other.speedX * tx + other.speedY * ty;

            let dpNorm1 = this.speedX * nx + this.speedY * ny;
            let dpNorm2 = other.speedX * nx + other.speedY * ny;

            // Calculate the new normal velocities
            let m1 = (dpNorm1 * (this.mass - other.mass) + 2 * other.mass * dpNorm2) / (this.mass + other.mass);
            let m2 = (dpNorm2 * (other.mass - this.mass) + 2 * this.mass * dpNorm1) / (this.mass + other.mass);

            // Update the velocities
            this.speedX = tx * dpTan1 + nx * m1;
            this.speedY = ty * dpTan1 + ny * m1;
            other.speedX = tx * dpTan2 + nx * m2;
            other.speedY = ty * dpTan2 + ny * m2;
        }
    }
}

let circles = [];

//initializes circles, add corresponding values
function setup() {
    createCanvas(600, 600);
    circles.push(new Circle(200, 250, 25, 2, 0, 1));
    circles.push(new Circle(400, 350, 40, -1.5, 0, 0.5));
    circles.push(new Circle(500, 350, 10, -1.5, 0, 0.5));
}

function draw() {
    background(220);
    for (let i = 0; i < circles.length; i++) {
        for (let j = i + 1; j < circles.length; j++) {
            circles[i].checkCollision(circles[j]);
        }
        circles[i].update();
        circles[i].draw();
        displayVariables(circles[i], i);
    }
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