let Phaser = require('./vendor').phaser;
TEXT_STYLE = require('./text_styles').DEFAULT_TEXT_STYLE;

const BACKLIGHT_COLOURS = {
  'none': {
    'over': {
      'fill': '#555',
      'stroke': '#888',
    },
    'out': {
      'fill': '#666',
      'stroke': '#999',
    },
    'down': {
      'fill': '#444',
      'stroke': '#777',
    },
    'up': {
      'fill': '#666',
      'stroke': '#999',
    }
  },
  'red': {
    'over': {
      'fill': '#844',
      'stroke': '#877',
    },
    'out': {
      'fill': '#766',
      'stroke': '#999',
    },
    'down': {
      'fill': '#D22',
      'stroke': '#C77',
    },
  },
  'green': {
    'over': {
      'fill': '#363',
      'stroke': '#787',
    },
    'out': {
      'fill': '#686',
      'stroke': '#999',
    },
    'down': {
      'fill': '#2D2',
      'stroke': '#7C7',
    },
  },
  'blue': {
    'over': {
      'fill': '#448',
      'stroke': '#778',
    },
    'out': {
      'fill': '#667',
      'stroke': '#999',
    },
    'down': {
      'fill': '#22D',
      'stroke': '#77C',
    },
  },
  'yellow': {
    'over': {
      'fill': '#993',
      'stroke': '#887',
    },
    'out': {
      'fill': '#774',
      'stroke': '#999',
    },
    'down': {
      'fill': '#DD2',
      'stroke': '#CC7',
    },
  },
  'orange': {
    'over': {
      'fill': '#853',
      'stroke': '#976',
    },
    'out': {
      'fill': '#976',
      'stroke': '#999',
    },
    'down': {
      'fill': '#FB2',
      'stroke': '#EA7',
    }
  },
};

function UIButton(game, x, y, label, callback, callback_context, backlight_colour, style_overrides) {
  backlight_colour = backlight_colour || 'none';
  style_overrides = style_overrides || {};

  this.normal_y = y;
  this.down_y = y + 4;

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

  this.backlight = BACKLIGHT_COLOURS[backlight_colour] || BACKLIGHT_COLOURS.none;

  let style = Object.assign({}, TEXT_STYLE, this.backlight.out, style_overrides);
  this.text = this.game.add.text(this.width / 2,
                                 this.height / 2,
                                 label,
                                 style);
  this.text.anchor.set(0.5, 0.5);
  this.addChild(this.text);

  this.over = false;
  this.down = false;
  this.update_state = function() {
    let state = 'out';
    if (this.over) {
      if (this.down) {
        state = 'down';
      } else {
        state = 'over';
      }
    }

    let backlight = this.backlight[state];
    this.text.fill = backlight.fill;
    this.text.stroke = backlight.stroke;

    this.y = this.down ? this.down_y : this.normal_y;
  };

  this.onInputOver.add(function() {
    this.over = true;
    this.update_state();
   }, this);
  this.onInputOut.add(function() {
    this.over = false;
    this.update_state();
  }, this);
  this.onInputDown.add(function() {
    this.down = true;
    this.update_state();
  }, this);
  this.onInputUp.add(function() {
    this.down = false;
    this.update_state();
  }, this);
}

UIButton.prototype = Object.create(Phaser.Button.prototype);
UIButton.prototype.constructor = UIButton;

module.exports = UIButton;
