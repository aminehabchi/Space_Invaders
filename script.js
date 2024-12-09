let board = document.getElementById("board");

var cords = board.getBoundingClientRect();

let ship = document.createElement("div");
ship.id = "ship";

board.appendChild(ship);

console.log(ship.style.top);
ship.style.top = `${cords.height}px`;
ship.style.left = `${cords.width / 2 + ship.offsetWidth}px`;
console.log(ship.style.left);

window.addEventListener("keydown", (event) => {
  if (event.key == " ") {
    shut();
  } else {
    moveShip(event.key);
  }
});
function shut() {
  let bullet = document.createElement("div");
  bullet.classList.add("bullets");
  bullet.style.left = `${ship.offsetLeft + 45}px`;
  bullet.style.top = `${ship.offsetTop}px`;
  board.appendChild(bullet);
  move(bullet);
}
const bulletSpeed = 5;
function move(bullet) {
  function animate() {
    if (bullet.offsetTop > 0) {
      bullet.style.top = `${bullet.offsetTop - bulletSpeed}px`;
      requestAnimationFrame(animate);
    } else {
      bullet.remove();
    }
  }

  requestAnimationFrame(animate);
}
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
