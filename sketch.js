
let bubbyL, bubbyR, bubbyU, bubbyD; //player icons that match by direction
let kelpForestImg, bubLost, bubWon, menuImg; //bg pics
let menuSong, gameSong, loseFX, winFX;
let font, krill, fish, orca;

let krillCollectibles = [];
let numKrill = 20;
let krillCount = 0;
let krillFlag = false;
let fishCollectibles = [];
let numFish = 2;
let fishCount = 0;
let fishFlag = false;

let playerPos, orcaPopo;
let playerSize = 30;
let playerSpeed = 4; //velocity
let playerLoop = true; // true=loops around edges of canvas, false=stops
// let isHurt = false;

let timeLimit = 30;
let timer = 0;
let state = 0;
 let level = 0; // each time the player wins, make it harder!
let keyNum = 0; //arrow key indicator
let health = 3;

function preload() {
  kelpForestImg = loadImage('Assets/Kelp_southAmerica_NGS.jpg');
  bubLost = loadImage('Assets/bubbyLOST.png');
  bubWon = loadImage('Assets/bubbyWIN.png');
  menuImg = loadImage('Assets/mainMenu.png');

  
  bubbyU = loadImage('Assets/swimUP.gif');
  bubbyD = loadImage('Assets/swimDOWN.gif');
  bubbyL = loadImage('Assets/swimLEFT.gif');
  bubbyR = loadImage('Assets/swimRIGHT.gif');

  menuSong = createAudio('Assets/gusky - PURBLE.mp3');
  loseFX = createAudio('Assets/LOZ - OOC Game Over.mp3');
  gameSong = createAudio('Assets/Xploshi - New You.mp3');
  winFX = createAudio('Assets/Earthbound OST You Win!.mp3');
  
  font = loadFont('Assets/Itim-Regular.ttf');
  
  krill = loadImage('Assets/shrimp.png');
  fish = loadImage('Assets/fish.png');
  orcaLeft = loadImage('Assets/orcaLeft.gif');
}

function setup() {
  createCanvas(400, 400);
  textFont(font);
  textSize(40);
  colorMode(HSB);
  playerPos = createVector(200, 200); //x and y
}

function resetGame() {
  krillFlag = false;
  fishFlag = false;
  krillCollectibles = []; // clear any remaining collectibles (enemies too if implemented)
  fishCollectibles = [];
  
  orcaPopo = new enemy();
  
  for (let i = 0; i < numKrill; i++) {
    krillCollectibles.push(new krillCollectible());
  }
  for (let i = 0; i < numFish; i++) {
      fishCollectibles.push(new fishCollectible());
  }
  krillCount = 0;
  fishCount = 0;
  timer = 0;
  
  // spawn player in middle
  // if you comment these two lines out, player will start from where they were
  
}

function draw() {
  
  switch (state) {
    case 0: // Main Menu
      textSize(40);
      loseFX.stop();
      winFX.stop();
      mainMenu();
      menuSong.loop();
      break;
    case 1: // Game state
      menuSong.stop();
      game();
      gameSong.loop();
      break;
    case 2: // Win state
      gameSong.stop();
      winFX.play();
      winScreen();
      break;
    case 3: // Lose state
      gameSong.stop();
      loseFX.play();
      loseScreen(); //maybe make this change to 1st state once sound is done
      break;
  }
}

function mainMenu() {
  background(menuImg);
  fill('rgb(88,69,38)');
  textAlign(CENTER);
  text("Welcome to \nBubby's Mission", 200, 50);
  textAlign(LEFT);
  textSize(25);
  fill(255);
  text("use the arrow keys to help Bubby \nthe harbor seal collect 45 shrimp \nand 10 fish to bring back to his \nhome planet, but \nbeware of the orca \npolice...", 20, 140);
  fill('rgb(88,69,38)');
  textSize(25)
  text("I'm hungry!!", 260, 345);
 fill(abs(255 * sin(frameCount * 0.005)), 100, 100);
  text("click to play!!!", 245, 375);
}

function levelChange(numLevel){
    if(numLevel == 1){
    numKrill = 15;
    numFish = 3;
    //timeLimit = 25;
    resetGame();
  } else if (numLevel == 2){
    numKrill = 5;
    numFish = 3;
    //timeLimit = 30;
    //orca level
    resetGame();
  }
}

