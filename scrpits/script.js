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
  score: 0,
};
export var speed = {
  bulletSpeed: 8,
  enemySpeed: 1,
  shipSpeed: 3,
  speedEnemyBullet: 5,
};

export var elements = {
  ScoreBar: document.getElementById("score"),
  menu: document.querySelector("#menu"),
  enemysDiv: document.getElementById("enemysDiv"),
  board: document.getElementById("board"),
  levelDiv: document.getElementById("level"),
  divText: document.getElementById("textAnimation"),
  blurOverlay: document.querySelector("#blur-overlay"),
  PauseBtn: document.querySelector("#pause"),
  livesDiv: document.getElementById("lives"),
  lives: document.querySelectorAll(".lives"),
  spanText: document.getElementById("text"),
  live: `<span class="lives material-symbols-outlined">
settings_heart
</span>`,
  Walls: document.getElementById("Walls"),
};

export var requestID = {
  requestID_MoveEnemy: 0,
  requestID_MoveShip: 0,
  timeoutId: 0,
};

export var cords = elements.board.getBoundingClientRect();

elements.divText.style.left = `${cords.left}px`;
elements.divText.style.top = `${cords.top}px`;
elements.divText.style.width = `${cords.width}px`;
elements.divText.style.height = `${cords.height}px`;
elements.divText.style.visibility = "hidden";

elements.levelDiv.style.left = `${
  elements.board.offsetWidth +
  elements.levelDiv.offsetLeft -
  elements.levelDiv.offsetWidth
}px`;

elements.levelDiv.style.top = `${cords.top}px`;
export let ship = document.createElement("div");
ship.id = "ship";
elements.board.appendChild(ship);

ship.style.top = `${cords.height + cords.top - ship.offsetHeight - 30}px`;
ship.style.left = `${cords.left + cords.width / 2 - ship.offsetWidth / 2}px`;

elements.livesDiv.style.top = `${cords.top}px`;
elements.livesDiv.style.left = `${
  cords.left + cords.width / 2 - elements.levelDiv.offsetWidth / 2
}px`;

elements.Walls.style.width = `${cords.width}px`;
elements.Walls.style.height = "60px";
elements.Walls.style.left = `${cords.left}px`;
elements.Walls.style.top = `${cords.top + 500}px`;

/************ restrt pause contunie positon************** */

elements.PauseBtn.onclick = Btn.Pause_Continue;

document.getElementById("startCon").onclick = Btn.Pause_Continue;
document.getElementById("restart").onclick = Btn.Restart;

elements.PauseBtn.style.left = `${cords.right}px`;
elements.PauseBtn.style.top = `${cords.bottom}px`;

/*****************LEVEL************************/

export function levelUP() {
  cancelAnimationFrame(requestID.requestID_MoveEnemy);

  if (game.LEVEL === 1) {
    gameOver("YOU WIN!!");
    return;
  }
  if (game.LEVEL == 0) {
    outil.addWalls();
  }
  game.LEVEL++;

  elements.enemysDiv.innerHTML = "";
  outil.distroy(".bullets");
  elements.enemysDiv.style.left = `${Math.ceil(cords.left)}px`;
  elements.enemysDiv.style.top = `${cords.top + 60}px`;

  elements.enemysDiv.style.gridTemplateRows = `repeat(${game.LEVEL}, 62.5px);`;
  elements.enemysDiv.style.height = `${40 * game.LEVEL}px`;

  game.enemyLevel += 8;
  game.enemyNBR = game.enemyLevel;
  game.isPaused = false;
  for (let i = 0; i < game.enemyLevel; i++) {
    let enemy = document.createElement("div");
    enemy.classList.add("enemy");
    enemy.classList.add("exist");
    enemy.id = i.toString();
    elements.enemysDiv.appendChild(enemy);
  }
  elements.levelDiv.textContent = "LEVEL " + game.LEVEL.toString();
  requestID.requestID_MoveEnemy = requestAnimationFrame(Moving.moveEnemys);
}
/**********************************************/

levelUP();

/****************************************/
export function gameOver(message) {
  game.isGamrOver = true;
  elements.divText.style.visibility = "visible";
  elements.enemysDiv.innerHTML = "";
  elements.spanText.textContent = "";
  animation.animate(message);
  outil.distroy(".bullets");
}

/*************************************/
