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

<link rel="shortcut icon" href="<?php print $domain; ?>/common/media/img/favicon.ico" type="image/x-icon; charset=binary">

<link href="<?php print $domain; ?>/common/css/bootstrap/bootstrap.css" rel="stylesheet" type="text/css" media="screen">
<link href="<?php print $domain; ?>/common/css/font-awesome/css/font-awesome.css" rel="stylesheet" type="text/css" media="screen" />
<link href="<?php print $domain; ?>/common/css/Entypo/entypo.css" rel="stylesheet" type="text/css" media="screen" />
<link href="<?php print $domain; ?>/common/css/ionicons-1.4.1/css/ionicons.css" rel="stylesheet" type="text/css" media="screen" />
<link href="<?php print $domain; ?>/common/css/PICOL-font/css/picol.css" rel="stylesheet" type="text/css" media="screen" />
<link href="<?php print $domain; ?>/common/css/mapglyphs/mapglyphs.css" rel="stylesheet" type="text/css" media="screen" />

<?php
if(LOGGED && $page->current == "Home" || LOGGED && $page->need_login) {
        ?>
        <!-- Demo purpose only: goes with demo.js, you can delete this css when designing your own WebApp -->
        <!-- <link rel="stylesheet" type="text/css" media="screen" href="css/demo.min.css"> -->

        <!-- FAVICONS -->
        <link rel="shortcut icon" href="img/favicon/favicon.ico" type="image/x-icon">
        <link rel="icon" href="img/favicon/favicon.ico" type="image/x-icon">

        <link href="<?php print $domain; ?>/common/css/animations<?php print ((!$interface["site"]["developer_mode"]) ? ".min" : ""); ?>.css?<?php print mt_rand(); ?>" rel="stylesheet" type="text/css" media="screen" />
        <link href="<?php print $domain; ?>/common/css/main<?php /*print ((!$interface["site"]["developer_mode"]) ? ".min" : "");*/ ?>.css?<?php print mt_rand(); ?>" rel="stylesheet" type="text/css" media="screen" />
        <link href="<?php print $domain; ?>/common/css/admin/smartadmin-production-plugins.min.css" rel="stylesheet" type="text/css" media="screen" />
        <link href="<?php print $domain; ?>/common/css/admin/main.css" rel="stylesheet" type="text/css" media="screen" />
        <link href="<?php print $domain; ?>/common/css/admin/smartadmin-skins.min.css" rel="stylesheet" type="text/css" media="screen" />
        <link href="<?php print $domain; ?>/common/css/admin/smartadmin-rtl.min.css" rel="stylesheet" type="text/css" media="screen" />
        <!-- <link rel="stylesheet" type="text/css" media="screen" href="<?php //print $domain; ?>/common/css/admin/bioversity.css"> -->

        <link rel="stylesheet" type="text/css" media="screen" href="<?php print $domain; ?>/common/css/admin/demo<?php print ((!$interface["site"]["developer_mode"]) ? ".min" : ""); ?>.css">

        <!-- #GOOGLE FONT -->
        <link rel="stylesheet" href="http://fonts.googleapis.com/css?family=Open+Sans:400italic,700italic,300,400,700">
        <?php
        if($page->is_backend) {
                ?>
        	<!-- Markitup Editor -->
                <link href="<?php print $domain; ?>/common/js/plugins/markitup/skins/simple/style.css" rel="stylesheet" type="text/css" media="screen" />
                <link href="<?php print $domain; ?>/common/js/plugins/markitup/sets/markdown_font-awesome/style.css" rel="stylesheet" type="text/css" media="screen" />
                <?php
        }
} else {
        ?>
        <link rel="stylesheet" type="text/css" media="all"  href="<?php print $domain; ?>/common/css/bioversity<?php print ((!$interface["site"]["developer_mode"]) ? ".min" : ""); ?>.css" />
        <link rel="stylesheet" type="text/css" media="print"  href="<?php print $domain; ?>/common/css/bioversity.merged.css" />

        <link href="<?php print $domain; ?>/common/css/animations<?php print ((!$interface["site"]["developer_mode"]) ? ".min" : ""); ?>.css?<?php print mt_rand(); ?>" rel="stylesheet" type="text/css" media="screen" />
        <link href="<?php print $domain; ?>/common/css/pgrdg-map-tools/pgrdg-map-tools<?php print ((!$interface["site"]["developer_mode"]) ? ".min" : ""); ?>.css" rel="stylesheet" type="text/css" media="screen" />
        <link href="<?php print $domain; ?>/common/css/main<?php /*print ((!$interface["site"]["developer_mode"]) ? ".min" : "");*/ ?>.css?<?php print mt_rand(); ?>" rel="stylesheet" type="text/css" media="screen" />

        <link href="<?php print $domain; ?>/common/css/print<?php print ((!$interface["site"]["developer_mode"]) ? ".min" : ""); ?>.css?<?php print mt_rand(); ?>" rel="stylesheet" media="print" />
        <?php
}
?>
<link rel="search" type="application/opensearchdescription+xml" title="PGRDG" href="osd.xml" />
