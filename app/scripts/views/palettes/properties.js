/**
 * # views/palettes/properties
 *
 * Constructor for the Properties palette.
 *
 * > http://draeton.github.io/stitches<br/>
 * > Copyright 2013 Matthew Cobbs<br/>
 * > Licensed under the MIT license.
 */

var config = require('../../config');
var messages = require('../../messages');
var template = require('../../templates/palettes/properties.hbs');

var PaletteView = require('./palette');

/**
 * @return {View}
 */
module.exports = PaletteView.extend({

	/**
	 * @type {Object}
	 */
	events: {
		'click [data-action=close]': 'onClickClose',
		'click [data-action=remove]': 'onClickRemove',
		'input [name=name]': 'onChangeName',
		'blur [name=name]': 'onChangeName'
	},

	/**
	 * Set up instance properties and call startup methods
	 */
	initialize: function () {
		console.info('views/palettes/properties : initialize()');

		// prepare in dom
		this.render();
	},

	/**
	 * Create the html for the view and append to the element.
	 *
	 * @param {SpriteModel} sprite
	 * @return {View}
	 */
	render: function (sprite) {
		console.info('views/palettes/properties : render()');

		var data = sprite ? sprite.toJSON() : null;
		var html = template(data);

		this.$el.empty().append(html);

		return this;
	},

	/**
	 * Close me
	 *
	 * @param {Event} e
	 */
	onClickClose: function () {
		console.info('views/palettes/properties : onClickClose()');

		this.close();
	},

	/**
	 * Remove source sprite from canvas
	 *
	 * @param {Event} e
	 */
	onClickRemove: function () {
		console.info('views/palettes/properties : onClickRemove()');

		messages.trigger(config.events.remove, this.source);
	},

	/**
	 * Process name after input change
	 *
	 * @param {Event} e
	 */
	onChangeName: function (e) {
		console.info('views/palettes/properties : onChangeName()');

		var input = $(e.currentTarget);
		var name = input.val();
		var sprite = this.source;

		sprite.name = sprite.cleanName(name);

		if (name !== sprite.name) {
			input.val(sprite.name);
		}
	}

});