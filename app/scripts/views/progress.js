var template = require('../templates/progress.hbs');

/**
 * @return {View}
 */
module.exports = Backbone.View.extend({

	/**
	 * @type {Object}
	 */
	events: {},

	/**
	 * Set up instance properties and call startup methods
	 */
	initialize: function () {
		console.info('views/progress : initialize()');

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
		console.info('views/progress : render()');

		var html = template();

		this.$el.empty().append(html);
		this.elements.bar = this.$el.find('.progress-bar');

		return this;
	},

	/**
	 * Set bar width and color
	 *
	 * @param {Number} percent
	 * @param {String} type
	 */
	set: function (percent, type) {
		console.info('views/progress : set()');

		if (type) {
			this.elements.bar.attr('class', 'progress-bar progress-bar-' + type);
		}

		this.elements.bar.css('width', percent + '%');
	}

});