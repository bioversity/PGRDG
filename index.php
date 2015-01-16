<?php
// header("Content-type: text/plain");
// session_start();
// print_r($_SESSION["user"]);
// exit();
/**
 * Load all definitions
 */
require_once("common/tpl/defines.tpl");

require_once("common/include/funcs/nl2.php");
require_once("common/include/funcs/readmore.php");
require_once("common/include/lib/php-markdown-extra-extended/markdown.php");
require_once("common/include/funcs/optimize_markdown.php");
require_once("common/include/classes/Parse_json.php");

if(session_status() == PHP_SESSION_NONE) {
	session_start();
}
if(isset($_COOKIE["l"]) && trim($_COOKIE["l"]) !== "") {
	/**
	 * Load session data
	 */
	if(isset($_SESSION["user"])) {
		$user = json_decode(json_encode($_SESSION["user"]), 1);
	}
	/**
	 * Assign a random image if there's no assigned
	 */
	if(!isset($user[kTAG_ENTITY_ICON])) {
		$user_images = array_diff(scandir(IMAGES_DIR . "admin/user_rand_images"), array("..", "."));
		$img_c = 0;
		foreach($user_images as $img_file) {
			$img_c++;
		}
		$rand_img = rand(0, ($img_c - 1)) . ".jpg";
		$_SESSION["user"][kTAG_ENTITY_ICON] = array(kAPI_PARAM_RESPONSE_FRMT_DISP => $rand_img);
		$user[kTAG_ENTITY_ICON] = array(kAPI_PARAM_RESPONSE_FRMT_DISP => $rand_img);
	}
	$logged = (md5($user[kTAG_ENTITY_PGP_FINGERPRINT][kAPI_PARAM_RESPONSE_FRMT_DISP]) == $_COOKIE["l"]) ? true : false;
}
if(!defined("LOGGED")) {
	define("LOGGED", $logged);
}
$site_config = new Parse_json();
$map_config = new Parse_json("common/include/conf/map.json");
$pages_config = new Parse_json("common/include/conf/interface/pages.json");
$i18n_config = new Parse_json("common/include/conf/interface/i18n.js");
$interface_config = new Parse_json("common/include/conf/interface/site.js");
$i18n = $i18n_config->parse_js_config("i18n");
$interface = $interface_config->parse_js_config("config");
$page = $pages_config->parse_page_config("pages");

if(isset($_COOKIE["lang"]) && trim($_COOKIE["lang"]) !== "") {
	$lang = $_COOKIE["lang"];
} else {
	$lang = $interface["site"]["default_language"];
}


$domain = (isset($_SERVER["HTTPS"]) && $_SERVER["HTTPS"] && $_SERVER["HTTPS"] != "off") ? "https" : "http" . "://" . $_SERVER["SERVER_NAME"];

// print_r($page);
// exit();
?>
<!DOCTYPE html>
<html lang="en"<?php print (strtolower($page->current) == "map") ? ' class="map"' : ""; ?>>
	<head>
		<?php include("common/tpl/head.tpl"); ?>
	</head>
	<body <?php print ((count($page->class) > 0 || LOGGED) ? 'class="' . ((LOGGED) ? "fixed-header fixed-page-footer " : "") . implode($page->class, " ") . '"' : "") . ' data-error="' . (($page->has_error) ? "true" : "false") . '"'; ?>>
		<?php
		if(strtolower($page->current) == "signin") {
			include("common/tpl/pages/Signin.tpl");
			include("common/tpl/script.tpl");
			include("common/tpl/loader.tpl");
		} else if(strtolower($page->current) == "signout") {
			include("common/tpl/script.tpl");
			include("common/tpl/pages/Signout.tpl");
			include("common/tpl/loader.tpl");
		} else if(strtolower($page->current) == "activation") {
			include("common/tpl/script.tpl");
			include("common/tpl/pages/Activation.tpl");
			include("common/tpl/loader.tpl");
		} else {
			if(!$page->exists) {
				include("common/tpl/pages/404.tpl");
			} else {
				if($page->need_login && !LOGGED) {
					include("common/tpl/pages/405.tpl");
					include("common/tpl/loader.tpl");
					include("common/tpl/script.tpl");
				} else {
					include("common/tpl/loader.tpl");
					if(LOGGED && $page->current == "" || LOGGED && $page->need_login) {
						include("common/tpl/admin/index.tpl");
					} else {
						?>
						<?php include("common/tpl/body_header.tpl"); ?>

						<?php include("common/include/get_contents.php"); ?>

						<?php include("common/tpl/script.tpl"); ?>
						<?php
					}
				}
			}
		}
		?>
	</body>
</html>
