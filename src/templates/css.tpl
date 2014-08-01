
.<%= prefix %> {\n
    background-image: url(<%= backgroundImage %>);\n
<% if (units == "pixel") { %>
    background-repeat: no-repeat;\n
<% } else {%>
    max-width: 100%;\n
<% } %>
    display: block;\n
}\n

<% $.map(sprites, function (sprite) { %>
\n
<% if (units == "percent") { %>
<% if (exportNormalSize) { %>
.<%= prefix %>-<%= sprite.name %>-sizeNormal {\n
    width: <%= sprite.width %>px;\n
    height: <%= sprite.height %>px;\n
}\n
\n
<% } %>
<% if (exportPercentageSize) { %>
<% if (sprite.parentWidth != 0 || sprite.parentHeight != 0) { %>
.<%= prefix %>-<%= sprite.name %>-sizePercentage {\n
    width: <%= ((sprite.parentWidth / sprite.width) * 100) %>%;\n
    height: <%= ((sprite.parentHeight / sprite.height) * 100) %>%;\n
}\n
<% } %>
<% } %>
<% } %>

.<%= prefix %>-<%= sprite.name %> {\n
<% if (units == "percent") { %>
    background-size : <%= ((canvasWidth / sprite.width) * 100) %>% <%= ((canvasHeight / sprite.height) * 100) %>%;\n
    background-position: <%= ((sprite.left() / (canvasWidth - sprite.width)) * 100) %>% <%= ((sprite.top() / (canvasHeight - sprite.height)) * 100) %>%;\n
<% } else { %>
    width: <%= sprite.width %>px;\n
    height: <%= sprite.height %>px;\n
    background-position: -<%= sprite.left() %>px -<%= sprite.top() %>px;\n
<% } %>
}\n
<% }); %>