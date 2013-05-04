.stitches-<%= prefix %>(@x: 0, @y: 0, @width: 0, @height: 0) {\n
	background-position: @x @y;\n
	width: @width;\n
	height: @height;\n
}\n
\n
.<%= prefix %> {\n
	background-image: url(<%= backgroundImage %>);
	background-repeat: no-repeat;\n
	display: block;\n
<% $.map(sprites, function (sprite) { %>
\n
	&.<%= prefix %>-<%= sprite.name %> {\n
		.stitches-<%= prefix %>(<%= sprite.left(true) %>, <%= sprite.top(true) %>, <%= sprite.image.width %>px, <%= sprite.image.height %>px);\n
	}\n
<% }); %>
}\n