let board = document.getElementById("board");

var cords = board.getBoundingClientRect();

let ship = document.createElement("div");
ship.id = "ship";
board.appendChild(ship);


ship.style.top = `${cords.height}px`;
ship.style.left = `${cords.width / 2 + ship.offsetWidth}px`;


/*enemy*/
let enemy = document.createElement("div");
enemy.classList.add('enemy')
board.appendChild(enemy)
/***************************/
let derection = true
let enemySpeed = 2
function moveEnemy() {
  if (enemy.offsetLeft > cords.right - enemy.offsetWidth) {
    enemySpeed *= -1
  }
  if (enemy.offsetLeft < board.offsetLeft) {
    enemySpeed *= -1
  }
  enemy.style.left = `${enemy.offsetLeft + enemySpeed}px`
  console.log(enemy.offsetLeft + enemySpeed);
  requestAnimationFrame(moveEnemy)
}
requestAnimationFrame(moveEnemy)
moveEnemy()
/*******************************************/
window.addEventListener("keydown", (event) => {
  if (event.key == " ") {
    shut();
  } else {
    moveShip(event.key);
  }
});

/*******************************************/
const bulletSpeed = 5;
function shut() {
  let bullet = document.createElement("div");
  bullet.classList.add("bullets");
  bullet.style.left = `${ship.offsetLeft + 45}px`;
  bullet.style.top = `${ship.offsetTop}px`;
  board.appendChild(bullet);
  move(bullet);
}

function move(bullet) {
  function animate() {
    if (bullet.offsetTop > cords.top) {
      bullet.style.top = `${bullet.offsetTop - bulletSpeed}px`;
      requestAnimationFrame(animate);
    } else {
      bullet.remove();
    }
  }
  requestAnimationFrame(animate);
}

/*******************************************/
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

