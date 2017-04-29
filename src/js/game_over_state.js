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
    button = new UIButton(this.game,
                          this.game.world.centerX - 95,                           // x
                          400,                                               // y
                          'Restart',
                          actionOnClick,                                     // click callback
                          this);
    this.ui.add(button);

  };
}

module.exports = GameOverState;
