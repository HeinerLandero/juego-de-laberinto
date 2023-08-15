const canvas = document.querySelector('#game');
const game = canvas.getContext('2d');
const btnUp = document.querySelector('#up');
const btnDown = document.querySelector('#down');
const btnRight = document.querySelector('#right');
const btnLeft = document.querySelector('#left');
const parrafo = document.querySelector('#parrafo');
const spanLives = document.querySelector('#lives');
const spanTime = document.querySelector('#time');


let canvasSize;
let elementsSize;
let level = 0 ; 
let lives = 3 ;

let timeStart;
let timePlayer;
let timeInterval;


const playerPosition = {
  x: undefined,
  y: undefined,
};
const giftPosition = {
  x: undefined,
  y: undefined,
};

let enemyPositions = [];

window.addEventListener('load', setCanvasSize);
window.addEventListener('resize', setCanvasSize);

function setCanvasSize(){
  if (window.innerHeight > window.innerWidth) {
    canvasSize = window.innerWidth * 0.8  ;
  } else {
    canvasSize = window.innerHeight * 0.8;
  }
  
  canvas.setAttribute('width', canvasSize);
  canvas.setAttribute('height', canvasSize);
  
  elementsSize = canvasSize / 10.09;
  startGame();
  
};
function showLives(){
  const heartsArrays = Array(lives).fill(emojis['HEART']);
  console.log(heartsArrays);

  spanLives.innerHTML = emojis["HEART"].repeat(lives)
};

function startGame(){
  console.log({ canvasSize, elementsSize });
  
  game.font = elementsSize + 'px Verdana';
  game.textAlign = 'end';
  const map = maps[level];
  
  if(!map){
    gameWin();
    return;
  }

  if(!timeStart){
    timeStart =  Date.now();
    timeInterval = setInterval(showTime, 100);
  }
  
  const mapRows = map.trim().split('\n');
  const mapCols = mapRows.map(row => row.trim().split(''))
  showLives();  
  
  enemyPositions = [];
  game.clearRect(0,0,canvasSize,canvasSize);
  mapCols.forEach((row, rowI) => {
    row.forEach(((col,colI)=>{
      const emoji = emojis[col];
      const posX = elementsSize*(colI +1);
      const posY = elementsSize*(rowI +1);

      if(col=='O'){
        if(!playerPosition.x && !playerPosition.y){
          playerPosition.x = posX;
          playerPosition.y = posY;
          console.log({playerPosition});
        }
      }else if (col == 'I'){
        giftPosition.x = posX;
        giftPosition.y = posY; 
      } else if (col == 'X') {
        enemyPositions.push({
          x: posX,
          y: posY,
        });
      }
      game.fillText(emoji,posX,posY);
      
    }));
    
  });
  movePlayer();
};
 
function levelFail(){
  console.log('chocaste contra un enemigo');
  lives--;
  if(lives <= -1){   
    level = 0;
    lives = 3;
    timeStart = undefined;
  }
  playerPosition.x = undefined;
  playerPosition.y = undefined;
  startGame();
}
function movePlayer(){
  
  const giftCollitionX = playerPosition.x.toFixed(3) == giftPosition.x.toFixed(3);
  const giftCollitionY = playerPosition.y.toFixed(3) == giftPosition.y.toFixed(3);
  const giftCollision = giftCollitionX && giftCollitionY;
  
  
  if(giftCollision){
    levelWin();
  };
  const enemyCollision = enemyPositions.find(enemy =>{
    const enemyCollisionX = enemy.x.toFixed(3) == playerPosition.x.toFixed(3);
    const enemyCollisionY = enemy.y.toFixed(3) == playerPosition.y.toFixed(3);
    return enemyCollisionX && enemyCollisionY;
  });

  if(enemyCollision){
    return levelFail();
  }
  
  game.fillText(emojis['PLAYER'], playerPosition.x, playerPosition.y);
};

function levelWin(){
  console.log('subiste de nivel');
  level++;
  startGame();
};
function gameWin(){
  console.log('Ganaste capo');
  clearInterval(timeInterval);
  const recordTime = localStorage.getItem('record_time');
  const playerTime = Date.now() - timeStart;

  if(recordTime){ 
    if(recordTime >= playerTime ){
      localStorage.setItem('record_time', playerTime);
      console.log('Nuevo record');
    } else{
      console.log('Lo siento, no superaste el record');
    }
  } else{
    localStorage.setItem('record_time', playerTime)
  }
  console.log({recordTime, playerTime});
}
function showTime(){
  spanTime.innerHTML = Date.now() - timeStart;
}

window.addEventListener('keydown', moveByKeys)
btnUp.addEventListener('click',moveUp);
btnDown.addEventListener('click',moveDown);
btnRight.addEventListener('click', moveRight);
  btnLeft.addEventListener('click', moveLeft);


  function moveByKeys(event){
    if( event.key == 'ArrowUp') moveUp();
     else if(event.key =='ArrowDown')  moveDown();
     else if(event.key =='ArrowLeft')  moveLeft();
     else if(event.key =='ArrowRight') moveRight();
  };

  function moveUp(){
    if((playerPosition.y - elementsSize) < elementsSize){
      console.log('OUT');
    } else {
    playerPosition.y -= elementsSize;
    startGame();
  }  
  };
  function moveDown(){
    if ((playerPosition.y + elementsSize) > canvasSize) {
      console.log('OUT');
    } else {
      playerPosition.y += elementsSize;
    startGame();
    }
      };
  function moveLeft(){
    if((playerPosition.x - elementsSize) < elementsSize){
      console.log('OUT');
    } else {
    playerPosition.x -= elementsSize;
    startGame();
  }
  };
  function moveRight(){
  if ((playerPosition.x + elementsSize) > canvasSize) {
    console.log('OUT');
  } else {
    playerPosition.x += elementsSize;
    startGame();
  }
  };

