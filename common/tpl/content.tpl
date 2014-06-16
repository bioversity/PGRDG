<div id="breadcrumb">
	<ol class="breadcrumb">
		<li id="goto_forms_btn"><span class="text-muted fa fa-tasks"></span> <span class="txt">Forms</span></li>
	</ol>
</div>
<div id="contents">
	<div id="content" class="panel-content">
		<?php
		print (is_home()) ? "" : "<h1>" . str_replace("_", " ", (($page == "") ? "home" : $page)) . "</h1>";
		require_once("common/tpl/pages/" . str_replace("_", " ", (($page == "") ? "home" : $page)) . ".tpl");
		?>
	</div>
</div>