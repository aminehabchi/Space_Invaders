import * as main from "./script.js";
import * as outil from "./outils.js";
import * as Moving from "./moving.js";
import { game, requestID, elements } from "./script.js";

export function Restart() {
  cancelAnimationFrame(requestID.requestID_MoveEnemy);
  outil.distroy(".will");
  outil.addWalls();
  if (requestID.timeoutId) {
    clearTimeout(requestID.timeoutId);
  }
  elements.spanText.textContent = "";
  elements.enemysDiv.innerHTML = "";
  elements.PauseBtn.style.visibility = "visible";

  elements.livesDiv.innerHTML = "";
  for (let i = 0; i < 3; i++) {
    elements.livesDiv.innerHTML += elements.live;
  }
  elements.lives = document.querySelectorAll(".lives");
  game.isGamrOver = false;
  game.LEVEL = 0;
  game.enemyLevel = 0;
  game.score = 0;
  elements.ScoreBar.textContent = "0000";
  elements.divText.style.visibility = "hidden";
  elements.menu.style.display = "none";
  elements.blurOverlay.style.zIndex = "-1";
  main.levelUP();
}
export function Pause_Continue() {
  outil.distroy(".bullets");
  if (game.isPaused) {
    game.isPaused = false;
    elements.PauseBtn.style.visibility = "visible";
    elements.menu.style.display = "none";
    elements.blurOverlay.style.zIndex = "-1";
    Moving.moveEnemys();
  } else {
    elements.menu.style.display = "flex";
    elements.blurOverlay.style.zIndex = "1";
    elements.menu.style.zIndex = "2";

    elements.PauseBtn.style.visibility = "hidden";
    game.isPaused = true;
  }
}
