<meta charset="utf-8" />
<base href="./">
<meta http-equiv="X-UA-Compatible" content="IE=edge">
<meta name="viewport" content="width=device-width, user-scalable=no, initial-scale=1">
<title>PGRDG ~ Researching agricultural and forest biodiversity | <?php print $page->title; ?></title>

<?php
if(LOGGED && $page->current == "") {
        ?>
        <link rel="stylesheet" type="text/css" media="screen" href="<?php print $domain; ?>/common/css/admin/bootstrap.min.css">
        <link href="<?php print $domain; ?>/common/css/font-awesome/css/font-awesome.css" rel="stylesheet" type="text/css" media="screen" />

        <link href="<?php print $domain; ?>/common/css/admin/smartadmin-production-plugins.min.css" rel="stylesheet" type="text/css" media="screen" />
        <link href="<?php print $domain; ?>/common/css/admin/smartadmin-production.min.css" rel="stylesheet" type="text/css" media="screen" />
        <link href="<?php print $domain; ?>/common/css/admin/smartadmin-skins.min.css" rel="stylesheet" type="text/css" media="screen" />
        <link rel="stylesheet" type="text/css" media="screen" href="<?php print $domain; ?>/common/css/admin/bioversity.css">

        <link rel="stylesheet" type="text/css" media="screen" href="<?php print $domain; ?>/common/css/admin/demo.min.css">

        <!-- #GOOGLE FONT -->
        <link rel="stylesheet" href="http://fonts.googleapis.com/css?family=Open+Sans:400italic,700italic,300,400,700">
        <?php
} else {
        ?>
        <link rel="shortcut icon" href="<?php print $domain; ?>/common/media/img/favicon.ico" type="image/x-icon; charset=binary">
        <link rel="stylesheet" type="text/css" media="all"  href="<?php print $domain; ?>/common/css/bioversity.css" />
        <link rel="stylesheet" type="text/css" media="print"  href="<?php print $domain; ?>/common/css/bioversity.merged.css" />
        <link href="<?php print $domain; ?>/common/css/bootstrap/bootstrap.css" rel="stylesheet" type="text/css" media="screen">

        <link href="<?php print $domain; ?>/common/css/font-awesome/css/font-awesome.css" rel="stylesheet" type="text/css" media="screen" />
        <link href="<?php print $domain; ?>/common/css/Entypo/entypo.css" rel="stylesheet" type="text/css" media="screen" />
        <link href="<?php print $domain; ?>/common/css/ionicons-1.4.1/css/ionicons.css" rel="stylesheet" type="text/css" media="screen" />
        <link href="<?php print $domain; ?>/common/css/PICOL-font/css/picol.css" rel="stylesheet" type="text/css" media="screen" />
        <link href="<?php print $domain; ?>/common/css/mapglyphs/mapglyphs.css" rel="stylesheet" type="text/css" media="screen" />
        <link href="<?php print $domain; ?>/common/css/pgrdg-map-tools/pgrdg-map-tools.css" rel="stylesheet" type="text/css" media="screen" />

        <link href="<?php print $domain; ?>/common/css/main.css?<?php print mt_rand(); ?>" rel="stylesheet" type="text/css" media="screen" />
        <link href="<?php print $domain; ?>/common/css/print.css?<?php print mt_rand(); ?>" rel="stylesheet" media="print" />
        <?php
}
?>
<link rel="search" type="application/opensearchdescription+xml" title="PGRDG" href="osd.xml" />
