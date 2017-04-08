function start_game() {
  var platforms = null;

  function preload() {
    this.load.image('sky', 'assets/img/sky.png');
    this.load.image('ground', 'assets/img/platform.png');
    this.load.image('star', 'assets/img/star.png');
    this.load.spritesheet('dude', 'assets/img/dude.png', 32, 48);
  }

  function create() {
    this.physics.startSystem(Phaser.Physics.ARCADE);
    this.add.sprite(0, 0, 'sky');
    platforms = this.add.group();
    platforms.enableBody = true;

    var ground = platforms.create(0, this.world.height - 64, 'ground');
    ground.scale.setTo(2, 2);
    ground.body.immovable = true;

    var ledge1 = platforms.create(400, 400, 'ground');
    ledge1.body.immovable = true;

    var ledge2 = platforms.create(-150, 250, 'ground');
    ledge2.body.immovable = true;
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
