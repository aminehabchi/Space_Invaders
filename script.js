var score = 0;
var LEVEL = 0;
var enemyLevel = 0;
var enemyNBR = 0;
var isPaused = false;
var isGamrOver = false;
let ScoreBar = document.getElementById("score");
let enemysDiv = document.getElementById("enemysDiv");
let board = document.getElementById("board");
var cords = board.getBoundingClientRect();
const live = `<span class="lives material-symbols-outlined">
settings_heart
</span>`;
var lives = document.querySelectorAll(".lives");
var divText = document.getElementById("textAnimation");
divText.style.left = `${cords.left}px`;
divText.style.top = `${cords.top}px`;
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

let livesDiv = document.getElementById("lives");
livesDiv.style.top = `${cords.top}px`;
livesDiv.style.left = `${
  cords.left + cords.width / 2 - levelDiv.offsetWidth / 2
}px`;

let Walls = document.createElement("div");
Walls.style.width = `${cords.width}px`;
Walls.style.height = "60px";
Walls.style.left = `${cords.left}px`;
Walls.style.top = `${cords.top + 500}px`;
Walls.id = "Walls";
board.appendChild(Walls);
/***********************************************/

var index = 0;
var text = "";
var spanText = document.getElementById("text");
var istyping = true;
let timeoutId;
function animateText() {
  if (!isGamrOver) {
    return;
  }
  if (istyping) {
    spanText.textContent += text[index];
    index++;
    if (index == text.length) {
      istyping = false;
      timeoutId = setTimeout(animateText, 1000);
      return;
    }
  } else if (!istyping) {
    spanText.textContent = text.slice(0, index - 1);
    index--;
    if (index == 0) {
      istyping = true;
      timeoutId = setTimeout(animateText, 1000);
      return;
    }
  }
  timeoutId = setTimeout(animateText, 300);
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
let requestID_MoveEnemy;
let isLevelUP = false;
function levelUP() {
  if (!requestID_MoveEnemy) {
    cancelAnimationFrame(requestID_MoveEnemy);
  }
  if (LEVEL === 3) {
    gameOver("YOU WIN!!");
    return;
  }
  if (LEVEL == 0) {
    addWalls();
  }
  LEVEL++;

  enemysDiv.innerHTML = "";
  distroy(".bullets");
  enemysDiv.style.left = `${cords.left}px`;
  enemysDiv.style.top = `${cords.top + 60}px`;

  enemysDiv.style.gridTemplateRows = `repeat(${LEVEL}, 62.5px);`;
  enemysDiv.style.height = `${40 * LEVEL}px`;

  enemyLevel += 8;
  enemyNBR = enemyLevel;
  isPaused = false;
  for (let i = 0; i < enemyLevel; i++) {
    let enemy = document.createElement("div");
    enemy.classList.add("enemy");
    enemy.classList.add("exist");
    enemy.id = i.toString();
    enemysDiv.appendChild(enemy);
  }
  levelDiv.textContent = "LEVEL " + LEVEL.toString();
  requestID_MoveEnemy = requestAnimationFrame(moveEnemys);
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
    enemysDiv.style.top = `${enemysDiv.offsetTop + 1}px`;
  }

  enemysDiv.style.left = `${enemysDiv.offsetLeft + enemySpeed}px`;
  if (enemysDiv.offsetTop + enemysDiv.offsetHeight > ship.offsetTop) {
    console.log("game over");
    gameOver("GAME OVER");
    cancelAnimationFrame(requestID_MoveEnemy);
    return;
  }
  if (!isPaused || !isGamrOver) {
    requestID_MoveEnemy = requestAnimationFrame(moveEnemys);
  } else {
    cancelAnimationFrame(requestID_MoveEnemy);
  }
}

levelUP();

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
  bullet.classList.add("Ybullets");
  let cords_ship = ship.getBoundingClientRect();
  bullet.style.left = `${cords_ship.left + 45}px`;
  bullet.style.top = `${cords_ship.top}px`;
  board.appendChild(bullet);
  moveBullet(bullet, 0);
}
var throttledShut = throttle(shut, 500);
// function move() {
//   let bullets = document.querySelectorAll(".Xbullets");
//   if (bullets) {
//     bullets.forEach((e) => {
//       moving(e);
//     });
//   }

//   let bulletY = document.querySelectorAll(".Ybullets");
//   if (bulletY) {
//     bulletY.forEach((b) => {
//       moveBullet(b,0);
//     });
//   }
// }
let requestID_MoveBullets;
function moveBullet(bullet, x) {
  if (isPaused || isGamrOver) {
    return;
  }
  let pixels = document.querySelectorAll(".existsPixel");

  for (let i = 0; i < pixels.length; i++) {
    if (isColliding(bullet, pixels[i])) {
      bullet.remove();
      pixels[i].style.visibility = "hidden";
      pixels[i].classList.remove("existsPixel");
      return;
    }
  }
  let c = bullet.getBoundingClientRect();
  if (c.top > cords.top) {
    bullet.style.transform = ` translateY(${x - bulletSpeed}px)`;
    x -= bulletSpeed;

    document.querySelectorAll(".enemy").forEach((e) => {
      if (e.style.visibility != "hidden") {
        if (isColliding(bullet, e)) {
          e.classList.remove("exist");
          score += 5;
          ScoreBar.textContent = String(score).padStart(4, "0");
          e.style.visibility = "hidden";
          bullet.remove();
          enemyNBR--;
          if (enemyNBR == 0) {
            console.log("levelUp");
            cancelAnimationFrame(requestID_MoveEnemy);
            levelUP();
            return;
          }
        }
      }
    });
  } else {
    bullet.remove();
    return;
  }
  requestID_MoveBullets = requestAnimationFrame(() => moveBullet(bullet, x));
}

