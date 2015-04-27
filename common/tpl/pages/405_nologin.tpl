<?php
http_response_code(405);
?>
<?php include("common/tpl/body_header.tpl"); ?>
<div class="e405">
        <h1><span>405</span><small class="help-block"><?php print $i18n[$lang]["messages"]["errors"]["405"]; ?></small></h1>
        <p><?php print $i18n[$lang]["messages"]["errors"]["you_cannot_login"]; ?></p>
</div>
<div class="signature">
        <span class="fa fa-camera"></span> <?php print str_replace(array("{NAME}", "{URL}"), array("Christopher Hogue Thompson", "http://commons.wikimedia.org/wiki/Main_Page"), $i18n[$lang]["messages"]["photo_author_caption"]); ?>
</div>
