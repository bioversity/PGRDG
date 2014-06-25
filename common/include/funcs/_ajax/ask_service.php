<?php
require_once("../common/include/classes/frontend_api.class.php");
require_once("Service/Library/definitions/Api.inc.php");

$service_conf = parse_ini_file("../common/include/conf/service.ini");
$service_url = $service_conf["url"] . "/Service.php?" . kAPI_REQUEST_OPERATION . "=";
//$service_url = "../pgrdg.grinfo.private/Service.php?" . kAPI_REQUEST_OPERATION . "=";
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
