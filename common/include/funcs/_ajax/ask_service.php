<?php
require_once("../common/include/classes/frontend_api.class.php");
require_once("../common/include/classes/parse_json_config.class.php");
require_once("Service/Library/definitions/Api.inc.php");

$interface_config = new parse_json_config("../common/include/conf/interface/site.js");
$interface = $interface_config->parse_js_config("config");
$service_url = $interface["service"]["url"] . "Service.php?debug=true&" . kAPI_REQUEST_OPERATION . "=";
$op = base64_decode($output[kAPI_REQUEST_OPERATION]);

// $parsed_address = parse_url($service_url . $op);
// print_r(base64_decode($output[kAPI_REQUEST_OPERATION]));
// exit();
// print $service_url . $op;
// exit();
if($output["debug"] == "true") {
	print_r($api->ask_service($service_url . $op));
} else {
	print $api->ask_service($service_url . $op);
}
exit();
?>
