.<%= prefix %> {\n
    background-image: url(<%= backgroundImage %>);\n
    background-repeat: no-repeat;\n
    display: block;\n
}\n

<% $.map(sprites, function (sprite) { %>
\n
.<%= prefix %>-<%= sprite.name %> {\n
    width: <%= sprite.image.width %>px;\n
    height: <%= sprite.image.height %>px;\n
    background-position: <%= sprite.left(true) %> <%= sprite.top(true) %>;\n
}\n
<% }); %>