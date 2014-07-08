var messages = {};

_.extend(messages, Backbone.Events);

messages.on('all', function (e) {
	var args = [].slice.call(arguments, 1);

	console.log('--- event:', e, args);
});

module.exports = messages;