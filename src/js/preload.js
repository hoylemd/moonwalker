let Phaser = require('./vendor').phaser;


function preload() {
  let game = this.game;
  game.levels = [];

  function preload_level(number) {
    game.levels.push(
      game.load.tilemap(`level:${number}`,
                        `data/levels/level_${number}.json`,
                        null,
                        Phaser.Tilemap.TILED_JSON));
  }

  game.load.image('key', 'images/key.png');
  game.load.image('tiles:ground', 'spritesheets/ground.png');
  game.load.image('tiles:background', 'images/blue_grass_background_scaled.png');

  game.load.image('invisible-wall', 'images/invisible_wall.png');
  game.load.image('icon:coin', 'images/coin_icon.png');

  game.load.spritesheet('coin', 'spritesheets/coin_animated.png', 22, 22);
  game.load.spritesheet('spider', 'spritesheets/spider.png', 42, 32);
  game.load.spritesheet('player', 'spritesheets/player.png', 31, 42);
  game.load.spritesheet('door', 'images/door.png', 42, 66);
  game.load.spritesheet('icon:key', 'images/key_icon.png', 34, 30);

  game.load.atlasXML('grey_ui',
                          'spritesheets/greySheet.png',
                          'spritesheets/greySheet.xml');

  game.load.image('font:numbers', 'images/numbers.png');

  game.load.audio('sfx:jump', 'audio/jump.wav');
  game.load.audio('sfx:coin', 'audio/coin.wav');
  game.load.audio('sfx:stomp', 'audio/stomp.wav');
  game.load.audio('sfx:key', 'audio/key.wav');
  game.load.audio('sfx:door', 'audio/door.wav');

  preload_level(0);
  preload_level(1);
  preload_level(2);
}

module.exports = preload;
