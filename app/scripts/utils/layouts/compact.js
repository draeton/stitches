/**
 * # utils/layouts/compact
 *
 * Constructor for the compact canvas layout manager. Used to determine
 * canvas dimensions and to place sprites without intersections (overlap).
 * Places sprites in the most compact rectangle possible
 *
 * > http://draeton.github.io/stitches<br/>
 * > Copyright 2013 Matthew Cobbs<br/>
 * > Licensed under the MIT license.
 */

var config = require('../../config');
var messages = require('../../messages');

var Layout = require('./layout');

/**
 * @return {CompactLayout}
 */
var CompactLayout = function () {};

CompactLayout.prototype = new Layout();

/**
 * Returns an object with the width and height necessary
 * to contain the `sprites`
 *
 * @param {SpriteCollection} sprites The list of sprites to size for
 * @param {Object} defaults Default width and height, if no sprites
 * @return {Object}
 */
CompactLayout.prototype.getDimensions = function (sprites, defaults) {
	console.info('utils/layouts/compact : getDimensions()');

	var width = _.max(sprites.pluck('width'));
	var height = _.max(sprites.pluck('height'));

	var area = sprites.reduce(function (memo, sprite) {
		return memo + sprite.area();
	}, 0);

	var mean = Math.ceil(Math.sqrt(area));

	width = Math.max(width, mean);
	height = Math.max(height, mean);

	return {
		width: width || defaults.width,
		height: height || defaults.height
	};
};

/**
 * Determine sprite coordinates on the canvas. Once a position is
 * determined with no intersections, the sprite is added to the
 * placed array. If there is no space, the dimensions are updated.
 *
 * @param {SpriteCollection} sprites The sprites to place
 * @param {SpriteModel} sprite The current sprite
 * @param {Object} dimensions The current canvas dimensions
 */
CompactLayout.prototype.placeSprite = function (sprites, sprite, dimensions) {
	console.info('utils/layouts/compact : placeSprite()');

	var intersection = null;
	var pass = 0;
	var x = 0;
	var y = 0;

	while (pass++ < config.settings.tries) {
		for (y = 0; y <= (dimensions.height - sprite.get('height')); y++) {
			for (x = 0; x <= (dimensions.width - sprite.get('width')); x++) {
				sprite.set('x', x);
				sprite.set('y', y);

				intersection = this.intersection(sprite, sprites.placed());

				if (!intersection) {
					return sprite.set('placed', true);
				}

				x = intersection.get('x') + intersection.get('width') - 1;
			}

			y = intersection.get('y') + intersection.get('height') - 1;
		}

		dimensions.width += sprite.get('width');
		dimensions.height += sprite.get('height');
	}

	messages.trigger(config.events.error);
};

module.exports = CompactLayout;