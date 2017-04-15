Phaser = require('./phaser_shim.js').phaser;

function main () {
  let game = new Phaser.Game(960, 600, Phaser.AUTO, 'mikes_game');
}

module.exports = main;
