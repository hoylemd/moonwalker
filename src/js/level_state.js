let Player = require('./player');
let Spider = require('./spider');

let preload = require('./preload');

function LevelState(game) {
  const GRAVITY = 1200;
  const KEY_HOVER_MARGIN = 3;
  const DEBUG_MODE = true;
  const TILE_UNIT_DIMENSION = 42;

  this.game = game;

  // Initialization
  this.init = function (spec) {
    // spec: {level: <int>, player: <Player>}
    spec = Object.assign({level: 0, player: null}, spec);
    this.game.renderer.renderSession.roundPixels = true;

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


    this.level = spec.level || 0;
    if (this.game.levels) {
      this.level %= this.game.levels.length;
    }
    this.carried_player = spec.player;
  };

  // Load Assets
  this.preload = preload;

  // Create game world
  this.create = function () {
    this.map = this.game.add.tilemap(`level:${this.level}`);
    this.map.addTilesetImage('ground', 'tiles:ground');
    this.map.addTilesetImage('background', 'tiles:background');

    this.background_layer = this.map.createLayer('background');
    this.terrain_layer = this.map.createLayer('terrain');

    this.map.setCollisionBetween(1, 100000, true, 'terrain');

    this.background_layer.resizeWorld();

    this.sfx = {
      jump: this.game.add.audio('sfx:jump'),
      coin: this.game.add.audio('sfx:coin'),
      stomp: this.game.add.audio('sfx:stomp'),
      key: this.game.add.audio('sfx:key'),
      door: this.game.add.audio('sfx:door'),
    };

    this.load_level();
    this.create_hud();
  };
  this.load_level = function() {
    this.game.physics.arcade.gravity.y = GRAVITY;

    this.midground = this.game.add.group();

    let objects = {};
    this.map.objects.objects.forEach(function (obj) {
      let type = obj.type;

      if (!type) return false;

      objects[type] = objects[type] || [];

      objects[type].push(obj);
    }, this);

    objects.door.forEach(this.spawn_door, this);
    objects.key.forEach(this.spawn_key, this);

    this.platform_edges = this.game.add.group();
    objects.platform_edge.forEach(this.spawn_platform_edge, this);
    this.platform_edges.visible = false;

    this.coins = this.game.add.group();
    objects.coin.forEach(this.spawn_coin, this);

    this.player = this.spawn_player(objects.player[0]);

    this.game.camera.follow(this.player);

    this.spiders = this.game.add.group();
    if (objects.spider) {
      objects.spider.forEach(this.spawn_spider, this);
    }
  };
  this.spawn_door = function(spec) {
    // spec:  {x: <int>, y: <int>}
    this.door = this.midground.create(spec.x, spec.y, 'door');
    this.door.anchor.set(0, 1);
    this.game.physics.enable(this.door);
    this.door.body.allowGravity = false;
    return this.door;
  };
  this.spawn_key = function(spec) {
    // spec:  {x: <int>, y: <int>}

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
  };
  this.spawn_platform_edge = function(spec) {
    // spec: {x: <int>, y: <int>, properties: {side: <'left' or 'right'>}}
    let edge = this.platform_edges.create(spec.x, spec.y, 'invisible-wall');
    edge.width = spec.width;
    edge.height = spec.height;
    edge.side = spec.properties.side;

    this.game.physics.enable(edge);
    edge.body.immovable = true;
    edge.body.allowGravity = false;

    return edge;
  };
  this.spawn_coin = function(spec) {
    // spec: {x: <int>, y: <int>}
    let coin = this.coins.create(spec.x, spec.y, 'coin');
    coin.anchor.set(0.5, 0.5);
    coin.animations.add('rotate', [0, 1, 2, 1], 6, true); // 6fps, looped
    coin.animations.play('rotate');
    this.game.physics.enable(coin);
    coin.body.allowGravity = false;
    return coin;
  };
  this.spawn_player = function(spec) {
    // spec: {x: <int>, y: <int>}
    let player = new Player(this.game, spec.x, spec.y);
    this.game.add.existing(player);
    if (this.carried_player) {
      player.coins = this.carried_player.coins;
    }
    if (DEBUG_MODE) {
      window.player = player;
    }
    return player;
  };
  this.spawn_spider = function(spec) {
    // spec: {x: <int>, y: <int>}
    let spider = new Spider(this.game, spec.x, spec.y);
    this.spiders.add(spider);
    return spider;
  };
  this.create_hud = function () {

    this.hud = this.game.add.group();

    this.key_icon = this.game.make.image(0, 19, 'icon:key');
    this.key_icon.anchor.set(0, 0.5);
    this.hud.add(this.key_icon);

    let coin_icon = this.game.make.image(this.key_icon.width + 7,
                                         0,
                                         'icon:coin');
    this.hud.add(coin_icon);

    let score_x = this.game.add.text(coin_icon.x + coin_icon.width + 8,
                                     coin_icon.height / 2,
                                     'x',
                                      {font: 'origicide',
                                       fill: '#666',
                                       stroke: '#999',
                                       strokeThickness: 4,
                                       fontSize: 24});
    score_x.anchor.set(0, 0.5);
    this.hud.add(score_x);
    window.score_x = score_x;

    this.coin_count = this.game.add.text(score_x.x + 20,
                                         coin_icon.height / 2,
                                         '',
                                         {font: 'origicide',
                                          fill: '#666',
                                          stroke: '#999',
                                          strokeThickness: 6,
                                          fontSize: coin_icon.height});
    this.coin_count.anchor.set(0, 0.5);
    this.hud.add(this.coin_count);

    this.hud.position.set(10, 10);

    return this.hud;
  };

  // Update game world
  this.update = function () {
    this.handle_input();
    this.handle_collisions();

    // update hud
    this.key_icon.frame = this.player.has_key ? 1 : 0;
    this.coin_count.text = `${this.player.coins}`;
  };

  this.handle_input = function() {
    let direction = 0;
    if (this.keys.left.isDown) {
      direction -= 1;
    }
    if (this.keys.right.isDown) {
      direction += 1;
    }

    this.player.move(direction);
  };
  this.handle_collisions = function() {
    let physics = this.game.physics.arcade;
    physics.collide(this.player, this.terrain_layer);
    physics.collide(this.spiders, this.terrain_layer);
    physics.collide(this.spiders, this.platform_edges);

    physics.overlap(this.player, this.coins, this.pickup_coin, null, this);
    physics.overlap(this.player, this.key, this.pickup_key, null, this);
    physics.overlap(this.player, this.spiders,
                    this.player_spider_collide, null, this);

    function can_open_door(player, door) {
      return player.has_key && player.body.onFloor();
    }

    physics.overlap(this.player, this.door,
                    this.open_door, can_open_door, this);
  };

  this.pickup_coin = function(player, coin) {
    coin.kill();
    this.sfx.coin.play();
    this.player.coins += 1;
  };
  this.pickup_key = function(player, key) {
    key.kill();
    this.sfx.key.play();
    this.player.has_key = true;
  };
  this.player_spider_collide = function(player, spider) {
    this.sfx.stomp.play();
    if (player.body.velocity.y > 0) {
      spider.die();
      player.bounce();
    } else {
      // game over
      this.game.state.restart(true,                                             // keep all assets
                              false,                                            // don't keep entities
                              {level: this.level,
                               player: this.carried_player});                             // spec to reload current level
    }
  };
  this.open_door = function(player, door) {
    this.sfx.door.play();
    let next_level = this.level + 1;
    if (next_level < this.game.levels.length) {
      this.game.state.restart(true,                                             // keep all assets
                              false,                                            // don't keep entities
                              {level: next_level,
                               player: this.player});
    } else {
      this.game.state.start('game_over',
                            true,                                               // keep all assets
                            false,                                              // don't keep entities
                            {score: this.player.coins,
                             win: true});                           // spec to load next level
    }
  };
}

module.exports = LevelState;
