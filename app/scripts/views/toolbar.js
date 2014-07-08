/**
 * # views/toolbar
 *
 * Constructor for UI toolbar view
 *
 * > http://draeton.github.io/stitches<br/>
 * > Copyright 2013 Matthew Cobbs<br/>
 * > Licensed under the MIT license.
 */

var config = require('../config');
var messages = require('../messages');
var template = require('../templates/toolbar.hbs');

/**
 * @return {ToolbarView}
 */
module.exports = Backbone.View.extend({

	/**
	 * @type {Object}
	 */
	events: {
		'change [data-action=open]': 'onChangeOpen',
		'click [data-action=settings]': 'onClickSettings',
		'click [data-action=reset]': 'onClickReset',
		'click [data-action=clear]': 'onClickClear',
		'click [data-action=downloads]': 'onClickDownloads',
		'click [data-action=about]': 'onClickAbout'
	},

	/**
	 * Set up instance properties and call startup methods
	 */
	initialize: function () {
		console.info('toolbar : initialize()');

		// prepare in dom
		this.render();
	},

	/**
	 * Create the html for the view and append to the element.
	 *
	 * @return {View}
	 */
	render: function () {
		console.info('toolbar : render()');

		var html = template();

		this.$el.empty().append(html);

		return this;
	},

	/**
	 * Start processing files
	 *
	 * @param {Event} e
	 */
	onChangeOpen: function (e) {
		var input = this.$el.find('input[type=file]');
		var clone = input.clone(true).val('');
		var files = e.target.files;

		messages.trigger(config.events.process, files);
		input.replaceWith(clone);
	},

	/**
	 * Open settings palette
	 *
	 * @param {Event} e
	 */
	onClickSettings: function () {
		messages.trigger(config.events.settings);
	},

	/**
	 * Reset canvas to initial state
	 *
	 * @param {Event} e
	 */
	onClickReset: function () {
		messages.trigger(config.events.reset);
	},

	/**
	 * Empty canvas
	 *
	 * @param {Event} e
	 */
	onClickClear: function () {
		messages.trigger(config.events.clear);
	},

	/**
	 * Open downloads palette
	 *
	 * @param {Event} e
	 */
	onClickDownloads: function () {
		messages.trigger(config.events.downloads);
	},

	/**
	 * Open about palette
	 *
	 * @param {Event} e
	 */
	onClickAbout: function () {
		messages.trigger(config.events.about);
	}

});