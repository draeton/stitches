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
	console.info('utils/layouts/layout : getDimensions()');

	var width = 0;
	var height = 0;
	var area = 0;
	var mean = 0;

	sprites.each(function (sprite) {
		width = sprite.width > width ? sprite.width : width;
		height = sprite.height > height ? sprite.height : height;
		area += sprite.area;
	});

	mean = Math.ceil(Math.sqrt(area));
	width = width > mean ? width : mean;
	height = height > mean ? height : mean;

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
 * @param {SpriteCollection} sprite The sprite to place
 * @param {Array} placed An array of sprites already placed
 * @param {Object} dimensions The current canvas dimensions
 */
CompactLayout.prototype.placeSprite = function (sprite, placed, dimensions) {
	console.info('utils/layouts/layout : placeSprite()');

	var intersection;
	var pass = 0;
	var x = 0;
	var y = 0;

	while (pass++ < config.settings.tries) {
		for (y = 0; y <= (dimensions.height - sprite.height); y++) {
			for (x = 0; x <= (dimensions.width - sprite.width); x++) {
				sprite.x = x;
				sprite.y = y;

				intersection = this.intersection(sprite, placed);

				if (!intersection) {
					placed.push(sprite);
					sprite.show();
					return true;
				}

				x = intersection.x + intersection.width - 1;
			}

			y = intersection.y + intersection.height - 1;
		}

		dimensions.width += sprite.width;
		dimensions.height += sprite.height;
	}
};

module.exports = CompactLayout;