<?php
if(strtolower($page->current) == "advanced_search") {
	require_once("common/tpl/left_panel.tpl");
}
?>
<section class="container <?php print (strtolower($page->current) == "search" && !isset($_GET["q"])) ? "backgrounded" : ""; ?>">
	<?php
	switch(strtolower($page->current)) {
		case "advanced_search":
			require_once("common/tpl/advanced_search_content.tpl");
			break;
		default:
			require_once("common/tpl/content.tpl");
			break;
	}
	?>
</section>
