<script type="text/javascript" src="<?php print $domain; ?>/common/js/jquery.min.js"></script>
<script type="text/javascript" src="<?php print $domain; ?>/common/js/jquery.easing.1.3.js"></script>
<script type="text/javascript" src="<?php print $domain; ?>/common/js/bootstrap/bootstrap.min.js"></script>
<script type="text/javascript" src="<?php print $domain; ?>/common/js/apprise-bootstrap.js"></script>
<!-- jquery.cookie & storage -->
<script src="<?php print $domain; ?>/common/js/jquery-cookie/jquery.cookie.js"></script>
<script src="<?php print $domain; ?>/common/js/jquery-storage/jquery.storageapi.js"></script>
<!-- Jcryption, MD5 & SHA1 -->
<script type="text/javascript" src="<?php print $domain; ?>/common/js/jquery.jcryption.3.0.js"></script>
<script type="text/javascript" src="<?php print $domain; ?>/common/js/jquery-md5/jquery.md5.js"></script>
<script type="text/javascript" src="<?php print $domain; ?>/common/js/jquery.sha1.js"></script>
<!-- Purl (A JavaScript URL parser) -->
<script type="text/javascript" src="<?php print $domain; ?>/common/js/purl/purl.js"></script>
<!-- Jquery Choosen -->
<link rel="stylesheet" href="<?php print $domain; ?>/common/js/chosen/chosen-bootstrap.css" type="text/css" />
<script type="text/javascript" src="<?php print $domain; ?>/common/js/chosen/chosen.jquery.js"></script>
<!--script type="text/javascript" src="<?php print $domain; ?>/common/js/bootstrap-multiselect/js/bootstrap-multiselect.js"></script-->
<!-- Jquery number formatter -->
<script type="text/javascript" src="<?php print $domain; ?>/common/js/jquery-number/jquery.number.min.js"></script>
<!-- Typeahead -->
<link rel="stylesheet" href="<?php print $domain; ?>/common/js/typeahead/typeahead.css" type="text/css" />
<script type="text/javascript" src="<?php print $domain; ?>/common/js/typeahead/typeahead.bundle.js"></script>
<!-- Jquery hotkeys -->
<script type="text/javascript" src="<?php print $domain; ?>/common/js/jquery.hotkeys/jquery.hotkeys.js"></script>
<script type="text/javascript" src="<?php print $domain; ?>/common/js/typeahead/typeahead.bundle.js"></script>
<!-- jQuery-Knob -->
<!--script type="text/javascript" src="<?php print $domain; ?>/common/js/jQuery-Knob/js/jquery.knob.js"></script-->
<!-- ToucSwipe -->
<script type="text/javascript" src="<?php print $domain; ?>/common/js/TouchSwipe/jquery.touchSwipe.min.js"></script>

	<!-- Core scripts -->
	<script type="text/javascript" src="<?php print $domain; ?>/common/js/_main/params.js"></script>
	<script type="text/javascript">
	function load_firebug() {
		var fileref;
		if(developer_mode) {
			document.body.style.cursor = "wait";
			fileref = document.createElement("script");
			fileref.setAttribute("type", "text/javascript");
			fileref.setAttribute("src", "<?php print $domain; ?>/common/js/firebug-lite/build/firebug-lite-debug.js");
			fileref.innerHTML = '{ saveCookies: true, startOpened: false, startInNewWindow: false, showIconWhenHidden: true, overrideConsole: true, ignoreFirebugElements: true, disableXHRListener: false, disableWhenFirebugActive: true, enableTrace: false, enablePersistent: false }';

			var head = document.getElementsByTagName("head")[0];
			head.appendChild(fileref);

			document.body.style.cursor = "default";
		}
	}
	</script>
	<script type="text/javascript" src="<?php print $domain; ?>/common/js/_main/main.js"></script>
	<?php
	if(strtolower($page) == "map" || strtolower($page) == "search" || strtolower($page) == "advanced_search") {
		?>
		<!-- OpenLayers2 -->
			<!--
			<script type="text/javascript" src="http://maps.google.com/maps/api/js?v=3&amp;sensor=false"></script>
			<link rel="stylesheet" href="<?php print $domain; ?>/common/js/OpenLayers/OpenLayers-2.13/theme/default/style.css" type="text/css">
			<script type="text/javascript" src="<?php print $domain; ?>/common/js/OpenLayers/OpenLayers-2.13/OpenLayers.js"></script>
			<script type="text/javascript" src="<?php print $domain; ?>/common/js/main.map.js"></script>
			-->
		<!-- OpenLayers 3 -->
		<!--link rel="stylesheet" href="<?php print $domain; ?>/common/js/OpenLayers/OpenLayers3/v3.0.0-beta.5/css/ol.css" type="text/css" />
		<script src="<?php print $domain; ?>/common/js/OpenLayers/OpenLayers3/v3.0.0-beta.5/build/ol.js" type="text/javascript"></script>

		<script type="text/javascript" src="<?php print $domain; ?>/common/js/_main/map3.js"></script-->

		<!-- Leaflet -->
		<link rel="stylesheet" href="<?php print $domain; ?>/common/js/leaflet/leaflet-0.7.3/leaflet.css" />
		<script type="text/javascript" src="<?php print $domain; ?>/common/js/leaflet/leaflet-0.7.3/leaflet.js"></script>
			<!-- Providers -->
			<script type="text/javascript" src="<?php print $domain; ?>/common/js/leaflet/plugin/leaflet-providers/leaflet-providers.js"></script>
			<!-- Marker cluster-->
			<link rel="stylesheet" href="<?php print $domain; ?>/common/js/leaflet/plugin/Leaflet.markercluster/dist/MarkerCluster.css" />
			<link rel="stylesheet" href="<?php print $domain; ?>/common/js/leaflet/plugin/Leaflet.markercluster/dist/MarkerCluster.Default.css" />
			<script type="text/javascript" src="<?php print $domain; ?>/common/js/leaflet/plugin/Leaflet.markercluster/dist/leaflet.markercluster-src.js"></script>

			<link href="<?php print $domain; ?>/common/js/bootstrap-switch/dist/css/bootstrap3/bootstrap-switch.css" rel="stylesheet">
			<script src="<?php print $domain; ?>/common/js/bootstrap-switch/dist/js/bootstrap-switch.js"></script>

		<script type="text/javascript" src="<?php print $domain; ?>/common/js/_main/_map.js"></script>
		<script type="text/javascript" src="<?php print $domain; ?>/common/js/_main/form.js"></script>
		<?php
	}
	?>
	<script type="text/javascript" src="<?php print $domain; ?>/API/?local=conf%2Frole_definitions.json"></script>
	<script type="text/javascript" src="<?php print $domain; ?>/API/?definitions=api&amp;keep_update=true"></script>
	<script type="text/javascript" src="<?php print $domain; ?>/API/?definitions=tags&amp;keep_update=true"></script>
	<script type="text/javascript" src="<?php print $domain; ?>/API/?definitions=types&amp;keep_update=true"></script>
	<?php include("common/include/conf/google_analytics.php"); ?>
