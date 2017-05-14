let Phaser = require('./vendor').phaser;

function preload() {
  this.game.load.image('key', 'images/key.png');
  this.game.load.image('tiles:ground', 'spritesheets/ground.png');
  this.game.load.image('tiles:background', 'images/blue_grass_background_scaled.png');

  this.game.load.image('invisible-wall', 'images/invisible_wall.png');
  this.game.load.image('icon:coin', 'images/coin_icon.png');

  this.game.load.spritesheet('coin', 'images/coin_animated.png', 22, 22);
  this.game.load.spritesheet('spider', 'images/spider.png', 42, 32);
  this.game.load.spritesheet('player', 'images/hero.png', 36, 42);
  this.game.load.spritesheet('door', 'images/door.png', 42, 66);
  this.game.load.spritesheet('icon:key', 'images/key_icon.png', 34, 30);

  this.game.load.atlasXML('grey_ui',
                          'spritesheets/greySheet.png',
                          'spritesheets/greySheet.xml');

  this.game.load.image('font:numbers', 'images/numbers.png');

  this.game.load.audio('sfx:jump', 'audio/jump.wav');
  this.game.load.audio('sfx:coin', 'audio/coin.wav');
  this.game.load.audio('sfx:stomp', 'audio/stomp.wav');
  this.game.load.audio('sfx:key', 'audio/key.wav');
  this.game.load.audio('sfx:door', 'audio/door.wav');

  this.game.load.tilemap('level:0',
                         'data/levels/level_00.json',
                         null,
                         Phaser.Tilemap.TILED_JSON);

  this.game.load.tilemap('level:1',
                         'data/levels/level_01.json',
                         null,
                         Phaser.Tilemap.TILED_JSON);
}

module.exports = preload;
