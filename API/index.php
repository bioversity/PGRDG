<?php
require_once($_SERVER["DOCUMENT_ROOT"] . "/common/include/funcs/defines.php");

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
			case "upload":
				if(!empty($_FILES)) {
					$user_dir = GNUPG_DIR . $_POST["user_id"];
					if(!file_exists($user_dir)) {
						mkdir($user_dir);
						if(!file_exists($user_dir . "/uploads")) {
							mkdir($user_dir . "/uploads");
						}
					}
					$temp_file = $_FILES["file"]["tmp_name"];
					$target_path = $user_dir . "/uploads";
					$target_file =  $target_path . "/" . $gv;
					if(!move_uploaded_file($temp_file, $target_file)) {
						throw new exception("Can move the file " . $target_file);
					}

					$api->set_content_type("text");
					print $target_file;
				}
				break;
			case "download":
				$api->force_download(SYSTEM_ROOT . "common/media/" . base64_decode($_REQUEST["download"]));
				break;
			case "view":
				$api->force_view(SYSTEM_ROOT . "common/media/" . base64_decode($_REQUEST["view"]));
				break;
			case "type":
				switch(trim($gv)) {
					case "activate_user":
					case "ask_service":
					case "get_managed_users":
					case "get_user":
					case "invite_user":
					case "login":
					case "logout":
					case "save_menu":
					case "save_user_data":
					case "upload_file":
						require_once(INCLUDE_DIR . "funcs/_ajax/_decrypt.php");
						break;
				}
				break;
		}
	}
}
?>
