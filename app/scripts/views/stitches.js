var template = require('../templates/stitches.hbs');

var ToolbarView = require('../views/toolbar');
var ProgressView = require('../views/progress');
var DropboxView = require('../views/dropbox');
var PalettesView = require('../views/palettes');

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
		console.info('stitches : render()');

		var html = template();

		this.$el.empty().append(html);
		this.elements.toolbar = this.$el.find('.wrap-toolbar');
		this.elements.progress = this.$el.find('.wrap-progress');
		this.elements.dropbox = this.$el.find('.wrap-dropbox');
		this.elements.palettes = this.$el.find('.wrap-palettes');

		this.views.toolbar = new ToolbarView({el: this.elements.toolbar});
		this.views.progress = new ProgressView({el: this.elements.progress});
		this.views.dropbox = new DropboxView({el: this.elements.dropbox});
		this.views.palettes = new PalettesView({el: this.elements.palettes});

		return this;
	}

});