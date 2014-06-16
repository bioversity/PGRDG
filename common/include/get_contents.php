<section class="container">
	<?php
	if(strtolower($page) == "search") {
		require_once("common/tpl/left_panel.tpl");
		require_once("common/tpl/search_content.tpl");
	} else {
		require_once("common/tpl/content.tpl");
	}
	?>
</section>