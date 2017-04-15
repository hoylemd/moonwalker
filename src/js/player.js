let Phaser = require('./vendor').phaser;

function Player(game, x, y) {
  Phaser.Sprite.call(this, game, x, y, 'player');

  this.anchor.set(0.5, 0.5);
}

Player.prototype = Object.create(Phaser.Sprite.prototype);
Player.prototype.constructor = Player;

module.exports = Player;
