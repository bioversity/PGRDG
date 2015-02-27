<?php
function cyclate_pages_config($page_data, $root = false) {
        $list = "";
        if(isset($page_data["title"])) {
                $list .= "<h4>" . $page_data["title"] . "</h4>";
        }
        $list .= '<ul class="' . (($root) ? "list-unstyled" : "") . '">';
                foreach($page_data as $k => $v) {
                        if(!is_array($v)) {
                                $list .= '<li><b>' . $k . "</b>: <code>" . (($v === true) ? "true" : (($v === false) ? "false" : (($v == "") ? '""' : $v))) . "</code></li>";
                        } else {
                                if(count($v) == 1) {
                                        $v = implode("\"<br />\"", $v);
                                        $list .= '<li><b>' . $k . "</b>: <code>" . (($v === true) ? "true" : (($v === false) ? "false" : (($v == "") ? '""' : $v))) . "</code></li>";
                                } else {
                                        $list .= "<li>";
                                                if($root) {
                                                        $list .= "<b>" . $k . "</b>: ";
                                                }
                                                $list .= cyclate_pages_config($v);
                                        $list .= "</li>";
                                }
                        }
                }
        $list .= "</ul>";
        if($root) {
                $list .= "<hr />";
        }
        return $list;
}
?>

<h1>Pages management</h1>
<div id="page_management">
        <ul>
        <?php
        // header("Conent-type: text/plain");
        // print_r($pages_config->json_conf["pages"]);
        // exit();
        foreach($pages_config->json_conf["pages"] as $page_name => $page_data) {
                if(isset($page_data["is_backend"]) && !$page_data["is_backend"]) {
                        print cyclate_pages_config($page_data, true);
                }
        }
        ?>
</div>
