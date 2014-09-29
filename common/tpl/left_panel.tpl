<div id="left_panel" class="panel panel-default<?php print (strtolower($page) == "map") ? " map" : ""; ?>">
	<div class="folder_menu">
		<!--ul>
			<li><a data-original-title="Open/close left panel" onclick="$.left_panel('filter');" href="javascript:void(0);" title=""><span class="fa fa-search"></span>&nbsp;Filter</a></li>
			<li><a data-original-title="Open/close left panel" onclick="$.left_panel('filter');" href="javascript:void(0);" title=""><span class="fa fa-search"></span>&nbsp;Filter</a></li>
		</ul-->
		<ul class="nav nav-tabs">
			<li><a data-original-title="Open/close left panel" onclick="$.left_panel('close');" href="javascript:void(0);" title=""><span class="fa fa-search"></span>&nbsp;Search</a></li>
		</ul>
	</div>
	<div class="panel-header controls clearfix">
		<h4 class="panel_btns pull-left">Metadata search</h4>
		<a href="javascript:void(0);" onclick="$.left_panel('close');"  id="close_left_panel_btn" title="Close left panel" style="display: none;" class="btn close_panel pull-right"><span class="text text-muted">Close</span> <span class="fa fa-caret-square-o-left text-muted"></span></a>
	</div>
	<div class="panel-body autocomplete"></div>
	<div class="panel-body contents">
		<h4><i style="text-muted"><?php print $i18n[$lang]["interface"]["static_form_help_text"]; ?></i></h4>
		<div>
			<div id="static_forms"></div>
		</div>
	</div>
	<div class="panel-body contents">
		<div class="title panel-heading" style="padding: 0; height: 60px;"></div>
		<hr />
		<div id="static_forms_list" style="padding: 0 15px;">
			<div id="static_forms_loader"><span class="fa fa-refresh fa-spin"></span> Loading...</span></div>
			<?php /*require_once("common/tpl/predefined_search.tpl");*/ ?>
		</div>
	</div>
</div>
