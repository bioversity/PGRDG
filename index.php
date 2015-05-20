<?php
// header("Content-type: text/plain");
// session_start();
// print_r($_SESSION["user"]);
// exit();

/**
 * Load all definitions
 */
require_once("common/include/funcs/defines.php");
/**
 * Import Service definitions
 */
require_once(CLASSES_DIR . "Frontend.php");
$frontend = new frontend_api();
$frontend->get_definitions("api", false, "obj");
$frontend->get_definitions("tags", false, "obj");
$frontend->get_definitions("types", false, "obj");

require_once(FUNCS_DIR . "nl2.php");
require_once(FUNCS_DIR . "readmore.php");
require_once(FUNCS_DIR . "has_permissions.php");
require_once(LIB_DIR . "php-markdown-extra-extended/markdown.php");
require_once(FUNCS_DIR . "optimize_markdown.php");
require_once(CLASSES_DIR . "Parse_json.php");

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
		$user_images = array_diff(scandir(ADMIN_IMAGES_DIR . "user_rand_images"), array("..", "."));
		$img_c = 0;
		foreach($user_images as $img_file) {
			$img_c++;
		}
		$rand_img = rand(0, ($img_c - 1)) . ".jpg";
		$_SESSION["user"][kTAG_ENTITY_ICON] = array(kAPI_PARAM_RESPONSE_FRMT_DISP => $rand_img);
		$user[kTAG_ENTITY_ICON] = array(kAPI_PARAM_RESPONSE_FRMT_DISP => $rand_img);
	}
	if(!isset($user[kTAG_ENTITY_PGP_FINGERPRINT])) {
		$user = array();
		$logged = false;

		session_destroy();
		setcookie("l", "", time()-3600);
		unset($_COOKIE["l"]);
	} else {
		$logged = (md5($user[kTAG_ENTITY_PGP_FINGERPRINT][kAPI_PARAM_RESPONSE_FRMT_DISP]) == $_COOKIE["l"]) ? true : false;
	}
}
if(!defined("LOGGED")) {
	define("LOGGED", $logged);
}
$global_menu = new Parse_json(CONF_DIR . "menu.json");
if(LOGGED) {
	$admin_menu = new Parse_json(CONF_DIR . "menu_admin.php");
	// print_r($admin_menu);
	// exit();
}
$map_config = new Parse_json(CONF_DIR . "map.json");
$pages_config = new Parse_json(CONF_DIR . "pages.json");
$i18n_config = new Parse_json(INTERFACE_CONF_DIR . "i18n.js");
$interface_config = new Parse_json(INTERFACE_CONF_DIR . "site.js");
$i18n = $i18n_config->parse_js_config("i18n");
$interface = $interface_config->parse_js_config("config");
$page = $pages_config->parse_page_config("pages");

if(isset($_COOKIE["lang"]) && trim($_COOKIE["lang"]) !== "") {
	$lang = $_COOKIE["lang"];
} else {
	$lang = $interface["site"]["default_language"];
}
// Uncommet if you have a dashboard page
if($page->current == "Home") {
	$page->is_backend = true;
}
if(!isset($page->class)) {
	$page->class = array();
}
if(isset($user)) {
	$page->has_permissions = has_permissions($user, $page);
} else {
	$page->has_permissions = false;
}
?>
<!DOCTYPE html>
<html lang="en"<?php print (strtolower($page->current) == "map") ? ' class="map"' : ""; ?>>
	<head>
		<?php include(TEMPLATE_DIR . "head.tpl"); ?>
	</head>
	<body <?php print ((count($page->class) > 0 || LOGGED) ? 'class="' . ((LOGGED) ? "fixed-header fixed-page-footer " : "") . ((!$interface["site"]["allow_signin"] || $page->need_login && !$page->has_permissions) ? "e405" : ((isset($page->class)) ? implode($page->class, " ") : "")) . '"' : "") . ' data-error="' . (($page->has_error) ? "true" : "false") . '"'; ?>>
		<?php
		switch(strtolower($page->current)) {
			case "signin":
				if($interface["site"]["allow_signin"]) {
					include(TEMPLATE_PAGES_DIR . "Signin.tpl");
					include(TEMPLATE_DIR . "script.tpl");
					include(TEMPLATE_DIR . "loader.tpl");
				} else {
					include(TEMPLATE_PAGES_DIR . "405_nologin.tpl");
					include(TEMPLATE_DIR . "loader.tpl");
					include(TEMPLATE_DIR . "script.tpl");
				}
				break;
			case "signout":
				include(TEMPLATE_DIR . "script.tpl");
				include(TEMPLATE_PAGES_DIR . "Signout.tpl");
				include(TEMPLATE_DIR . "loader.tpl");
				break;
			case "activation":
				include(TEMPLATE_DIR . "script.tpl");
				include(TEMPLATE_PAGES_DIR . "Activation.tpl");
				include(TEMPLATE_DIR . "loader.tpl");
				break;
			default:
				if(!$page->exists) {
					include(TEMPLATE_PAGES_DIR . "404.tpl");
				} else {
					if($page->need_login && !LOGGED) {
						include(TEMPLATE_PAGES_DIR . "405.tpl");
						include(TEMPLATE_DIR . "loader.tpl");
						include(TEMPLATE_DIR . "script.tpl");
					} else {
						include(TEMPLATE_DIR . "loader.tpl");
						if(LOGGED && $page->current == "Home" || LOGGED && $page->need_login) {
							if($page->has_permissions) {
								include(ADMIN_TEMPLATE_DIR . "index.tpl");
							} else {
								include(TEMPLATE_PAGES_DIR . "405_nologin.tpl");
							}
						} else {
							?>
							<?php include(TEMPLATE_DIR . "body_header.tpl"); ?>

							<?php include(INCLUDE_DIR . "get_contents.php"); ?>

							<?php include(TEMPLATE_DIR . "script.tpl"); ?>
							<?php
						}
					}
				}
				break;
		}
		?>
	</body>
</html>
