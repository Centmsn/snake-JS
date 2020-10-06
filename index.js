let snake = [1, 2, 3, 4, 5];
let direction = "right";
let gameId = "";
let score = 0;
let gameSpeed = 250;
const startBtn = document.querySelector(".button");
const gameTiles = document.querySelectorAll(".game-container__tile");

const endGame = () => {
  document.querySelector(".game-result__info").textContent = "Game over!";
  startBtn.removeAttribute("disabled");
  gameTiles.forEach((tile) => {
    tile.classList.remove("apple");
  });
};

const updateScore = () => {
  const food = parseInt(document.querySelector("#food").value);
  switch (food) {
    case 1:
      score++;
      break;
    case 2:
      score += 3;
      break;
    case 3:
      score += 5;
      break;
  }
  document.querySelector(".game-result__number").textContent = score;
};

const drawSnake = () => {
  gameTiles.forEach((tile, index) => {
    tile.classList.remove("snake");
    if (snake.includes(index)) {
      tile.classList.add("snake");
    }
  });
};

const drawApple = () => {
  let randomTile = "";
  do {
    randomTile = Math.floor(Math.random() * 100);
  } while (gameTiles[randomTile].classList.contains("snake"));

  gameTiles[randomTile].classList.add("apple");
};

const expandSnake = () => {
  const segments = parseInt(document.querySelector("#food").value);
  if (segments === 1) {
    snake.push(snake[snake.length - 1]);
  } else if (segments === 2) {
    for (let i = 0; i < 2; i++) {
      snake.push(snake[snake.length - 1]);
    }
  } else if (segments === 3) {
    for (let i = 0; i < 3; i++) {
      snake.push(snake[snake.length - 1]);
    }
  }
};

const getDirection = (e) => {
  if (e.keyCode === 39) {
    direction = "right";
  } else if (e.keyCode === 37) {
    direction = "left";
  } else if (e.keyCode === 40) {
    direction = "down";
  } else if (e.keyCode === 38) {
    direction = "up";
  }
};

const detectCollision = () => {
  const snakeHead = snake[snake.length - 1];
  if (snakeHead > 100 || snakeHead < 0) {
    clearInterval(gameId);
    endGame();
    return;
  }

  if (gameTiles[snakeHead].classList.contains("snake")) {
    clearInterval(gameId);
    endGame();
    return;
  }

  //   food collision
  if (gameTiles[snakeHead].classList.contains("apple")) {
    gameTiles[snakeHead].classList.remove("apple");
    drawApple();
    updateScore();
    expandSnake();
  }
};

const moveSnake = () => {
  const newPosition = [...snake];
  for (let i = 0; i < snake.length; i++) {
    newPosition[i] = snake[i + 1];

    if (i === snake.length - 1) {
      switch (direction) {
        case "right":
          newPosition[i] = snake[i] + 1;
          break;
        case "left":
          newPosition[i] = snake[i] - 1;
          break;
        case "down":
          newPosition[i] = snake[i] + 10;
          break;
        case "up":
          newPosition[i] = snake[i] - 10;
          break;
      }
    }

    snake = [...newPosition];
  }
};

const startGame = () => {
  // reset game
  startBtn.setAttribute("disabled", "true");
  snake = [1, 2, 3];
  direction = "right";
  score = 0;
  document.querySelector(".game-result__number").textContent = score;

  const speed = document.querySelector("#gameSpeed").value;

  switch (speed) {
    case "slow":
      gameSpeed = 500;
      break;
    case "normal":
      gameSpeed = 250;
      break;
    case "fast":
      gameSpeed = 150;
      break;
    case "vFast":
      gameSpeed = 50;
      break;
  }

  drawApple();

  gameId = setInterval(() => {
    moveSnake();
    detectCollision();
    drawSnake();
  }, gameSpeed);

  window.addEventListener("keydown", getDirection);
};
startBtn.addEventListener("click", startGame);
