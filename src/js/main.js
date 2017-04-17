let Phaser = require('./vendor').phaser;
let Player = require('./player');
let Spider = require('./spider');

let preload = require('./preload');

let play_state = {
  load_level: function(spec) {
    const GRAVITY = 1200;
    this.game.physics.arcade.gravity.y = GRAVITY;

    this.platforms = this.game.add.group();
    this.platform_edges = this.game.add.group();
    spec.platforms.forEach(this.spawn_platform, this);
    this.platform_edges.visible = false;

    this.coins = this.game.add.group();
    spec.coins.forEach(this.spawn_coin, this);

    this.player = this.spawn_player(spec.hero);

    this.spiders = this.game.add.group();
    spec.spiders.forEach(this.spawn_spider, this);
  },
  spawn_platform: function(spec) {
    // spec: {x: <int>, y: <int>, image: <image asset name>}
    let platform = this.platforms.create(spec.x, spec.y, spec.image);
    this.game.physics.enable(platform);
    platform.body.allowGravity = false;
    platform.body.immovable = true;

    left_edge_spec = {x: platform.x, y: platform.y, side: 'left'};
    platform.left_edge = this.spawn_platform_edge(left_edge_spec);
    right_edge_spec = {x: platform.x + platform.width,
                       y: platform.y,
                       side: 'right'};
    platform.right_edge = this.spawn_platform_edge(right_edge_spec);

    return platform;
  },
  spawn_platform_edge: function(spec) {
    // spec: {x: <int>, y: <int>, side: 'left' || 'right}
    let edge = this.platform_edges.create(spec.x, spec.y, 'invisible-wall');
    edge.anchor.set(spec.side === 'left' ? 1 : 0, 1);

    this.game.physics.enable(edge);
    edge.body.immovable = true;
    edge.body.allowGravity = false;

    return edge;
  },
  spawn_player: function(spec) {
    // spec: {x: <int>, y: <int>}
    let player = new Player(this.game, spec.x, spec.y);
    this.game.add.existing(player);
    return player;
  },
  spawn_spider: function(spec) {
    // spec: {x: <int>, y: <int>}
    let spider = new Spider(this.game, spec.x, spec.y);
    this.spiders.add(spider);
    return spider;
  },
  spawn_coin: function(spec) {
    // spec: {x: <int>, y: <int>}
    let coin = this.coins.create(spec.x, spec.y, 'coin');
    coin.anchor.set(0.5, 0.5);
    coin.animations.add('rotate', [0, 1, 2, 1], 6, true); // 6fps, looped
    coin.animations.play('rotate');
    this.game.physics.enable(coin);
    coin.body.allowGravity = false;
    return coin;
  },

  handle_input: function() {
    let direction = 0;
    if (this.keys.left.isDown) {
      direction -= 1;
    }
    if (this.keys.right.isDown) {
      direction += 1;
    }

    this.player.move(direction);
  },
  handle_collisions: function() {
    let physics = this.game.physics.arcade;
    physics.collide(this.player, this.platforms);
    physics.collide(this.spiders, this.platforms);
    physics.collide(this.spiders, this.platform_edges);

    physics.overlap(this.player, this.coins, this.pickup_coin, null, this);
    physics.overlap(this.player, this.spiders, this.kill_player, null, this);
  },

  pickup_coin: function(player, coin) {
    coin.kill();
    this.sfx.coin.play();
  },
  kill_player: function(player, spider) {
     this.sfx.stomp.play();
     this.game.state.restart();
  },

  init: function () {
    this.game.renderer.renderSession.roundPixels = true;

    this.characters = {};

    this.keys = this.game.input.keyboard.addKeys({
      left: Phaser.KeyCode.LEFT,
      right: Phaser.KeyCode.RIGHT,
      up: Phaser.KeyCode.UP
    });

    this.keys.up.onDown.add(function() {
      if (this.player.jump()) {
        this.sfx.jump.play();
      }
    }, this);
  },
  preload: preload,
  create: function () {
    this.game.add.image(0, 0, 'background');

    this.sfx = {
      jump: this.game.add.audio('sfx:jump'),
      coin: this.game.add.audio('sfx:coin'),
      stomp: this.game.add.audio('sfx:stomp'),
    };

    this.load_level(this.game.cache.getJSON('level:1'));
  },
  update: function () {
    this.handle_input();
    this.handle_collisions();
  }
};

function main () {
  let game = new Phaser.Game(960, 600, Phaser.AUTO, 'mikes_game');

  game.state.add('play', play_state);

  game.state.start('play');
}

module.exports = main;
