<section class="container">
	<?php
	if(strtolower($page) == "map") {
		require_once("common/tpl/left_panel.tpl");
		require_once("common/tpl/map.tpl");
	} else {
		require_once("common/tpl/left_panel.tpl");
		require_once("common/tpl/content.tpl");
	}
	?>
</section>