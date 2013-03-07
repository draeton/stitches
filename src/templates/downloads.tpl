
<ul class="nav nav-tabs">
    <li class="active"><a href="#spritesheet" data-toggle="tab">PNG</a></li>
    <li><a href="#stylesheet" data-toggle="tab"><%= stylesheetType.toUpperCase() %></a></li>
    <li><a href="#markup" data-toggle="tab">HTML</a></li>
    <li><a href="#example" data-toggle="tab"><strong>Example</strong></a></li>
</ul>
<div class="tab-content">
    <div class="tab-pane active" id="spritesheet">
        <p><img src="<%= spritesheet %>" class="thumbnail"/></p>
    </div>
    <div class="tab-pane" id="stylesheet">
        <p><textarea rows="<%= stylesheetLines %>"><%= stylesheet %></textarea></p>
    </div>
    <div class="tab-pane" id="markup">
        <p><textarea rows="<%= markupLines %>"><%= markup %></textarea></p>
    </div>
    <div class="tab-pane stitches-example" id="example">
        <style type="text/<%= stylesheetType %>"><%= stylesheetWithUri %></style>
        <div><%= markupTooltip %></div>
        <script src="//cdnjs.cloudflare.com/ajax/libs/less.js/1.3.3/less.min.js"></script>
    </div>
</div>