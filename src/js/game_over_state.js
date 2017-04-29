function GameOverState(game) {

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
    button = game.add.button(game.world.centerX - 95,                           // x
                             400,                                               // y
                             'grey_ui',                                         // spritesheet name
                             actionOnClick,                                     // click callback
                             this,                                              // callback context
                             'grey_button01.png',                               // over frame
                             'grey_button03.png',                               // down frame
                             'grey_button02.png',                               // up frame
                             null,
                             this.ui);
    button.onInputDown.add(function () {
      button.y += 4;
    }, this);
    button.onInputUp.add(function () {
      button.y -= 4;
    }, this);

    button_text = this.game.add.text(button.width / 2,
                                     button.height / 2,
                                     'Restart',
                                     {font: 'origicide',
                                      fill: '#666',
                                      stroke: '#999',
                                      strokeThickness: 4,
                                      fontSize: 32});
    button_text.anchor.set(0.5, 0.5);
    button.addChild(button_text);
  };

  this.update = function () {

  };
}

module.exports = GameOverState;
