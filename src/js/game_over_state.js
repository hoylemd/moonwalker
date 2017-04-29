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

    button = game.add.button(game.world.centerX - 95,                           // x
                             400,                                               // y
                             'grey_ui',                                         // spritesheet name
                             actionOnClick,                                     // click callback
                             this,                                              // callback context
                             'grey_button01.png',                               // over frame
                             'grey_button03.png',                               // down frame
                             'grey_button02.png');                              // up frame
  };

  this.update = function () {

  };
}

module.exports = GameOverState;
