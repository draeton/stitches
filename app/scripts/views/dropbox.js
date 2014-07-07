var template = require('../templates/dropbox.hbs');

/**
 * @return {View}
 */
module.exports = Backbone.View.extend({

	/**
	 * @type {Objetc}
	 */
	events: {},

	/**
	 * Set up instance properties and call startup methods
	 */
	initialize: function () {
		console.info('dropbox : initialize()');

		// prepare in dom
		this.render();
	},

	/**
	 * Create the html for the view and append to the element.
	 *
	 * @return {View}
	 */
	render: function () {
		console.info('dropbox : render()');

		var html = template();

		this.$el.empty().append(html);

		return this;
	}

});