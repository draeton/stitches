var config = require('../../config');
var messages = require('../../messages');
var template = require('../../templates/palettes/properties.hbs');

var PaletteView = require('./palette');

/**
 * @return {View}
 */
module.exports = PaletteView.extend({

	/**
	 * @type {Objetc}
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
		console.info('palettes : properties : initialize()');

		// prepare in dom
		this.render();
	},

	/**
	 * Create the html for the view and append to the element.
	 *
	 * @return {View}
	 */
	render: function () {
		console.info('palettes : properties : render()');

		var html = template();

		this.$el.empty().append(html);

		return this;
	},

	/**
	 * Close me
	 *
	 * @param {Event} e
	 */
	onClickClose: function () {
		console.info('palettes : downloads : onClickClose()');

		this.close();
	},

	/**
	 * Remove source sprite from canvas
	 *
	 * @param {Event} e
	 */
	onClickRemove: function () {
		console.info('palettes : downloads : onClickRemove()');

		messages.trigger(config.events.remove, this.source);
	},

	/**
	 * Process name after input change
	 *
	 * @param {Event} e
	 */
	onChangeName: function (e) {
		console.info('palettes : downloads : onChangeName()');

		var input = $(e.currentTarget);
		var name = input.val();
		var sprite = this.source;

		sprite.name = sprite.cleanName(name);

		if (name !== sprite.name) {
			input.val(sprite.name);
		}
	}

});