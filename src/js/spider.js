let Phaser = require('./vendor').phaser;

function Spider(game, x, y) {

}

Spider.prototype = Object.create(Phaser.Sprite.prototype);
Spider.prototype.constructior = Spider;

module.exports = Spider;
