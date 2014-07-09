/**
 * # collections/sprite
 *
 * Constructor for the sprite collection, invoked when files are loaded and ready
 * to be processed into sprites
 *
 * > http://draeton.github.io/stitches<br/>
 * > Copyright 2013 Matthew Cobbs<br/>
 * > Licensed under the MIT license.
 */

var config = require('../config');
var messages = require('../messages');

var SpriteModel = require('../models/sprite');

/**
 * @return {SpriteCollection}
 */
module.exports = Backbone.Collection.extend({

		/**
		 * @type {Model}
		 */
		model: SpriteModel,

		/**
		 * Initialize collection properties
		 */
		initialize: function () {
			console.info('collections/sprite : initialize');
		},

		/**
		 * Parse file data
		 *
		 * @param {FileList} files
		 * @return {Array}
		 */
		parse: function (files) {
			console.info('collections/sprite : parse');

			return files;
		}

});