/*******************************************/
var isMoving = false;
var direction;
let requestID_MoveShip;
window.addEventListener("keydown", (event) => {
  if ((event.key === "ArrowLeft" || event.key === "ArrowRight") && !isMoving) {
    direction = event.key;
    isMoving = true;
    requestID_MoveShip = requestAnimationFrame(moveShip);
  }
});

// Stop moving the ship when the key is released
window.addEventListener("keyup", (event) => {
  if (event.key == direction) {
    isMoving = false;
    if (!requestID_MoveShip) {
      cancelAnimationFrame(requestID_MoveShip);
    }
  }
});

var shipSpeed = 3;
var x = 1;
function moveShip() {
  if (!isMoving) {
    return;
  }
  if (direction == "ArrowLeft" && ship.offsetLeft > board.offsetLeft) {
    //    ship.style.left = `${ship.offsetLeft - shipSpeed}px`;
    ship.style.transform = ` translateX(${x - shipSpeed}px)`;
    x -= shipSpeed;
  }
  if (
    direction == "ArrowRight" &&
    ship.offsetLeft < board.offsetLeft + board.offsetWidth - ship.offsetWidth
  ) {
    //ship.style.left = `${ship.offsetLeft + shipSpeed}px`;
    ship.style.transform = ` translateX(${x - shipSpeed}px)`;
    x += shipSpeed;
  }

  requestID_MoveShip = requestAnimationFrame(moveShip);
}

/*************************************/
function Restart() {
  cancelAnimationFrame(requestID_MoveEnemy);
  distroy(".will");
  addWalls();
  if (timeoutId) {
    clearTimeout(timeoutId);
  }
  spanText.textContent = "";
  enemysDiv.innerHTML = "";
  if (isPaused) {
    isPaused = false;
    PauseBtn.style.visibility = "visible";
    PlayBtn.style.visibility = "hidden";
  }
  livesDiv.innerHTML = "";
  for (let i = 0; i < 3; i++) {
    livesDiv.innerHTML += live;
  }
  lives = document.querySelectorAll(".lives");
  isGamrOver = false;
  LEVEL = 0;
  enemyLevel = 0;
  score = 0;
  ScoreBar.textContent = "0000";
  divText.style.visibility = "hidden";
  levelUP();
}
/***********************************/
let btnPR = document.querySelector("#psCn");
function Pause_Continue() {
  if (isGamrOver) {
    return;
  }
  distroy(".bullets");
  if (isPaused) {
    isPaused = false;
    PauseBtn.style.visibility = "visible";
    PlayBtn.style.visibility = "hidden";
    moveEnemys();
    // move();
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
  enemysDiv.innerHTML = "";
  spanText.textContent = "";
  text = message;
  animateText(message);
  nbr = 0;
  nbrB = 0;
  distroy(".bullets");
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
  let existEnemy = document.querySelectorAll(".exist");
  if (!existEnemy) {
    return;
  }
  let a = existEnemy[getNb(existEnemy.length).toString()];
  let b = document.createElement("div");
  b.classList.add("bullets");
  b.classList.add("Xbullets");

  let cord = a.getBoundingClientRect();
  b.style.left = `${cord.left + existEnemy[0].offsetWidth / 2}px`;

  b.style.top = `${cord.top + existEnemy[0].offsetHeight}px`;

  board.appendChild(b);

  moving(b, 0);
}, 2000);

const getNb = (n) => {
  return Math.floor(Math.random() * n);
};
let requestID_MoveEnemyBullets;
let Speed = 3;
function moving(bullet, x) {
  if (!bullet || isGamrOver || isPaused) {
    return;
  }
  let pixels = document.querySelectorAll(".existsPixel");
  pixels.forEach((e) => {
    if (isColliding(bullet, e)) {
      bullet.remove();
      e.style.visibility = "hidden";
      e.classList.remove("existsPixel");
      return;
    }
  });
  let c = bullet.getBoundingClientRect();
  if (c.top + c.height < cords.bottom) {
    // bullet.style.top = `${bullet.offsetTop + 3}px`;
    bullet.style.transform = ` translateY(${x + Speed}px)`;
    x += Speed;

    if (isColliding(bullet, ship)) {
      bullet.remove();

      lives = document.querySelectorAll(".lives");
      lives[0].remove();
      if (lives.length == 1) {
        cancelAnimationFrame(requestID_MoveEnemyBullets);
        gameOver("GAME OVER");
      }
      return;
    }
  } else if (bullet) {
    bullet.remove();
    return;
  }
  requestAnimationFrame(() => moving(bullet, x));
}

/**********************************/
let bl = false;
setInterval(function animate() {
  if (isGamrOver || isPaused) {
    return;
  }
  let existEnemy = document.querySelectorAll(".exist");
  if (!existEnemy) {
    return;
  }
  existEnemy.forEach((e) => {
    if (bl) {
      e.style.backgroundImage = "url('InvaderB1.png')";
    } else {
      e.style.backgroundImage = "url('InvaderB2.png')";
    }
  });
  if (bl) {
    bl = false;
  } else {
    bl = true;
  }
}, 500);

/*************************************/
function createWall() {
  let wall = document.createElement("div");
  wall.classList.add("wall");
  let empty = document.createElement("div");
  empty.classList.add("empty");
  wall.appendChild(empty);
  for (let i = 0; i < 48; i++) {
    let pixel = document.createElement("div");
    pixel.classList.add("pixel");
    pixel.classList.add("existsPixel");
    wall.appendChild(pixel);
  }
  return wall;
}
function addWalls() {
  let Walls = document.getElementById("Walls");
  Walls.innerHTML = "";
  for (let i = 0; i < 3; i++) {
    let wall = createWall();
    Walls.appendChild(wall);
  }
}
