/**
 * # utils/layouts/horizontal
 *
 * Constructor for the horizontal canvas layout manager. Used to determine
 * canvas dimensions and to place sprites without intersections (overlap).
 * Places sprites in a horizontal row
 *
 * > http://draeton.github.io/stitches<br/>
 * > Copyright 2013 Matthew Cobbs<br/>
 * > Licensed under the MIT license.
 */

var config = require('../../config');
var messages = require('../../messages');

var Layout = require('./layout');

/**
 * @return {HorizontalLayout}
 */
var HorizontalLayout = function () {};

HorizontalLayout.prototype = new Layout();

/**
 * Returns an object with the width and height necessary
 * to contain the `sprites`
 *
 * @param {SpriteCollection} sprites The list of sprites to size for
 * @return {Object}
 */
HorizontalLayout.prototype.getDimensions = function (sprites) {
	console.info('utils/layouts/horizontal : getDimensions()');

	var height = _.max(sprites.pluck('height'));

	var width = sprites.reduce(function (memo, sprite) {
		return memo + sprite.get('width');
	}, 0);

	console.log(width, height);

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
HorizontalLayout.prototype.placeSprite = function (sprites, sprite, canvas) {
	console.info('utils/layouts/horizontal : placeSprite()');

	var intersection = null;
	var pass = 0;
	var x = 0;
	var y = 0;

	while (pass++ < config.settings.tries) {
		for (x = 0; x <= canvas.get('width') - sprite.get('width'); x++) {
			sprite.set('x', x, {silent: true});
			sprite.set('y', y, {silent: true});

			intersection = this.intersection(sprite, sprites.placed());

			if (!intersection) {
				return sprite.set('placed', true);
			}

			x = intersection.get('x') + intersection.get('width') - 1;
		}

		canvas.set({
			width: canvas.get('width') + sprite.get('width'),
			height: canvas.get('height') + sprite.get('height')
		});
	}

	messages.trigger(config.events.error);
};

module.exports = HorizontalLayout;