/**
 * # views/sprite
 *
 * Constructor for the sprite view
 *
 * > http://draeton.github.io/stitches<br/>
 * > Copyright 2013 Matthew Cobbs<br/>
 * > Licensed under the MIT license.
 */

var config = require('../config');
var messages = require('../messages');
var template = require('../templates/sprite.hbs');

/**
 * @return {SpriteView}
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
		console.info('views/sprite : initialize()');

		// prepare in dom
		this.render();
		this.bind();
	},

	/**
	 * Bind event handlers
	 */
	bind: function () {
		console.info('views/sprite : bind()');

		this.model.bind('change', this.render, this);
		this.model.bind('destroy', this.remove, this);
	},

	/**
	 * Create the html for the view and append to the element.
	 *
	 * @return {View}
	 */
	render: function () {
		console.info('views/sprite : render()');

		var data = this.model.toJSON();
		var html = template(data);

		this.$el.empty().append(html);

		return this;
	},

	/**
	 * Remove from dom after model is destroyed
	 */
	remove: function () {
		console.info('views/sprite : remove()');

		this.$el.remove();
	}

});