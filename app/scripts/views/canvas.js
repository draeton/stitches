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

var template = require('../templates/canvas.hbs');

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
		console.info('canvas : initialize()');

		// prepare in dom
		this.render();
	},

	/**
	 * Create the html for the view and append to the element.
	 *
	 * @return {View}
	 */
	render: function () {
		console.info('canvas : render()');

		var html = template();

		this.$el.empty().append(html);

		return this;
	}

});