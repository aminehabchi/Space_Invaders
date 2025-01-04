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
  bullet.style.left = `${cords_ship.left + 10}px`;
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
      pixels[i].classList.remove("existsPixel");
      return;
    }
  }
  let c = bullet.getBoundingClientRect();
  if (c.top > main.cords.top) {
    bullet.style.transform = `translateY(${x}px)`;
    x -= speed.bulletSpeed;

    document.querySelectorAll(".existsEnemy").forEach((e) => {
      if (outil.isColliding(bullet, e)) {
        e.classList.remove("existsEnemy");
        game.score = game.score + 5;
        elements.ScoreBar.textContent = String(game.score).padStart(4, "0");
        bullet.remove();
        game.enemyNBR--;
        if (game.enemyNBR == 0) {
          main.levelUP();
          return;
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
let xx = 0;
export function moveEnemys() {

  const enemyCords = elements.enemysDiv.getBoundingClientRect();

  if (enemyCords.right > cords.right || enemyCords.left < cords.left) {
    speed.enemySpeed *= -1;
  }

  
  if (enemyCords.right-cords.right > 0) {
    xx+=cords.right-enemyCords.right
  }
  if (enemyCords.left - cords.left < 0) {
    xx+= cords.left-enemyCords.left
  }
  
  
  xx += speed.enemySpeed;
  elements.enemysDiv.style.transform = `translateX(${xx}px)`;

  requestID.requestID_MoveEnemy = requestAnimationFrame(moveEnemys);
}

/***********************ship**************************/

var isMoving = false;
var direction;
window.addEventListener("keydown", (event) => {
  if ((event.key === "ArrowLeft" || event.key === "ArrowRight") && !isMoving) {
    direction = event.key;
    isMoving = true;
    requestID.requestID_MoveShip = requestAnimationFrame(moveShip);
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

  const transform = ship.getBoundingClientRect();
    
  if (x > elements.board.offsetWidth / 2) {
    x+=cords.right-transform.right
    ship.style.transform = ` translateX(${x}px)`;

  }
  if (x < -elements.board.offsetWidth / 2) {
    x+= cords.left-transform.left
    ship.style.transform = ` translateX(${x}px)`;

  }
  

  if (
    direction == "ArrowLeft" &&
    x >= ship.offsetWidth / 2 - elements.board.offsetWidth / 2
  ) {
    ship.style.transform = ` translateX(${x}px)`;
    x -= speed.shipSpeed;
  }

  if (
    direction == "ArrowRight" &&
    x <= elements.board.offsetWidth / 2 - ship.offsetWidth / 2
  ) {
    ship.style.transform = ` translateX(${x}px)`;
    x += speed.shipSpeed;
  }

  
  

  
  
  requestID.requestID_MoveShip = requestAnimationFrame(moveShip);
}
/***********************enemy shuting******************************/

setInterval(() => {
  if (game.isPaused || game.isGamrOver || game.enemyNBR == 0) {
    return;
  }
  let existEnemy = document.querySelectorAll(".existsEnemy");

  let a = existEnemy[outil.getNb(existEnemy.length)];
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
  if (bullet == undefined || game.isGamrOver || game.isPaused) {
    return;
  }

  let pixels = document.querySelectorAll(".existsPixel");
  for (let i = 0; i < pixels.length; i++) {
    if (outil.isColliding(bullet, pixels[i])) {
      bullet.remove();
      pixels[i].classList.remove("existsPixel");
      return;
    }
  }

  let c = bullet.getBoundingClientRect();
  if (c.top + c.height < cords.bottom) {
    x += speed.speedEnemyBullet;
    bullet.style.transform = `translateY(${x}px) translateZ(0)`;

    if (outil.isColliding(bullet, ship)) {
      bullet.remove();
      game.livesNbr--;
      elements.lives[game.livesNbr].style.visibility = "hidden";
      if (game.livesNbr == 0) {
        main.gameOver(game.gameresultTexts[1], 0);
      }
      return;
    }
  } else if (bullet) {
    bullet.remove();
    return;
  }
  requestAnimationFrame(() => moving(bullet, x));
}
