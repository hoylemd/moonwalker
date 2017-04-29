let Phaser = require('./vendor').phaser;

TEXT_STYLE = require('./text_styles').DEFAULT_TEXT_STYLE;

function UILabel(game, x, y, label, style_overrides) {
  style_overrides = style_overrides || {};

  let style = Object.assign({}, TEXT_STYLE, style_overrides);

  Phaser.Text.call(this, game, x, y, label, style);
}

UILabel.prototype = Object.create(Phaser.Text.prototype);
UILabel.prototype.constructor = UILabel;

module.exports = UILabel;
