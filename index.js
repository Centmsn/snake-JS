let snake = [1, 2, 3];
let direction = "right";
let gameId = "";
let score = 0;
let highScore = 0;
let gameSpeed = 250;
let darkMode = false;
let allowDirectionChange = true;
const startBtn = document.querySelector("#start-game");
const gameTiles = document.querySelectorAll(".game-container__tile");
const gameContainer = document.querySelector(".game-container");

const endGame = () => {
  startBtn.removeAttribute("disabled");
  document.querySelector("#food").removeAttribute("disabled");
  document.querySelector("#gameSpeed").removeAttribute("disabled");
  gameTiles.forEach((tile) => {
    tile.classList.remove("apple");
  });

  document.querySelector(".snake-head").classList.add("collision");

  //   display end game info
  const modal = document.createElement("div");
  modal.classList.add("modal");

  if (darkMode) {
    modal.classList.add("modal--dark");
  }

  const info = document.createElement("p");

  const hScoreBox = document.querySelector(".game-result__high-score");
  //   update highscore
  if (highScore > parseInt(hScoreBox.textContent)) {
    info.innerHTML = `Game over<br>Score: ${score}<br>New high score!`;
    hScoreBox.textContent = highScore;
  } else {
    info.innerHTML = `Game over<br>Score: ${score}`;
  }

  info.classList.add("modal__info");
  modal.appendChild(info);

  gameContainer.appendChild(modal);
};

const toggleDarkmode = (e) => {
  const modal = document.querySelector(".modal");
  const options = document.querySelector(".game-result");

  if (e.target.value === "dark") {
    e.target.value = "light";
    e.target.textContent = "Turn on the lights";
    gameContainer.classList.add("game-container--dark");
    options.classList.add("game-result--dark");
    if (modal) {
      modal.classList.add("modal--dark");
    }
    darkMode = true;
  } else {
    e.target.value = "dark";
    e.target.textContent = "Turn off the lights";
    gameContainer.classList.remove("game-container--dark");
    options.classList.remove("game-result--dark");
    if (modal) {
      modal.classList.remove("modal--dark");
    }
    darkMode = false;
  }
};

const updateScore = () => {
  const food = parseInt(document.querySelector("#food").value);
  //   if highest speed
  const speed = gameSpeed === 50 ? gameSpeed - 60 : gameSpeed * 0.01;
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

  const scoreBox = document.querySelector(".game-result__current-score");
  scoreBox.textContent = score;
  score > highScore ? (highScore = score) : null;
};

const drawSnake = () => {
  gameTiles.forEach((tile, index) => {
    //   clear current position
    tile.classList.remove("snake");
    tile.classList.remove("snake-head");

    // draw body
    if (snake.includes(index)) {
      tile.classList.add("snake");

      //   draw head
      index === snake[snake.length - 1]
        ? tile.classList.add("snake-head")
        : null;
    }
  });
  allowDirectionChange = true;
};

const drawApple = () => {
  let randomTile = "";
  do {
    randomTile = Math.floor(Math.random() * 100);
  } while (gameTiles[randomTile].classList.contains("snake"));

  gameTiles[randomTile].classList.add("apple");
};

const expandSnake = () => {
  // number depends on user select
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
  // decode pressed key
  // block 180deg turn
  if (allowDirectionChange) {
    allowDirectionChange = false;
    if (e.keyCode === 39 && direction !== "left") {
      direction = "right";
    } else if (e.keyCode === 37 && direction !== "right") {
      direction = "left";
    } else if (e.keyCode === 40 && direction !== "up") {
      direction = "down";
    } else if (e.keyCode === 38 && direction !== "down") {
      direction = "up";
    }
  }
};

const detectCollision = () => {
  // wall collision
  const snakeHead = snake[snake.length - 1];
  const leftWall = [0, 10, 20, 30, 40, 50, 60, 70, 80, 90];
  const rightWall = [9, 19, 29, 39, 49, 59, 69, 79, 89, 99];
  if (snakeHead > 100 || snakeHead < 0) {
    clearInterval(gameId);
    endGame();
    return false;
  }

  if (rightWall.includes(snakeHead) && direction === "left") {
    clearInterval(gameId);
    endGame();
    return false;
  } else if (leftWall.includes(snakeHead) && direction === "right") {
    clearInterval(gameId);
    endGame();
    return false;
  }

  //   body collision
  if (gameTiles[snakeHead].classList.contains("snake")) {
    clearInterval(gameId);
    endGame();
    return false;
  }

  //   food collision
  if (gameTiles[snakeHead].classList.contains("apple")) {
    gameTiles[snakeHead].classList.remove("apple");
    expandSnake();
    drawApple();
    updateScore();

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
  // before game start
  const modal = document.createElement("div");
  modal.classList.add("modal");

  if (darkMode) {
    modal.classList.add("modal--dark");
  }

  gameContainer.appendChild(modal);
  modal.textContent = "3";
  setTimeout(() => (modal.textContent = "2"), 1000);
  setTimeout(() => (modal.textContent = "1"), 2000);
  setTimeout(() => gameContainer.removeChild(modal), 3000);
};

const startGame = () => {
  // reset game before start
  startBtn.setAttribute("disabled", "true");
  snake = [1, 2, 3];
  direction = "right";
  score = 0;
  document.querySelector(".game-result__current-score").textContent = score;
  gameTiles.forEach((tile) =>
    tile.classList.remove("snake", "snake-head", "collision")
  );

  const modal = document.querySelector(".modal");
  if (modal) {
    gameContainer.removeChild(modal);
  }

  const speed = document.querySelector("#gameSpeed");

  //   set game speed
  switch (speed.value) {
    case "slow":
      gameSpeed = 200;
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
document.querySelector("#darkmode").addEventListener("click", toggleDarkmode);
