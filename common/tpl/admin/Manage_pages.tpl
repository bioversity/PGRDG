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

function cyclate_pages($page_data, $root = false) {
        $list = "";
        $list .= '<div class="col-xs-12 col-sm-6 col-md-4 col-lg-3">';
                $list .= '<a href="javascript:void(0);" class="big_btn" title="Edit this page">';
                        // $list .= '<span class="fa fa-file-text-o fa-5x"></span>';
                        // $list.= '<img src="data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs%3D" data-url="http://' . $_SERVER["SERVER_NAME"] . "/" . $page_data["address"] . '" />';
                        $list.= '<div class="folded"><img src="data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs%3D" data-url="http://pgrdiversity.bioversityinternational.org/' . $page_data["address"] . '" /></div>';
                        if(isset($page_data["title"])) {
                                $list .= '<span class="big_btn_title">' . $page_data["title"] . "</span>";
                        }
                        $list .= '<div class="icons_list">';
                                $list .= '<span class="fa fa-fw fa-' . (($page_data["need_login"]) ? "lock" : "unlock") . '"></span>';
                                $list .= '<span class="fa fa-fw fa-' . (($page_data["is_visible"]) ? "eye" : "eye-slash") . '"></span>';
                                $list .= '<span class="fa fa-fw fa-' . ((is_array($page_data["subpages"])) ? "files-o" : "file-o") . '"></span>';
                        $list .= '</div>';
                $list .= '</a>';
        $list .= '</div>';
        return $list;
}
?>

<h1>Pages management</h1>
<br />
<div id="page_management">
        <div class="row">
                <!-- <div class="col-xs-12 col-sm-6 col-md-4 col-lg-3">
                        <a href="javascript:void(0);" class="big_btn" title="Edit this page">
                                <span class="fa fa-file-text-o fa-5x"></span>
                                <span class="big_btn_title">Home</span>
                        </a>
                </div> -->
                <?php
                // header("Conent-type: text/plain");
                // print_r($pages_config->json_conf["pages"]);
                // exit();
                foreach($pages_config->json_conf["pages"] as $page_name => $page_data) {
                        if(isset($page_data["is_backend"]) && !$page_data["is_backend"]) {
                                print cyclate_pages($page_data, true);
                        }
                }
                ?>
        </div>
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
