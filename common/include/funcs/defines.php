<?php
/**
 * HOST
 */
if(!defined("HOST")) { define("HOST", (isset($_SERVER["HTTPS"]) && $_SERVER["HTTPS"] && $_SERVER["HTTPS"] != "off") ? "https" : "http" . "://" . ((!isset($_SERVER["SERVER_NAME"])) ? php_uname("n") : $_SERVER["SERVER_NAME"]) . "/"); }

/**
 * Root
 */
if(!defined("SYSTEM_ROOT")) { define("SYSTEM_ROOT", $_SERVER["DOCUMENT_ROOT"] . "/"); }

/**
 * root:common/
 */
if(!defined("COMMON_DIR")) { define("COMMON_DIR", SYSTEM_ROOT . "common/"); }
        /**
         * root:common/.gnupg/
         */
        if(!defined("GNUPG_DIR")) { define("GNUPG_DIR", COMMON_DIR . ".gnupg/"); }

        /**
         * root:common/css/
         */
        if(!defined("CSS_DIR")) { define("CSS_DIR", COMMON_DIR . "css/"); }

                /**
                 * root:common/css/admin/
                 */
                if(!defined("ADMIN_CSS_DIR")) { define("ADMIN_CSS_DIR", CSS_DIR . "admin/"); }

        /**
         * root:common/include/
         */
        if(!defined("INCLUDE_DIR")) { define("INCLUDE_DIR", COMMON_DIR . "include/"); }
                /**
                 * root:common/include/classes/
                 */
                if(!defined("CLASSES_DIR")) { define("CLASSES_DIR", INCLUDE_DIR . "classes/"); }

                /**
                 * root:common/include/conf/
                 */
                if(!defined("CONF_DIR")) { define("CONF_DIR", INCLUDE_DIR . "conf/"); }
                        /**
                         * root:common/include/conf/interface/
                         */
                        if(!defined("INTERFACE_CONF_DIR")) { define("INTERFACE_CONF_DIR", CONF_DIR . "interface/"); }


                /**
                 * root:common/include/funcs/
                 */
                if(!defined("FUNCS_DIR")) { define("FUNCS_DIR", INCLUDE_DIR . "funcs/"); }
                        /**
                         * root:common/include/funcs/_ajax
                         */
                        if(!defined("AJAX_DIR")) { define("AJAX_DIR", FUNCS_DIR . "_ajax/"); }

                /**
                 * root:common/include/lib/
                 */
                if(!defined("LIB_DIR")) { define("LIB_DIR", INCLUDE_DIR . "lib/"); }

        /**
         * root:common/js/
         */
        if(!defined("JAVASCRIPT_DIR")) { define("JAVASCRIPT_DIR", COMMON_DIR . "js/"); }

                /**
                 * root:common/js/admin/
                 */
                if(!defined("ADMIN_JAVASCRIPT_DIR")) { define("ADMIN_JAVASCRIPT_DIR", JAVASCRIPT_DIR . "admin/"); }

                /**
                 * root:common/js/plugins/
                 */
                if(!defined("JAVASCRIPT_PLUGINS_DIR")) { define("JAVASCRIPT_PLUGINS_DIR", JAVASCRIPT_DIR . "plugins/"); }

        /**
         * root:common/md/
         */
        if(!defined("MARKDOWN_DIR")) { define("MARKDOWN_DIR", COMMON_DIR . "md/"); }

        /**
         * root:common/media/
         */
        if(!defined("MEDIA_DIR")) { define("MEDIA_DIR", COMMON_DIR . "media/"); }
                /**
                 * root:common/media/img/
                 */
                if(!defined("IMAGES_DIR")) { define("IMAGES_DIR", MEDIA_DIR . "img/"); }
                        /**
                         * root:common/media/img/admin/
                         */
                        if(!defined("ADMIN_IMAGES_DIR")) { define("ADMIN_IMAGES_DIR", IMAGES_DIR . "admin/"); }
                                /**
                                 * root:common/media/img/admin/user_images/
                                 */
                                if(!defined("ADMIN_IMAGES")) { define("ADMIN_IMAGES", ADMIN_IMAGES_DIR . "user_images/"); }

        /**
         * root:common/tpl/
         */
        if(!defined("TEMPLATE_DIR")) { define("TEMPLATE_DIR", COMMON_DIR . "tpl/"); }

                /**
                 * root:common/tpl/admin/
                 */
                if(!defined("ADMIN_TEMPLATE_DIR")) { define("ADMIN_TEMPLATE_DIR", TEMPLATE_DIR . "admin/"); }

                /**
                 * root:common/tpl/modals/
                 */
                if(!defined("TEMPLATE_MODALS_DIR")) { define("TEMPLATE_MODALS_DIR", TEMPLATE_DIR . "modals/"); }

                /**
                 * root:common/tpl/pages/
                 */
                if(!defined("TEMPLATE_PAGES_DIR")) { define("TEMPLATE_PAGES_DIR", TEMPLATE_DIR . "pages/"); }

                /**
                 * root:common/tpl/search_panels/
                 */
                if(!defined("TEMPLATE_SEARCH_PANEL_DIR")) { define("TEMPLATE_SEARCH_PANEL_DIR", TEMPLATE_DIR . "search_panels/"); }

/**
 * A simple bool variable to determine logged users status.
 * Peace of mind :)
 * @var bool                    $logged                 The current user is logged in?
 */
$logged = false;

/* =============================================================================
        USEFUL FUNCTIONS
============================================================================= */

/**
 * Convert a local defined path to remote url path
 * @param  string               $defines                The definition path to convert
 * @return string                                       The definition path converted to remote url path
 */
function local2host($defines) { return str_replace(SYSTEM_ROOT, HOST, $defines); }

/**
 * Convert a defined remote url path to local path
 * @param  string               $defines                The remote url path to convert
 * @return string                                       The remote url path converted to local
 */
function host2local($defines) { return str_replace(HOST, SYSTEM_ROOT, $defines); }

?>
