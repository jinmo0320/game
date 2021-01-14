const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");
const btn = document.querySelector("button");
const score = document.querySelector("#score");
const result = document.querySelector("#result");
const alert = document.querySelector("#alert");
canvas.width = innerWidth;
canvas.height = innerHeight;
addEventListener("resize", () => {
  canvas.width = innerWidth;
  canvas.height = innerHeight;
  init();
});

function getDis(x1, y1, x2, y2) {
  return Math.sqrt(Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2));
}

class Rect {
  constructor(x, y, size) {
    this.x = x;
    this.y = y;
    this.size = size;
    this.vy = -50;
  }
  draw() {
    ctx.fillStyle = "#e74c3c";
    ctx.fillRect(this.x, this.y, this.size, this.size);
  }
  update() {
    this.y += this.vy;
    if (this.y + this.size + this.vy > landY) {
      this.vy *= 0;
    } else {
      this.vy += 4;
    }
    this.draw();
  }
}

class Land {
  constructor(x, y, w, h) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
  }
  draw() {
    var grd = ctx.createLinearGradient(this.x, this.y, this.x, this.y + this.h);
    grd.addColorStop(0, "#84BF04");
    grd.addColorStop(1, "#2E5902");
    ctx.fillStyle = grd;
    ctx.fillRect(this.x, this.y, this.w, this.h);
  }
}

class Obstacle {
  constructor(x, y, w, h) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.vx = 10;
  }
  draw() {
    ctx.fillStyle = "#2c3e50";
    ctx.fillRect(this.x, this.y, this.w, this.h);
  }
  update() {
    this.x -= this.vx;
    if (this.x + this.w < 0) {
      this.x = canvas.width;
      this.w = Math.floor(Math.random() * 80 + 20);
      this.h = Math.floor(Math.random() * 100 + 100);
      this.y = landY - this.h;
    }
    if (timerId % 500 === 0) {
      this.vx += 5;
      alert.style.display = "block";
      setTimeout(() => {
        alert.style.display = "none";
      }, 3000);
    }
    this.draw();
  }
}

class Particle {
  constructor(x, y, size) {
    this.x = x;
    this.y = y;
    this.size = size;
  }
  draw() {
    ctx.fillStyle = "white";
    ctx.fillRect(this.x, this.y, this.size, this.size);
  }
  update() {
    this.x -= 5;
    if (this.x + this.size < 0) {
      this.x = canvas.width;
      this.y = Math.floor(Math.random() * (canvas.height / 2 - 10 + 1)) + 10;
    }
    this.draw();
  }
}

let rect;
let land;
let obstacle;
let particles;
const size = 70;
const landHeight = 150;
const landY = canvas.height - landHeight;
const obHeight = 200;

function init() {
  rect = new Rect(size + 100, landY - size, size);
  land = new Land(0, landY, canvas.width, landHeight);
  obstacle = new Obstacle(canvas.width, landY - obHeight, 50, obHeight);
  particles = [];
  for (let i = 0; i < 50; i++) {
    let x = Math.floor(Math.random() * (canvas.width - 10) + 10);
    let y = Math.floor(Math.random() * (canvas.height / 1.5 - 10 + 1)) + 10;
    particles.push(new Particle(x, y, 5));
  }
}
let timerId;
function animate() {
  timerId = requestAnimationFrame(animate);
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  for (let i = 0; i < particles.length; i++) {
    particles[i].update();
  }
  rect.update();
  land.draw();
  obstacle.update();
  check();

  score.innerHTML = `${timerId}`;
  result.innerHTML = `score: ${score.innerHTML}`;
}

function check() {
  if (
    (rect.x + rect.size > obstacle.x &&
      rect.x + rect.size < obstacle.x + obstacle.w &&
      rect.y + rect.size > obstacle.y) ||
    (rect.x > obstacle.x &&
      rect.x < obstacle.x + obstacle.w &&
      rect.y + rect.size > obstacle.y)
  ) {
    btn.addEventListener("click", () => {
      window.location.reload();
    });
    addEventListener("keypress", (event) => {
      if (event.code === "Space") {
        window.location.reload();
      }
    });
    cancelAnimationFrame(timerId);
    btn.style.display = "block";
    result.style.display = "block";
  }
}

function rectInit() {
  rect = new Rect(size + 100, landY - size, size);
}
addEventListener("keyup", (event) => {
  if (event.code === "Space" && rect.vy === 0) {
    rectInit();
  }
});

init();
animate();
