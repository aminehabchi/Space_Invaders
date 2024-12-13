var score = 0;
var LEVELE = 0;
var enemyLevel = 1;
var enemyNBR = 1;
var isPaused = false;
var isGamrOver = false;
let ScoreBar = document.getElementById("score");
let enemysDiv = document.getElementById("enemysDiv");
let board = document.getElementById("board");
var cords = board.getBoundingClientRect();

var divText = document.getElementById("textAnimation");
divText.style.left = `${cords.left}px`;
divText.style.top = `${cords.left}px`;
divText.style.width = `${cords.width}px`;
divText.style.height = `${cords.height}px`;
divText.style.visibility = "hidden";

let levelDiv = document.getElementById("level");
levelDiv.style.left = `${
  board.offsetWidth + levelDiv.offsetLeft - levelDiv.offsetWidth
}px`;
levelDiv.style.top = `${cords.top}px`;
let ship = document.createElement("div");
ship.id = "ship";
board.appendChild(ship);

ship.style.top = `${cords.height + cords.top - ship.offsetHeight - 30}px`;
ship.style.left = `${cords.left + cords.width / 2 - ship.offsetWidth / 2}px`;

/***********************************************/

var index = 0;
var text = "";
var spanText = document.getElementById("text");
var istyping = true;

function animateText() {
  if (!isGamrOver) {
    return;
  }
  if (istyping) {
    spanText.textContent += text[index];
    index++;
    if (index == text.length) {
      istyping = false;
      setTimeout(animateText, 1000);
      return;
    }
  } else if (!istyping) {
    spanText.textContent = text.slice(0, index - 1);
    index--;
    if (index == 0) {
      istyping = true;
      setTimeout(animateText, 1000);
      return;
    }
  }
  setTimeout(animateText, 300);
}

/************ restrt pause contunie positon************** */
let RestartBtn = document.querySelector("#restart");
RestartBtn.style.right = `${cords.left}px`;
RestartBtn.style.top = `${cords.bottom}px`;
let PlayBtn = document.querySelector("#play");
let PauseBtn = document.querySelector("#pause");

PlayBtn.style.left = `${cords.left}px`;
PlayBtn.style.top = `${cords.bottom}px`;
PauseBtn.style.left = `${cords.left}px`;
PauseBtn.style.top = `${cords.bottom}px`;
PlayBtn.style.visibility = "hidden";
/**********************************************/
function throttle(func, interval) {
  let lastCall = 0;

  return function (...args) {
    const now = Date.now();

    if (now - lastCall >= interval) {
      lastCall = now;
      func.apply(this, args);
    }
  };
}
/*****************LEVEL************************/
function levelUP() {
  if (LEVELE === 3) {
    gameOver("YOU WIN!!");
    return;
  }
  distroy(".enemy");
  distroy(".bullets");
  enemysDiv.style.left = `${cords.left}px`;
  enemysDiv.style.top = `${cords.top + 60}px`;
  LEVELE++;
  enemyLevel++;
  enemyNBR = enemyLevel;
  isPaused = false;
  for (let i = 0; i < enemyLevel; i++) {
    let enemy = document.createElement("div");
    enemy.classList.add("enemy");
    enemy.id = i.toString();
    enemysDiv.appendChild(enemy);
  }
  levelDiv.textContent = "LEVEL " + LEVELE.toString();
}
/**********************************************/

let enemySpeed = 1;
function moveEnemys() {
  if (isPaused || isGamrOver) {
    return;
  }
  if (
    enemysDiv.offsetLeft > cords.right - enemysDiv.offsetWidth ||
    enemysDiv.offsetLeft < cords.left
  ) {
    enemySpeed *= -1;
  }
  enemysDiv.style.top = `${enemysDiv.offsetTop + 0.5}px`;

  enemysDiv.style.left = `${enemysDiv.offsetLeft + enemySpeed}px`;
  if (enemysDiv.offsetTop + enemysDiv.offsetHeight > ship.offsetTop) {
    console.log("game over");
    gameOver("GAME OVER");
    cancelAnimationFrame(moveEnemys);
    return;
  }
  requestAnimationFrame(moveEnemys);
}
//  requestAnimationFrame(moveEnemys);
levelUP();
moveEnemys();

/*******************************************/
window.addEventListener("keydown", (event) => {
  if (isPaused) {
    return;
  }
  if (event.key == " ") {
    throttledShut();
  }
});

/*****************************/
function isColliding(bullet, enemy) {
  let a = bullet.getBoundingClientRect();
  let b = enemy.getBoundingClientRect();
  return (
    a.left < b.right && a.right > b.left && a.top < b.bottom && a.bottom > b.top
  );
}

