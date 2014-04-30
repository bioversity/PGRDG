<div id="contextMenu" class="dropdown clearfix">
	<?php
	//print $site_config->menu("map_contextmenu", array("class" => "dropdown-menu", "role" => "menu", "aria-labelledby" => "dropdownMenu", "style" => "display:block;position:static;margin-bottom:5px;"));
	?>
</div>
<div id="map_toolbox">
	<?php
	print $site_config->menu("map_toolbox", "menu");
	?>
</div>
<div id="selected_zone"></div>
<div id="information_zone"></div>
<div id="map_sub_toolbox">
	<div id="previous_selected_layer"></div>
	<div id="find_location" class="level0">
		<input type="search" class="form-control input-sm" size="30" placeholder="Enter the location name here" />
	</div>
	<div id="change_map" class="level1">
		<span id="selected_map" style="display: none;"><?php print $map_config->json_conf["map"]["default_map_layer"]; ?></span>
		<?php
		//print $map_config->menu("layers", "list-unstyled");
		?>
	</div>
</div>

<div style="display: none;">
	<!-- Clickable label for Vienna -->
	<a class="overlay" id="vienna" target="_blank" href="http://en.wikipedia.org/wiki/Vienna">Vienna</a>
	<div id="marker" title="Marker"></div>
	<!-- Popup -->
	<div id="popup" title="Welcome to ol3"></div>
</div>

<!-- Contextmenu -->
<div id="knob">
	<div class="component csstransforms">
		<div class="cn-wrapper opened-nav" id="cn-wrapper">
			<?php
			print $site_config->contextmenu("map_knob_contextmenu", array()/*array("class" => "dropdown-menu", "role" => "menu", "aria-labelledby" => "dropdownMenu", "style" => "display:block;position:static;margin-bottom:5px;")*/);
			?>
			<!--ul>
				<li><span><a href="javascript:void(0);"><small class="fa fa-check"></small></a></span></li>
				<li><span><a href="javascript:void(0);"><small class="fa fa-cloud"></small></a></span></li>
				<li><span><a href="javascript:void(0);"><small class="fa fa-flask"></small></a></span></li>
				<li><span><a href="javascript:void(0);"><small class="fa fa-leaf"></small></a></span></li>
				<li><span><a href="javascript:void(0);"><small class="fa fa-magic"></small></a></span></li>
				<li><span><a href="javascript:void(0);"><small class="fa fa-tint"></small></a></span></li>
				<li><span><a href="javascript:void(0);"><small class="fa fa-road"></small></a></span></li>
			</ul-->
		</div>
	</div>
</div>