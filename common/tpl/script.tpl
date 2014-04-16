<script type="text/javascript" src="common/js/jquery.min.js"></script>
<script type="text/javascript" src="common/js/bootstrap/bootstrap.min.js"></script>
<script type="text/javascript" src="common/js/jquery.jcryption.3.0.js"></script>

<?php if(strtolower($page) == "map") { ?>
	<!--
	OpenLayers2
	<script type="text/javascript" src="http://maps.google.com/maps/api/js?v=3&amp;sensor=false"></script>
	<link rel="stylesheet" href="common/js/OpenLayers-2.13/theme/default/style.css" type="text/css">
	<script type="text/javascript" src="common/js/OpenLayers-2.13/OpenLayers.js"></script>
	<script type="text/javascript" src="common/js/main.map.js"></script>
	-->
	<!--
	OpenLayers 3
	-->
	<link rel="stylesheet" href="common/js/OpenLayers-3.0.0-beta.4/css/ol.css" type="text/css" />
	<script src="common/js/OpenLayers-3.0.0-beta.4/build/ol.js" type="text/javascript"></script>
	
	<script type="text/javascript" src="common/js/main.map3.js"></script>
<?php } ?>
<script type="text/javascript" src="common/js/jquery.hotkeys.js"></script>
<script type="text/javascript" src="common/js/main.js"></script>