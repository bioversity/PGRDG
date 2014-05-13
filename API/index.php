<?php
require_once("../common/include/classes/frontend_api.class.php");

if(isset($_GET["proxy"]) && trim($_GET["proxy"]) == "true") {
	$api = new frontend_api();
	//$api->debug();
	print $api->ask_service($_GET["address"]);
	exit();
	/*
	$url = base64_decode(rawurldecode($_GET["address"]));
	if($_GET["debug"] == "true") {
		print $url;
		exit();
	}
	if($_GET["type"] == "service") {
		header("Content-type: application/json");
		$ch = curl_init();
		curl_setopt($ch, CURLOPT_URL, $url);
		$result = curl_exec($ch);
		curl_close($ch);
	}
	exit();
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
} else {
	require_once("../common/include/lib/jcryption.php");
}
?>