<% $.map(sprites, function (sprite) { %>
<% if (tooltip) { %>
<i class="<%= prefix %>-<%= sprite.name %>" data-toggle="tooltip" title=".<%= prefix %>-<%= sprite.name %>"></i>\n
<% } else { %>
<i class="<%= prefix %>-<%= sprite.name %>"></i>\n
<% } %>
<% }); %>