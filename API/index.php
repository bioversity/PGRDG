<?php
header("Content-type: text/plain");

if(isset($_GET["proxy"]) && trim($_GET["proxy"]) == "true") {
	$url = rawurldecode($_GET["address"]);
	if($_GET["type"] == "post") {
		header("Content-type: " . $_GET["header"]);
		$fields_string = "";	
		foreach($_GET["params"] as $key=>$value) {
			$fields_string .= $key . "=" . $value . "&";
		}
		rtrim($fields_string, "&");
		$ch = curl_init();
		curl_setopt($ch, CURLOPT_URL, $url);
		curl_setopt($ch, CURLOPT_POST, count($_GET["params"]));
		curl_setopt($ch, CURLOPT_POSTFIELDS, $fields_string);

		//execute post
		$result = curl_exec($ch);

		//close connection
		curl_close($ch);
	} else {
		$fields_string = "";	
		foreach($_GET["params"] as $key=>$value) {
			$fields_string .= $key . "=" . $value . "&";
		}
		print file_get_contents($_GET["address"] . "?" . $fields_string);
	}
} else {
	require_once("../common/include/lib/jcryption.php");
}
?>