function game() {
  background(kelpForestImg);
  
   if (fishFlag && krillFlag) {
    levelChange(++level);
  }
  
  if(level == 2){
    orcaPopo.display();
    orcaPopo.move();
    fill(255);
    text("Lives: " + (health), width - 150, height - 20);
    if (orcaPopo.pos.dist(playerPos) < playerSize){
      health--;
      // isHurt = true;
      orcaPopo = new enemy();
    }
    
    if (health == 0){
      state = 3;
    }
  }
  
  for (let i = 0; i < krillCollectibles.length; i++) {
    krillCollectibles[i].display();
    krillCollectibles[i].move();
    
    //if collectible i's position's relative distance to player is less than player's size / at same place as player
    if (krillCollectibles[i].pos.dist(playerPos) < playerSize) {
      krillCollectibles.splice(i, 1); //at that index, take 1 fish out
      krillCount++;
      if (krillCollectibles.length == 0) { 
        krillFlag = true;
      }
    }
  }
    
  for (let i = 0; i < fishCollectibles.length; i++) {
    fishCollectibles[i].display();
    fishCollectibles[i].move();
     
    if(fishCollectibles[i].pos.dist(playerPos) < playerSize + 25){
      fishCollectibles[i].moveChange();
    }
      
    if (fishCollectibles[i].pos.dist(playerPos) < playerSize) {
      fishCollectibles.splice(i, 1); //at that index, take 1 fish out
      fishCount++;
      playerSpeed += 0.05;
      
      if (fishCollectibles.length == 0) { 
        fishFlag = true;
      } 
    }
  }
  
  if (level == 3){ //all levels cleared
    numKrill = 20; //reset to beginning values
    numFish = 2;
    state = 2;
  }

    checkForKeys(); // handle keyboard input for player motion
    checkForTwoKeys();
    loopCheck();
  
  
  // Show current status
  fill(255);
  textSize(25);
  text((numKrill - krillCount) + " shrimp left", 200, 50);
  text((numFish - fishCount) + " fish left", 200, 70);
  text("level " + (level + 1), 50, height - 20);
  
  timer++;
  text("time: " +(timeLimit - int(timer / 60)), 50, 50);
  if (timer > timeLimit * 60) { 
    // Game Over!
    state = 3; //if everything isnt collected by this point
  }
}

function winScreen() {
  background(bubWon);
  textAlign(LEFT);
  fill(abs(255 * sin(frameCount * 0.005)), 100, 100);
  text("click to play again", 10, height - 10);
  fill(0);
  text("Mission Accomplished!", 10, 60);
  textAlign(CENTER);
  text("Now Bubby can go back \nhome to his planet.",140, 100);
}

function loseScreen() {
  background(bubLost);
  fill(abs(255 * sin(frameCount * 0.005)), 100, 100);
  textAlign(LEFT);
  text("click to play again", width - 200, height - 10);
  fill(255);
  text("Mission Failed!", width / 4, 150);
  textAlign(CENTER);
  text("Bubby will starve to death and \ncan never go back home to \nsee his family again.", 200, 200);  
}

function mousePressed() {
  if (state == 0) {
    resetGame();
    playerPos.x = width / 2;
    playerPos.y = height / 2;
    level = 0;
    health = 3;
    playerSpeed = 4;
    state = 1; // go to game state
  } else if (state == 1) {
    // click makes something happen during game (maybe not needed?) - is a pause possible
  } else if (state == 2) {
    // win
    state = 0;
  } else if (state == 3) {
    // lose
    state = 0;
  }
}

function checkForKeys() {
  
  if (keyIsDown(LEFT_ARROW)) {
    keyNum = 0;
    playerPos.x -= playerSpeed; //this is how we're moving based on the arrow
  }
  else if (keyIsDown(RIGHT_ARROW)) {
    keyNum = 1;
    playerPos.x += playerSpeed;

  }
  else if (keyIsDown(UP_ARROW)) {
    keyNum = 2;
    playerPos.y -= playerSpeed;

  }
  else if (keyIsDown(DOWN_ARROW)) {
    keyNum = 3;
    playerPos.y += playerSpeed;

  } 
  
  bubbyDisplay(keyNum);
}

function checkForTwoKeys(){
  if (keyIsDown(UP_ARROW) && keyIsDown(LEFT_ARROW)){
    playerPos.y -= playerSpeed /4;
    playerPos.x -= playerSpeed /4;
    
  } else if (keyIsDown(UP_ARROW) && keyIsDown(RIGHT_ARROW)){
    playerPos.y -= playerSpeed /4;
    playerPos.x += playerSpeed /4;
    
  } else if (keyIsDown(DOWN_ARROW) && keyIsDown(LEFT_ARROW)){
    playerPos.y += playerSpeed /4;
    playerPos.x -= playerSpeed /4;
    
  } else if (keyIsDown(DOWN_ARROW) && keyIsDown(RIGHT_ARROW)){
    playerPos.y += playerSpeed /4;
    playerPos.x += playerSpeed /4;
  }
  
}

