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
  isStoryshowed: false,
  score: 0,
  livesNbr: 3,
  wallNbr: 3,
  line: 8,
  second: 0,
  gameresultTexts: [
    "Mission accomplished, hero! The Zorvax are retreating, and Earth is safe thanks to you. Humanity will never forget your bravery! 🌟🎖️",
    "You fought valiantly, pilot, but the Zorvax have gained the upper hand. Earth needs you to rise again! Retry and defend our world! 🔄"
  ]
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
  battlestartbtn: document.querySelector(".battlestart"),
  story: document.getElementById("story"),
  textStory: document.getElementById("textStory")
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
document.addEventListener("DOMContentLoaded", () => {
  Btn.Pause()
  elements.menu.style.display = "none";
  elements.story.style.zIndex = "2";
  game.isStoryshowed = true
})
elements.battlestartbtn.addEventListener("click", () => {
  story.style.display = "none"
  game.isStoryshowed = false
  Btn.Continue()
})
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
    if (game.isPaused && !game.isStoryshowed) {
      Btn.Continue();
    } else {
      Btn.Pause();
    }
  }
});

/*****************LEVEL************************/
const levelMotivations = [
  "Impressive start! But the Zorvax are getting serious. Stay sharp, pilot! 💫",
  "You're a rising star, pilot! The enemy waves are intensifying. Protect Earth at all costs! 🌍",
  "The Zorvax are unleashing their elite forces! This battle will test your skills. Keep fighting! 🚀",
  "This is it, pilot! The Zorvax mothership is within range. Strike with all you've got and save humanity! 🌠"
]
let textlevel = 2
export function levelUP() {

  if (game.LEVEL === 5) {
    gameOver(game.gameresultTexts[0], 1);
    return;
  }

  if (game.LEVEL == 0) {
    outil.addWalls();
  }

  game.LEVEL++;

  if (game.LEVEL === textlevel) {
    game.isStoryshowed = true
    story.style.display = "block"
    Btn.Pause()
    elements.textStory.textContent = levelMotivations[textlevel - 2]
    elements.battlestartbtn.textContent = "continue hero!"
    textlevel++
  }
  elements.enemysDiv.innerHTML = "";
  outil.distroy(".bullets");


 

  elements.enemysDiv.style.gridTemplateRows = `repeat(${game.LEVEL}, 62.5px);`;
  elements.enemysDiv.style.height = `${40 * game.LEVEL}px`;

  game.enemyLevel += game.line;
  game.enemyNBR = game.enemyLevel;
  for (let i = 0; i < game.enemyLevel; i++) {
    let enemy = document.createElement("div");
    enemy.classList.add("enemy");
    enemy.classList.add("existsEnemy");
    elements.enemysDiv.appendChild(enemy);
  }
  elements.levelDiv.textContent = "LEVEL " + game.LEVEL;
}
requestID.requestID_MoveEnemy = requestAnimationFrame(Moving.moveEnemys);
/**********************************************/

/****************************************/
export function gameOver(message, win) {
  game.isGamrOver = true;
  elements.divText.style.visibility = "visible";
  elements.enemysDiv.innerHTML = "";
  elements.spanText.textContent = "";
  elements.spanText.style.fontSize = "25px"
  if (win == 1) {
    elements.spanText.style.color = "green";
  } else {
    elements.spanText.style.color = "red";
  }

  animation.animate(message);
  outil.distroy(".bullets");
  //elements.board.removeChild(ship)
}

/*************************************/

addEventListener("resize", setup);

function setup() {

  elements.PauseBtn.onclick = Btn.Pause;
  document.getElementById("startCon").onclick = Btn.Continue;
  document.getElementById("restart").onclick = Btn.Restart;

  elements.divText.style.left = `${cords.left}px`;
  elements.divText.style.top = `${cords.top}px`;
  elements.divText.style.width = `${cords.width}px`;
  elements.divText.style.height = `${cords.height}px`;
  elements.divText.style.visibility = "hidden";

  elements.enemysDiv.style.top = `${cords.top + 100}px`;

  ship.id = "ship";
  elements.board.appendChild(ship);

  ship.style.top = `${cords.height + cords.top - ship.offsetHeight - 30}px`;
  ship.style.left = `${cords.left + cords.width / 2 - ship.offsetWidth / 2}px`;
  cords = elements.board.getBoundingClientRect();







  const transform = ship.getBoundingClientRect();

  if (transform.left < cords.left) {
    ship.style.transform = ` translateX(${cords.left - transform.left - cords.width / 2 + transform.width / 2}px)`;

  }
  if (transform.right > cords.right) {
    ship.style.transform = ` translateX(${cords.right - transform.right + cords.width / 2 - transform.width / 2}px)`;

  }
}
levelUP();
setup();

