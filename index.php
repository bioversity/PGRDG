<?php
// header("Content-type: text/plain");

require_once("common/include/funcs/nl2.php");
require_once("common/include/funcs/readmore.php");
require_once("common/include/lib/php-markdown-extra-extended/markdown.php");
require_once("common/include/funcs/optimize_markdown.php");
require_once("common/include/classes/parse_json_config.class.php");

$site_config = new parse_json_config();
$map_config = new parse_json_config("common/include/conf/map.json");
$pages_config = new parse_json_config("common/include/conf/interface/pages.json");
$i18n_config = new parse_json_config("common/include/conf/interface/i18n.js");
$interface_config = new parse_json_config("common/include/conf/interface/site.js");
$i18n = $i18n_config->parse_js_config("i18n");
$interface = $interface_config->parse_js_config("config");
$page = $pages_config->parse_page_config("pages");

if(isset($_COOKIE["lang"]) && trim($_COOKIE["lang"]) !== "") {
	$lang = $_COOKIE["lang"];
} else {
	$lang = $interface["site"]["default_language"];
}

$domain = (isset($_SERVER["HTTPS"]) && $_SERVER["HTTPS"] && $_SERVER["HTTPS"] != "off") ? "https" : "http" . "://" . $_SERVER["SERVER_NAME"];
$logged = false;

// print_r($page);
// exit();
?>
<!DOCTYPE html>
<html lang="en"<?php print (strtolower($page->current) == "map") ? ' class="map"' : ""; ?>>
	<head>
		<?php include("common/tpl/head.tpl"); ?>
	</head>
	<body <?php print (($page->exists) ? (($page->need_login && !$logged) ? 'class="e405"' : "") : 'class="e404"'); ?>>
		<?php
		if(!$page->exists) {
			include("common/tpl/pages/404.tpl");
		} else {
			if($page->need_login && !$logged) {
				include("common/tpl/pages/405.tpl");
				include("common/tpl/script.tpl");
			} else {
				?>
				<div id="loader" class="system">
					<div></div>
					<div></div>
				</div>
				<?php
				if($logged && strtolower($page->current) == "dashboard") {
					?>
					<?php include("common/tpl/admin/index.tpl"); ?>
					<?php
				} else {
					?>
					<?php include("common/tpl/body_header.tpl"); ?>

					<?php include("common/include/get_contents.php"); ?>

					<?php include("common/tpl/script.tpl"); ?>
					<?php
				}
			}
		}
		?>
	</body>
</html>
