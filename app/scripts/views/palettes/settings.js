/**
 * # views/palettes/settings
 *
 * Constructor for the Settings palette.
 *
 * > http://draeton.github.io/stitches<br/>
 * > Copyright 2013 Matthew Cobbs<br/>
 * > Licensed under the MIT license.
 */

var config = require('../../config');
var messages = require('../../messages');
var template = require('../../templates/palettes/settings.hbs');

var PaletteView = require('./palette');

/**
 * @return {View}
 */
module.exports = PaletteView.extend({

	/**
	 * @type {Object}
	 */
	events: {
		'click [data-action=close]': 'onClickClose'
	},

	/**
	 * Set up instance properties and call startup methods
	 */
	initialize: function () {
		console.info('palettes : settings : initialize()');

		this.elements = {};

		// prepare in dom
		this.render();
	},

	/**
	 * Create the html for the view and append to the element.
	 *
	 * @return {View}
	 */
	render: function () {
		console.info('palettes : settings : render()');

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
	}

});