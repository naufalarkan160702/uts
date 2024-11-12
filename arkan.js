const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const boxSize = 20;
const canvasSize = 400;
let snake = [{ x: 200, y: 200 }];
let direction = { x: boxSize, y: 0 };
let food = { x: getRandomCoordinate(), y: getRandomCoordinate() };
let score = 0;

document.addEventListener("keydown", changeDirection);

function changeDirection(event) {
    const key = event.keyCode;
    if (key === 37 && direction.x === 0) direction = { x: -boxSize, y: 0 }; // Kiri
    if (key === 38 && direction.y === 0) direction = { x: 0, y: -boxSize }; // Atas
    if (key === 39 && direction.x === 0) direction = { x: boxSize, y: 0 };  // Kanan
    if (key === 40 && direction.y === 0) direction = { x: 0, y: boxSize };  // Bawah
}

function gameLoop() {
    const head = { x: snake[0].x + direction.x, y: snake[0].y + direction.y };

    // Game over conditions
    if (head.x < 0 || head.y < 0 || head.x >= canvasSize || head.y >= canvasSize || isCollision(head)) {
        alert("Game Over! Score: " + score);
        document.location.reload();
        return;
    }

    // Check if snake eats the food
    if (head.x === food.x && head.y === food.y) {
        score++;
        document.getElementById("score").innerText = score;
        food = { x: getRandomCoordinate(), y: getRandomCoordinate() };
    } else {
        snake.pop();
    }

    snake.unshift(head);
    drawGame();
}

function drawGame() {
    ctx.clearRect(0, 0, canvasSize, canvasSize);}