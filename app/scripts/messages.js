/**
 * # messages
 *
 * Communicate between module using strings from config.events
 *
 * > http://draeton.github.io/stitches<br/>
 * > Copyright 2013 Matthew Cobbs<br/>
 * > Licensed under the MIT license.
 */

var messages = {};

_.extend(messages, Backbone.Events);

messages.on('all', function (e) {
	var args = [].slice.call(arguments, 1);

	console.info('--- event:', e, args);
});

module.exports = messages;