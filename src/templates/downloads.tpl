
<ul class="nav nav-tabs">
    <li class="active"><a href="#spritesheet" data-toggle="tab">Spritesheet</a></li>
    <li><a href="#stylesheet" data-toggle="tab">Stylesheet</a></li>
</ul>
<div class="tab-content">
    <div class="tab-pane active" id="spritesheet">
        <p><img src="<%= spritesheet %>" class="thumbnail"/></p>
    </div>
    <div class="tab-pane" id="stylesheet">
        <p><textarea rows="<%= lines %>"><%= stylesheet %></textarea></p>
    </div>
    <div class="tab-pane" id="markup">
        <p><textarea rows="<%= lines %>"><%= markup %></textarea></p>
    </div>
</div>