document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('gameCanvas');
    const ctx = canvas.getContext('2d');
    const scoreElement = document.getElementById('score');
    const gameOverScreen = document.getElementById('gameOver');
    const finalScoreElement = document.getElementById('finalScore');
    const restartButton = document.getElementById('restartButton');

    const gridSize = 20;
    let snake = [{ x: 10, y: 10 }];
    let food = {};
    let direction = 'right';
    let score = 0;
    let speed = 150; // Milliseconds, lower is faster
    let gameInterval;
    let isGameOver = false;

    function generateFood() {
        food = {
            x: Math.floor(Math.random() * (canvas.width / gridSize)),
            y: Math.floor(Math.random() * (canvas.height / gridSize))
        };
        // Ensure food doesn't spawn on the snake
        for (let segment of snake) {
            if (segment.x === food.x && segment.y === food.y) {
                generateFood();
                return;
            }
        }
    }

    function draw() {
        // Clear canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Draw snake
        snake.forEach((segment, index) => {
            ctx.fillStyle = index === 0 ? '#d81b60' : '#ff4081'; // Head is darker pink
            ctx.fillRect(segment.x * gridSize, segment.y * gridSize, gridSize, gridSize);
            ctx.strokeStyle = '#fce4ec'; // Light pink outline for segments
            ctx.strokeRect(segment.x * gridSize, segment.y * gridSize, gridSize, gridSize);
        });

        // Draw food (apple)
        ctx.fillStyle = '#4CAF50'; // Green for the apple
        ctx.strokeStyle = '#388E3C'; // Darker green outline
        ctx.beginPath();
        ctx.arc(food.x * gridSize + gridSize / 2, food.y * gridSize + gridSize / 2, gridSize / 2, 0, 2 * Math.PI);
        ctx.fill();
        ctx.stroke();
    }

    function update() {
        if (isGameOver) return;

        const head = { ...snake[0] }; // Copy head

        // Move head
        switch (direction) {
            case 'up': head.y -= 1; break;
            case 'down': head.y += 1; break;
            case 'left': head.x -= 1; break;
            case 'right': head.x += 1; break;
        }

        // Check for wall collision
        if (head.x < 0 || head.x >= canvas.width / gridSize || head.y < 0 || head.y >= canvas.height / gridSize) {
            return gameOver();
        }

        // Check for self collision
        for (let i = 1; i < snake.length; i++) {
            if (head.x === snake[i].x && head.y === snake[i].y) {
                return gameOver();
            }
        }

        snake.unshift(head); // Add new head

        // Check for food collision
        if (head.x === food.x && head.y === food.y) {
            score++;
            scoreElement.textContent = score;
            generateFood();
        } else {
            snake.pop(); // Remove tail
        }

        draw();
    }

    function changeDirection(event) {
        const keyPressed = event.key;
        const goingUp = direction === 'up';
        const goingDown = direction === 'down';
        const goingLeft = direction === 'left';
        const goingRight = direction === 'right';

        if (keyPressed === 'ArrowUp' && !goingDown) direction = 'up';
        if (keyPressed === 'ArrowDown' && !goingUp) direction = 'down';
        if (keyPressed === 'ArrowLeft' && !goingRight) direction = 'left';
        if (keyPressed === 'ArrowRight' && !goingLeft) direction = 'right';
    }
    
    function gameOver() {
        isGameOver = true;
        clearInterval(gameInterval);
        gameOverScreen.classList.remove('hidden');
        finalScoreElement.textContent = score;
    }

    function startGame() {
        isGameOver = false;
        snake = [{ x: 10, y: 10 }];
        direction = 'right';
        score = 0;
        scoreElement.textContent = score;
        gameOverScreen.classList.add('hidden');
        generateFood();
        gameInterval = setInterval(update, speed);
    }
    
    document.addEventListener('keydown', changeDirection);
    restartButton.addEventListener('click', startGame);
    
    startGame();
});