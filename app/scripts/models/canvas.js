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

/**
 * @return {CanvasModel}
 */
module.exports = Backbone.Model.extend({

	/**
	 * @type {Object}
	 */
	defaults: {
		width: config.settings.canvas.width,
		height: config.settings.canvas.height
	}

});