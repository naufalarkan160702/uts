// game.js
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const boxSize = 20;
let snake = [{ x: 9 * boxSize, y: 10 * boxSize }];
let direction = "RIGHT";
let score = 0;

let food = {
    x: Math.floor(Math.random() * 19) * boxSize,
    y: Math.floor(Math.random() * 19) * boxSize
};

document.addEventListener("keydown", setDirection);

function setDirection(event) {
    if (event.key === "ArrowUp" && direction !== "DOWN") direction = "UP";
    else if (event.key === "ArrowDown" && direction !== "UP") direction = "DOWN";
    else if (event.key === "ArrowLeft" && direction !== "RIGHT") direction = "LEFT";
    else if (event.key === "ArrowRight" && direction !== "LEFT") direction = "RIGHT";
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw snake
    for (let i = 0; i < snake.length; i++) {
        ctx.fillStyle = i === 0 ? "green" : "white";
        ctx.fillRect(snake[i].x, snake[i].y, boxSize, boxSize);
    }

    // Draw food
    ctx.fillStyle = "red";
    ctx.fillRect(food.x, food.y, boxSize, boxSize);

    // Move snake
    let snakeX = snake[0].x;
    let snakeY = snake[0].y;

    if (direction === "UP") snakeY -= boxSize;
    if (direction === "DOWN") snakeY += boxSize;
    if (direction === "LEFT") snakeX -= boxSize;
    if (direction === "RIGHT") snakeX += boxSize;

    // Check if snake eats food
    if (snakeX === food.x && snakeY === food.y) {
        score++;
        document.getElementById("score").textContent = score;
        food = {
            x: Math.floor(Math.random() * 19) * boxSize,
            y: Math.floor(Math.random() * 19) * boxSize
        };
    } else {
        snake.pop();
    }

    // New head
    let newHead = { x: snakeX, y: snakeY };

    // Game over conditions
    if (snakeX < 0 || snakeY < 0 || snakeX >= canvas.width || snakeY >= canvas.height || collision(newHead, snake)) {
        clearInterval(game);
        submitScore();
    }

    snake.unshift(newHead);
}

// Collision detection
function collision(head, array) {
    for (let i = 0; i < array.length; i++) {
        if (head.x === array[i].x && head.y === array[i].y) {
            return true;
        }
    }
    return false;
}

// Submit score to PHP server
function submitScore() {
    fetch("submit_score.php", {
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded"
        },
        body: `score=${score}`
    })
    .then(response => response.text())
    .then(data => {
        console.log("Score submitted:", data);
        alert(`Game Over! Your score: ${score}`);
        score = 0;
        document.getElementById("score").textContent = score;
        snake = [{ x: 9 * boxSize, y: 10 * boxSize }];
        direction = "RIGHT";
        food = {
            x: Math.floor(Math.random() * 19) * boxSize,
            y: Math.floor(Math.random() * 19) * boxSize
        };
        game = setInterval(draw, 100);
    })
    .catch(error => console.error("Error submitting score:", error));
}

let game = setInterval(draw, 100);
