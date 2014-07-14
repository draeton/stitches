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
var layout = require('../utils/layout');

var SpriteModel = require('../models/sprite');
var CanvasModel = require('../models/canvas');

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

		this.canvas = new CanvasModel();

		this.on('change:src', _.bind(this.onChangeSrc, this));
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
	 * For updating progress, create spritesheet when completed
	 */
	onChangeSrc: function () {
		console.info('collections/sprite : onChangeSrc()');

		var loaded = this.length - this.where({src: ''}).length;
		var completed = loaded / this.length;

		messages.trigger(config.events.progress, completed);

		if (completed === 1) {
			messages.trigger(config.events.idle);
			messages.trigger(config.events.stitch);
		}
	},

	/**
	 * Spirtes that have been placed
	 *
	 * @return {Array}
	 */
	placed: function () {
		console.info('collections/sprite : placed()');

		return this.where({placed: true});
	},

	/**
	 * Recalculate canvas dimensions and sprite positioning. Used after a
	 * change to sprites or settings
	 */
	stitch: function () {
		console.info('collections/sprite : stitch()');

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
		console.info('collections/sprite : measure()');

		var dimensions = layout.getDimensions(this);

		this.canvas.set(dimensions);
	},

	/**
	 * Place a set of sprites on this canvas. Sorts sprites by `name`
	 * property before placement
	 */
	place: function () {
		console.info('collections/sprite : place()');

		var sprites = this;
		var canvas = this.canvas;

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
		console.info('collections/sprite : place()');

		var dimensions = layout.trimDimensions(this);

		this.canvas.set(dimensions);
	}

});