/*******************************************/

const bulletSpeed = 8;
function shut() {
  let bullet = document.createElement("div");
  bullet.classList.add("bullets");
  bullet.style.left = `${ship.offsetLeft + 45}px`;
  bullet.style.top = `${ship.offsetTop}px`;
  board.appendChild(bullet);
  move(bullet);
}
var throttledShut = throttle(shut, 500);
function move(bullet) {
  function animate() {
    if (!bullet) {
      return;
    }
    if (bullet.offsetTop > cords.top) {
      bullet.style.top = `${bullet.offsetTop - bulletSpeed}px`;
      document.querySelectorAll(".enemy").forEach((e) => {
        if (e.style.visibility != "hidden") {
          if (isColliding(bullet, e)) {
            score += 5;
            ScoreBar.textContent = String(score).padStart(4, "0");
            e.style.visibility = "hidden";
            //  e.remove();
            bullet.remove();
            enemyNBR--;
            if (enemyNBR == 0) {
              console.log("levelUp");
              cancelAnimationFrame(animate);
              levelUP();
            }
          }
        }
      });
      requestAnimationFrame(animate);
    } else {
      bullet.remove();
    }
  }
  requestAnimationFrame(animate);
}
/*******************************************/
var isMoving = false;
var direction;
window.addEventListener("keydown", (event) => {
  if ((event.key === "ArrowLeft" || event.key === "ArrowRight") && !isMoving) {
    direction = event.key;
    isMoving = true;
    requestAnimationFrame(moveShip);
  }
});

// Stop moving the ship when the key is released
window.addEventListener("keyup", (event) => {
  if (event.key == direction) {
    isMoving = false;
  }
});

var shipSpeed = 3;
function moveShip() {
  if (!isMoving) {
    return;
  }
  console.log("move");

  if (direction == "ArrowLeft" && ship.offsetLeft > board.offsetLeft) {
    ship.style.left = `${ship.offsetLeft - shipSpeed}px`;
  }
  if (
    direction == "ArrowRight" &&
    ship.offsetLeft < board.offsetLeft + board.offsetWidth - ship.offsetWidth
  ) {
    ship.style.left = `${ship.offsetLeft + shipSpeed}px`;
  }

  requestAnimationFrame(moveShip);
}

/*************************************/
function Restart() {
  distroy(".enemy");
  if (isPaused) {
    isPaused = false;
    PauseBtn.style.visibility = "visible";
    PlayBtn.style.visibility = "hidden";
  }
  isGamrOver = false;
  LEVELE = 0;
  enemyLevel = 1;
  score = 0;
  ScoreBar.textContent = "0000";
  divText.style.visibility = "hidden";
  levelUP();
  moveEnemys();
}
/***********************************/
let btnPR = document.querySelector("#psCn");
function Pause_Continue() {
  if (isGamrOver) {
    return;
  }
  if (isPaused) {
    isPaused = false;
    PauseBtn.style.visibility = "visible";
    PlayBtn.style.visibility = "hidden";
    moveEnemys();
  } else {
    PauseBtn.style.visibility = "hidden";
    PlayBtn.style.visibility = "visible";
    isPaused = true;
  }
}

/****************************************/
function gameOver(message) {
  isGamrOver = true;
  divText.style.visibility = "visible";
  distroy(".enemy");
  spanText.textContent = "";
  text = message;
  animateText(message);
}

/**************************************/
function distroy(name) {
  document.querySelectorAll(name).forEach((x) => {
    x.remove();
  });
}
/*******************************/
setInterval(() => {
  if (isPaused || isGamrOver) {
    return;
  }

  let a = document.getElementById(getNb().toString());
  let b = document.createElement("div");
  b.classList.add("bullets");

  b.style.left = `${a.offsetLeft - b.offsetWidth + a.offsetWidth / 2}px`;
  b.style.top = `${a.offsetTop + a.offsetHeight}px`;
  enemysDiv.appendChild(b);
  moveBulletEnemy(b);
}, 2000);

const getNb = () => {
  return Math.floor(Math.random() * enemyLevel);
};
function moveBulletEnemy(bullet) {
  if (isGamrOver || isPaused) {
    return;
  }
  function animate() {
    if (isGamrOver || isPaused) {
      return;
    }
    if (!bullet) {
      return;
    }
    if (bullet.offsetTop < cords.bottom) {
      bullet.style.top = `${bullet.offsetTop + 2}px`;

      if (isColliding(bullet, ship)) {
        bullet.remove();

        gameOver("GAME OVER");
        return;
      }

      requestAnimationFrame(animate);
    } else {
      bullet.remove();
    }
  }
  requestAnimationFrame(animate);
}
