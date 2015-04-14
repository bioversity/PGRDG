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
			case "definitions":
				$api->get_definitions(
					$_REQUEST["definitions"],
					((isset($_REQUEST["keep_update"]) && $_REQUEST["keep_update"] == "true") ? true : false),
					((isset($_REQUEST["type"]) && trim($_REQUEST["type"]) !== "") ? $_REQUEST["type"] : "string"),
					((isset($_REQUEST["condensed"]) && $_REQUEST["condensed"] == "true") ? true : false)
				);
				break;
			case "download":
				$api->force_download(SYSTEM_ROOT . "common/media/" . base64_decode($_REQUEST["download"]));
				break;
			case "local":
				$api->set_content_type("text");

				$api->get_local_json($_REQUEST["local"]);
				break;
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
			case "upload":
					// print_r($_FILES);
					// exit();
				if(!empty($_FILES)) {
					$interface_config = new Parse_json(INTERFACE_CONF_DIR . "site.js");
					$interface = $interface_config->parse_js_config("config");

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
						throw new exception("Can't move the file to " . $target_path);
					} else {
						/**
						 * Remote upload
						 *
						 * Working but not implemented for security reasons
						 */
						// $url = $interface["service"]["url"] . "uploads/index.php";
						// // Create a CURLFile object
						// $cfile = curl_file_create('cats.xlsx','application/vnd.openxmlformats-officedocument.spreadsheetml.sheet','test_name');
						// $args['file'] = new CurlFile($_FILES['file']['tmp_name'],'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', $_FILES['file']['name']);
						// $args["user_id"] = $_POST["user_id"];
						//
						// // Assign POST data
						// $data = array('test_file' => $_FILES["file"]["tmp_name"]);
						// $ch = curl_init($url);
						// curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
						// curl_setopt($ch, CURLOPT_POST, 1);
						// curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
						// curl_setopt($ch, CURLOPT_POSTFIELDS, $args);
						//
						// $result = curl_exec($ch);
						// curl_close($ch);
						//
						// print_r($result);
					}

					$api->set_content_type("text");
					print "ok";
				}
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
					case "upload_group_transaction":
					case "upload_group_transaction_message":
					case "upload_group_columns_by_worksheet":
					case "upload_group_transaction_by_worksheet":
					case "upload_group_transaction_worksheets":
					case "upload_session_status":
					case "upload_user_status":
						require_once(INCLUDE_DIR . "funcs/_ajax/_decrypt.php");
						break;
				}
				break;
			case "view":
				$api->force_view(SYSTEM_ROOT . "common/media/" . base64_decode($_REQUEST["view"]));
				break;
		}
	}
}
?>
