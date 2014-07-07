var template = require('../templates/palettes.hbs');

var AboutView = require('../views/palettes/about');
var DownloadsView = require('../views/palettes/downloads');
var PropertiesView = require('../views/palettes/properties');
var SettingsView = require('../views/palettes/settings');

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
		console.info('palettes : initialize()');

		this.elements = {};
		this.views = {};

		// prepare in dom
		this.render();
	},

	/**
	 * Create the html for the view and append to the element.
	 *
	 * @return {View}
	 */
	render: function () {
		console.info('palettes : render()');

		var html = template();

		this.$el.empty().append(html);
		this.elements.about = this.$el.find('.wrap-about');
		this.elements.downloads = this.$el.find('.wrap-downloads');
		this.elements.properties = this.$el.find('.wrap-properties');
		this.elements.settings = this.$el.find('.wrap-settings');

		this.views.about = new AboutView({el: this.elements.about});
		this.views.downloads = new DownloadsView({el: this.elements.downloads});
		this.views.properties = new PropertiesView({el: this.elements.properties});
		this.views.settings = new SettingsView({el: this.elements.settings});

		return this;
	}

});