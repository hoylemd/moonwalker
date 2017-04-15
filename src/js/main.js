let Phaser = require('./vendor').phaser;

let play_state = {
  preload: function () {
    this.game.load.image('background', 'images/background.png');
  },
  create: function () {
    this.game.add.image(0, 0, 'background');
  }
};

function main () {
  let game = new Phaser.Game(960, 600, Phaser.AUTO, 'mikes_game');

  game.state.add('play', play_state);

  game.state.start('play');
}

module.exports = main;
