<script type="text/javascript" src="<?php print $domain; ?>/common/js/plugins/jquery.min.js"></script>
<!-- Jquery UI -->
<link rel="stylesheet" href="<?php print $domain; ?>/common/js/plugins/jquery-ui-1.11.2.custom/jquery-ui.min.css" type="text/css" />
<script type="text/javascript" src="<?php print $domain; ?>/common/js/plugins/jquery-ui-1.11.2.custom/jquery-ui.min.js"></script>
<script type="text/javascript" src="<?php print $domain; ?>/common/js/plugins/jquery.easing.1.3.js"></script>
<script type="text/javascript" src="<?php print $domain; ?>/common/js/plugins/bootstrap/bootstrap.min.js"></script>
<script type="text/javascript" src="<?php print $domain; ?>/common/js/plugins/apprise-bootstrap.js"></script>
<!-- jquery.cookie & storage -->
<script src="<?php print $domain; ?>/common/js/plugins/jquery-cookie/jquery.cookie.js"></script>
<script src="<?php print $domain; ?>/common/js/plugins/jquery-storage/jquery.storageapi.js"></script>
<!-- Jcryption, MD5 & SHA1 -->
<script type="text/javascript" src="<?php print $domain; ?>/common/js/plugins/jquery.jcryption.3.0.js"></script>
<script type="text/javascript" src="<?php print $domain; ?>/common/js/plugins/jquery-md5/jquery.md5.js"></script>
<script type="text/javascript" src="<?php print $domain; ?>/common/js/plugins/jquery.sha1.js"></script>
<!-- d3js -->
<!--script src="<?php print $domain; ?>/common/js/plugins/d3/d3.min.js" charset="utf-8"></script-->
<script type="text/javascript" src="<?php print $domain; ?>/common/js/plugins/d3/d3_flare.js"></script>
<script type="text/javascript" src="<?php print $domain; ?>/common/js/plugins/d3/d3.layout.js"></script>
<!-- Purl (A JavaScript URL parser) -->
<script type="text/javascript" src="<?php print $domain; ?>/common/js/plugins/purl/purl.js"></script>
<!-- Jquery Choosen -->
<link rel="stylesheet" href="<?php print $domain; ?>/common/js/plugins/chosen/chosen-bootstrap.css" type="text/css" />
<script type="text/javascript" src="<?php print $domain; ?>/common/js/plugins/chosen/chosen.jquery.js"></script>
<!--script type="text/javascript" src="<?php print $domain; ?>/common/js/plugins/bootstrap-multiselect/js/bootstrap-multiselect.js"></script-->
<!-- Jquery number formatter -->
<script type="text/javascript" src="<?php print $domain; ?>/common/js/plugins/jquery-number/jquery.number.min.js"></script>
<!-- Typeahead -->
<link rel="stylesheet" href="<?php print $domain; ?>/common/js/plugins/typeahead/typeahead.css" type="text/css" />
<script type="text/javascript" src="<?php print $domain; ?>/common/js/plugins/typeahead/typeahead.bundle.js"></script>
<!-- Jquery hotkeys -->
<script type="text/javascript" src="<?php print $domain; ?>/common/js/plugins/jquery.hotkeys/jquery.hotkeys.js"></script>
<script type="text/javascript" src="<?php print $domain; ?>/common/js/plugins/typeahead/typeahead.bundle.js"></script>
<!-- jQuery-Knob -->
<!--script type="text/javascript" src="<?php print $domain; ?>/common/js/plugins/jQuery-Knob/js/jquery.knob.js"></script-->
<!-- Stupid-Table-Plugin -->
<script type="text/javascript" src="<?php print $domain; ?>/common/js/plugins/Stupid-Table-Plugin/stupidtable.js"></script>
<!-- ToucSwipe -->
<script type="text/javascript" src="<?php print $domain; ?>/common/js/plugins/TouchSwipe/jquery.touchSwipe.min.js"></script>

	<!-- Core scripts -->
	<script type="text/javascript" src="<?php print $domain; ?>/common/include/conf/interface/i18n.js"></script>
	<script type="text/javascript" src="<?php print $domain; ?>/common/include/conf/interface/site.js"></script>
	<script type="text/javascript" src="<?php print $domain; ?>/API/?local=conf%2Frole_definitions.json"></script>
	<script type="text/javascript" src="<?php print $domain; ?>/API/?definitions=api"></script>
	<script type="text/javascript" src="<?php print $domain; ?>/API/?definitions=tags"></script>
	<script type="text/javascript" src="<?php print $domain; ?>/API/?definitions=types"></script>
	<script type="text/javascript" src="<?php print $domain; ?>/common/js/params.js"></script>
	<script type="text/javascript" src="<?php print $domain; ?>/common/js/shortcuts.js"></script>
	<script type="text/javascript">
	function load_firebug() {
		var fileref;
		if(config.site.developer_mode) {
			$("#loader").addClass("system").fadeIn(300, function() {
				document.body.style.cursor = "wait";
				fileref = document.createElement("script");
				fileref.setAttribute("type", "text/javascript");
				fileref.setAttribute("src", "<?php print $domain; ?>/common/js/plugins/firebug-lite/build/firebug-lite-debug.js");
				fileref.innerHTML = '{ saveCookies: true, startOpened: false, startInNewWindow: false, showIconWhenHidden: true, overrideConsole: true, ignoreFirebugElements: true, disableXHRListener: false, disableWhenFirebugActive: true, enableTrace: false, enablePersistent: false }';

				var head = document.getElementsByTagName("head")[0];
				head.appendChild(fileref);

				document.body.style.cursor = "default";
				$("#loader").fadeOut(0);
			});
		}
	}
	</script>
	<script type="text/javascript" src="<?php print $domain; ?>/common/js/main.js"></script>
	<?php
	if(strtolower($page->current) == "map" || strtolower($page->current) == "search" || strtolower($page->current) == "advanced_search") {
		?>
		<!-- OpenLayers2 -->
			<!--
			<script type="text/javascript" src="http://maps.google.com/maps/api/js?v=3&amp;sensor=false"></script>
			<link rel="stylesheet" href="<?php print $domain; ?>/common/js/plugins/OpenLayers/OpenLayers-2.13/theme/default/style.css" type="text/css">
			<script type="text/javascript" src="<?php print $domain; ?>/common/js/plugins/OpenLayers/OpenLayers-2.13/OpenLayers.js"></script>
			<script type="text/javascript" src="<?php print $domain; ?>/common/js/plugins/main.map.js"></script>
			-->
		<!-- OpenLayers 3 -->
		<!--link rel="stylesheet" href="<?php print $domain; ?>/common/js/plugins/OpenLayers/OpenLayers3/v3.0.0-beta.5/css/ol.css" type="text/css" />
		<script src="<?php print $domain; ?>/common/js/plugins/OpenLayers/OpenLayers3/v3.0.0-beta.5/build/ol.js" type="text/javascript"></script>

		<script type="text/javascript" src="<?php print $domain; ?>/common/js/map3.js"></script-->

		<!-- Leaflet -->
		<script type="text/javascript" src="<?php print $domain; ?>/common/js/plugins/leaflet/Leaflet-master/leaflet.js"></script>
		<link rel="stylesheet" href="<?php print $domain; ?>/common/js/plugins/leaflet/Leaflet-master/leaflet.css" />
			<!-- Providers -->
			<script type="text/javascript" src="<?php print $domain; ?>/common/js/plugins/leaflet/plugins/leaflet-providers/leaflet-providers.js"></script>
			<!-- Marker cluster-->
			<link rel="stylesheet" href="<?php print $domain; ?>/common/js/plugins/leaflet/plugins/Leaflet.markercluster/dist/MarkerCluster.css" />
			<link rel="stylesheet" href="<?php print $domain; ?>/common/js/plugins/leaflet/plugins/Leaflet.markercluster/dist/MarkerCluster.Default.css" />
			<script type="text/javascript" src="<?php print $domain; ?>/common/js/plugins/leaflet/plugins/Leaflet.markercluster/dist/leaflet.markercluster-src.js"></script>
			<!-- Heatmap -->
			<!-- <script type="text/javascript" src="<?php print $domain; ?>/common/js/plugins/leaflet/plugins/leaflet-heat.js"></script> -->
			<!-- Leaflet Draw -->
			<link rel="stylesheet" href="<?php print $domain; ?>/common/js/plugins/leaflet/plugins/Leaflet.draw/dist/leaflet.draw.css" />
			<script type="text/javascript" src="<?php print $domain; ?>/common/js/plugins/leaflet/plugins/Leaflet.draw/src/Leaflet.draw.js"></script>
				<script src="<?php print $domain; ?>/common/js/plugins/leaflet/plugins/Leaflet.draw/src/edit/handler/Edit.Poly.js"></script>
				<script src="<?php print $domain; ?>/common/js/plugins/leaflet/plugins/Leaflet.draw/src/edit/handler/Edit.SimpleShape.js"></script>
				<script src="<?php print $domain; ?>/common/js/plugins/leaflet/plugins/Leaflet.draw/src/edit/handler/Edit.Circle.js"></script>
				<script src="<?php print $domain; ?>/common/js/plugins/leaflet/plugins/Leaflet.draw/src/edit/handler/Edit.Rectangle.js"></script>

				<script src="<?php print $domain; ?>/common/js/plugins/leaflet/plugins/Leaflet.draw/src/draw/handler/Draw.Feature.js"></script>
				<script src="<?php print $domain; ?>/common/js/plugins/leaflet/plugins/Leaflet.draw/src/draw/handler/Draw.Polyline.js"></script>
				<script src="<?php print $domain; ?>/common/js/plugins/leaflet/plugins/Leaflet.draw/src/draw/handler/Draw.Polygon.js"></script>
				<script src="<?php print $domain; ?>/common/js/plugins/leaflet/plugins/Leaflet.draw/src/draw/handler/Draw.SimpleShape.js"></script>
				<script src="<?php print $domain; ?>/common/js/plugins/leaflet/plugins/Leaflet.draw/src/draw/handler/Draw.Rectangle.js"></script>
				<script src="<?php print $domain; ?>/common/js/plugins/leaflet/plugins/Leaflet.draw/src/draw/handler/Draw.Circle.js"></script>
				<script src="<?php print $domain; ?>/common/js/plugins/leaflet/plugins/Leaflet.draw/src/draw/handler/Draw.Marker.js"></script>

				<script src="<?php print $domain; ?>/common/js/plugins/leaflet/plugins/Leaflet.draw/src/ext/LatLngUtil.js"></script>
				<script src="<?php print $domain; ?>/common/js/plugins/leaflet/plugins/Leaflet.draw/src/ext/GeometryUtil.js"></script>
				<script src="<?php print $domain; ?>/common/js/plugins/leaflet/plugins/Leaflet.draw/src/ext/LineUtil.Intersect.js"></script>
				<script src="<?php print $domain; ?>/common/js/plugins/leaflet/plugins/Leaflet.draw/src/ext/Polyline.Intersect.js"></script>
				<script src="<?php print $domain; ?>/common/js/plugins/leaflet/plugins/Leaflet.draw/src/ext/Polygon.Intersect.js"></script>

				<script src="<?php print $domain; ?>/common/js/plugins/leaflet/plugins/Leaflet.draw/src/Control.Draw.js"></script>
				<script src="<?php print $domain; ?>/common/js/plugins/leaflet/plugins/Leaflet.draw/src/Tooltip.js"></script>
				<script src="<?php print $domain; ?>/common/js/plugins/leaflet/plugins/Leaflet.draw/src/Toolbar.js"></script>

				<script src="<?php print $domain; ?>/common/js/plugins/leaflet/plugins/Leaflet.draw/src/draw/DrawToolbar.js"></script>
				<script src="<?php print $domain; ?>/common/js/plugins/leaflet/plugins/Leaflet.draw/src/edit/EditToolbar.js"></script>
				<script src="<?php print $domain; ?>/common/js/plugins/leaflet/plugins/Leaflet.draw/src/edit/handler/EditToolbar.Edit.js"></script>
				<script src="<?php print $domain; ?>/common/js/plugins/leaflet/plugins/Leaflet.draw/src/edit/handler/EditToolbar.Delete.js"></script>

			<link href="<?php print $domain; ?>/common/js/plugins/bootstrap-switch/dist/css/bootstrap3/bootstrap-switch.css" rel="stylesheet">
			<script src="<?php print $domain; ?>/common/js/plugins/bootstrap-switch/dist/js/bootstrap-switch.js"></script>

		<script type="text/javascript" src="<?php print $domain; ?>/common/js/form.js"></script>
		<script type="text/javascript" src="<?php print $domain; ?>/common/js/map.js"></script>
		<!--script type="text/javascript" src="<?php print $domain; ?>/common/js/charts.js"></script-->
		<?php
	}
	?>
	<?php //include("common/include/conf/google_analytics.php"); ?>
