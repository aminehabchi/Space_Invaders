import { game, elements, requestID } from "./script.js";
let bl = false;
setInterval(function () {
  if (game.isGamrOver || game.isPaused) {
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

var index = 0;
var text = "";
var istyping = true;
export function animate(message) {
  istyping = true;
  text = message;
  index = 0;
  animateText();
}
function animateText() {
  if (!game.isGamrOver) {
    return;
  }
  if (istyping) {
    elements.spanText.textContent += text[index];
    index++;
    if (index == text.length) {
      istyping = false;
      requestID.timeoutId = setTimeout(animateText, 1000);
      return;
    }
  } else if (!istyping) {
    elements.spanText.textContent = text.slice(0, index - 1);
    index--;
    if (index == 0) {
      istyping = true;
      requestID.timeoutId = setTimeout(animateText, 1000);
      return;
    }
  }
  requestID.timeoutId = setTimeout(animateText, 300);
}
