<div id="map_toolbox">
	<?php
	print $site_config->menu("map_toolbox", "menu");
	?>
</div>
<div id="map_sub_toolbox">
	<div id="find_location" class="level1">
		<input type="search" class="form-control input-sm" size="30" placeholder="Enter the location name here" />
	</div>
	<div id="change_map" class="level2">
		<span id="selected_map" style="display: none;"><?php print $map_config->json_conf["map"]["default_map_layer"]; ?></span>
		<?php
		print $map_config->menu("layers", "list-unstyled");
		?>
	</div>
</div>