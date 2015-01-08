<?php
if(!defined("SYSTEM_ROOT")) {
        define("SYSTEM_ROOT", $_SERVER["DOCUMENT_ROOT"] . DIRECTORY_SEPARATOR);
}
if(!defined("INCLUDE_DIR")) {
        define("INCLUDE_DIR", SYSTEM_ROOT . "common/include/");
}
if(!defined("CLASSES_DIR")) {
        define("CLASSES_DIR", INCLUDE_DIR . "classes/");
}
if(!defined("CONF_DIR")) {
        define("CONF_DIR", INCLUDE_DIR . "conf/interface/");
}
require_once(CLASSES_DIR . "Frontend.php");
$frontend = new frontend_api();
$frontend->get_definitions("api", false, "obj");
$frontend->get_definitions("tags", false, "obj");
$frontend->get_definitions("types", false, "obj");
$logged = false;
?>
