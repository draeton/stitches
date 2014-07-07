var template = require("./templates/stitches.hbs");

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
		console.info('stitches : initialize()');

		this.views = {};
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
		console.info('stitches : render()');

		var html = template();

		this.$el.empty().append(html);

		return this;
	}

});