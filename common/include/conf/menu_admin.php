<?php
require_once($_SERVER["DOCUMENT_ROOT"] . DIRECTORY_SEPARATOR . "common/include/funcs/defines.php");

if(session_status() == PHP_SESSION_NONE) {
        session_start();
}
if(isset($_COOKIE["l"]) && trim($_COOKIE["l"]) !== "") {
        if(isset($_SESSION["user"])) {
                $user = json_decode(json_encode($_SESSION["user"]), 1);
        }
        $logged = (md5($user[kTAG_ENTITY_PGP_FINGERPRINT][kAPI_PARAM_RESPONSE_FRMT_DISP]) == $_COOKIE["l"]) ? true : false;
} else {
        throw new exception("Expired session, cannot load admin menu");
}
// header("Content-type: text/plain");
// print in_array(kTYPE_ROLE_EDIT, $user[kTAG_ROLES][kAPI_PARAM_RESPONSE_FRMT_VALUE]);
// exit();
if(!defined("LOGGED")) {
        define("LOGGED", $logged);
}
$m = new stdClass();
$m->menu = new stdClass();
$m->menu->admin = new stdClass();
$m->menu->admin->home = new stdClass();
$m->menu->admin->home->content = array(
        "icon" => "fa fa-home",
        "text" => "Home"
);
$m->menu->admin->home->attributes = array(
        "href" => "./",
        "title" => "Go to Main Page",
        "class" => "btn btn-link hidden"
);
if(in_array(kTYPE_ROLE_INVITE, $user[kTAG_ROLES][kAPI_PARAM_RESPONSE_FRMT_VALUE])) {// || in_array(kTYPE_ROLE_USERS, $user[kTAG_ROLES][kAPI_PARAM_RESPONSE_FRMT_VALUE])) {
        $m->menu->admin->Manage_user = new stdClass();
        $m->menu->admin->Manage_user->content = array(
                        "icon" => "ionicons ion-person-stalker",
                        "text" => "Manage users"
        );
        $m->menu->admin->Manage_user->attributes = array(
                "href" => "javascript:void(0);",
                "title" => "",
                "class" => "btn btn-link",
                "id" => "manage_users_menu"
        );
        $m->menu->admin->Manage_user->childs = new stdClass();
        // if($user[kTAG_MANAGED_COUNT][kAPI_PARAM_RESPONSE_FRMT_VALUE] > 0) {
        //         $m->menu->admin->Manage_user->childs->All_users = new stdClass();
        //         $m->menu->admin->Manage_user->childs->All_users->content = array(
        //                 "icon" => "fa fa-fw ionicons ion-ios7-people",
        //                 "text" => "All users"
        //         );
        //         $m->menu->admin->Manage_user->childs->All_users->attributes = array(
        //                 "href" => "./Users",
        //                 "title" => "See all users",
        //                 "class" => "btn btn-link"
        //         );
        // }
        if(in_array(kTYPE_ROLE_INVITE, $user[kTAG_ROLES][kAPI_PARAM_RESPONSE_FRMT_VALUE])) {
                $m->menu->admin->Manage_user->childs->Invite_user = new stdClass();
                $m->menu->admin->Manage_user->childs->Invite_user->content = array(
                        "icon" => "ionicons ion-person-add",
                        "text" => "Invite new"
                );
                $m->menu->admin->Manage_user->childs->Invite_user->attributes = array(
                        "href" => "./Invite",
                        "title" => "Invite an user",
                        "class" => "btn btn-link btn-default"
                );
        }
}

$m->menu->admin->Your_data = new stdClass();
$m->menu->admin->Your_data->content = array(
        "icon" => "fa fa-cubes",
        "text" => "Your data"
);
$m->menu->admin->Your_data->attributes = array(
        "href" => "javascript:void(0);",
        "title" => "",
        "class" => "btn btn-link",
        "id" => "your_data_menu"
);
$m->menu->admin->Your_data->childs = new stdClass();
$m->menu->admin->Your_data->childs->History = new stdClass();
$m->menu->admin->Your_data->childs->History->content = array(
        "icon" => "fa fa-fw fa-history",
        "text" => "History"
);
$m->menu->admin->Your_data->childs->History->attributes = array(
        "href" => "./History",
        "title" => "History",
        "class" => "btn btn-link"
);
if(in_array(kTYPE_ROLE_UPLOAD, $user[kTAG_ROLES][kAPI_PARAM_RESPONSE_FRMT_VALUE])) {
        $m->menu->admin->Your_data->childs->Upload = new stdClass();
        $m->menu->admin->Your_data->childs->Upload->content = array(
                "icon" => "fa fa-fw fa-upload",
                "text" => "Upload"
        );
        $m->menu->admin->Your_data->childs->Upload->attributes = array(
                "href" => "./Upload",
                "title" => "Upload",
                "class" => "btn btn-link"
        );
}

if(in_array(kTYPE_ROLE_EDIT, $user[kTAG_ROLES][kAPI_PARAM_RESPONSE_FRMT_VALUE])) {
        $m->menu->admin->Manage_contents = new stdClass();
        $m->menu->admin->Manage_contents->content = array(
                "icon" => "fa fa-file-text-o",
                "text" => "Manage contents"
        );
        $m->menu->admin->Manage_contents->attributes = array(
                "href" => "javascript:void(0);",
                "title" => "",
                "class" => "btn btn-link",
                "id" => "manage_contents_menu"
        );
        $m->menu->admin->Manage_contents->childs = new stdClass();
        $m->menu->admin->Manage_contents->childs->Menu = new stdClass();
        $m->menu->admin->Manage_contents->childs->Menu->content = array(
                "icon" => "fa fa-fw fa fa-list",
                "text" => "Menu"
        );
        $m->menu->admin->Manage_contents->childs->Menu->attributes = array(
                "href" => "./Menu",
                "title" => "Menu",
                "class" => "btn btn-link"
        );
        $m->menu->admin->Manage_contents->childs->Pages = new stdClass();
        $m->menu->admin->Manage_contents->childs->Pages->content = array(
                "icon" => "fa fa-fw fa-file-text",
                "text" => "Pages"
        );
        $m->menu->admin->Manage_contents->childs->Pages->attributes = array(
                "href" => "./Pages",
                "title" => "Pages",
                "class" => "btn btn-link"
        );
        $m->menu->admin->Manage_contents->childs->Blog = new stdClass();
        $m->menu->admin->Manage_contents->childs->Blog->content = array(
                "icon" => "fa fa-fw fa-newspaper-o",
                "text" => "Blog"
        );
        $m->menu->admin->Manage_contents->childs->Blog->attributes = array(
                "href" => "./Blog",
                "title" => "Blog",
                "class" => "btn btn-link disabled hidden"
        );
}
// Append Signout button to end
$m->menu->admin->Logout = new stdClass();
$m->menu->admin->Logout->content = array(
        "icon" => "fa fa-sign-out",
        "text" => "Logout"
);
$m->menu->admin->Logout->attributes = array(
        "href" => "./Signout",
        "title" => "",
        "class" => "btn btn-link text-warning"
);

print json_encode($m);
// header("Content-type: text/plain");
// print_r($user[kTAG_ROLES]);
// exit();
?>
