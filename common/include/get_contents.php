<?php
if(strtolower($page->current) == "advanced_search") {
	require_once(TEMPLATE_DIR . "left_panel.tpl");
}
?>
<section class="container <?php print (strtolower($page->current) == "search" && !isset($_GET["q"])) ? "backgrounded" : ""; ?>">
	<?php
	switch(strtolower($page->current)) {
		case "advanced_search":
			require_once(TEMPLATE_DIR . "advanced_search_content.tpl");
			break;
		default:
			require_once(TEMPLATE_DIR . "content.tpl");
			break;
	}
	?>
</section>
