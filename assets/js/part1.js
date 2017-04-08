
function preload() {
}

function create() {
}

function update() {
}

function start_game() {
  return new Phaser.Game(800,
                         600,
                         Phaser.AUTO,
                         '',
                         { preload: preload,
                           create: create,
                           update: update });
}

var game = start_game();
