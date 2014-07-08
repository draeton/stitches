var template = require('../templates/stitches.hbs');

var CanvasView = require('../views/canvas');
var DropboxView = require('../views/dropbox');
var PalettesView = require('../views/palettes');
var ProgressView = require('../views/progress');
var ToolbarView = require('../views/toolbar');

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
		this.palettes = {};

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
		this.elements.canvas = this.$el.find('.wrap-canvas');
		this.elements.dropbox = this.$el.find('.wrap-dropbox');
		this.elements.palettes = this.$el.find('.wrap-palettes');
		this.elements.progress = this.$el.find('.wrap-progress');
		this.elements.toolbar = this.$el.find('.wrap-toolbar');

		this.views.canvas = new CanvasView({el: this.elements.canvas});
		this.views.dropbox = new DropboxView({el: this.elements.dropbox});
		this.views.palettes = new PalettesView({el: this.elements.palettes});
		this.views.progress = new ProgressView({el: this.elements.progress});
		this.views.toolbar = new ToolbarView({el: this.elements.toolbar});

		this.palettes.about = this.views.palettes.views.about;
		this.palettes.downloads = this.views.palettes.views.downloads;
		this.palettes.properties = this.views.palettes.views.properties;
		this.palettes.settings = this.views.palettes.views.settings;

		return this;
	}

});