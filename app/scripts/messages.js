var messages = {};

_.extend(messages, Backbone.Events);

messages.on('all', function (e) {
	console.log('--- event:', e);
});

module.exports = messages;