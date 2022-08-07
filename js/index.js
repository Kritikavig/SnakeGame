let direction = { x: 0, y: 0 };
const foodSound = new Audio("music/food.mp3");
const overSound = new Audio("music/gameover.mp3");
const moveSound = new Audio("music/move.mp3");

let speed = 5;
let score = 0;
let lastTime = 0;
let snakeArr = [{ x: 13, y: 15 }];
food = { x: 6, y: 7 };

//Functions
function main(ctime) 
{
  window.requestAnimationFrame(main);
  if ((ctime - lastTime) / 1000 < 1 / speed) {
    return;
  }
  
  lastTime = ctime;
  gameEngine();
}

function isCollide(snakeArr) 
{
  //when snake touches its tail
  for (let i = 1; i < snakeArr.length; i++) 
  {
    if (snakeArr[i].x === snakeArr[0].x && snakeArr[i].y === snakeArr[0].y) {
      return true;
    }
  }

  //snake comes out of boundary
  if (snakeArr[0].x >= 18 || snakeArr[0].y >= 18 || snakeArr[0].x <= 0 || snakeArr[0].y <= 0) {
    return true;
  }

  return false;
}

function gameEngine() {

  //update snake array, if snake gets collided
  if (isCollide(snakeArr)) 
  {
    overSound.play();
    direction = { x: 0, y: 0 };
    alert("Game Over!. Press any key to play again.");
    snakeArr = [{ x: 13, y: 15 }];
    score = 0;
  }

  //when snake ate food, increment score, relocate food
  if (snakeArr[0].y === food.y && snakeArr[0].x === food.x) 
  {
    foodSound.play();
    score += 1;
    if (score > hiscoreval) 
    {
      hiscoreval = score;
      localStorage.setItem("hiscore", JSON.stringify(hiscoreval));
      hiscoreBox.innerHTML = "Highest Score: " + hiscoreval;
    }
    scoreBox.innerHTML = "Score: " + score;

    //add body of snake at head, when snake eats food
    snakeArr.unshift({x: snakeArr[0].x + direction.x, y: snakeArr[0].y + direction.y});

    //Grid is between 0-18 
    let a = 2;
    let b = 16; 
    food = {
      x: Math.round(a + (b - a) * Math.random()),
      y: Math.round(a + (b - a) * Math.random()),
    }; //random number between a (start) and b (end)
  }

  //Move snake
  for (let i = snakeArr.length - 2; i >= 0; i--) {
    snakeArr[i + 1] = { ...snakeArr[i] }; //last element = second last element
  }

  snakeArr[0].x += direction.x;
  snakeArr[0].y += direction.y;

  //Display snake
  board.innerHTML = "";
  snakeArr.forEach((currElement, index) => {
    snakeElement = document.createElement("div");
    snakeElement.style.gridRowStart = currElement.y;
    snakeElement.style.gridColumnStart = currElement.x;

    if (index == 0) {
      snakeElement.classList.add("head");
    } else {
      snakeElement.classList.add("snake");
    }
    board.appendChild(snakeElement);
  });

  //Display food
  foodElement = document.createElement("div");
  foodElement.style.gridRowStart = food.y;
  foodElement.style.gridColumnStart = food.x;
  foodElement.classList.add("food");
  board.appendChild(foodElement);
}

//Main Logic
//Storing highscore at local storage
let highscore = localStorage.getItem("highscore");
if (highscore === null) {
  hiscoreval = 0;
  localStorage.setItem("hiscore", JSON.stringify(hiscoreval));
} 
else {
  hiscoreval = JSON.parse(highscore);
  hiscoreBox.innerHTML = "Highest Score: " + highscore;
}

window.requestAnimationFrame(main); //loop for game

window.addEventListener("keydown", (element) => {
  direction = { x: 0, y: 1 }; //starting coordinates in the game
  moveSound.play();

  switch (element.key) {
    case "ArrowUp":
      direction.x = 0;
      direction.y = -1; //y becomes +ve as we go down
      break;

    case "ArrowDown":
      direction.x = 0;
      direction.y = 1;
      break;

    case "ArrowLeft":
      direction.x = -1;
      direction.y = 0;
      break;

    case "ArrowRight":
      direction.x = +1;
      direction.y = 0;
      break;

    default:
      break;
  }
});
