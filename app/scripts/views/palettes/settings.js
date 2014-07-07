var template = require('../../templates/palettes/settings.hbs');

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
		console.info('palettes : settings : initialize()');

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
	}

});