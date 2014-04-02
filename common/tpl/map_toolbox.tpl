<div id="map_toolbox">
	<ul>
		<li><a href="javascript: void(0);" title="Find a location" class="btn" onclick="$.sub_toolbox('find_location');"><span class="fa fa-search"></span></a></li>
		<li><a href="javascript: void(0);" title="Change map type" class="btn" onclick="$.sub_toolbox('change_map');"><span class="fa fa-tasks"></span></a></li>
	</ul>
</div>
<div id="map_sub_toolbox">
	<div id="find_location">
		<input type="search" class="form-control input-sm" size="30" placeholder="Enter the location name here" />
	</div>
	<div id="change_map" class="level1">
		<span id="selected_map" style="display: none;">Google Physical</span>
		<ul class="list-unstyled">
			<li><a class="btn change_map_btn" href="javascript: void(0);" onclick="$.change_map_layer('Google Physical', $(this));"><span class="fa fa-circle-o"></span>&nbsp;&nbsp;Physical</a></li>
			<li><a class="btn change_map_btn" href="javascript: void(0);" onclick="$.change_map_layer('Google Streets', $(this));"><span class="fa fa-circle-o"></span>&nbsp;&nbsp;Street</a></li>
			<li><a class="btn change_map_btn" href="javascript: void(0);" onclick="$.change_map_layer('Google Hybrid', $(this));"><span class="fa fa-circle-o"></span>&nbsp;&nbsp;Hybrid</a></li>
			<li><a class="btn change_map_btn" href="javascript: void(0);" onclick="$.change_map_layer('Google Satellite', $(this));"><span class="fa fa-check-circle"></span>&nbsp;&nbsp;Satellite</a></li>
		</ul>
	</div>
</div>