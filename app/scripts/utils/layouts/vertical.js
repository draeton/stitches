/**
 * # utils/layouts/vertical
 *
 * Constructor for the vertical canvas layout manager. Used to determine
 * canvas dimensions and to place sprites without intersections (overlap).
 * Places sprites in a vertical column
 *
 * > http://draeton.github.io/stitches<br/>
 * > Copyright 2013 Matthew Cobbs<br/>
 * > Licensed under the MIT license.
 */

var config = require('../../config');
var messages = require('../../messages');

var Layout = require('./layout');

/**
 * @return {VerticalLayout}
 */
var VerticalLayout = function () {};

VerticalLayout.prototype = new Layout();

/**
 * Returns an object with the width and height necessary
 * to contain the `sprites`
 *
 * @param {SpriteCollection} sprites The list of sprites to size for
 * @return {Object}
 */
VerticalLayout.prototype.getDimensions = function (sprites) {
	console.info('utils/layouts/vertical : getDimensions()');

	var width = _.max(sprites.pluck('width'));

	var height = sprites.reduce(function (memo, sprite) {
		return memo + sprite.size().height;
	}, 0);

	return {
		width: width,
		height: height
	};
};

/**
 * Determine sprite coordinates on the canvas. Once a position is
 * determined with no intersections, the sprite is added to the
 * placed array. If there is no space, the dimensions are updated.
 *
 * @param {SpriteCollection} sprites The sprites to place
 * @param {SpriteModel} sprite The current sprite
 * @param {CanvasModel} canvas The current canvas
 */
VerticalLayout.prototype.placeSprite = function (sprite, placed, canvas) {
	console.info('utils/layouts/vertical : placeSprite()');

	var intersection = null;
	var pass = 0;
	var x = 0;
	var y = 0;

	while (pass++ < config.settings.tries) {
		for (y = 0; y <= dimensions.height - sprite.height; y++) {
			sprite.set('x', x, {silent: true});
			sprite.set('y', y, {silent: true});

			intersection = this.intersection(sprite, sprites.placed());

			if (!intersection) {
				return sprite.set('placed', true);
			}

			y = intersection.get('y') + intersection.get('height') - 1;
		}

		canvas.set({
			width: canvas.get('width') + sprite.get('width'),
			height: canvas.get('height') + sprite.get('height')
		});
	}

	messages.trigger(config.events.error);
};

module.exports = VerticalLayout;