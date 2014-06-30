<% $.map(sprites, function (sprite) { %>
<% if (tooltip) { %>
<i class="<%= prefix %> <%= prefix %>-<%= sprite.name %> <%= prefix %>-<%= sprite.name %>-sizeNormal" data-toggle="tooltip" title=".<%= prefix %>.<%= prefix %>-<%= sprite.name %>"></i>
<% } else { %>
<i class="<%= prefix %> <%= prefix %>-<%= sprite.name %>"></i>\n
<% } %>
<% }); %>