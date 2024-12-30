import * as main from "./script.js";
import * as outil from "./outils.js";
import { game, ship, cords, requestID, speed, elements } from "./script.js";

/**********************shooting***************************/
var throttledShut = outil.throttle(shut, 500);
window.addEventListener("keydown", (event) => {
  if (game.isPaused) {
    return;
  }
  if (event.key == " ") {
    if (!game.isGamrOver) throttledShut();
  }
});

export function shut() {
  let bullet = document.createElement("div");
  bullet.classList.add("bullets");
  bullet.classList.add("Ybullets");
  let cords_ship = ship.getBoundingClientRect();
  bullet.style.left = `${cords_ship.left + 35}px`;
  bullet.style.top = `${cords_ship.top}px`;
  elements.board.appendChild(bullet);
  moveBullet(bullet, 0);
}

function moveBullet(bullet, x) {
  if (game.isPaused || game.isGamrOver) {
    return;
  }
  let pixels = document.querySelectorAll(".existsPixel");

  for (let i = 0; i < pixels.length; i++) {
    if (outil.isColliding(bullet, pixels[i])) {
      bullet.remove();
      pixels[i].style.visibility = "hidden";
      pixels[i].classList.remove("existsPixel");
      return;
    }
  }
  let c = bullet.getBoundingClientRect();
  if (c.top > main.cords.top) {
    bullet.style.transform = ` translateY(${x - speed.bulletSpeed}px)`;
    x -= speed.bulletSpeed;

    document.querySelectorAll(".enemy").forEach((e) => {
      if (e.style.visibility != "hidden") {
        if (outil.isColliding(bullet, e)) {
          e.classList.remove("exist");
          game.score = game.score + 5;
          elements.ScoreBar.textContent = String(game.score).padStart(4, "0");
          e.style.visibility = "hidden";
          bullet.remove();
          game.enemyNBR--;
          if (game.enemyNBR == 0) {
            main.levelUP();
            return;
          }
        }
      }
    });
  } else {
    bullet.remove();
    return;
  }
  requestAnimationFrame(() => moveBullet(bullet, x));
}

/***************************move Enemys****************************/
export function moveEnemys() {
  if (game.isPaused || game.isGamrOver) {
    return;
  }
  if (
    elements.enemysDiv.offsetLeft >
    cords.right - elements.enemysDiv.offsetWidth ||
    elements.enemysDiv.offsetLeft < cords.left
  ) {
    speed.enemySpeed *= -1;
    elements.enemysDiv.style.top = `${elements.enemysDiv.offsetTop + 1}px`;
  }

  elements.enemysDiv.style.left = `${elements.enemysDiv.offsetLeft + speed.enemySpeed
    }px`;
  if (
    elements.enemysDiv.offsetTop + elements.enemysDiv.offsetHeight >
    ship.offsetTop
  ) {
    console.log("game over");
    gameOver("GAME OVER", 0);
    cancelAnimationFrame(requestID.requestID_MoveEnemy);
    return;
  }
  if (!game.isPaused || !game.isGamrOver) {
    requestID.requestID_MoveEnemy = requestAnimationFrame(moveEnemys);
  } else {
    cancelAnimationFrame(requestID.requestID_MoveEnemy);
  }
}
/***********************ship**************************/

var isMoving = false;
var direction;
window.addEventListener("keydown", (event) => {
  if ((event.key === "ArrowLeft" || event.key === "ArrowRight") && !isMoving) {
    direction = event.key;
    isMoving = true;
    if (!game.isGamrOver) requestID.requestID_MoveShip = requestAnimationFrame(moveShip);
  }
});

window.addEventListener("keyup", (event) => {
  if (event.key == direction) {
    isMoving = false;
    if (!requestID.requestID_MoveShip) {
      cancelAnimationFrame(requestID.requestID_MoveShip);
    }
  }
});

var x = 0;
function moveShip() {
  if (!isMoving) {
    return;
  }
  
  
  if (direction == "ArrowLeft" && x >= ship.offsetWidth / 2 - elements.board.offsetWidth / 2) {
    ship.style.transform = ` translateX(${x}px)`;
    x -= speed.shipSpeed;
  }
  if (direction == "ArrowRight" && x <= elements.board.offsetWidth / 2 - ship.offsetWidth / 2) {
    ship.style.transform = ` translateX(${x}px)`;
    x += speed.shipSpeed;
  }

  requestID.requestID_MoveShip = requestAnimationFrame(moveShip);
}
/***********************enemy shuting******************************/

setInterval(() => {
  if (game.isPaused || game.isGamrOver) {
    return;
  }
  let existEnemy = document.querySelectorAll(".exist");
  if (!existEnemy || game.enemyNBR == 0) {
    return;
  }
  let a = existEnemy[outil.getNb(existEnemy.length).toString()];
  let b = document.createElement("div");
  b.classList.add("bullets");
  b.classList.add("Xbullets");

  let cord = a.getBoundingClientRect();
  b.style.left = `${cord.left + existEnemy[0].offsetWidth / 2}px`;

  b.style.top = `${cord.top + existEnemy[0].offsetHeight}px`;

  elements.board.appendChild(b);

  moving(b, 0);
}, 2000);

function moving(bullet, x) {
  if (!bullet || game.isGamrOver || game.isPaused) {
    return;
  }
  let pixels = document.querySelectorAll(".existsPixel");
  pixels.forEach((e) => {
    if (outil.isColliding(bullet, e)) {
      bullet.remove();
      e.style.visibility = "hidden";
      e.classList.remove("existsPixel");
      return;
    }
  });
  let c = bullet.getBoundingClientRect();
  if (c.top + c.height < cords.bottom) {
    bullet.style.transform = ` translateY(${x + speed.speedEnemyBullet
      }px) translateZ(0)`;

    x += speed.speedEnemyBullet;

    if (outil.isColliding(bullet, ship)) {
      bullet.remove();

      elements.lives = document.querySelectorAll(".lives");
      elements.lives[0].remove();
      if (elements.lives.length <= 1) {
        main.gameOver("GAME OVER", 0);
      }
      return;
    }
  } else if (bullet) {
    bullet.remove();
    return;
  }
  requestAnimationFrame(() => moving(bullet, x));
}
