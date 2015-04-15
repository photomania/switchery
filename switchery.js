/**
 * Switchery 0.7.0
 * http://abpetkov.github.io/switchery/
 *
 * Authored by Alexander Petkov
 * https://github.com/abpetkov
 *
 * Copyright 2013-2014, Alexander Petkov
 * License: The MIT License (MIT)
 * http://opensource.org/licenses/MIT
 *
 */

/**
 * External dependencies.
 */

var transitionize = require('transitionize')
  , fastclick = require('fastclick')
  , classes = require('classes')
  , Hammer = require('hammer.js');

/**
 * Expose `Switchery`.
 */

module.exports = Switchery;

/**
 * Set Switchery default values.
 *
 * @api public
 */

var defaults = {
    color          : '#64bd63'
  , secondaryColor : '#dfdfdf'
  , jackColor      : '#fff'
  , className      : 'switchery'
  , disabled       : false
  , disabledOpacity: 0.5
  , speed          : '0.4s'
  , size           : 'default'
};

/**
 * Create Switchery object.
 *
 * @param {Object} element
 * @param {Object} options
 * @api public
 */

function Switchery(element, options) {
  if (!(this instanceof Switchery)) return new Switchery(element, options);

  this.element = element;
  this.options = options || {};

  for (var i in defaults) {
    if (this.options[i] == null) {
      this.options[i] = defaults[i];
    }
  }

  if (this.element != null && this.element.type == 'checkbox') this.init();
}

/**
 * Hide the target element.
 *
 * @api private
 */

Switchery.prototype.hide = function() {
  this.element.style.display = 'none';
};

/**
 * Show custom switch after the target element.
 *
 * @api private
 */

Switchery.prototype.show = function() {
  var switcher = this.create();
  this.insertAfter(this.element, switcher);
};

/**
 * Create custom switch.
 *
 * @returns {Object} this.switcher
 * @api private
 */

Switchery.prototype.create = function() {
  this.switcher = document.createElement('span');
  this.jack = document.createElement('small');
  this.switcher.appendChild(this.jack);
  this.switcher.className = this.options.className;

  return this.switcher;
};

/**
 * Insert after element after another element.
 *
 * @param {Object} reference
 * @param {Object} target
 * @api private
 */

Switchery.prototype.insertAfter = function(reference, target) {
  reference.parentNode.insertBefore(target, reference.nextSibling);
};

/**
 * See if input is checked.
 *
 * @returns {Boolean}
 * @api private
 */

Switchery.prototype.isChecked = function() {
  return this.element.checked;
};

/**
 * See if switcher should be disabled.
 *
 * @returns {Boolean}
 * @api private
 */

Switchery.prototype.isDisabled = function() {
  return this.options.disabled || this.element.disabled || this.element.readOnly;
};

/**
 * Set switch jack proper position.
 *
 * @param {Boolean} clicked - we need this in order to uncheck the input when the switch is clicked
 * @api private
 */

Switchery.prototype.setPosition = function (clicked) {
  var checked = this.isChecked()
    , switcher = this.switcher
    , jack = this.jack;

  if (clicked && checked) checked = false;
  else if (clicked && !checked) checked = true;

  if (checked === true) {
    this.element.checked = true;

    if (window.getComputedStyle) {
      jack.style.transform = 'translateX(' + (parseInt(window.getComputedStyle(switcher).width) - parseInt(window.getComputedStyle(jack).width)) + 'px)';
      jack.style.webkitTransform = 'translateX(' + (parseInt(window.getComputedStyle(switcher).width) - parseInt(window.getComputedStyle(jack).width)) + 'px)';
    } else {
      jack.style.transform = 'translateX(' + (parseInt(switcher.currentStyle['width']) - parseInt(jack.currentStyle['width'])) + 'px)';
      jack.style.webkitTransform = 'translateX(' + (parseInt(switcher.currentStyle['width']) - parseInt(jack.currentStyle['width'])) + 'px)';
    }

    if (this.options.color) this.colorize();
    this.setSpeed();
  } else {
    jack.style.transform = 'translateX(0)';
    jack.style.webkitTransform = 'translateX(0)';
    this.element.checked = false;
    this.switcher.style.boxShadow = 'inset 0 0 0 0 ' + this.options.secondaryColor;
    this.switcher.style.borderColor = this.options.secondaryColor;
    this.switcher.style.backgroundColor = (this.options.secondaryColor !== defaults.secondaryColor) ? this.options.secondaryColor : '#fff';
    this.jack.style.backgroundColor = this.options.jackColor;
    this.setSpeed();
  }
};

/**
 * Set speed.
 *
 * @api private
 */

