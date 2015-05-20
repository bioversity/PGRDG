<meta charset="utf-8" />
<base href="./">
<meta http-equiv="X-UA-Compatible" content="IE=edge">
<meta name="viewport" content="width=device-width, user-scalable=no, initial-scale=1">
<title>
        <?php
        print $interface["site"]["title"] . " | ";
        if(LOGGED && isset($page->logged_title)) {
                print $page->logged_title;
        } else {
                print $page->title;
        }
        ?>
</title>

<link rel="shortcut icon" href="<?php print local2host(IMAGES_DIR); ?>favicon.ico" type="image/x-icon; charset=binary">

<link href="<?php print local2host(CSS_DIR); ?>bootstrap/bootstrap.css" rel="stylesheet" type="text/css" media="screen">
<link href="<?php print local2host(CSS_DIR); ?>font-awesome/css/font-awesome.css" rel="stylesheet" type="text/css" media="screen" />
<link href="<?php print local2host(CSS_DIR); ?>Entypo/entypo.css" rel="stylesheet" type="text/css" media="screen" />
<link href="<?php print local2host(CSS_DIR); ?>ionicons-1.4.1/css/ionicons.css" rel="stylesheet" type="text/css" media="screen" />
<link href="<?php print local2host(CSS_DIR); ?>PICOL-font/css/picol.css" rel="stylesheet" type="text/css" media="screen" />
<link href="<?php print local2host(CSS_DIR); ?>mapglyphs/mapglyphs.css" rel="stylesheet" type="text/css" media="screen" />

<?php
if(LOGGED && $page->current == "Home" || LOGGED && $page->need_login && $page->has_permissions) {
        ?>
        <!-- Demo purpose only: goes with demo.js, you can delete this css when designing your own WebApp -->
        <!-- <link rel="stylesheet" type="text/css" media="screen" href="css/demo.min.css"> -->

        <!-- FAVICONS -->
        <link rel="shortcut icon" href="<?php local2host(IMAGES_DIR); ?>favicon/favicon.ico" type="image/x-icon">
        <link rel="icon" href="<?php local2host(IMAGES_DIR); ?>favicon/favicon.ico" type="image/x-icon">

        <link href="<?php print local2host(CSS_DIR); ?>animations<?php print ((!$interface["site"]["developer_mode"]) ? ".min" : ""); ?>.css?<?php print mt_rand(); ?>" rel="stylesheet" type="text/css" media="screen" />
        <link href="<?php print local2host(CSS_DIR); ?>main<?php print ((!$interface["site"]["developer_mode"]) ? ".min" : ""); ?>.css?<?php print mt_rand(); ?>" rel="stylesheet" type="text/css" media="screen" />
        <link href="<?php print local2host(ADMIN_CSS_DIR); ?>smartadmin-production-plugins.min.css" rel="stylesheet" type="text/css" media="screen" />
        <link href="<?php print local2host(ADMIN_CSS_DIR); ?>main<?php print ((!$interface["site"]["developer_mode"]) ? ".min" : ""); ?>.css" rel="stylesheet" type="text/css" media="screen" />
        <link href="<?php print local2host(ADMIN_CSS_DIR); ?>smartadmin-skins.min.css" rel="stylesheet" type="text/css" media="screen" />
        <link href="<?php print local2host(ADMIN_CSS_DIR); ?>smartadmin-rtl.min.css" rel="stylesheet" type="text/css" media="screen" />
        <!-- <link rel="stylesheet" type="text/css" media="screen" href="<?php //print local2host(ADMIN_CSS_DIR); ?>bioversity.css"> -->

        <link rel="stylesheet" type="text/css" media="screen" href="<?php print local2host(ADMIN_CSS_DIR); ?>demo<?php print ((!$interface["site"]["developer_mode"]) ? ".min" : ""); ?>.css">

        <!-- #GOOGLE FONT -->
        <link rel="stylesheet" href="http://fonts.googleapis.com/css?family=Open+Sans:400italic,700italic,300,400,700">
        <?php
        if($page->is_backend) {
                ?>
        	<!-- Markitup Editor -->
                <link href="<?php print local2host(JAVASCRIPT_PLUGINS_DIR); ?>markitup/skins/simple/style.css" rel="stylesheet" type="text/css" media="screen" />
                <link href="<?php print local2host(JAVASCRIPT_PLUGINS_DIR); ?>markitup/sets/markdown_font-awesome/style.css" rel="stylesheet" type="text/css" media="screen" />
                <?php
        }
} else {
        ?>
        <link rel="stylesheet" type="text/css" media="all"  href="<?php print local2host(CSS_DIR); ?>bioversity<?php print ((!$interface["site"]["developer_mode"]) ? ".min" : ""); ?>.css" />
        <link rel="stylesheet" type="text/css" media="print"  href="<?php print local2host(CSS_DIR); ?>bioversity.merged.css" />

        <link href="<?php print local2host(CSS_DIR); ?>animations<?php print ((!$interface["site"]["developer_mode"]) ? ".min" : ""); ?>.css?<?php print mt_rand(); ?>" rel="stylesheet" type="text/css" media="screen" />
        <link href="<?php print local2host(CSS_DIR); ?>pgrdg-map-tools/pgrdg-map-tools<?php print ((!$interface["site"]["developer_mode"]) ? ".min" : ""); ?>.css" rel="stylesheet" type="text/css" media="screen" />
        <link href="<?php print local2host(CSS_DIR); ?>main<?php print ((!$interface["site"]["developer_mode"]) ? ".min" : ""); ?>.css?<?php print mt_rand(); ?>" rel="stylesheet" type="text/css" media="screen" />

        <link href="<?php print local2host(CSS_DIR); ?>print<?php print ((!$interface["site"]["developer_mode"]) ? ".min" : ""); ?>.css?<?php print mt_rand(); ?>" rel="stylesheet" media="print" />
        <?php
}
?>
<link rel="search" type="application/opensearchdescription+xml" title="PGRDG" href="osd.xml" />
