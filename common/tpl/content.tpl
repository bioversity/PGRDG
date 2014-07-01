<div id="breadcrumb">
	<ol class="breadcrumb">
		<li id="goto_forms_btn"><span class="text-muted fa fa-tasks"></span> <span class="txt">Forms</span></li>
	</ol>
</div>
<div id="contents">
	<?php
	if(strtolower($page) == "map") {
		?>
		<div id="map" class="panel_content">
			<?php require_once("common/tpl/map_toolbox.tpl"); ?>

			<div id="map_hidden_elements" style="display: none;"></div>
			<!--script src="common/js/polyfills.js"></script-->
		</div>
		<div id="pgrdg_map"></div>
		<?php
	} else {
		?>
		<div id="content" class="panel-content">
			<?php
			print (is_home()) ? '<h1>Plant Genetic Resources Diversity Gateway<small class="help-block">for the conservation and use of crop wild relative and landrace traits</small></h1>' : "<h1>" . str_replace("_", " ", (($page == "") ? "home" : $page)) . "</h1>";
			require_once("common/tpl/pages/" . str_replace("_", " ", (($page == "") ? "home" : $page)) . ".tpl");
			?>
		</div>
		<?php
	}
	?>
</div>
