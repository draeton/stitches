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

		// prepare in dom
		this.bind();
	},

	/**
	 * Bind event handlers
	 */
	bind: function () {
		console.info('views/canvas : bind()');

		this.model.on('change', _.bind(this.onChange, this));
		this.model.sprites.on('add', _.bind(this.onAdd, this));
		this.model.sprites.on('reset', _.bind(this.onReset, this));
	},

	/**
	 * Update canvas style
	 */
	onChange: function () {
		console.info('views/canvas : onChange()', arguments);

		this.$el.css({
			width: this.model.get('width'),
			height: this.model.get('height')
		});
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
	}

});