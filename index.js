let snake = [1, 2, 3];
let direction = "right";
let gameId = "";
let score = 0;
let gameSpeed = 250;
const startBtn = document.querySelector(".button");
const gameTiles = document.querySelectorAll(".game-container__tile");

const endGame = () => {
  document.querySelector(".game-result__info").textContent = "Game over!";
  startBtn.removeAttribute("disabled");
  document.querySelector("#food").removeAttribute("disabled");
  document.querySelector("#gameSpeed").removeAttribute("disabled");
  gameTiles.forEach((tile) => {
    tile.classList.remove("apple");
  });

  document.querySelector(".snake-head").classList.add("collision");
};

const updateScore = () => {
  const food = parseInt(document.querySelector("#food").value);
  const speed = gameSpeed * 0.01;
  switch (food) {
    case 1:
      score += 4 - speed;
      break;
    case 2:
      score += 9 - speed;
      break;
    case 3:
      score += 13 - speed;
      break;
  }
  document.querySelector(".game-result__number").textContent = score;
};

const drawSnake = () => {
  gameTiles.forEach((tile, index) => {
    tile.classList.remove("snake");
    tile.classList.remove("snake-head");
    if (snake.includes(index)) {
      tile.classList.add("snake");

      index === snake[snake.length - 1]
        ? tile.classList.add("snake-head")
        : null;
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
    snake.unshift(snake[snake.length - 1]);
  } else if (segments === 2) {
    for (let i = 0; i < 2; i++) {
      snake.unshift(snake[snake.length - 1]);
    }
  } else if (segments === 3) {
    for (let i = 0; i < 3; i++) {
      snake.unshift(snake[snake.length - 1]);
    }
  }
};

const getDirection = (e) => {
  if (e.keyCode === 39 && direction !== "left") {
    direction = "right";
  } else if (e.keyCode === 37 && direction !== "right") {
    direction = "left";
  } else if (e.keyCode === 40 && direction !== "up") {
    direction = "down";
  } else if (e.keyCode === 38 && direction !== "down") {
    direction = "up";
  }
};

const detectCollision = () => {
  const snakeHead = snake[snake.length - 1];
  if (snakeHead > 100 || snakeHead < 0) {
    clearInterval(gameId);
    endGame();
    return false;
  }

  if (gameTiles[snakeHead].classList.contains("snake")) {
    clearInterval(gameId);
    endGame();
    return false;
  }

  //   food collision
  if (gameTiles[snakeHead].classList.contains("apple")) {
    gameTiles[snakeHead].classList.remove("apple");
    drawApple();
    updateScore();
    expandSnake();
    return true;
  }

  return true;
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

const showCountdown = () => {
  const modal = document.createElement("div");
  modal.classList.add("modal");

  document.querySelector(".game-container").appendChild(modal);
  modal.textContent = "3";
  setTimeout(() => (modal.textContent = "2"), 1000);
  setTimeout(() => (modal.textContent = "1"), 2000);
  setTimeout(
    () => document.querySelector(".game-container").removeChild(modal),
    3000
  );
};

const startGame = () => {
  // reset game before start
  startBtn.setAttribute("disabled", "true");
  snake = [1, 2, 3];
  direction = "right";
  score = 0;
  document.querySelector(".game-result__number").textContent = score;
  gameTiles.forEach((tile) =>
    tile.classList.remove("snake", "snake-head", "collision")
  );

  const speed = document.querySelector("#gameSpeed");

  //   set game speed
  switch (speed.value) {
    case "slow":
      gameSpeed = 300;
      break;
    case "normal":
      gameSpeed = 150;
      break;
    case "fast":
      gameSpeed = 100;
      break;
    case "vFast":
      gameSpeed = 50;
      break;
  }

  speed.setAttribute("disabled", "true");
  document.querySelector("#food").setAttribute("disabled", "true");

  //   display countdown before start
  showCountdown();
  setTimeout(() => {
    drawApple();

    gameId = setInterval(() => {
      moveSnake();
      if (detectCollision()) {
        drawSnake();
      }
    }, gameSpeed);

    window.addEventListener("keydown", getDirection);
  }, 3000);
};
startBtn.addEventListener("click", startGame);
