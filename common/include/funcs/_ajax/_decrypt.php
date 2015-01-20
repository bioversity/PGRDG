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
		case "ask_service":
			require_once("ask_service.php");
			break;
		case "login":
			require_once(CLASSES_DIR . "Service_exchange.php");
			$se = new Service_exchange();
			$login = $se->send_to_service(array($output["username"], $output["password"]), "login");
			$user_data = json_decode($login, 1);
			// header("Content-type: text/plain");
			// print_r($login);
			// exit();
			if($user_data[kAPI_RESPONSE_STATUS][kAPI_STATUS_STATE] == "ok" && $user_data[kAPI_RESPONSE_PAGING][kAPI_PAGING_AFFECTED] > 0) {
				foreach($user_data[kAPI_RESPONSE_RESULTS] as $uid => $ud) {
					$fingerprint = $ud[kTAG_ENTITY_PGP_FINGERPRINT][kAPI_PARAM_RESPONSE_FRMT_DISP];

					$_SESSION["user"] = $ud;

					if(isset($output["remember"])) {
						setcookie("l", md5($fingerprint), time()+10800, "/");
					} else {
						setcookie("l", md5($fingerprint), time()+28800, "/");
					}

					print json_encode($user_data);
				}
			} else {
				print json_encode($user_data);
			}
			break;
		case "get_user":
			require_once(CLASSES_DIR . "Service_exchange.php");
			$se = new Service_exchange();
			$login = $se->send_to_service($output["user_id"], "get_user");
			$user_data = json_decode($login, 1);
			// header("Content-type: text/plain");
			// print_r($login);
			// exit();
			print json_encode($user_data);
			break;
		case "get_managed_users":
			require_once(CLASSES_DIR . "Service_exchange.php");
			$se = new Service_exchange();
			$managed_users = $se->send_to_service($output["user_id"], "get_managed_users");
			$mu = json_decode($managed_users, 1);
			print $managed_users;
			break;
		case "logout":
			$_SESSION["user"] = array();
			session_destroy();
			setcookie("l", "", time()-3600);
			unset($_COOKIE["l"]);
			print "ok";
			break;
		case "invite_user":
			require_once(CLASSES_DIR . "Service_exchange.php");
			require_once(CLASSES_DIR . "PGP.php");

			$se = new Service_exchange();
			$data = array(
				"inviter" => $output["user_id"],
				"name" => $output["name"],
				"email" => $output["email"],
				"comment" => "",
				"passphrase" => ""
			);
			$pgp = new PGP($data);
			$key_data = $pgp->generate_key();

			$data["fingerprint"] = $key_data["fingerprint"][0];
			$data["public_key"] = $key_data["public_key"];
			$action = "invite_user";
			print $se->send_to_service($data, $action);
			break;
		case "activate_user":
			require_once(CLASSES_DIR . "Service_exchange.php");
			$se = new Service_exchange();
			print $se->send_to_service(trim(base64_decode($output["fingerprint"])), "activate_user");
			break;
	}
}
?>
