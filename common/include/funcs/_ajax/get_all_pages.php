<?php
header("Content-type: application/json");


if(!defined("SYSTEM_ROOT")) {
        define("SYSTEM_ROOT", $_SERVER["DOCUMENT_ROOT"] . DIRECTORY_SEPARATOR);
}
if(!defined("INCLUDE_DIR")) {
        define("INCLUDE_DIR", SYSTEM_ROOT . "common/include/");
}
if(!defined("CONF_DIR")) {
        define("CONF_DIR", INCLUDE_DIR . "conf/interface/");
}
$pages_json = json_decode(file_get_contents(CONF_DIR . "pages.json"));

function iterate_pages_list($pages_obj) {
        $arr = array();
        foreach($pages_obj as $pk => $page_data) {
                $title = ((!isset($page_data->title) || trim($page_data->title) == "") ? "./" : $page_data->title);
                $link = (strlen($page_data->address) == 0) ? $_SERVER["HTTP_HOST"] : (($page_data->address !== "./") ? "/" . str_replace("./", "", $page_data->address) : "/");

                if(isset($page_data->subpages) && is_object($page_data->subpages)) {
                        $arr += iterate_pages_list($page_data->subpages);
                }
                if(!$page_data->is_system_page) {
                        $arr[] = array("title" => $title, "link" => $link);
                }
        }
        return $arr;
}
print json_encode(iterate_pages_list($pages_json->pages));
// print_r(iterate_pages_list($pages_json->pages));
?>
