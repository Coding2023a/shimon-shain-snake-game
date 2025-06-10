const board = document.getElementById('game-board')

const boardWidth = 20, boardHeight = 20, speed = 200;

let snake = [{x: 10, y: 10}];

let direction = 'right';

let food;

let score = 0;

let highScore = localStorage.getItem('snakeHighScore') || 0;

let gameLoop;

const updateScore = () => {
    document.getElementById('score').innerText = `Score: ${score}`;
    document.getElementById('high-score').innerText = `High Score: ${highScore}`;
}

const updateHighScore = () => {
    if (score > highScore)
        localStorage.setItem('snakeHighScore', highScore = score);
};

const generateFood = () => ({
    x: Math.floor(Math.random() * boardWidth),
    y: Math.floor(Math.random() * boardHeight)
});

const clearElements = className => {
    document.querySelectorAll(`.${className}`).forEach(el => el.remove())
}

const drawElements = (items, className) => {
    items.forEach(({x, y}) => {
    const el = document.createElement('div');
    el.style.gridColumn = x + 1;
    el.style.gridRow = y + 1;
    el.classList.add(className);
    board.appendChild(el);
    });
};

const drawFood = () => {
    clearElements('food');
    drawElements([food], 'food');
};

const drawSnake = () => {
    clearElements('snake');
    drawElements(snake, 'snake');
}

const restartGame = () => {
    snake = [{ x: 10, y: 10 }];
    direction = 'right';
    score = 0;
    food = generateFood();
    updateScore();
    clearElements('snake');
    drawFood();
    clearInterval(gameLoop);
    gameLoop = setInterval(moveSnake, speed);
};

const moveSnake = () => {
    const head = { ...snake[0] };
    const moves = {
        up: () => head.y--,
        down: () => head.y++,
        left: () => head.x--,
        right: () => head.x++
    };
    moves[direction]();

    const hitWall = head.x < 0 || Headers.x >= boardWidth
    || head.y < 0 || head.y >= boardHeight;
    const hitSelf = snake.some(segment => segment.x ===
        head.x && segment === head.y);

        if (hitWall || hitSelf) {
            clearInterval(gameLoop);
            updateHighScore();
            alert('Game Over!');
            return;
        }

        snake.unshift(head);

        if (head.x === food.x && head.y === food.y) {
        score++;
        updateHighScore();
        food = generateFood();
        drawFood();
    } else {
         snake.pop();   
        }

        updateScore();
        drawSnake();
};

const changeDirection = (event) => {
    const { key } = event;
    if (key.toLowerCase() === 'r') return restartGame();
    const opposites = { ArrowUp: 'down', ArrowDown: 'up', ArrowLeft: 'right', ArrowRight: 'left'};
    if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(key)) {
        if (['ArrowUp', 'ArrowDown'].includes(key)) event.preventDefault();
        if (direction !== opposites[key]) direction = key.replace('Arrow', '')
            .toLowerCase();
    }
}

food = generateFood();
drawFood();
drawSnake();
gameLoop = setInterval(moveSnake, speed);

document.addEventListener('keydown', changeDirection)