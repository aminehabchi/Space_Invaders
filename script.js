var score = 0;
var LEVELE = 0;
var enemyLevel = 1;
var enemyNBR = 1;
var isPaused = false;
let ScoreBar = document.getElementById("score");
let board = document.getElementById("board");
let enemysDiv = document.getElementById("enemysDiv");
var cords = board.getBoundingClientRect();

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
  document.querySelectorAll(".bullets").forEach((e) => {
    e.remove();
  });

  enemysDiv.style.left = `${cords.left}px`;
  enemysDiv.style.top = `${cords.top + 60}px`;
  LEVELE++;
  enemyLevel++;
  enemyNBR = enemyLevel;
  for (let i = 0; i < enemyLevel; i++) {
    let enemy = document.createElement("div");
    enemy.classList.add("enemy");
    enemysDiv.appendChild(enemy);
  }
  levelDiv.textContent = "LEVEL " + LEVELE.toString();
}
/***************************/

let enemySpeed = 1;
function moveEnemys() {
  if (isPaused) {
    return;
  }
  if (
    enemysDiv.offsetLeft > cords.right - enemysDiv.offsetWidth ||
    enemysDiv.offsetLeft < cords.left
  ) {
    enemySpeed *= -1;
    enemysDiv.style.top = `${enemysDiv.offsetTop + 10}px`;
  }

  enemysDiv.style.left = `${enemysDiv.offsetLeft + enemySpeed}px`;
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
  } else {
    moveShip(event.key);
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
var throttledShut = throttle(shut, 800);
function move(bullet) {
  function animate() {
    if (!bullet) {
      return;
    }
    if (bullet.offsetTop > cords.top) {
      bullet.style.top = `${bullet.offsetTop - bulletSpeed}px`;
      document.querySelectorAll(".enemy").forEach((e) => {
        if (isColliding(bullet, e)) {
          score += 5;
          ScoreBar.textContent = String(score).padStart(4, "0");
          e.remove();
          bullet.remove();
          enemyNBR--;
          if (enemyNBR == 0) {
            console.log("levelUp");
            cancelAnimationFrame(animate);
            levelUP();
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
function moveShip(direction) {
  switch (direction) {
    case "ArrowLeft":
      if (ship.offsetLeft > board.offsetLeft) {
        ship.style.left = `${ship.offsetLeft - 10}px`;
      }
      break;
    case "ArrowRight":
      if (
        ship.offsetLeft <
        board.offsetLeft + board.offsetWidth - ship.offsetWidth
      ) {
        ship.style.left = `${ship.offsetLeft + 10}px`;
      }
      break;
  }
}
/*************************************/
function Restart() {
  document.querySelectorAll(".enemy").forEach((e) => {
    e.remove();
  });
  if (isPaused) {
    isPaused = false;
    btnPR.textContent = "Pause";
    moveEnemys();
  }
  LEVELE = 0;
  enemyLevel = 1;
  score = 0;
  ScoreBar.textContent = "0000";
  levelUP();
}
/***********************************/
let btnPR = document.querySelector("#psCn");
function Pause_Continue() {
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
