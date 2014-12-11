<?php
http_response_code(404);
?>
<?php include("common/tpl/body_header.tpl"); ?>
<div class="e404">
        <h1><span>404</span><small class="help-block">Page not found</small></h1>
        <p><?php print $i18n[$lang]["messages"]["errors"]["page_do_not_exists"]; ?></p>
</div>
<div class="signature"><span class="fa fa-camera"></span> <?php print str_replace(array("{NAME}", "{URL}"), array("Timo Balk", "http://www.redbubble.com/people/timobalk"), $i18n[$lang]["messages"]["photo_author_caption"]); ?></div>
