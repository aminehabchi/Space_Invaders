import * as Moving from "./moving.js";
import * as outil from "./outils.js";
import * as Btn from "./button.js";
import * as animation from "./animation.js";
export var game = {
  LEVEL: 0,
  enemyLevel: 0,
  enemyNBR: 0,
  isPaused: false,
  isGamrOver: false,
  isleave: false,
  score: 0,
  livesNbr: 3,
  wallNbr: 3,
  line: 8,
  second: 0,
};
export var speed = {
  bulletSpeed: 5,
  enemySpeed: 1,
  shipSpeed: 3,
  speedEnemyBullet: 5,
};

export var elements = {
  timer: document.getElementById("timer"),
  ScoreBar: document.getElementById("score"),
  menu: document.querySelector("#menu"),
  enemysDiv: document.getElementById("enemysDiv"),
  board: document.getElementById("board"),
  levelDiv: document.getElementById("level"),
  divText: document.getElementById("textAnimation"),
  blurOverlay: document.querySelector("#blur-overlay"),
  PauseBtn: document.querySelector("#pause"),
  lives: document.querySelectorAll(".lives"),
  spanText: document.getElementById("text"),
  Walls: document.getElementById("Walls"),
};

export var requestID = {
  requestID_MoveEnemy: 0,
  requestID_MoveShip: 0,
  timeoutId: 0,
};

export var cords = elements.board.getBoundingClientRect();
export let ship = document.createElement("div");

/********************************************* */

/*************************** */

setInterval(function updatetimer() {
  if (game.isGamrOver || game.isPaused) {
    return;
  }
  game.second++;
  elements.timer.textContent = String(game.second).padStart(3, "0");
}, 1000);

/************ restrt pause contunie positon************** */
document.addEventListener("visibilitychange", function () {
  if (document.hidden) {
    Btn.Pause();
  }
});

document.addEventListener("keydown", (e) => {
  if (e.key == "Escape") {
    if (game.isPaused) {
      Btn.Continue();
    } else {
      Btn.Pause();
    }
  }
});

/*****************LEVEL************************/

export function levelUP() {
  cancelAnimationFrame(requestID.requestID_MoveEnemy);

  if (game.LEVEL === 5) {
    gameOver("YOU WIN!!", 1);
    return;
  }
  if (game.LEVEL == 0) {
    outil.addWalls();
  }
  game.LEVEL++;

  elements.enemysDiv.innerHTML = "";
  outil.distroy(".bullets");
  elements.enemysDiv.style.left = `${Math.ceil(cords.left)}px`;
  elements.enemysDiv.style.top = `${cords.top + 100}px`;

  elements.enemysDiv.style.gridTemplateRows = `repeat(${game.LEVEL}, 62.5px);`;
  elements.enemysDiv.style.height = `${40 * game.LEVEL}px`;

  game.enemyLevel += game.line;
  game.enemyNBR = game.enemyLevel;
  game.isPaused = false;
  for (let i = 0; i < game.enemyLevel; i++) {
    let enemy = document.createElement("div");
    enemy.classList.add("enemy");
    enemy.classList.add("existsEnemy");
    elements.enemysDiv.appendChild(enemy);
  }
  elements.levelDiv.textContent = "LEVEL " + game.LEVEL.toString();
  requestID.requestID_MoveEnemy = requestAnimationFrame(Moving.moveEnemys);
}
/**********************************************/

/****************************************/
export function gameOver(message, win) {
  const cursor = document.getElementById("cursor");
  game.isGamrOver = true;
  elements.divText.style.visibility = "visible";
  elements.enemysDiv.innerHTML = "";
  elements.spanText.textContent = "";
  if (win == 1) {
    elements.spanText.style.color = "green";
    cursor.style.color = "green";
  } else {
    elements.spanText.style.color = "red";
    cursor.style.color = "red";
  }

  animation.animate(message);
  outil.distroy(".bullets");
  //elements.board.removeChild(ship)
}

/*************************************/
function setup() {
  let body_with = window.innerWidth;

  if (body_with < 560 && body_with > 300) {
    elements.enemysDiv.style = `grid-template-columns: repeat(6, 1fr)`;
    game.line = 6;
  } else if (body_with < 300) {
    game.wallNbr = 2;
    elements.enemysDiv.style = `grid-template-columns: repeat(4, 1fr)`;
    game.line = 4;
  } 

  elements.PauseBtn.onclick = Btn.Pause;
  document.getElementById("startCon").onclick = Btn.Continue;
  document.getElementById("restart").onclick = Btn.Restart;
  elements.enemysDiv.style.width = `${cords.width * 0.7}px`;

  elements.divText.style.left = `${cords.left}px`;
  elements.divText.style.top = `${cords.top}px`;
  elements.divText.style.width = `${cords.width}px`;
  elements.divText.style.height = `${cords.height}px`;
  elements.divText.style.visibility = "hidden";

  ship.id = "ship";
  elements.board.appendChild(ship);

  ship.style.top = `${cords.height + cords.top - ship.offsetHeight - 30}px`;
  ship.style.left = `${cords.left + cords.width / 2 - ship.offsetWidth / 2}px`;

  levelUP();
}
setup();
