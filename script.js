const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

let speed = 120;
let tile = 20;

let snake = [{ x: 10, y: 10 }];
let food = randomFood();

let dx = 0, dy = 0;
let score = 0;

let highScore = localStorage.getItem("highScore") || 0;
document.getElementById("highScore").textContent = highScore;

let gameStarted = false;

document.addEventListener("keydown", keyPush);

function keyPush(e) {
  gameStarted = true;
  if (e.key === "ArrowUp" && dy === 0) { dx = 0; dy = -1; }
  if (e.key === "ArrowDown" && dy === 0) { dx = 0; dy = 1; }
  if (e.key === "ArrowLeft" && dx === 0) { dx = -1; dy = 0; }
  if (e.key === "ArrowRight" && dx === 0) { dx = 1; dy = 0; }
}

function randomFood() {
  return {
    x: Math.floor(Math.random() * (canvas.width / tile)),
    y: Math.floor(Math.random() * (canvas.height / tile))
  };
}

function updateScore() {
  document.getElementById("score").textContent = score;

  if (score > highScore) {
    highScore = score;
    localStorage.setItem("highScore", highScore);
    document.getElementById("highScore").textContent = highScore;
  }
}

function gameLoop() {
  if (!gameStarted) {
    draw();
    return setTimeout(gameLoop, speed);
  }

  // Move
  let head = { x: snake[0].x + dx, y: snake[0].y + dy };

  // Game Over
  if (
    head.x < 0 || head.x >= canvas.width / tile ||
    head.y < 0 || head.y >= canvas.height / tile ||
    snake.some(seg => seg.x === head.x && seg.y === head.y)
  ) {
    alert("Game Over!");
    location.reload();
    return;
  }

  snake.unshift(head);

  // Eat food
  if (head.x === food.x && head.y === food.y) {
    score++;
    updateScore();
    food = randomFood();
  } else {
    snake.pop();
  }

  draw();
  setTimeout(gameLoop, speed);
}

function draw() {
  ctx.fillStyle = "#000";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = "#00ff7f";
  snake.forEach(s =>
    ctx.fillRect(s.x * tile, s.y * tile, tile - 1, tile - 1)
  );

  ctx.fillStyle = "red";
  ctx.fillRect(food.x * tile, food.y * tile, tile - 1, tile - 1);
}

gameLoop();
