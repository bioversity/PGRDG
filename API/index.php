<?php
require_once("../common/include/classes/frontend_api.class.php");
$api = new frontend_api();

if(empty($_GET) && empty($_POST)) {
	$api->set_content_type("text");
	print "May the force be with you...!\n\n";
	exit();
}
if(isset($_GET["proxy"]) && trim($_GET["proxy"]) == "true") {
	if($_GET["debug"] == "true") {
		$api->debug();
	}
	switch($_GET["type"]) {
		case "service":
			if($_GET["debug"] == "true") {
				print_r($api->ask_service($_GET["address"], true));
			} else {
				print $api->ask_service($_GET["address"], true);
			}
			break;
	}
	
	exit();
}
if(isset($_POST["type"]) && trim($_POST["type"]) == "ask_service") {
	require_once("../common/include/lib/jcryption.php");
	require_once("../common/include/funcs/_ajax/_decrypt.php");
	/*
	if($_GET["type"] == "post") {
		header("Content-type: " . $_GET["header"]);
		$fields_string = "";	
		if(isset($_GET["params"]) && trim($_GET["params"]) !== "") {
			foreach($_GET["params"] as $key=>$value) {
				$fields_string .= $key . "=" . $value . "&";
			}
			rtrim($fields_string, "&");
		}
		$ch = curl_init();
		curl_setopt($ch, CURLOPT_URL, $url);
		if(isset($_GET["params"]) && trim($_GET["params"]) !== "") {
			curl_setopt($ch, CURLOPT_POST, count($_GET["params"]));
			curl_setopt($ch, CURLOPT_POSTFIELDS, $fields_string);
		}

		//execute post
		$result = curl_exec($ch);

		//close connection
		curl_close($ch);
	} else {
		$fields_string = "";	
		foreach($_GET["params"] as $key=>$value) {
			$fields_string .= $key . "=" . $value . "&";
		}
		if($_GET["debug"] == "true") {
			print $_GET["address"] . "?" . $fields_string . "\n\n";
		}
		
		print file_get_contents($_GET["address"] . "?" . $fields_string);
	}
	*/
}
?>