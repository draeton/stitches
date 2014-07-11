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
	layout: new CompactLayout(),

	/**
	 * Set the working layout manager instance by type
	 *
	 * @param {String} type The layout manager style
	 */
	set: function (type) {
		console.info('utils/layout : set()');

		var Layout = this.style[type] || this.style.compact;

		this.layout = new Layout();
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
	 * Position a list of sprites to fit in dimensions and layout
	 *
	 * @param {SpriteCollection} sprites To place
	 * @param {Object} dimensions Working width and height
	 */
	placeSprites: function (sprites, dimensions) {
		console.info('utils/layout : placeSprites()');

		messages.trigger(config.events.progress, 0, 'info');

		sprites.each(_.bind(function (sprite) {

			this.layout.placeSprite(sprites, sprite, dimensions);

			messages.trigger(config.events.progress, sprites.placed().length / sprites.length);

		}, this));
	},

	/**
	 * Trim dimensions to only contain placed sprites
	 *
	 * @param {SpriteCollection} sprites A list of sprites
	 * @param {Object} dimensions Working width and height
	 */
	trim: function (sprites, dimensions) {
		console.info('utils/layout : trim()');

		var w = 0;
		var h = 0;

		sprites.each(function (sprite) {
			w = w > sprite.x + sprite.width ? w : sprite.x + sprite.width;
			h = h > sprite.y + sprite.height ? h : sprite.y + sprite.height;
		});

		dimensions.width = w || dimensions.width;
		dimensions.height = h || dimensions.height;
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