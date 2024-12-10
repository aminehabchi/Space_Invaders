var score = 0;
var LEVELE = 0;
var enemyLevel = 1;
var enemyNBR = 1;

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

ship.style.top = `${cords.height}px`;
ship.style.left = `${cords.width / 2 + ship.offsetWidth}px`;

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
// requestAnimationFrame(moveEnemys);
levelUP();
moveEnemys();

/*******************************************/
window.addEventListener("keydown", (event) => {
  if (event.key == " ") {
    shut();
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
const bulletSpeed = 5;
function shut() {
  let bullet = document.createElement("div");
  bullet.classList.add("bullets");
  bullet.style.left = `${ship.offsetLeft + 45}px`;
  bullet.style.top = `${ship.offsetTop}px`;
  board.appendChild(bullet);
  move(bullet);
}

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
          ScoreBar.innerHTML = String(score).padStart(4, "0");
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
