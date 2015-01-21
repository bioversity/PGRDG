<?php
if(!defined("SYSTEM_ROOT")) {
	define("SYSTEM_ROOT", $_SERVER["DOCUMENT_ROOT"] . DIRECTORY_SEPARATOR);
}
if(!defined("INCLUDE_DIR")) {
	define("INCLUDE_DIR", SYSTEM_ROOT . "common/include/");
}
if(!defined("CLASSES_DIR")) {
	define("CLASSES_DIR", INCLUDE_DIR . "classes/");
}

if(empty($_REQUEST) && empty($_POST)) {
	header("Content-type: text/plain");
	print "May the force be with you...!\n\n";
} else {
	require_once(CLASSES_DIR . "Frontend.php");
	$api = new frontend_api();

	foreach($_REQUEST as $gk => $gv) {
		// Set the header Content-type
		if($gk == "header") {
			$api->set_content_type($gv);
		} else {
			$api->set_content_type("text");
		}

		switch (trim($gk)) {
			case "proxy":
				// if($_REQUEST["debug"] == "true") {
				// 	$api->debug();
				// }
				switch($_REQUEST["type"]) {
					case "service":
						// if($_REQUEST["debug"] == "true") {
						// 	print_r($api->ask_service($_REQUEST["query"], true));
						// } else {
							print $api->ask_service($_REQUEST["query"], true);
						// }
					break;
					case "github":
						$api->set_content_type("text");
						print $api->browse($_REQUEST["address"]);
						break;
					default:
						print $api->browse($_REQUEST["address"]);
						break;
				}

				exit();
				break;
			case "definitions":
				$api->get_definitions(
					$_REQUEST["definitions"],
					((isset($_REQUEST["keep_update"]) && $_REQUEST["keep_update"] == "true") ? true : false),
					((isset($_REQUEST["type"]) && trim($_REQUEST["type"]) !== "") ? $_REQUEST["type"] : "string"),
					((isset($_REQUEST["condensed"]) && $_REQUEST["condensed"] == "true") ? true : false)
				);
				break;
			case "local":
				$api->set_content_type("text");

				$api->get_local_json($_REQUEST["local"]);
				break;
			case "download":
				$api->force_download(SYSTEM_ROOT . "common/media/" . base64_decode($_REQUEST["download"]));
				break;
			case "view":
				$api->force_view(SYSTEM_ROOT . "common/media/" . base64_decode($_REQUEST["view"]));
				break;
			case "type":
				switch(trim($gv)) {
					case "ask_service":
					case "activate_user":
					case "get_user":
					case "get_managed_users":
					case "login":
					case "logout":
						require_once(INCLUDE_DIR . "funcs/_ajax/_decrypt.php");
						break;
				}
				break;
		}
	}
}
?>
