<% if (units == "pixel") { %>
.stitches-<%= prefix %>(@x: 0, @y: 0, @width: 0, @height: 0) {\n
    background-position: @x @y;\n
    width: @width;\n
    height: @height;\n
}\n
<% } else if (units == "percent") { %>
.stitches-<%= prefix %>(@x: 0, @y: 0, @width: 0, @height: 0) {\n
    background-position: percentage(@x / (<%= canvasWidth %> - @width)) percentage(@y / (<%= canvasHeight %> - @height));\n
    background-size: percentage(<%= canvasWidth %> / @width) percentage(<%= canvasHeight %> / @height);\n
}\n
<% } %>
\n
<% if (units == "percent") { %>
.stitches-<%= prefix %>-sizeNormal(@width: 0, @height: 0) {\n
    width: @width;\n
    height: @height;\n
}
\n
<% }%>
.<%= prefix %> {\n
    background-image: url(<%= backgroundImage %>);\n
<% if (units == "pixel") { %>
    background-repeat: no-repeat;\n
<% } else if (units == "percent") { %>
    max-width: 100%;\n
<% } %>
    display: block;\n
<% $.map(sprites, function (sprite) { %>
\n
<% if (units == "percent") { %>
    &.<%= prefix %>-<%= sprite.name %>-sizeNormal {\n
        .stitches-<%= prefix %>-sizeNormal(<%= sprite.width %>px, <%= sprite.height %>px);\n
    }\n
<% } %>

    &.<%= prefix %>-<%= sprite.name %> {\n
<% if (units == "pixel") { %>
        .stitches-<%= prefix %>(-<%= sprite.left() %>px, -<%= sprite.top() %>px, <%= sprite.width %>px, <%= sprite.height %>px);\n
<% } else if (units == "percent") { %>
        .stitches-<%= prefix %>(<%= sprite.left() %>, <%= sprite.top() %>, <%= sprite.width %>, <%= sprite.height %>);\n
<% } %>
    }\n
<% }); %>
}\n