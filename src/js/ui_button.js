let Phaser = require('./vendor').phaser;

const NORMAL_TEXT_FILL = '#666';
const NORMAL_TEXT_STROKE = '#999';
const OVER_TEXT_FILL = '#555';
const OVER_TEXT_STROKE = '#888';
const TEXT_STYLE = {
  font: 'origicide',
  fill: NORMAL_TEXT_FILL,
  stroke: NORMAL_TEXT_STROKE,
  strokeThickness: 4,
  fontSize: 32
};

function UIButton(game, x, y, label, callback, callback_context, style_overrides) {
  style_overrides = style_overrides || {};

  Phaser.Button.call(this,
                     game,
                     x,
                     y,
                     'grey_ui',
                     callback,
                     callback_context,
                     'grey_button01.png',
                     'grey_button03.png',
                     'grey_button02.png');

  style = Object.assign({}, TEXT_STYLE, style_overrides);
  this.text = this.game.add.text(this.width / 2,
                                 this.height / 2,
                                 label,
                                 style);
  this.text.anchor.set(0.5, 0.5);
  this.addChild(this.text);

  this.onInputOver.add(function() {
    this.text.fill = OVER_TEXT_FILL;
    this.text.stroke = OVER_TEXT_STROKE;
  }, this);
  this.onInputOut.add(function() {
    this.text.fill = NORMAL_TEXT_FILL;
    this.text.stroke = NORMAL_TEXT_STROKE;
  }, this);
  this.onInputDown.add(function() {
    this.y += 4;
  }, this);
  this.onInputUp.add(function() {
    this.y -= 4;
  }, this);
}

UIButton.prototype = Object.create(Phaser.Button.prototype);
UIButton.prototype.constructor = UIButton;

module.exports = UIButton;
