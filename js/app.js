var Game = (function() {
  'use strict';

  // Superclass Entity
  var Entity = function(x, y, sprite) {
    this.sprite = sprite;
    this.x = x;
    this.y = y;
  };

  Entity.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
  };


  var Obstacle = function() {
    this.yPositions = [65, 150, 235, 320];
    var y = this.yPositions[Math.floor(Math.random() * 4)];
    var x = (Math.floor(Math.random() * 3) * 100) + 100 ;
    Entity.call(this, x, y, 'images/Rock.png');
  };

  Obstacle.prototype = Object.create(Entity.prototype);
  Obstacle.constructor = Obstacle;

  Obstacle.spawn = function() {
    game.allObstacles = [];
    var totalObstacle = Math.floor(Math.random() * 3 + 1);
    for (var i = 0; i < totalObstacle; i++) {
      game.allObstacles.push(new Obstacle());
    }
  };

  // Star Class
  var Star = function(x, y) {
    x = x || Math.floor(Math.random() * 5) * 85;
    y = y || Math.floor(Math.random() * 5) * 85;
    Entity.call(this, x, y, 'images/Star.png');
  };

  Star.prototype = Object.create(Entity.prototype);
  Star.constructor = Star;

  // check if player collected the star and reposition it
  Star.prototype.checkCollect = function() {
    var xdiff = (game.player.x - this.x);
    var ydiff = (game.player.y - this.y);

    if (xdiff >= -50 && xdiff <= 50 && ydiff >= -50 && ydiff <= 30) {
      game.player.gainPoint();
      this.reposition();
    }
  };

  // Randomly reposition star
  Star.prototype.reposition = function() {
    if (game.player.point >= 5) {
      // Move Star off screen
      this.x = 600;
      this.y = 600;
    } else {
      this.x = Math.floor(Math.random() * 5) * 85;
      this.y = Math.floor(Math.random() * 5) * 85;
      if (!this.locationAvailable(this.x, this.y)) {
        this.reposition();
      }
    }
  };

  Star.prototype.locationAvailable = function(x, y) {
    return game.allObstacles.every(function(obstacle) {
      var xdiff = (x - obstacle.x);
      var ydiff = (y - obstacle.y);

      if (xdiff >= -50 && xdiff <= 50 && ydiff >= -50 && ydiff <= 30) {
        return false;
      } else {
        return true;
      }
    });
  };

  Star.prototype.update = function() {
    this.checkCollect();
  };


  // Enemy Class
  var Enemy = function(y, direction) {
    // enemy speed randomly generated
    this.speed = Math.floor(Math.random() * 200) + 50;
    this.direction = direction;
    if (this.direction === 'right') {
      Entity.call(this, 0, y, 'images/enemy-bug.png');
    } else {
      Entity.call(this, 399, y, 'images/enemy-bug.png');
    }
  };
  Enemy.prototype = Object.create(Entity.prototype);
  Enemy.constructor = Enemy;

  // update move and check check collisions
  Enemy.prototype.update = function(dt) {
    this.move(dt);
    this.checkCollisions();
    this.checkObstacle();
  };

  // Enemy moves horizontally
  Enemy.prototype.move = function(dt) {
    if (this.direction === 'right') {
      this.x += dt * this.speed;
    } else if (this.direction === 'left') {
      this.x -= dt * this.speed;
    }
  };

  // Check collission between 100px horizontally and 80px vertically of enemy sprite
  Enemy.prototype.checkCollisions = function() {
    var xdiff = (game.player.x - this.x);
    var ydiff = (game.player.y - this.y);

    if (xdiff >= -50 && xdiff <= 50 && ydiff >= -50 && ydiff <= 30) {
      game.player.loseLife();
    }
  };

  Enemy.prototype.checkObstacle = function() {
    var enemy = this;
    game.allObstacles.forEach(function(obstacle) {
      var xdiff = (enemy.x - obstacle.x);
      var ydiff = (enemy.y - obstacle.y);

      if (xdiff >= -50 && xdiff <= 50 && ydiff >= -50 && ydiff <= 30) {
        if (enemy.direction === 'right') {
          enemy.direction = 'left';
          enemy.x -= 25;
        } else if (enemy.direction === 'left') {
          enemy.direction = 'right';
          enemy.x += 25;
        }
      }
    });
  };

  // Eliminate all Enemies
  Enemy.reset = function() {
    game.allEnemies = [];
    for (var i = 1; i < 99999; i++) {
      window.clearInterval(i);
    }
  };

  // Instantiate Enemy and push to allEnemies
  Enemy.spawn = function() {
    var bugPositions = [65, 150, 235];
    var directions = ['right', 'left'];
    setInterval(function() {

      // keep array under 50 enemies
      if (game.allEnemies.length > 100) {
        game.allEnemies = game.allEnemies.slice(0, -50);
      }

      // randomized appearance of enemies position
      var yCoor = bugPositions[Math.floor(Math.random() * 5)];
      var direction = directions[Math.floor(Math.random() * 2)];
      game.allEnemies.push(new Enemy(yCoor, direction));
    }, Math.random() * 2500 + 0.5);
  };


  var Player = function() {
    Entity.call(this, 200, 400, 'images/char-boy.png');
    this.life = 3;
    this.point = 0;
    this.win = false;
  };

  Player.prototype = Object.create(Entity.prototype);
  Player.constructor = Player;

  // Prevent player from going out of bounds/canvas
  Player.prototype.withinbounds = function(x, y) {
    var player = this;
    if (player.x + x >= 400 || player.x + x < 0 || player.y + y >= 400 || player.y + y < 0) {
      return false;
    }

    return game.allObstacles.every(function(obstacle) {
      var xdiff = (player.x + x - obstacle.x);
      var ydiff = (player.y + y - obstacle.y);

      if (xdiff >= -50 && xdiff <= 50 && ydiff >= -50 && ydiff <= 30) {
        return false;
      } else {
        return true;
      }
    });
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

  // 5 Points and reaching water at coordinate y-0 to win game
  Player.prototype.checkWin = function() {
    if (this.point >= 5 && this.y === 0) {
      this.win = true;
    }
  };

  Player.prototype.update = function() {
    this.checkWin();
  };

  Player.prototype.move = function(x, y) {
    if (this.withinbounds(x, y)) {
      this.x += x;
      this.y += y;
    }
  };


  // Render Star Collected and Life Info
  Player.prototype.renderScoreBoard = function() {
    ctx.clearRect(0, 0, 500, 45);
    ctx.font = '48px serif';
    ctx.fillStyle = '#BD5643';
    ctx.fillText('Life: ' + this.life, 350, 40);

    ctx.fillStyle = '#355796';
    ctx.fillText('Star: ' + this.point, 10, 40);
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
    if (this.win) {
      this.endGame('Congratulation');
    } else if (this.life <= 0) {
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
        game.player = new Player();
        game.star = new Star();
        Obstacle.spawn();
        Enemy.reset();
        Enemy.spawn();
        break;
    }
  };


  // Enter and Arrow Keys are only allow
  document.addEventListener('keydown', function(e) {
    var allowedKeys = {
      37: 'left',
      38: 'up',
      39: 'right',
      40: 'down',
      13: 'new game'
    };

    game.player.handleInput(allowedKeys[e.keyCode]);
  });



  // Instantiating star and player
  var game = {
    star: new Star(200, 300),
    player: new Player(),
    allEnemies: [],
    allObstacles: []
  };

  Obstacle.spawn();
  // clearing all intervals and enemies then spawn.
  Enemy.reset();
  Enemy.spawn();

  // game obj will be available globally
  return game;
})();
