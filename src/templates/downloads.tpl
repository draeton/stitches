
<ul class="nav nav-tabs">
    <li class="active"><a href="#spritesheet" data-toggle="tab">Spritesheet</a></li>
    <li><a href="#stylesheet" data-toggle="tab">Stylesheet</a></li>
    <li><a href="#markup" data-toggle="tab">Markup</a></li>
</ul>
<div class="tab-content">
    <div class="tab-pane active" id="spritesheet">
        <p><img src="<%= spritesheet %>" class="thumbnail"/></p>
    </div>
    <div class="tab-pane" id="stylesheet">
        <p><textarea rows="<%= stylesheetLines %>"><%= stylesheet %></textarea></p>
    </div>
    <div class="tab-pane" id="markup">
        <style type="text/css">
            <%= stylesheet %>
        </style>
        <div><%= markup %></div>
        <p><textarea rows="<%= markupLines %>"><%= markup %></textarea></p>
    </div>
    <div class="tab-pane" id="example">
        <style type="text/css">
            .<%= prefix %> { float: left; }
            <%= stylesheet %>
        </style>
        <div><%= markup %></div>
    </div>
</div>