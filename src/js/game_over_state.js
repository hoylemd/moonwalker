let UIButton = require('./ui_button');

function GameOverState(game) {
  this.game = game;

  this.init = function (spec) {
    // spec: {score: <int>, win: <boolean>}
    this.game.renderer.renderSession.roundPixels = true;

    this.score = spec.score;
    this.win = spec.win;
  };

  this.create = function () {
    this.game.add.image(0, 0, 'background');

    let actionOnClick = function() {
      console.log('clicked');
    };

    this.ui = this.game.add.group();

    none_button = new UIButton(this.game,
                               this.game.world.centerX - (190 + 20 + 95),
                               350,
                               'Grey',
                               actionOnClick,
                               this);
    this.ui.add(none_button);

    red_button = new UIButton(this.game,
                              this.game.world.centerX - (0 + 0 + 95),
                              350,
                              'Red',
                              actionOnClick,
                              this,
                              'red');
    this.ui.add(red_button);

    green_button = new UIButton(this.game,
                                this.game.world.centerX + (95 + 20),
                                350,
                                'Green',
                                actionOnClick,
                                this,
                                'green');
    this.ui.add(green_button);

    blue_button = new UIButton(this.game,
                               this.game.world.centerX - (190 + 20 + 95),
                               400,
                               'Blue',
                               actionOnClick,
                               this,
                               'blue');
    this.ui.add(blue_button);

    yellow_button = new UIButton(this.game,
                                 this.game.world.centerX - (0 + 0 + 95),
                                 400,
                                 'Yellow',
                                 actionOnClick,
                                 this,
                                 'yellow');
    this.ui.add(yellow_button);

    orange_button = new UIButton(this.game,
                                 this.game.world.centerX + (95 + 20),
                                 400,
                                 'Orange',
                                 actionOnClick,
                                 this,
                                 'orange');
    this.ui.add(orange_button);


  };
}

module.exports = GameOverState;
