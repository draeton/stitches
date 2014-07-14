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
		'click [data-action=clear]': 'onClickClear',
		'click [data-action=downloads]': 'onClickDownloads',
		'click [data-action=about]': 'onClickAbout'
	},

	/**
	 * Set up instance properties and call startup methods
	 */
	initialize: function () {
		console.info('views/toolbar : initialize()');

		this.sprites = this.collection;

		// prepare in dom
		this.render();
	},

	/**
	 * Create the html for the view and append to the element.
	 *
	 * @return {View}
	 */
	render: function () {
		console.info('views/toolbar : render()');

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
		console.info('views/toolbar : onChangeOpen()');

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
		console.info('views/toolbar : onClickSettings()');

		messages.trigger(config.events.settings);
	},

	/**
	 * Empty canvas
	 *
	 * @param {Event} e
	 */
	onClickClear: function () {
		console.info('views/toolbar : onClickClear()');

		messages.trigger(config.events.clear);
	},

	/**
	 * Open downloads palette
	 *
	 * @param {Event} e
	 */
	onClickDownloads: function () {
		console.info('views/toolbar : onClickDownloads()');

		messages.trigger(config.events.downloads);
	},

	/**
	 * Open about palette
	 *
	 * @param {Event} e
	 */
	onClickAbout: function () {
		console.info('views/toolbar : onClickAbout()');

		messages.trigger(config.events.about);
	}

});