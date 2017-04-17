let preload = require('./preload');
let Player = require('./player');
let Spider = require('./spider');


const GRAVITY = 1200;
const LEVEL_COUNT = 2;

let play_state = {                                                              // TODO: make this also a class
  load_level: function(spec) {
    this.game.physics.arcade.gravity.y = GRAVITY;

    this.midground = this.game.add.group();
    this.spawn_door(spec.door);
    this.spawn_key(spec.key);

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
  spawn_door: function(spec) {
    // spec:  {x: <int>, y: <int>}
    this.door = this.midground.create(spec.x, spec.y, 'door');
    this.door.anchor.set(0.5, 1);
    this.game.physics.enable(this.door);
    this.door.body.allowGravity = false;
    return this.door;
  },
  spawn_key: function(spec) {
    // spec:  {x: <int>, y: <int>}
    const KEY_HOVER_MARGIN = 3;


    this.key = this.midground.create(spec.x, spec.y, 'key');
    this.key.anchor.set(0.5, 0.5);
    this.game.physics.enable(this.key);
    this.key.body.allowGravity = false;

    this.key.y -= KEY_HOVER_MARGIN;
    this.game.add.tween(this.key)
                 .to({y: this.key.y + (2 * KEY_HOVER_MARGIN)},
                     800,
                     Phaser.Easing.Sinusoidal.InOut)
                 .yoyo(true)
                 .loop()
                 .start();

    return this.key;
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
    physics.overlap(this.player, this.key, this.pickup_key, null, this);
    physics.overlap(this.player, this.spiders,
                    this.player_spider_collide, null, this);

    function can_open_door(player, door) {
      return player.has_key && player.body.touching_down;
    }

    physics.overlap(this.player, this.door,
                    this.open_door, can_open_door, this);
  },

  pickup_coin: function(player, coin) {
    coin.kill();
    this.sfx.coin.play();
    this.player.coins += 1;
  },
  pickup_key: function(player, key) {
    key.kill();
    this.sfx.key.play();
    this.player.has_key = true;
  },
  open_door: function(player, door) {
    this.sfx.door.play();
    this.game.state.restart(true,                                               // keep all assets
                            false,                                              // don't keep entities
                            {level: this.level + 1});                           // spec to load next level
  },
  player_spider_collide: function(player, spider) {
    this.sfx.stomp.play();
    if (player.body.velocity.y > 0) {
      spider.die();
      player.bounce();
    } else {
      // game over
      this.game.state.restart(true,                                             // keep all assets
                              false,                                            // don't keep entities
                              {level: this.level});                             // spec to reload current level
    }
  },

  init: function (spec) {
    // spec: {level: <int>}
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

    this.level = (spec.level || 0) % LEVEL_COUNT;
  },
  preload: preload,
  create: function () {
    this.game.add.image(0, 0, 'background');

    this.sfx = {
      jump: this.game.add.audio('sfx:jump'),
      coin: this.game.add.audio('sfx:coin'),
      stomp: this.game.add.audio('sfx:stomp'),
      key: this.game.add.audio('sfx:key'),
      door: this.game.add.audio('sfx:door'),
    };

    this.load_level(this.game.cache.getJSON(`level:${this.level}`));
    this.create_hud();
  },
  update: function () {
    this.handle_input();
    this.handle_collisions();

    // update hud
    this.key_icon.frame = this.player.has_key ? 1 : 0;
    this.coin_count.text = `x${this.player.coins}`;
  },
  create_hud: function () {
    const FONT_CHARACTERS = '0123456789X';

    this.hud = this.game.add.group();

    this.key_icon = this.game.make.image(0, 19, 'icon:key');
    this.key_icon.anchor.set(0, 0.5);
    this.hud.add(this.key_icon);

    let coin_icon = this.game.make.image(this.key_icon.width + 7,
                                         0,
                                         'icon:coin');
    this.hud.add(coin_icon);

    this.coin_count = this.game.add.retroFont('font:numbers',
                                              20,                               // glyph width
                                              26,                               // glyph height
                                              FONT_CHARACTERS,                  // characters
                                              6);                               // glyphs per row
    let score_indicator = this.game.make.image(coin_icon.x + coin_icon.width,
                                               coin_icon.height / 2,
                                               this.coin_count);
    score_indicator.anchor.set(0, 0.5);
    this.hud.add(score_indicator);

    this.hud.position.set(10, 10);

    return this.hud;
  },
};

module.exports = play_state;
