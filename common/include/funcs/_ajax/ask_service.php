<?php
require_once("../common/include/classes/frontend_api.class.php");
require_once("Service/Library/definitions/Api.inc.php");

$service_conf = parse_ini_file("../common/include/conf/service.ini");
$service_url = $service_conf["url"] . "Service.php?debug=true&" . kAPI_REQUEST_OPERATION . "=";
//$service_url = "../pgrdg.grinfo.private/Service.php?" . kAPI_REQUEST_OPERATION . "=";
$op = base64_decode($output[kAPI_REQUEST_OPERATION]);

//$parsed_address = parse_url($service_url . $op);
//print $service_url . $op . "\n\n";
//exit();
// print $service_url . $op;
// exit();
if($output["debug"] == "true") {
	print_r($api->ask_service($service_url . $op));
} else {
	print $api->ask_service($service_url . $op);
}
exit();
?>
