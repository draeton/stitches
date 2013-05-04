.<%= prefix %> {\n
	background-image: url(<%= backgroundImage %>);\n
	background-repeat: no-repeat;\n
	display: block;\n
}\n

<% $.map(sprites, function (sprite) { %>
\n
.<%= prefix %>-<%= sprite.name %> {\n
	width: <%= sprite.width(true) %>;\n
	height: <%= sprite.height(true) %>;\n
	background-position: <%= sprite.left(true) %> <%= sprite.top(true) %>;\n
}\n
<% }); %>