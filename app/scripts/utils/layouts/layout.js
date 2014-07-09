/**
 * # utils/layouts/layout
 *
 * Base constructor for the canvas layout managers. Used to determine
 * canvas dimensions and to place sprites without intersections (overlap)
 *
 * > http://draeton.github.io/stitches<br/>
 * > Copyright 2013 Matthew Cobbs<br/>
 * > Licensed under the MIT license.
 */

/**
 * @return {Layout}
 */
var Layout = function () {};

/**
 * Returns an object with the width and height necessary
 * to contain the `sprites`
 *
 * @param {SpriteCollection} sprites The list of sprites to size for
 * @param {Object} defaults Default width and height, if no sprites
 * @return {Object}
 */
Layout.prototype.getDimensions = function () {
	console.info('utils/layouts/layout : getDimensions()');
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
Layout.prototype.placeSprite = function () {
	console.info('utils/layouts/layout : placeSprite()');
};

/**
 * Determine if a sprite intersects any other placed sprites. If no,
 * returns undefined; if yes, returns the intersecting sprite
 * for comparison
 *
 * @param {SpriteModel} sprite The sprite to compare against others
 * @param {Array} obstacles An array of sprites already placed
 * @return {SpriteModel}
 */
Layout.prototype.intersection = function (sprite, obstacles) {
	console.info('utils/layouts/layout : intersection()');

	var x1, x2, y1, y2;
	var intersections = [];
	var intersection;

	_.map(obstacles, function (obstacle) {
		x1 = (obstacle.x < (sprite.x + sprite.width));
		y1 = (obstacle.y < (sprite.y + sprite.height));
		x2 = ((obstacle.x + obstacle.width) > sprite.x);
		y2 = ((obstacle.y + obstacle.height) > sprite.y);

		if (x1 && x2 && y1 && y2) {
			intersections.push(obstacle);
		}
	});

	if (intersections.length) {
		intersection = intersections.pop();
	}

	return intersection;
};

module.exports = Layout;