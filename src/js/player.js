let Phaser = require('./vendor').phaser;

function Player(game, x, y) {
  Phaser.Sprite.call(this, game, x, y, 'player');

  this.anchor.set(0.5, 0.5);

  this.speed = 2.5;  // moves at 2.5 pixels per frame
  this.move = function(direction) {
    this.x += direction * this.speed;
  };
}

Player.prototype = Object.create(Phaser.Sprite.prototype);
Player.prototype.constructor = Player;

module.exports = Player;
