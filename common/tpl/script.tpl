<script type="text/javascript" src="common/js/jquery.min.js"></script>
<script type="text/javascript" src="common/js/jquery.easing.1.3.js"></script>
<script type="text/javascript" src="common/js/bootstrap/bootstrap.min.js"></script>
<script type="text/javascript" src="common/js/apprise-bootstrap.js"></script>
<!-- jquery.cookie & storage -->
<script src="common/js/jquery-cookie/jquery.cookie.js"></script>
<script src="common/js/jquery-storage/jquery.storageapi.js"></script>
<!-- Jcryption & MD5 -->
<script type="text/javascript" src="common/js/jquery.jcryption.3.0.js"></script>
<script type="text/javascript" src="common/js/jquery-md5/jquery.md5.js"></script>
<!-- Purl (A JavaScript URL parser) -->
<script type="text/javascript" src="common/js/purl/purl.js"></script>
<!-- Jquery Choosen -->
<link rel="stylesheet" href="common/js/chosen/chosen-bootstrap.css" type="text/css" />
<script type="text/javascript" src="common/js/chosen/chosen.jquery.js"></script>
<!--script type="text/javascript" src="common/js/bootstrap-multiselect/js/bootstrap-multiselect.js"></script-->
<!-- Typeahead -->
<link rel="stylesheet" href="common/js/typeahead/typeahead.css" type="text/css" />
<script type="text/javascript" src="common/js/typeahead/typeahead.bundle.js"></script>

<?php //if(strtolower($page) == "map") { ?>
	<!-- OpenLayers2 -->
		<!--
		<script type="text/javascript" src="http://maps.google.com/maps/api/js?v=3&amp;sensor=false"></script>
		<link rel="stylesheet" href="common/js/OpenLayers/OpenLayers-2.13/theme/default/style.css" type="text/css">
		<script type="text/javascript" src="common/js/OpenLayers/OpenLayers-2.13/OpenLayers.js"></script>
		<script type="text/javascript" src="common/js/main.map.js"></script>
		-->
	<!-- OpenLayers 3 -->
	<link rel="stylesheet" href="common/js/OpenLayers/OpenLayers3/v3.0.0-beta.5/css/ol.css" type="text/css" />
	<script src="common/js/OpenLayers/OpenLayers3/v3.0.0-beta.5/build/ol.js" type="text/javascript"></script>

	<script type="text/javascript" src="common/js/_main/map3.js"></script>
<?php //} ?>
<script type="text/javascript" src="common/js/_main/main.js"></script>
<script type="text/javascript" src="common/js/jquery.hotkeys/jquery.hotkeys.js"></script>
<?php
if($_GET["p"] == "Search") {
	?>
	<script type="text/javascript" src="common/js/_main/form.js"></script>
	<?php
}
?>
<script type="text/javascript" src="API/?definitions=api&keep_update=true"></script>
<script type="text/javascript" src="API/?definitions=tags&keep_update=true"></script>
<script type="text/javascript" src="API/?definitions=types&keep_update=true"></script>