function loopCheck() {
  if (playerPos.x < 0) { //left
      playerLoop ? (playerPos.x = width) : (playerPos.x = 0);
  }
  if (playerPos.y < 0) { //up
      playerLoop ? (playerPos.y = height) : (playerPos.y = 0);
  }
   if (playerPos.x > width) { //right
      playerLoop ? (playerPos.x = 0) : (playerPos.x = width);
    }
  if (playerPos.y > height) { //down
      playerLoop ? (playerPos.y = 0) : (playerPos.y = height);
    }
}

function bubbyDisplay(keyNum){
  // let o = 100;
  // if (isHurt){
  //   tint(255, 0, 0, o + 20);
  // }
  
  if(keyNum == 0){ //left
    image(bubbyL, playerPos.x - 25, playerPos.y - 55, playerSize *4, playerSize * 4);
  } else if (keyNum == 1){ //right
    image(bubbyR, playerPos.x - 95, playerPos.y - 55, playerSize *4, playerSize * 4);
  } else if (keyNum == 2){ //up
    image(bubbyU, playerPos.x - 60, playerPos.y - 30, playerSize *4, playerSize * 4);
  } else if (keyNum == 3){ //down
    image(bubbyD, playerPos.x - 60, playerPos.y - 90, playerSize *4, playerSize * 4);
  }
}

class krillCollectible {
  // The class's constructor and attributes
  constructor() {
    this.pos = createVector(100, random(50, 350)); //how we can access x and y
    
     this.size = 300;

//     this.r = 255;
//     this.g = 0;
//     this.b = 0;
//     this.o = 100; //opacity
    //this.collectArr = ['fish', 'krill'];
    //this.

    this.xSpeed = random(-5, 5);
    this.ySpeed = random(-5, 5);
  }

  display() {
    image(krill, this.pos.x - 15, this.pos.y - 25, this.size / 6, this.size/ 6);
  }

  move() {
    this.pos.x = this.pos.x + this.xSpeed;
    this.pos.y = this.pos.y + this.ySpeed; //bc of this?
    if (this.pos.x > width) this.pos.x = 0; //allow disappearing and respawning
    if (this.pos.x < 0) this.pos.x = width;
    if (this.pos.y > height) this.pos.y = 0;
    if (this.pos.y < 0) this.pos.y = height;
  }
}

//fish are slower and try to avoid player
class fishCollectible {
  constructor() {
    this.pos = createVector(300, random(50, 350)); 
    this.xSpeed = random(-2,2); //directional
    this.ySpeed = random(-2, 2);
    
    this.size = 50;
  }
  
  display() {
     image(fish, this.pos.x - 25, this.pos.y - 30, this.size, this.size);
  }
  
  move() {
    this.pos.x = this.pos.x + this.xSpeed;
      this.pos.y = this.pos.y + this.ySpeed; 
       
      if (this.pos.x > width) this.pos.x = 0; 
      if (this.pos.x < 0) this.pos.x = width;
      if (this.pos.y > height) this.pos.y = 0;
      if (this.pos.y < 0) this.pos.y = height;
  }
  
  moveChange(){
    if(playerPos.x > this.pos.x){
      this.pos.x -= playerSpeed;
    this.pos.y -= playerSpeed;
    }
    else{
       this.pos.x += playerSpeed;
    this.pos.y += playerSpeed;
    }
    
  }
}

//orca attack
class enemy {
 
  constructor() {
    this.pos = createVector(random(0,width), random(0, height)); 
    this.vel = random(-5,5);
    this.easeAmt = 0.02;
    
    this.shade = random(0, 150);
  }
  
  display() {
    fill(this.shade);
    // circle(this.pos.x, this.pos.y, 30);
    image(orcaLeft, this.pos.x - 50, this.pos.y - 55, 150, 100); //not matching by direction
  }
  
  easeTo() {
    this.pos.x += (playerPos.x - this.pos.x) * this.easeAmt;
    this.pos.y += (playerPos.y - this.pos.y) * this.easeAmt;
  }

  move() {
     this.easeTo();  
  }
}

