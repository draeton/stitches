/**
 * # utils/layout
 *
 * Methods for setting the canvas layout and stitching the sprites together
 * (i.e. placing them on the canvas)
 *
 * > http://draeton.github.io/stitches<br/>
 * > Copyright 2013 Matthew Cobbs<br/>
 * > Licensed under the MIT license.
 */

var config = require('../config');
var messages = require('../messages');

var CompactLayout = require('./layouts/compact');
var HorizontalLayout = require('./layouts/horizontal');
var VerticalLayout = require('./layouts/vertical');

/**
 * @type {Object}
 */
module.exports = {

	/**
	 * @type {Object}
	 */
	style: {
		compact: CompactLayout,
		horizontal: HorizontalLayout,
		vertical: VerticalLayout
	},

	/**
	 * @type {Layout}
	 */
	layout: null,

	/**
	 * Set the working layout manager instance by type
	 *
	 * @param {String} type The layout manager style
	 */
	set: function (type) {
		console.info('utils/layout : set()');

		var Layout = this.style[type];

		if (Layout) {
			this.layout = new Layout();
		}
	},

	/**
	 * Get the dimensions necessary to place the sprites
	 *
	 * @param {SpriteCollection} sprites A list of sprites to place
	 * @return {Object}
	 */
	getDimensions: function (sprites) {
		console.info('utils/layout : getDimensions()');

		return this.layout.getDimensions(sprites, config.settings.dimensions);
	},

	/**
	 * Place a sprite on the canvas using the current layout
	 *
	 * @param {SpriteCollection} sprites The sprites to place
	 * @param {SpriteModel} sprite The current sprite
	 * @param {CanvasModel} canvas The current canvas
	 */
	placeSprite: function (sprites, sprite, canvas) {
		console.info('utils/layout : placeSprite()');

		this.layout.placeSprite(sprites, sprite, canvas);
	},

	/**
	 * Trim dimensions to only contain placed sprites
	 *
	 * @param {SpriteCollection} sprites A list of sprites
	 * @return {Object}
	 */
	trimDimensions: function (sprites) {
		console.info('utils/layout : trimDimensions()');

		var width = 0;
		var height = 0;

		sprites.each(function (sprite) {
			width = Math.max(width, sprite.get('x') + sprite.get('width'));
			height = Math.max(height, sprite.get('y') + sprite.get('height'));
		});

		return {
			width: width,
			height: height
		};
	},

	/**
	 * Returns an image using the browser canvas element's drawing context.
	 * Triggers a non-fatal error if anything fails
	 *
	 * @param {SpriteCollection} sprites A list of sprites
	 * @param {Object} dimensions Working width and height
	 * @return {String}
	 */
	getSpritesheet: function (sprites, dimensions) {
		console.info('utils/layout : getSpritesheet()');

		var canvas;
		var context;
		var spritesheet;

		canvas = document.createElement('canvas');
		canvas.width = dimensions.width;
		canvas.height = dimensions.height;

		try {
			context = canvas.getContext('2d');

			sprites.each(function (sprite) {
				var x = sprite.left();
				var y = sprite.top();

				context.drawImage(sprite.image, x, y);
			});

			spritesheet = canvas.toDataURL('image/png');
		} catch (e) {
			messages.trigger(config.events.error, e);
		}

		return spritesheet;
	}

};