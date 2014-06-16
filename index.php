<?php
//header("Content-type: text/plain");
require_once("common/include/classes/parse_json_config.class.php");
$site_config = new parse_json_config();
$map_config = new parse_json_config("common/include/conf/map.json");
//print_r($site_config->menu("map_toolbox", "menu"));
//exit();
function is_home() {
	return ($_GET["p"] == "" || strtolower($_GET["p"]) == "home") ? true : false;
}
if (isset($_GET["p"]) && trim($_GET["p"]) !== "") {
	$page = $_GET["p"];
	if (isset($_GET["s"]) && trim($_GET["s"]) !== "") {
		$sub_page = $_GET["s"];
		if (isset($_GET["ss"]) && trim($_GET["ss"]) !== "") {
			$sub_subpage = $_GET["ss"];
		}
	}
} else {
	$page = "";
}
?>
<!DOCTYPE html>
<html lang="en"<?php print (strtolower($page) == "map") ? ' class="map"' : ""; ?>>
	<head>
		<?php include("common/tpl/head.tpl"); ?>
	</head>
	<body>
		<?php include("common/tpl/body_header.tpl"); ?>
		
		<?php include("common/include/get_contents.php"); ?>
		
		<?php include("common/tpl/footer.tpl"); ?>
		
		<?php include("common/tpl/script.tpl"); ?>
	</body>
</html>
