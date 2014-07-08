var config = require('../config');
var messages = require('../messages');
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

		this.elements = {};

		// prepare in dom
		this.render();
		this.bind();
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
		this.elements.dropbox = this.$el.find('.dropbox');
		this.elements.overlay = this.$el.find('.overlay');

		return this;
	},

	/**
	 * Bind event handlers
	 */
	bind: function () {
		console.info('dropbox : bind()');

		var dropbox = this.elements.dropbox.get(0);
		var overlay = this.elements.overlay.get(0);

		dropbox.addEventListener('dragenter', _.bind(this.onDragStart, this), false);
		overlay.addEventListener('dragleave', _.bind(this.onDragStop, this), false);
		overlay.addEventListener('dragexit', _.bind(this.onDragStop, this), false);
		overlay.addEventListener('dragover', function () {}, false);
		overlay.addEventListener('drop', _.bind(this.onDrop, this), false);
	},

	/**
	 * Show the overlay
	 */
	showOverlay: function () {
		console.info('dropbox : showOverlay()');

		this.elements.overlay.addClass('active');
	},

	/**
	 * Hide the overlay
	 */
	hideOverlay: function () {
		console.info('dropbox : hideOverlay()');

		this.elements.overlay.removeClass('active');
	},

	/**
	 * Close all palettes and block the UI when dragging
	 *
	 * @param {Event} e
	 */
	onDragStart: function () {
		console.info('dropbox : onDragStart()');

		messages.trigger(config.events.close);
		messages.trigger(config.events.busy);
	},

	/**
	 * If we're on the target, unblock the UI
	 *
	 * @param {Event} e
	 */
	onDragStop: function (e) {
		console.info('dropbox : onDragStop()');

		var contains = $.contains(this.el, e.target);

		if (contains) {
			messages.trigger(config.events.idle);
		}
	},

	/**
	 * When a drop event occurs, check for files. If there are files, start
	 * processing them
	 *
	 * @param {Event} e
	 */
	onDrop: function (e) {
		console.info('dropbox : onDrop()');

		var files = (e.files || e.dataTransfer.files);

		e.stopPropagation();
		e.preventDefault();

		if (files.length) {
			messages.trigger(config.events.process, [files]);
		} else {
			messages.trigger(config.events.idle);
		}
	}

});