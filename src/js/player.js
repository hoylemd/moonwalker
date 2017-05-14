let Phaser = require('./vendor').phaser;

function Player(game, x, y) {
  Phaser.Sprite.call(this, game, x, y, 'player');

  this.anchor.set(0.5, 0.5);

  this.animations.add('stop', [0]);
  this.animations.add('run', [1, 2], 8, true);                                  // 8 fps, looped
  this.animations.add('jump', [3]);
  this.animations.add('fall', [4]);

  this.game.physics.enable(this);
  this.body.collideWorldBounds = true;

  this.speed = 200;

  this.coins = 0;
  this.has_key = false;

  this.move = function(direction) {
    this.body.velocity.x = direction *  this.speed;

    this.scale.x = this.body.velocity.x > 0 ? -1 : 1;
  };

  this.jump = function() {
    const JUMP_SPEED = 600;
    let can_jump = this.body.onFloor();

    if (can_jump) {
      this.body.velocity.y = -JUMP_SPEED;
    }

    return can_jump;
  };

  this.bounce = function() {
    const BOUNCE_SPEED = 200;
    this.body.velocity.y = -1 * BOUNCE_SPEED;
  };

  this.update = function() {
    let current_animation_name = this.get_animation_name();
    if (this.animations.name !== current_animation_name) {
      this.animations.play(current_animation_name);
    }
  };

  this.get_animation_name = function() {
    let velocity = this.body.velocity;
    let is_standing = this.body.onFloor();

    if (velocity.y < 0) {                                                       // moving upwards
      return 'jump';
    } else if (velocity.y && !is_standing) {
      return 'fall';
    } else if (velocity.x !== 0 && is_standing) {
      return 'run';
    }
    return 'stop';
  };
}

Player.prototype = Object.create(Phaser.Sprite.prototype);
Player.prototype.constructor = Player;

module.exports = Player;
