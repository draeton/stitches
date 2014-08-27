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
		console.info('views/palettes/settings : initialize()');

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
		console.info('views/palettes/settings : render()');

		// set selected layout
		_.map(config.layouts, function (layout) {
			layout.selected = layout.type === config.settings.layout;
		});

		// set selected stylesheet
		_.map(config.stylesheets, function (stylesheet) {
			stylesheet.selected = stylesheet.type === config.settings.stylesheet;
		});

		var data = config;
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
		console.info('views/palettes/settings : onClickClose()');

		this.close();
	}

});