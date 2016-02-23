'use strict';

// Star Class
var Star = function(x, y) {
  this.sprite = 'images/Star.png';
  this.x = x || Math.floor(Math.random() * 5) * 85;
  this.y = y || Math.floor(Math.random() * 5) * 85;
};

// check if player collected the star and reposition it
Star.prototype.checkCollect = function() {
  var xdiff = (player.x - this.x);
  var ydiff = (player.y - this.y);

  if (xdiff >= -50 && xdiff <= 50 && ydiff >= -50 && ydiff <= 30) {
    player.gainPoint();
    star.reposition();
  }
};

// Randomly reposition star
Star.prototype.reposition = function() {
  this.x = Math.floor(Math.random() * 5) * 85;
  this.y = Math.floor(Math.random() * 5) * 85;
};

Star.prototype.update = function() {
  this.checkCollect();
};

Star.prototype.render = function() {
  ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};


// Enemy Class
var Enemy = function(x, y) {
  this.sprite = 'images/enemy-bug.png';
  this.x = x;
  this.y = y;
  // enemy speed randomly generated
  this.speed = Math.floor(Math.random() * 200) + 50;
};

// update move and check check collisions
Enemy.prototype.update = function(dt) {
  this.move(dt);
  this.checkCollisions();
};

// Enemy moves horizontally
Enemy.prototype.move = function(dt) {
  this.x += dt * this.speed;
};

// Draw the enemy on the screen
Enemy.prototype.render = function() {
  ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

// Check collission between 100px horizontally and 80px vertically of enemy sprite
Enemy.prototype.checkCollisions = function() {
  var xdiff = (player.x - this.x);
  var ydiff = (player.y - this.y);

  if (xdiff >= -50 && xdiff <= 50 && ydiff >= -50 && ydiff <= 30) {
    player.loseLife();
  }
};

// Eliminate all Enemies
Enemy.reset = function() {
  allEnemies = [];
  for (var i = 1; i <= 9999; i++) {
    window.clearInterval(i);
  }
};

// Instantiate Enemy and push to allEnemies
Enemy.spawn = function() {
  setInterval(function() {

    // keep array under 50 enemies
    if (allEnemies.length > 100) {
      allEnemies = allEnemies.slice(0, -50);
    }

    // randomized appearance of enemies position
    var bugPositions = [65, 150, 235];
    var yCoor = bugPositions[Math.floor(Math.random() * 5)];
    allEnemies.push(new Enemy(0, yCoor));
  }, Math.random() * 2500 + 0.5);
};


var Player = function() {
  this.sprite = 'images/char-boy.png';
  this.x = 200;
  this.y = 400;
  this.life = 3;
  this.point = 0;
  this.win = false;
};

// Prevent player from going out of bounds/canvas
Player.prototype.boundary = function() {
  if (this.x >= 400) {
    this.x = 400;
  } else if (this.x < 0) {
    this.x = 0;
  }
  if (this.y >= 400) {
    this.y = 400;
  } else if (this.y < 0) {
    this.y = 0;
  }
};

// Reposition player to starting point when lose life
Player.prototype.loseLife = function() {
  this.life--;
    this.x = 200;
  this.y = 400;
};

Player.prototype.gainPoint = function() {
  this.point++;
};

// 5 Points win the game
Player.prototype.checkWin = function() {
  if (this.point >= 5) {
    player.win = true;
  }
};

Player.prototype.update = function() {
  this.boundary();
  this.checkWin();
};

Player.prototype.move = function(x, y) {
  this.x += x;
  this.y += y;
};


// Render Star Collected and Life Info
Player.prototype.renderScoreBoard = function() {
  ctx.clearRect(0, 0, 500, 45);
  ctx.font = '48px serif';
  ctx.fillStyle = '#BD5643';
  ctx.fillText('Life: ' + player.life, 350, 40);

  ctx.fillStyle = '#355796';
  ctx.fillText('Star: ' + player.point, 10, 40);
};

Player.prototype.endGame = function(result) {
  // End Game Text
  ctx.fillText(result, 120, 175);
  ctx.font = '26px serif';
  ctx.fillText('Press Enter To Play Again', 125, 350);

  // Remove enemies
  Enemy.reset();
};

// Render player sprite, scoreboard, and end game status
Player.prototype.render = function() {
  if (player.win) {
    this.endGame('Congratulation');
  } else if (player.life <= 0) {
    this.endGame('Game Over');
  }
  this.renderScoreBoard();
  ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

Player.prototype.handleInput = function(dir) {
  switch (dir) {
    case 'right':
      this.move(10, 0);
      break;
    case 'left':
      this.move(-10, 0);
      break;
    case 'up':
      this.move(0, -10);
      break;
    case 'down':
      this.move(0, 10);
      break;
    case 'new game':
      player = new Player();
      star = new Star();
      Enemy.reset();
      Enemy.spawn();
      break;
  }
};

// Instantiating star and player
var star = new Star(200, 300);
var player = new Player();
var allEnemies = [];
// clearing all intervals and enemies then spawn.
Enemy.reset();
Enemy.spawn();

// Enter and Arrow Keys are only allow
document.addEventListener('keydown', function(e) {
  var allowedKeys = {
    37: 'left',
    38: 'up',
    39: 'right',
    40: 'down',
    13: 'new game'
  };

  player.handleInput(allowedKeys[e.keyCode]);
});
