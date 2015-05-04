<?php
// Note: this script is a comment stripped version.
// If you want to study, you can find a commented version in `common/js/jCryption/php/jcryption.php`

if(!defined("SYSTEM_ROOT")) {
	define("SYSTEM_ROOT", $_SERVER["DOCUMENT_ROOT"] . DIRECTORY_SEPARATOR);
}
if(!defined("INCLUDE_DIR")) {
	define("INCLUDE_DIR", SYSTEM_ROOT . "common/include/");
}
if(!defined("CLASSES_DIR")) {
	define("CLASSES_DIR", INCLUDE_DIR . "classes/");
}
//header("Content-type: text/plain");
session_start();

$descriptorspec = array(
	0 => array("pipe", "r"),
	1 => array("pipe", "w")
);

if(isset($_GET["getPublicKey"])) {
	$arrOutput = array(
		"publickey" => file_get_contents($_SERVER["DOCUMENT_ROOT"] . DIRECTORY_SEPARATOR . "common/include/conf/.rsa_keys/rsa_2048_pub.pem")
	);
	print json_encode($arrOutput);
} elseif (isset($_GET["handshake"])) {
	$cmd = sprintf("openssl rsautl -decrypt -inkey " . escapeshellarg($_SERVER["DOCUMENT_ROOT"] . DIRECTORY_SEPARATOR . "common/include/conf/.rsa_keys/rsa_2048_priv.pem"));
	$process = proc_open($cmd, $descriptorspec, $pipes);
	if (is_resource($process)) {
		 fwrite($pipes[0], base64_decode($_POST["key"]));
		 fclose($pipes[0]);

		 $key = stream_get_contents($pipes[1]);
		 fclose($pipes[1]);
		 proc_close($process);
	}
	$_SESSION["key"] = $key;

	$cmd = sprintf("openssl enc -aes-256-cbc -pass pass:" . $key . " -a -e");
	$process = proc_open($cmd, $descriptorspec, $pipes);
	if (is_resource($process)) {
		 fwrite($pipes[0], $key);
		 fclose($pipes[0]);

		 $challenge = trim(str_replace("\n", "", stream_get_contents($pipes[1])));
		 fclose($pipes[1]);
		 proc_close($process);
	}

	print json_encode(array("challenge" =>  $challenge));
} elseif (isset($_GET["decrypttest"])) {
	date_default_timezone_set("UTC");
	$toEncrypt = date("c");

	$key = $_SESSION["key"];

	$cmd = sprintf("openssl enc -aes-256-cbc -pass pass:" . $key . " -a -e");
	$process = proc_open($cmd, $descriptorspec, $pipes);
	if (is_resource($process)) {
		 fwrite($pipes[0], $toEncrypt);
		 fclose($pipes[0]);

		 $encrypted = stream_get_contents($pipes[1]);
		 fclose($pipes[1]);
		 proc_close($process);
	}

	print json_encode(
		array(
			"encrypted" => $encrypted,
			"unencrypted" => $toEncrypt
		)
	);
} elseif (isset($_POST["jCryption"])) {
	$key = $_SESSION["key"];

	$cmd = sprintf("openssl enc -aes-256-cbc -pass pass:" . $key . " -d");
	$process = proc_open($cmd, $descriptorspec, $pipes);
	if (is_resource($process)) {
		fwrite($pipes[0], base64_decode($_POST["jCryption"]));
		fclose($pipes[0]);

		$data = stream_get_contents($pipes[1]);
		fclose($pipes[1]);
		proc_close($process);
	}
	parse_str($data, $output);

	$type = (isset($_GET["type"]) && trim($_GET["type"]) !== "") ? $_GET["type"] : $_POST["type"];

	switch($type) {
		case "activate_user":
			require_once(CLASSES_DIR . "Service_exchange.php");
			$se = new Service_exchange();
			print $se->send_to_service(trim(base64_decode($output["fingerprint"])), "activate_user");
			break;
		case "ask_service":
			require_once("ask_service.php");
			break;
		case "get_managed_users":
			require_once(CLASSES_DIR . "Service_exchange.php");
			$se = new Service_exchange();
			$managed_users = $se->send_to_service($output, "get_managed_users");
			$mu = json_decode($managed_users, 1);
			print $managed_users;
			break;
		case "get_user":
			require_once(CLASSES_DIR . "Service_exchange.php");
			$se = new Service_exchange();
			$login = $se->send_to_service($output, "get_user");
			$ud = json_decode($login, 1);
			// foreach($ud as $k => $v){
			// 	$user_data = $v;
			// }
			// header("Content-type: text/plain");
			// print_r($user_data);
			// exit();
			print json_encode($ud);
			break;
		case "invite_user":
			require_once(CLASSES_DIR . "Service_exchange.php");
			require_once(CLASSES_DIR . "PGP.php");

			$se = new Service_exchange();
			$pgp = new PGP($output);
			$key_data = $pgp->generate_key();

			$output[kTAG_ENTITY_PGP_FINGERPRINT] = $key_data["fingerprint"][0];
			$output[kTAG_ENTITY_PGP_KEY] = $key_data["public_key"];
			$action = "invite_user";
			print $se->send_to_service($output, $action);
			break;
		case "login":
			require_once(CLASSES_DIR . "Service_exchange.php");
			$se = new Service_exchange();
			// print_r($output);
			// exit();
			$login = $se->send_to_service(array($output["username"], $output["password"]), $type);
			$user_data = json_decode($login, 1);
			// setcookie("l", md5("7C4D3533C21C608B39E8EAB256B4AFB771FA534A"), time()+10800, "/");
			// $_SESSION["user"] = $ud;
			// header("Content-type: text/plain");
			// print_r($user_data);
			// exit();
			if($user_data[kAPI_RESPONSE_STATUS][kAPI_STATUS_STATE] == "ok" && $user_data[kAPI_RESPONSE_PAGING][kAPI_PAGING_AFFECTED] > 0) {
				foreach($user_data[kAPI_RESPONSE_RESULTS] as $uid => $ud) {
					$fingerprint = $ud[kTAG_ENTITY_PGP_FINGERPRINT][kAPI_PARAM_RESPONSE_FRMT_DISP];

					$_SESSION["user"] = $ud;

					if(isset($output["remember"])) {
						setcookie("l", md5($fingerprint), time()+28800, "/");
						setcookie("m", md5($output["password"]), time()+28800, "/");
					} else {
						setcookie("l", md5($fingerprint), time()+10800, "/");
						setcookie("m", md5($output["password"]), time()+10800, "/");
					}

					print json_encode($user_data);
				}
			} else {
				print json_encode($user_data);
			}
			break;
		case "logout":
			$_SESSION["user"] = array();
			session_destroy();
			setcookie("l", "", time()-3600);
			setcookie("m", "", time()-3600);
			unset($_COOKIE["l"]);
			unset($_COOKIE["m"]);
			print "ok";
			break;
		case "save_menu":
			// print_r($output);
			// exit();
			// require_once(CLASSES_DIR . "Service_exchange.php");
			header("Content-type: text/plain");

			$fp = fopen(CONF_DIR . "__menu.json", "w");
			fwrite($fp, stripslashes(json_encode($output)));
			fclose($fp);

			print "ok";
			break;
		case "save_page_data":
			require_once(CLASSES_DIR . "Parse_json.php");
			$pages_config = new Parse_json(INTERFACE_CONF_DIR . "pages.json");
			foreach($output["data"] as $k => $v) {
				$pages_config->json_conf["pages"][$k] = $v;
			}

			header("Content-type: text/plain");

			$fp = fopen(CONF_DIR . "interface/pages.json", "w");
			if(fwrite($fp, str_replace(array('"true"', '"false"'), array("true", "false"), json_encode($pages_config->json_conf)))) {
				$fc = fopen(SYSTEM_ROOT . "common/md/" . $output["content"]["title"] . ".md", "w");
				if(fwrite($fc, $output["content"]["content"])) {
					chmod(SYSTEM_ROOT . "common/md/" . $output["content"]["title"] . ".md", 0777);
					print "ok";
				}
				fclose($fc);
			}
			fclose($fp);
			exit();
			break;
			break;
		case "save_user_data":
		case "save_user_image":
		case "upload_file":
		case "upload_group_transaction":
		case "upload_group_transaction_test":
		case "upload_group_transaction_message":
		case "upload_group_columns_by_worksheet":
		case "upload_group_transaction_by_worksheet":
		case "upload_group_transaction_worksheets":
		case "upload_session_status":
		case "upload_user_status":
			require_once(CLASSES_DIR . "Service_exchange.php");
			// header("Content-type: text/plain");
			// print_r($output);
			// exit();
			// print_r($output);
			$se = new Service_exchange();
			$action = $type;
			print $se->send_to_service($output, $action);
			break;
	}
}
?>
