let UIButton = require('./ui_button');
let UILabel = require('./ui_label');

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
      this.game.state.start('play', true, false);
    };

    this.ui = this.game.add.group();

    let message = new UILabel(this.game,
                              this.game.world.centerX,
                              150,
                              this.win ? 'You Won!' : 'You Lost!');
    message.anchor.set(0.5, 0.5);
    this.ui.add(message);

    let score_message = new UILabel(this.game,
                                    this.game.world.centerX,
                                    200,
                                    `You got ${this.score} coins!`);
    score_message.anchor.set(0.5, 0.5);
    this.ui.add(score_message);

    let button = new UIButton(this.game,
                              this.game.world.centerX - 95,
                              350,
                              'Restart',
                              actionOnClick,
                              this,
                              this.win ? 'green' : 'red');
    this.ui.add(button);
  };
}

module.exports = GameOverState;
