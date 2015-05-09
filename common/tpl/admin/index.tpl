<?php
require_once(ADMIN_TEMPLATE_DIR . "body_header.tpl");
require_once(ADMIN_TEMPLATE_DIR . "left_panel.tpl");
require_once(ADMIN_TEMPLATE_DIR . "content.tpl");
require_once(ADMIN_TEMPLATE_DIR . "footer.tpl");
require_once(ADMIN_TEMPLATE_DIR . "shortcut.tpl");
switch($page->current) {
        case "Home":
        case "Profile":
        case "History":
        case "Invite":
        case "Menu":
        case "Pages":
        case "Upload":
                require_once(TEMPLATE_DIR . "script.tpl");
                break;
        default:
                require_once(ADMIN_TEMPLATE_DIR . "script.tpl");
                break;
}
?>
