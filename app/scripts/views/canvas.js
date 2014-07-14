/**
 * # views/canvas
 *
 * Constructor for the sprite sheet canvas view, which holds and displays
 * all placed sprites. Used for manipulating sprite placement and
 * state
 *
 * > http://draeton.github.io/stitches<br/>
 * > Copyright 2013 Matthew Cobbs<br/>
 * > Licensed under the MIT license.
 */

var config = require('../config');
var messages = require('../messages');

var SpriteView = require('../views/sprite');

/**
 * @return {CanvasView}
 */
module.exports = Backbone.View.extend({

	/**
	 * @type {Object}
	 */
	events: {},

	/**
	 * Set up instance properties and call startup methods
	 */
	initialize: function () {
		console.info('views/canvas : initialize()');

		this.sprites = this.collection;
		this.canvas = this.sprites.canvas;

		// prepare in dom
		this.bind();
	},

	/**
	 * Bind event handlers
	 */
	bind: function () {
		console.info('views/canvas : bind()');

		this.sprites.on('add', _.bind(this.onAdd, this));
		this.sprites.on('reset', _.bind(this.onReset, this));
		this.canvas.on('change', _.bind(this.onChange, this));
	},

	/**
	 * When sprites are added to the collection
	 *
	 * @param {SpriteModel} sprite
	 */
	onAdd: function (sprite) {
		console.info('views/canvas : onAdd()');

		var view = new SpriteView({model: sprite});

		this.$el.append(view.el);
	},

	/**
	 * Clear out canvas
	 */
	onReset: function () {
		console.info('views/canvas : onReset()');

		this.$el.empty();
	},

	/**
	 * Update canvas style
	 */
	onChange: function () {
		console.info('views/canvas : onChange()');

		this.$el.css({
			width: this.canvas.get('width'),
			height: this.canvas.get('height')
		});
	}

});