// Enemies our player must avoid
var Enemy = function(x, y) {
    // Variables applied to each of our instances go here,
    // we've provided one for you to get started

    // The image/sprite for our enemies, this uses
    // a helper we've provided to easily load images
    this.sprite = 'images/enemy-bug.png';
    this.x = x;
    this.y = y;
    this.speed = Math.floor(Math.random() * 200) + 50;
};

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.
    this.x += dt * this.speed;
};

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};





// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.
var Player = function() {
  this.sprite = 'images/char-boy.png';
  this.x = 200;
  this.y = 400;
  this.life = 3;
};

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

Player.prototype.loseLife = function() {
  this.life--
  this.x = 200;
  this.y = 400;
  if (this.life <= 0) {
    player = new Player();
  }
};

Player.prototype.checkWin = function() {
  if (this.y === 0) {
    ctx.strokeText("Winner", 0, 40);
  }
};

Player.prototype.update = function(xdist, ydist) {
  this.x += xdist || 0;
  this.y += ydist || 0;
  this.boundary();
  this.render();
  this.checkWin();
};

Player.prototype.render = function() {
  ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
  console.log(player.life);


  ctx.clearRect(350, 0, 150, 40);
  ctx.font = "48px serif";
  ctx.strokeText("Life: " + player.life, 350, 40, 100);

};

Player.prototype.handleInput = function(dir) {
  switch(dir) {
    case "right":
      this.update(10, 0);
      break;
    case "left":
      this.update(-10, 0);
      break;
    case "up":
      this.update(0, -10);
      break;
    case "down":
      this.update(0, 10);
      break;
  }
};




// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player

var player = new Player();
var allEnemies = [];
function generateEnemy() {
  var bugPositions = [63, 143, 228];
  var yCoor = bugPositions[Math.floor(Math.random() * 3)]
  allEnemies.push(new Enemy(0, yCoor));
}

generateEnemy();
setInterval(function() {
  generateEnemy();
}, Math.random() * 2500) + .5;



// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keydown', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };

    player.handleInput(allowedKeys[e.keyCode]);
});
