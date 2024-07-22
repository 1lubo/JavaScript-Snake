const boardBorder = 'black';
const boardBackground = 'white';
const snakeCol = 'lightblue';
const snakeBorder = 'darkblue';

let score = 0;
let foodX;
let foodY;
// True if changing direction
let changingDirection = false;
// Horizontal velocity
let dx = 10;
// Vertical velocity
let dy = 10;

let snake = [
    {x: 100, y: 100},
    {x: 90, y: 100},
    {x: 80, y: 100},
    {x: 70, y: 100},
    {x: 60, y: 100}
];

// Get canvas element
const snakeBoard = document.getElementById("gameBoard");
// Return a two-dimensional drawing context
const snakeBoardCtx = snakeBoard.getContext("2d");
// Start game
main();

generateFood();

document.addEventListener("keydown", changeDirection);

// main function
function main() {
    if (hasGameEnded()) return;

    changingDirection = false;
    setTimeout(function onTick() {
        clearCanvas();
        drawFood()
        moveSnake();
        drawSnake();
        // Repeat
        main();
    }, 100)
}

function clearCanvas() {
    // Select the colour to fill the drawing
    snakeBoardCtx.fillStyle = boardBackground;
    // Select the colour for the border of the canvas
    snakeBoardCtx.strokeStyle = boardBorder;
    // Draw a "filled" rectangle to cover the entire canvas
    snakeBoardCtx.fillRect(0, 0, snakeBoard.width, snakeBoard.height);
    // Draw a "border" around the entire canvas
    snakeBoardCtx.strokeRect(0, 0, snakeBoard.width, snakeBoard.height);
}

// Draw one snake part
function drawSnakePart (snakePart) {
    // Set the colour of the snake part
    snakeBoardCtx.fillStyle = snakeCol;
    // Set the border colour of the snake part
    snakeBoardCtx.strokeStyle = snakeBorder;
    //Draw a "filled" rectangle to represent the snake part at the coordinates the part is located
    snakeBoardCtx.fillRect(snakePart.x, snakePart.y, 10, 10);
    // Draw a border around the snake part
    snakeBoardCtx.strokeRect(snakePart.x, snakePart.y, 10, 10);
}

function drawSnake(){
    snake.forEach(drawSnakePart);
}

function moveSnake() {
    // Create a new Snake's head
    const head = {x: snake[0].x + dx, y: snake[0].y + dy};
    // Add the new head to the beginning of the snake body
    snake.unshift(head);
    const hasEatenFood = snake[0].x === foodX && snake[0].y === foodY;
    if (hasEatenFood) {
        // Increase score
        score += 10
        // Display score on screen
        document.getElementById("score").innerHTML = score;
        // Generate new food location item
        generateFood()
    } else {
        // Remove the last part of the body
        snake.pop();
    }
}

function changeDirection(event) {
    const LEFT_KEY = 37;
    const RIGHT_KEY = 39;
    const UP_KEY = 38;
    const DOWN_KEY = 40;

    // Prevent snake from reversing
    if (changingDirection) return;
    changingDirection = true;
    const keyPressed = event.keyCode;
    const goingUp = dy === -10;
    const goingDown = dy === 10;
    const goingRight = dx === 10;
    const goingLeft = dx === -10;

    if (keyPressed === LEFT_KEY && !goingRight) {
        dx = -10;
        dy = 0;
    }

    if (keyPressed === UP_KEY && !goingDown) {
        dx = 0;
        dy = -10;
    }

    if (keyPressed === RIGHT_KEY && !goingLeft) {
        dx = 10;
        dy = 0;
    }

    if (keyPressed === DOWN_KEY && !goingUp) {
        dx = 0;
        dy = 10;
    }
}

function hasGameEnded() {
    for (let i = 4; i < snake.length; i++) {
        const has_collided = snake[i].x === snake[0].x && snake[i].y === snake[0].y
        if (has_collided)
            return true
    }

    const hitLeftWall = snake[0].x < 0;
    const hitRightWall = snake[0].x > snakeBoard.width - 10;
    const hitTopWall = snake[0].y < 0;
    const hitBottomWall = snake[0].y > snakeBoard.height - 10;

    return hitLeftWall || hitRightWall || hitTopWall || hitBottomWall
}

function randomFood (min, max){
    return Math.round((Math.random() * (max - min) + min) / 10) * 10;
}

function generateFood() {
    foodX = randomFood(0, snakeBoard.width - 10);
    foodY = randomFood(0, snakeBoard.height - 10);

    snake.forEach(function hasSnakeEatenFood(part) {
        const hasEaten = part.x == foodX && part.y == foodY;
        if (hasEaten) generateFood();
    })
}

function drawFood() {
    snakeBoardCtx.fillStyle = 'lightgreen';
    snakeBoardCtx.strokeStyle = 'darkgreen';
    snakeBoardCtx.fillRect(foodX, foodY, 10, 10);
    snakeBoardCtx.strokeRect(foodX, foodY, 10, 10);
}