Switchery.prototype.setSpeed = function() {
  var switcherProp = {}
    , jackProp = {
      '-webkit-transform': this.options.speed.replace(/[a-z]/, '') / 2 + 's'
    };

  if (this.isChecked()) {
    switcherProp = {
        'border': this.options.speed
      , 'box-shadow': this.options.speed
      , 'background-color': this.options.speed.replace(/[a-z]/, '') * 3 + 's'
      , 'opacity': this.options.speed
    };
  } else {
    switcherProp = {
        'border': this.options.speed
      , 'box-shadow': this.options.speed
      , 'opacity': this.options.speed
    };
  }

  transitionize(this.switcher, switcherProp);
  transitionize(this.jack, jackProp);
};

/**
 * Set switch size.
 *
 * @api private
 */

Switchery.prototype.setSize = function() {
  var small = 'switchery-small'
    , normal = 'switchery-default'
    , large = 'switchery-large';

  switch (this.options.size) {
    case 'small':
      classes(this.switcher).add(small)
      break;
    case 'large':
      classes(this.switcher).add(large)
      break;
    default:
      classes(this.switcher).add(normal)
      break;
  }
};

/**
 * Set switch color.
 *
 * @api private
 */

Switchery.prototype.colorize = function() {
  var switcherHeight = this.switcher.offsetHeight / 2;

  this.switcher.style.backgroundColor = this.options.color;
  this.switcher.style.borderColor = this.options.color;
  this.switcher.style.boxShadow = 'inset 0 0 0 ' + switcherHeight + 'px ' + this.options.color;
  this.jack.style.backgroundColor = this.options.jackColor;
};

/**
 * Disable the switchery element.
 *
 * @api public
 */

Switchery.prototype.disable = function() {
  if (this.isDisabled()) {
    return;
  }

  this.element.disabled = true;
  this.switcher.style.opacity = this.options.disabledOpacity;
};

/**
 * Enable the Switchery element.
 *
 * @api public
 */

Switchery.prototype.enable = function() {
  if (!this.isDisabled()) {
    return;
  }

  this.element.disabled = false;
  this.switcher.style.opacity = 1;
};

/**
 * Handle the onchange event.
 *
 * @param {Boolean} state
 * @api private
 */

Switchery.prototype.handleOnchange = function(state) {
  if (document.dispatchEvent) {
    var event = document.createEvent('HTMLEvents');
    event.initEvent('change', true, true);
    this.element.dispatchEvent(event);
  } else {
    this.element.fireEvent('onchange');
  }
};

/**
 * Handle the native input element state change.
 * A `change` event must be fired in order to detect the change.
 *
 * @api private
 */

Switchery.prototype.handleChange = function() {
  var self = this
    , el = this.element;

  if (el.addEventListener) {
    el.addEventListener('change', function() {
      self.setPosition();
    });
  } else {
    el.attachEvent('onchange', function() {
      self.setPosition();
    });
  }
};

/**
 * Handle the switch click event.
 *
 * @api private
 */

Switchery.prototype.handleClick = function() {
  var self = this
    , switcher = this.switcher
    , parent = self.element.parentNode.tagName.toLowerCase()
    , labelParent = (parent === 'label') ? false : true;

  if (this.isDisabled() === false) {
    fastclick(switcher);

    var handler = function () {
      if (!self.isDisabled()) {
        self.setPosition(labelParent);
        self.handleOnchange(self.element.checked);
      }
    };

    if (switcher.addEventListener) {
      switcher.addEventListener('click', handler);
    } else {
      switcher.attachEvent('onclick', handler);
    }

    // Swipe handling (with Hammer.js)
    var mc = new Hammer.Manager(switcher);
    mc.add(new Hammer.Swipe({velocity: 0, threshold: 0}));
    mc.on('swipeleft swiperight', function (e) {
      if (e.direction == Hammer.DIRECTION_LEFT) { // Swipe left
        if (self.isChecked()) {
          handler();
        }
      } else {  // Swipe right
        if (!self.isChecked()) {
          handler();
        }
      }
    });
  } else {
    this.element.disabled = true;
    this.switcher.style.opacity = this.options.disabledOpacity;
  }
};

/**
 * Mark an individual switch as already handled.
 *
 * @api private
 */

Switchery.prototype.markAsSwitched = function() {
  this.element.setAttribute('data-switchery', true);
};

/**
 * Check if an individual switch is already handled.
 *
 * @api private
 */

Switchery.prototype.markedAsSwitched = function() {
  return this.element.getAttribute('data-switchery');
};

/**
 * Initialize Switchery.
 *
 * @api private
 */

Switchery.prototype.init = function() {
  this.hide();
  this.show();
  this.setSize();
  this.setPosition();
  this.markAsSwitched();
  this.handleChange();
  this.handleClick();
};
