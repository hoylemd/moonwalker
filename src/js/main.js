let Phaser = require('./vendor').phaser;
let Player = require('./player');

let play_state = {
  load_level: function(spec) {
    spec.platforms.forEach(this.spawn_platform, this);
    this.spawn_character('player', spec.hero);
  },
  spawn_platform: function(platform) {
    this.game.add.sprite(platform.x, platform.y, platform.image);
  },
  spawn_character: function(name, spec) {
    this.characters[name] = new Player(this.game, spec.x, spec.y);
    this.game.add.existing(this.characters[name]);
  },

  init: function () {
    this.characters = {};
  },
  preload: function () {
    this.game.load.image('background', 'images/background.png');
    this.game.load.image('ground', 'images/ground.png');
    this.game.load.image('grass:8x1', 'images/grass_8x1.png');
    this.game.load.image('grass:6x1', 'images/grass_6x1.png');
    this.game.load.image('grass:4x1', 'images/grass_4x1.png');
    this.game.load.image('grass:2x1', 'images/grass_2x1.png');
    this.game.load.image('grass:1x1', 'images/grass_1x1.png');

    this.game.load.image('player', 'images/hero_stopped.png');

    this.game.load.json('level:1', 'data/level01.json');
  },
  create: function () {
    this.game.add.image(0, 0, 'background');

    this.load_level(this.game.cache.getJSON('level:1'));
  }
};

function main () {
  let game = new Phaser.Game(960, 600, Phaser.AUTO, 'mikes_game');

  game.state.add('play', play_state);

  game.state.start('play');
}

module.exports = main;
