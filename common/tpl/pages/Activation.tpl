<?php

include(TEMPLATE_DIR . "body_header.tpl");
?>
<span id="f" style="display: none;"><?php print trim($_GET["f"]); ?></span>
<div class="signin">
        <h1><span style="font-size: 2.2em !important;">Wait...</span><small class="help-block"><?php print $i18n[$lang]["messages"]["activation"]["title"]; ?></small></h1>
        <div id="activation_content">
                <p class="lead" ><?php print $i18n[$lang]["messages"]["activation"]["message"]; ?></p>
        </div>
</div>
<div class="signature"><span class="fa fa-camera"></span> <?php print str_replace(array("{NAME}", "{URL}"), array("Irina Naumets", "http://www.freeimages.com/photo/1426260"), $i18n[$lang]["messages"]["photo_author_caption"]); ?></div>
