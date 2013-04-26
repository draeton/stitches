.stitches-<%= prefix %>(@x: 0, @y: 0, @width: 0, @height: 0) {\n
  background-position: @x @y;\n
  width: @width;\n
  height: @height;\n
}\n
\n
.<%= prefix %> {\n
  background: url(<%= backgroundImage %>) no-repeat;\n
  display: block;\n
<% $.map(sprites, function (sprite) { %>
\n
  &.<%= prefix %>-<%= sprite.name %> {\n
    .stitches-<%= prefix %>(-<%= sprite.left() %>px, -<%= sprite.top() %>px, <%= sprite.image.width %>px, <%= sprite.image.height %>px);\n
  }\n
<% }); %>
}\n