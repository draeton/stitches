/**
 * # models/canvas
 *
 * Constructor for the canvas model, which holds canvas dimensions
 *
 * > http://draeton.github.io/stitches<br/>
 * > Copyright 2013 Matthew Cobbs<br/>
 * > Licensed under the MIT license.
 */

var config = require('../config');
var messages = require('../messages');
var layout = require('../utils/layout');

var SpriteCollection = require('../collections/sprite');

/**
 * @return {CanvasModel}
 */
module.exports = Backbone.Model.extend({

	/**
	 * @type {Object}
	 */
	defaults: {
		layout: '',
		width: 0,
		height: 0
	},

	/**
	 * Initialize model properties
	 */
	initialize: function () {
		console.info('models/canvas : initialize()');

		this.sprites = new SpriteCollection();

		this.on('change:layout', _.bind(this.onChangeLayout, this));
		this.set(config.settings.canvas);
	},

	/**
	 * Add sprites to collection from files
	 *
	 * @param {FilesList} files
	 */
	addFiles: function (files) {
		console.info('models/canvas : addFiles()');

		var items = SpriteCollection.prototype.parse(files);

		this.sprites.add(items);
	},

	/**
	 * Recalculate canvas dimensions and sprite positioning. Used after a
	 * change to sprites or settings
	 */
	stitch: function () {
		console.info('models/canvas : stitch()');

		messages.trigger(config.events.busy);

		this.measure();
		this.place();
		this.cut();

		messages.trigger(config.events.generate);
		messages.trigger(config.events.idle);
	},

	/**
	 * Determine the canvas dimensions based on a set of sprites
	 */
	measure: function () {
		console.info('models/canvas : measure()');

		var dimensions = layout.getDimensions(this.sprites);

		this.set(dimensions);
	},

	/**
	 * Place a set of sprites on this canvas. Sorts sprites by `name`
	 * property before placement
	 */
	place: function () {
		console.info('models/canvas : place()');

		var sprites = this.sprites;
		var canvas = this;

		messages.trigger(config.events.progress, 0, 'info');

		sprites.invoke('reset');
		sprites.each(function (sprite) {

			layout.placeSprite(sprites, sprite, canvas);

			messages.trigger(config.events.progress, sprites.placed().length / sprites.length);

		});
	},

	/**
	 * Trim an excess canvas dimensions not required to include this
	 * set of sprites
	 */
	cut: function () {
		console.info('models/canvas : cut()');

		var dimensions = layout.trimDimensions(this.sprites);

		this.set(dimensions);
	},

	/**
	 * Update the layout utility
	 */
	onChangeLayout: function () {
		console.info('models/canvas : onChangeLayout()');

		layout.set(this.get('layout'));
	}

});