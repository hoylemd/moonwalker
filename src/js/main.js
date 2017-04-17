let Phaser = require('./vendor').phaser;
let LevelState = require('./level_state');

function main () {
  let game = new Phaser.Game(960, 600, Phaser.AUTO, 'game');

  game.state.add('play', new LevelState(game));

  game.state.start('play',                                                      // state name
                   true,                                                        // keep all of the assets
                   false,                                                       // don't keep any world objects
                   {level: 0});                                                 // state spec
}

module.exports = main;
