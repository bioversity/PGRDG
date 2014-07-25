<section class="container <?php print (strtolower($page) == "se") ? "backgrounded" : ""; ?>">
	<?php
	switch(strtolower($page)) {
		case "search":
			require_once("common/tpl/left_panel.tpl");
			require_once("common/tpl/search_content.tpl");
			break;
		default:
			require_once("common/tpl/content.tpl");
			break;
	}
	?>
</section>
