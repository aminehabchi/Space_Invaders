import * as Moving from "./moving.js";
import * as outil from "./outils.js";
import * as Btn from "./button.js";
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
  time: 0,
  gameresultTexts: [
    "Mission accomplished, hero! The Zorvax are retreating, and Earth is safe thanks to you. Humanity will never forget your bravery! 🌟🎖️",
    "You fought valiantly, pilot, but the Zorvax have gained the upper hand. Earth needs you to rise again! Retry and defend our world! 🔄"
  ],
  levelMotivations: [
    "Impressive start! But the Zorvax are getting serious. Stay sharp, pilot! 💫",
    "You're a rising star, pilot! The enemy waves are intensifying. Protect Earth at all costs! 🌍",
    "The Zorvax are unleashing their elite forces! This battle will test your skills. Keep fighting! 🚀",
    "This is it, pilot! The Zorvax mothership is within range. Strike with all you've got and save humanity! 🌠"
  ]
};
export var speed = {
  bulletSpeed: 5,
  enemySpeed: 1,
  shipSpeed: 3,
  speedEnemyBullet: 5,
}

export var elements = {
  timer: document.getElementById("timer"),
  ScoreBar: document.getElementById("score"),
  menu: document.querySelector("#menu"),
  enemysDiv: document.getElementById("enemysDiv"),
  board: document.getElementById("board"),
  levelDiv: document.getElementById("level"),
  blurOverlay: document.querySelector("#blur-overlay"),
  PauseBtn: document.querySelector("#pause"),
  lives: document.querySelectorAll(".lives"),
  story: document.getElementById("story"),
  textStory: document.getElementById("textStory"),
  Walls: document.getElementById("Walls"),
  battlestartbtn: document.querySelector(".battlestart"),
  spantext: document.getElementById("7lof"),
};

export var requestID = {
  requestID: 0,
};

export var cords = elements.board.getBoundingClientRect();
export let ship = document.createElement("div");

/**********************************************/

document.addEventListener("DOMContentLoaded", () => {
  Btn.Pause()
  elements.menu.style.display = "none";
  elements.story.style.zIndex = "2";
  game.isStoryshowed = true
})

elements.battlestartbtn.addEventListener("click", () => {
  story.style.display = "none"
  game.isStoryshowed = false
  console.log(game.isGamrOver);
  if (game.isGamrOver) {

    Btn.Restart()
  } else {
    Btn.Continue()
  }
})

setInterval(function updatetimer() {
  if (game.isGamrOver || game.isPaused) {
    return;
  }
  game.second++;
  elements.timer.textContent = String(game.second).padStart(3, "0");
}, 1000);

/************ restrt pause contunie positon************** */
let ss = 0
setInterval(() => {
  ss++
  elements.spantext.textContent = "" + ss
  if (ss == 1000) {
    ss = 0
  }
}, 11)
document.addEventListener("keydown", (e) => {
  if (game.isStoryshowed) return
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
    gameOver(1);
    return;
  }
  if (game.LEVEL == 0) {
    outil.addWalls();
  }
  game.LEVEL++;

  if (game.LEVEL > 1) {
    game.isStoryshowed = true
    elements.story.style.display = "flex"
    Btn.Pause()
    elements.textStory.textContent = game.levelMotivations[game.LEVEL - 2]
    elements.battlestartbtn.textContent = "continue hero!"
  }


  elements.enemysDiv.innerHTML = "";
  outil.distroy(".bullets");
  elements.enemysDiv.style.left = `${Math.ceil(cords.left)}px`;
  elements.enemysDiv.style.top = `${cords.top + 100}px`;

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

  elements.levelDiv.textContent = "LEVEL " + game.LEVEL.toString();
}


function gameLoop(t) {

  Moving.moveShip();
  Moving.moveEnemys();
  Moving.enemyShoot(t)
  Moving.moveBullet()
  Moving.movingEnemybullets()

  requestID.requestID = requestAnimationFrame(gameLoop);
}

/**********************************************/

/****************************************/
export function gameOver(win) {
  game.isGamrOver = true;
  game.isStoryshowed = true
  elements.story.style.display = "flex"
  if (win == 1) {
    elements.textStory.textContent = game.gameresultTexts[0];
    elements.textStory.style.color = "green";
  } else {
    elements.textStory.textContent = game.gameresultTexts[1];
    elements.textStory.style.color = "red";
  }
  elements.battlestartbtn.textContent = "play again"

  outil.distroy(".bullets");
  //elements.board.removeChild(ship)
}

/*************************************/
export function setup() {
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


  ship.id = "ship";
  elements.board.appendChild(ship);

  ship.style.top = `${cords.height + cords.top - ship.offsetHeight - 30}px`;
  ship.style.left = `${cords.left + cords.width / 2 - ship.offsetWidth / 2}px`;

  levelUP();
  requestID.requestID = requestAnimationFrame(gameLoop);
}

setup();


let bl = false;
setInterval(function () {
  if (game.isGamrOver || game.isPaused) {
    return;
  }
  let existEnemy = document.querySelectorAll(".existsEnemy");
  if (!existEnemy) {
    return;
  }
  existEnemy.forEach((e) => {
    if (bl) {
      e.style.backgroundImage = "url('assets/InvaderB1.png')";
    } else {
      e.style.backgroundImage = "url('assets/InvaderB2.png')";
    }
  });
  if (bl) {
    bl = false;
  } else {
    bl = true;
  }
}, 500);
