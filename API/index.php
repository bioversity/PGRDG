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
				$api->force_download(MEDIA_DIR . base64_decode($_REQUEST["download"]));
				break;
			case "download_template":
				// Uncomment for production version
				// $api->force_download(base64_decode($_REQUEST["download_template"]));
				// break;
				$api->force_download(GNUPG_DIR . base64_decode($_REQUEST["download_template"]));
				break;
			case "local":
				$api->set_content_type("text");

				$api->get_local_json($_REQUEST["local"]);
				break;
			case "preview":
				$api->set_content_type("html");
				$domain = (isset($_SERVER["HTTPS"]) && $_SERVER["HTTPS"] && $_SERVER["HTTPS"] != "off") ? "https" : "http" . "://" . $_SERVER["SERVER_NAME"];
				require_once(LIB_DIR . "php-markdown-extra-extended/markdown.php");
				require_once(FUNCS_DIR . "optimize_markdown.php");
				?>
				<html>
					<head>
						<meta charset="utf-8" />
						<base href="./">
						<meta http-equiv="X-UA-Compatible" content="IE=edge">
						<meta name="viewport" content="width=device-width, user-scalable=no, initial-scale=1">
						<link href="<?php print $domain . CSS_DIR; ?>bootstrap/bootstrap.css" rel="stylesheet" type="text/css" media="screen">
						<link href="<?php print $domain . CSS_DIR; ?>font-awesome/css/font-awesome.css" rel="stylesheet" type="text/css" media="screen" />
						<link href="<?php print $domain . CSS_DIR; ?>Entypo/entypo.css" rel="stylesheet" type="text/css" media="screen" />
						<link href="<?php print $domain . CSS_DIR; ?>ionicons-1.4.1/css/ionicons.css" rel="stylesheet" type="text/css" media="screen" />
						<link href="<?php print $domain . CSS_DIR; ?>PICOL-font/css/picol.css" rel="stylesheet" type="text/css" media="screen" />
						<link href="<?php print $domain . CSS_DIR; ?>mapglyphs/mapglyphs.css" rel="stylesheet" type="text/css" media="screen" />
						<link href="<?php print $domain . CSS_DIR; ?>font-awesome/css/font-awesome.css" rel="stylesheet" type="text/css" media="screen" />
						<link href="<?php print $domain . CSS_DIR; ?>main.css" rel="stylesheet" type="text/css" media="screen" />
						<!-- #GOOGLE FONT -->
					        <link rel="stylesheet" href="http://fonts.googleapis.com/css?family=Open+Sans:400italic,700italic,300,400,700">
					</head>
					<body>
						<?php
						print optimize(Markdown(trim($_POST["data"])));
						?>
					</body>
				</html>
				<?php
				exit();
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
					$tmp_file = "/tmp/" . $gv;
					$target_file =  $target_path . "/" . $gv;
					if(!move_uploaded_file($temp_file, $target_file)) {
						throw new exception("Can't move the file to " . $target_path);
					} else {
						chmod($target_path, 0777);
						chmod($target_file, 0777);
						copy($target_file, $tmp_file);
					}

					$api->set_content_type("text");
					print "ok";
				}
				break;
			case "upload_image":
				require_once(LIB_DIR . "SimpleImage.php");

				if(!empty($_FILES)) {
					$interface_config = new Parse_json(INTERFACE_CONF_DIR . "site.js");
					$interface = $interface_config->parse_js_config("config");

					$temp_file = $_FILES["file"]["tmp_name"];
					$target_path = ADMIN_IMAGES;
					$target_file = $target_path . $gv;
					if(!move_uploaded_file($temp_file, $target_file)) {
						throw new exception("Can't move the file to " . $target_path);
					} else {
						// Permissions
						chmod($target_path, 0777);
						chmod($target_file, 0777);
						// Resize the uploaded image
						$image = new SimpleImage();
						$image->load($target_file);
						$image->resizeToHeight(180);
						$image->save($target_file);
					}

					$api->set_content_type("text");
					print "ok";
				}
				break;
			case "type":
				switch(trim($gv)) {
					case "activate_user":
					case "ask_service":
					case "create_user":
					case "get_managed_users":
					case "get_user":
					case "invite_user":
					case "login":
					case "logout":
					case "remove_page":
					case "save_menu":
					case "save_config":
					case "save_page_data":
					case "save_user_data":
					case "save_user_image":
					case "upload_file":
					case "upload_group_transaction":
					case "upload_group_transaction_test":
					case "upload_group_transaction_message":
					case "upload_group_columns_by_worksheet":
					case "upload_group_transaction_by_worksheet":
					case "upload_group_transaction_worksheets":
					case "upload_publish_data":
					case "upload_session_status":
					case "upload_user_status":
						require_once(AJAX_DIR . "_decrypt.php");
						break;
				}
				break;
			case "view":
				$api->force_view(MEDIA_DIR . base64_decode($_REQUEST["view"]));
				break;
		}
	}
}
?>
