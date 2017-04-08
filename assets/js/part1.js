function start_game() {
  var platforms = null;
  var player = null;

  var cursors = null;

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

    player = this.add.sprite(32, this.world.height - 150, 'dude');
    this.physics.arcade.enable(player);
    player.body.bounce.y = 0.2;
    player.body.gravity.y = 300;
    player.body.collideWorldBounds = true;

    player.animations.add('left', [0, 1, 2, 3], 10, true);
    player.animations.add('right', [5, 6, 7, 8], 10, true);

    cursors = this.input.keyboard.createCursorKeys();
  }

  function update() {
    player.body.velocity.x = 0;

    if (cursors.left.isDown) {
      player.body.velocity.x = -150;
      player.animations.play('left');
    } else if (cursors.right.isDown) {
      player.body.velocity.x = 150;
      player.animations.play('right');
    } else {
      player.animations.stop();
      player.frame = 4;
    }

    var standing = this.physics.arcade.collide(player, platforms);

    if (cursors.up.isDown && player.body.touching.down && standing) {
      player.body.velocity.y = -250;
    }
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
