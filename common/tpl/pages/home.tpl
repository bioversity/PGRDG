<h1>
	Plant Genetic Resources Diversity Gateway
	<small class="help-block">for the conservation and use of crop wild relative and landrace traits</small>
</h1>
<?php
$dir = IMAGES_DIR . "home";
$images = array_diff(scandir($dir), array("..", "."));
$h = -1;
$i = -1;
?>
<div data-ride="carousel" class="carousel slide" id="home_pictures">
	<ol class="carousel-indicators">
		<?php
		foreach($images as $src) {
			$h++;
			?>
			<li class="<?php print ($h == 0) ? "active" : ""; ?>" data-slide-to="<?php print $h; ?>" data-target="#home_pictures"></li>
			<?php
		}
		?>
	</ol>
	<div class="carousel-inner">
		<?php
		foreach($images as $src) {
			$i++;
			?>
			<div class="item<?php print ($i == 0) ? " active" : ""; ?>">
				<img alt="<?php print str_replace("_", " ", $src); ?>" src="<?php print local2host($dir) . "/" . $src; ?>" />
			</div>
			<?php
		}
		?>
	</div>
</div>
<?php
print optimize(Markdown(file_get_contents(MARKDOWN_DIR . str_replace("_", " ", (($page->current == "Home") ? "home" : $page->current)) . ".md")));
?>
