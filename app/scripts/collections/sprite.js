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
		console.info('collections/sprite : initialize()');

		this.on('change:src', _.bind(this.onChangeSrc, this));
		this.on('change', _.bind(this.onChange, this))
	},

	/**
	 * Parse file data
	 *
	 * @param {FileList} files
	 * @return {Array}
	 */
	parse: function (files) {
		console.info('collections/sprite : parse()');

		var list = _.filter(files, function (file) {
			return /jpeg|png|gif/.test(file.type);
		});

		return list;
	},

	/**
	 * For updating progress
	 */
	onChangeSrc: function () {
		console.info('collections/sprite : onChangeSrc()');

		var loaded = this.length - this.where({src: ''}).length;
		var completed = loaded / this.length;

		messages.trigger(config.events.progress, completed);

		if (completed === 1) {
			messages.trigger(config.events.idle);
		}
	},

	/**
	 * Rearrange sprites
	 */
	onChange: function () {
		console.info('collections/sprite : onChange()');

		messages.trigger(config.events.stitch);
	}

});