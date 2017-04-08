function start_game() {
  function preload() {
    this.load.image('sky', 'assets/img/sky.png');
    this.load.image('ground', 'assets/img/platform.png');
    this.load.image('star', 'assets/img/star.png');
    this.load.spritesheet('dude', 'assets/img/dude.png', 32, 48);
  }

  function create() {
  }

  function update() {
  }


  return new Phaser.Game(800,
                         600,
                         Phaser.AUTO,
                         '',
                         { preload: preload,
                           create: create,
                           update: update });
}

var game = start_game();
