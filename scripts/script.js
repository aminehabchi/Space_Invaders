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
  esc: 0,
  wallNbr: 3,
  line: 8,
};
export var speed = {
  bulletSpeed: 8,
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
  livesDiv: document.getElementById("lives"),
  lives: document.querySelectorAll(".lives"),
  spanText: document.getElementById("text"),
  live: `<img class="livesimg" src="backgd.jpg" alt="">`,
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


export let ship = document.createElement("div");
ship.id = "ship";
elements.board.appendChild(ship);

ship.style.top = `${cords.height + cords.top - ship.offsetHeight - 30}px`;
ship.style.left = `${cords.left + cords.width / 2 - ship.offsetWidth / 2}px`;

/********************************************* */



let body_with = window.innerWidth

console.log(body_with);

if (body_with > 560) {
  elements.enemysDiv.style = `grid-template-columns: repeat(6, 1fr)`
  game.line = 6
} else if (body_with > 200) {
  game.wallNbr = 2
  elements.enemysDiv.style = `grid-template-columns: repeat(4, 1fr)`
  game.line = 4
} else {
  // return
}



elements.enemysDiv.style.width = `${cords.width * 0.7}px`


/*************************** */

let s = 0
let interval
function updatetimer() {
  if (game.isGamrOver) {
    clearInterval(interval)
    elements.timer.textContent = s
    return
  }
  s++
  if (s < 10) {
    elements.timer.textContent = "0" + s
  } else {
    elements.timer.textContent = s
  }
}
function starttimer() {
  interval = setInterval(updatetimer, 1000)
}
elements.PauseBtn.addEventListener('click', () => {
  clearInterval(interval)
})

document.getElementById("restart").addEventListener('click', () => {
  clearInterval(interval)
  s = 0
  elements.timer.textContent = "0" + s
  starttimer()
})
document.getElementById("startCon").addEventListener('click', () => {
  starttimer()
})
starttimer()
elements.Walls.style.width = `${cords.width}px`;
elements.Walls.style.height = "60px";
elements.Walls.style.left = `${cords.left}px`;
elements.Walls.style.top = `${cords.top + cords.height * 0.65}px`;

/************ restrt pause contunie positon************** */

elements.PauseBtn.onclick = Btn.Pause_Continue;
document.addEventListener("keydown", (e) => {
  if (e.key == "Escape") {
    game.esc++
    if (game.esc % 2 !== 0) {
      Btn.Pause_Continue()
      clearInterval(interval)
    } else {
      Btn.Pause_Continue();
      starttimer();
    }
  }
})
document.getElementById("startCon").onclick = Btn.Pause_Continue;
document.getElementById("restart").onclick = Btn.Restart;

elements.PauseBtn.style.left = `${cords.right - elements.PauseBtn.offsetWidth}px`;
elements.PauseBtn.style.top = `${cords.bottom}px`;

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
export function gameOver(message, win) {
  const cursor = document.getElementById("cursor")
  game.isGamrOver = true;
  elements.divText.style.visibility = "visible";
  elements.enemysDiv.innerHTML = "";
  elements.spanText.textContent = "";
  if (win == 1) {
    elements.spanText.style.color = "green"
    cursor.style.color = "green"
  } else {
    elements.spanText.style.color = "red"
    cursor.style.color = "red"
  }

  animation.animate(message);
  outil.distroy(".bullets");
  //elements.board.removeChild(ship)
}

/*************************************/
