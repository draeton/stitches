/**
 * # models/sprite
 *
 * Constructor for the sprite model, which holds sprite dimensions,
 * position, and display info. Used for manipulation of a single
 * sprite on the canvas
 *
 * > http://draeton.github.io/stitches<br/>
 * > Copyright 2013 Matthew Cobbs<br/>
 * > Licensed under the MIT license.
 */

var config = require('../config');
var messages = require('../messages');

/**
 * @return {SpriteModel}
 */
module.exports = Backbone.Model.extend({

	/**
	 * @type {Object}
	 */
	defaults: {
		name: '',
		padding: config.settings.padding,
		x: 0,
		y: 0,
		width: 0,
		height: 0,
		area: 0,
		src: '',
		placed: false
	},

	/**
	 * Initialize model properties
	 *
	 * @param {File} file
	 */
	initialize: function (file) {
		console.info('models/sprite : initialize()');

		this.image = null;
		this.placed = false;

		this.cleanName();
		this.read(file);
	},

	/**
	 * Clean name
	 */
	cleanName: function () {
		console.info('models/sprite : cleanName()');

		var name = this.get('name');

		name = name.replace(/\.\w+$/i, ""); // file extension
		name = name.replace(/[\s.]+/gi, "-"); // spaces to -
		name = name.replace(/[^a-z0-9\-]/gi, "_"); // other to _

		this.set('name', name);
	},

	/**
	 * Read file contents to prepare sprite
	 *
	 * @param {File} file
	 */
	read: function (file) {
		console.info('models/sprite : read()');

		var reader;

		try {
			reader = new FileReader();
			reader.onloadend = _.bind(this.onRead, this);
			reader.readAsDataURL(file);
		} catch (e) {
			messages.trigger(config.events.error, e);
		}
	},

	/**
	 * File contents have been read
	 *
	 * @param {Event} e
	 */
	onRead: function (e) {
		console.info('models/sprite : onRead()');

		this.load(e.target.result);
	},

	/**
	 * Load the sprite as an image element to get attributes
	 *
	 * @param {String} src
	 */
	load: function (src) {
		console.info('models/sprite : load()');

		this.image = new Image();
		this.image.onload = _.bind(this.onLoad, this);
		this.image.src = src;
	},

	/**
	 * Image element has loaded
	 *
	 * @param {Event} e
	 */
	onLoad: function () {
		console.info('models/sprite : onLoad()');

		var padding = this.get('padding');
		var width = this.image.width + padding * 2;
		var height = this.image.height + padding * 2;
		var area = width * height;

		this.set({
			x: 0,
			y: 0,
			width: width,
			height: height,
			area: area,
			src: this.image.src
		});
	},

	/**
	 * Reset the placement status and position of the sprite. Used before
	 * recalculating everything in a canvas reset
	 */
	reset: function () {
		console.info('models/sprite : reset()');

		this.set({
			x: 0,
			y: 0,
			placed: false
		});
	}

});