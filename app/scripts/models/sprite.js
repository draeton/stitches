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
	defaults: {},

	/**
	 * Initialize model properties
	 *
	 * @param {File} file
	 */
	initialize: function (file) {
		console.info('models/sprite : initialize', file);
	}

});