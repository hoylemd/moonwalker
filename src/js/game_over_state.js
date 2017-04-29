function GameOverState(game) {

  this.init = function (spec) {
    // spec: {score: <int>, win: <boolean>}
    this.game.renderer.renderSession.roundPixels = true;

    this.score = spec.score;
    this.win = spec.win;
  };

  this.preload = function () {
    this.game.load.atlasXML('grey_ui',
                            'spritesheets/greySheet.png',
                            'spritesheets/greySheet.xml');
  };

  let actionOnClick = function() {
    console.log('clicked');
  };
  let over = function() {
    console.log('over');
  };
  let out = function() {
    console.log('out');
  };
  let up = function() {
    console.log('up');
  };

  this.create = function () {
    button = game.add.button(game.world.centerX - 95,                           // x
                             400,                                               // y
                             'grey_ui',                                         // spritesheet name
                             actionOnClick,                                     // click callback
                             this,                                              // callback context
                             'grey_button01.png',                               // over frame
                             'grey_button03.png',                               // down frame
                             'grey_button02.png');                              // up frame

    button.onInputOver.add(over, this);
    button.onInputOut.add(out, this);
    button.onInputUp.add(up, this);

  };

  this.update = function () {

  };
}

module.exports = GameOverState;
