<?php
require_once("../common/include/classes/frontend_api.class.php");

$service_url = "http://pgrdg.grinfo.private/Service.php?op=";
$address = base64_decode($output["address"]);
//$parsed_address = parse_url($service_url . $address);
//print $service_url . $address . "\n\n";
//exit();
if($output["debug"] == "true") {
	print_r($api->ask_service($service_url . $address));
} else {
	print $api->ask_service($service_url . $address);
}
exit();
?>