var template = require('../templates/toolbar.hbs');

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
	}

});