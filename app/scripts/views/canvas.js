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

		this.collection.on('add', _.bind(this.add, this));
		this.collection.on('reset', _.bind(this.reset, this));
	},

	/**
	 * When sprites are added to the collection
	 *
	 * @param {SpriteModel} sprite
	 */
	add: function (sprite) {
		console.info('views/canvas : add()');

		var view = new SpriteView({model: sprite});

		this.$el.append(view.el);
	},

	/**
	 * Clear out canvas
	 */
	reset: function () {
		console.info('views/canvas : reset()');

		this.$el.empty();
	},

	/**
	 * Recalculate canvas dimensions and sprite positioning. Used after a
	 * change to sprites or settings
	 */
	stitch: function () {
		console.info('views/canvas : stitch()');

		messages.trigger(config.events.busy);

		this.measure();
		this.place();
		this.cut();

		messages.trigger(config.events.generate);
		messages.trigger(config.events.idle);
	}

});