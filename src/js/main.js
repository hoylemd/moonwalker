let Phaser = require('./vendor').phaser;
let Player = require('./player');

let preload = require('./preload');

let play_state = {
  load_level: function(spec) {
    const GRAVITY = 1200;
    this.game.physics.arcade.gravity.y = GRAVITY;

    this.platforms = this.game.add.group();
    spec.platforms.forEach(this.spawn_platform, this);

    this.coins = this.game.add.group();
    spec.coins.forEach(this.spawn_coin, this);

    this.player = this.spawn_character('player', spec.hero);
  },
  spawn_platform: function(spec) {
    let platform = this.platforms.create(spec.x, spec.y, spec.image);
    this.game.physics.enable(platform);
    platform.body.allowGravity = false;
    platform.body.immovable = true;
    return platform;
  },
  spawn_character: function(name, spec) {
    this.characters[name] = new Player(this.game, spec.x, spec.y);
    this.game.add.existing(this.characters[name]);
    return this.characters[name];
  },
  spawn_coin: function(spec) {
    let coin = this.coins.create(spec.x, spec.y, 'coin');
    coin.anchor.set(0.5, 0.5);
    return coin;
  },
  handle_input: function() {
    let direction = 0;
    if (this.keys.left.isDown) {
      direction -= 1;
    }
    if (this.keys.right.isDown) {
      direction += 1;
    }

    this.player.move(direction);
  },
  handle_collisions: function() {
    this.game.physics.arcade.collide(this.player, this.platforms);
  },

  init: function () {
    this.game.renderer.renderSession.roundPixels = true;

    this.characters = {};

    this.keys = this.game.input.keyboard.addKeys({
      left: Phaser.KeyCode.LEFT,
      right: Phaser.KeyCode.RIGHT,
      up: Phaser.KeyCode.UP
    });

    this.keys.up.onDown.add(function() {
      if (this.player.jump()) {
        this.sfx.jump.play();
      }
    }, this);
  },
  preload: preload,
  create: function () {
    this.game.add.image(0, 0, 'background');

    this.sfx = {
      jump: this.game.add.audio('sfx:jump')
    };

    this.load_level(this.game.cache.getJSON('level:1'));
  },
  update: function () {
    this.handle_input();
    this.handle_collisions();
  }
};

function main () {
  let game = new Phaser.Game(960, 600, Phaser.AUTO, 'mikes_game');

  game.state.add('play', play_state);

  game.state.start('play');
}

module.exports = main;
