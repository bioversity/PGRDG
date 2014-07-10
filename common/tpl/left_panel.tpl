<div id="left_panel" class="panel panel-default<?php print (strtolower($page) == "map") ? " map" : ""; ?>">
	<div class="folder_menu">
		<!--ul>
			<li><a data-original-title="Open/close left panel" onclick="$.left_panel('filter');" href="javascript:void(0);" title=""><span class="fa fa-search"></span>&nbsp;Filter</a></li>
			<li><a data-original-title="Open/close left panel" onclick="$.left_panel('filter');" href="javascript:void(0);" title=""><span class="fa fa-search"></span>&nbsp;Filter</a></li>
		</ul-->
		<ul class="nav nav-tabs">
			<li><a data-original-title="Open/close left panel" onclick="$.left_panel('filter');" href="javascript:void(0);" title=""><span class="fa fa-search"></span>&nbsp;Search</a></li>
		</ul>
	</div>
	<div class="panel-header controls">
		<ul class="panel_btns">
			<li><a href="javascript:void(0);" onclick="$.left_panel('filter');" title="Close left panel" class="btn close_panel"><span class="text text-muted">Close</span> <span class="fa fa-caret-square-o-left text-muted"></span></a></li>
		</ul>
	</div>
	<div class="panel-body"></div>
</div>
