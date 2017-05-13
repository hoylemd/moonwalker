let Phaser = require('./vendor').phaser;
let LevelState = require('./level_state');
let GameOverState = require('./game_over_state');

function main () {
  // actual size is 966 x 630
  let game = new Phaser.Game(960, 600, Phaser.AUTO, 'game');

  game.state.add('play', new LevelState(game));
  game.state.add('game_over', new GameOverState(game));

  game.state.start('play',                                                      // state name
                   true,                                                        // keep all of the assets
                   false,                                                       // don't keep any world objects
                   {level: 0});                                                 // state spec
}

module.exports = main;
