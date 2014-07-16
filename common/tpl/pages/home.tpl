<?php
$dir = "common/media/img/home";
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
				<img alt="<?php print str_replace("_", " ", $src); ?>" src="<?php print $dir . "/" . $src; ?>" />
			</div>
			<?php
		}
		?>
	</div>
</div>
<h3 id="one-comprehensive-information-gateway-for-plant-genetic-resources-for-food-and-agriculture">One comprehensive information gateway for plant genetic resources for food and agriculture</h3>

<p>The Plant Genetic Resources Diversity Gateway aims to promote and facilitate the use of crop wild relatives and landraces in breeding and crop improvement by providing traits and QTL information of potential value to breeders and other users of germplasm. It also provides information on checklists, inventories and conservation strategies of crop wild relatives and land races at national level and regional levels of use to conservation managers, scientists and policymakers.</p>
<p>The Plant Genetic Resources Diversity Gateway started as a product of a project known as ‘PGR Secure’.  This collaborative project, with the full name ‘Novel characterization of crop wild relative and landrace resources as a basis for improved crop breeding’ was funded under the EU Seventh Framework Programme THEME KBBE.2010.1.1-03 on ‘Characterization of biodiversity resources for wild crop relatives to improve crops by breeding’.</p>
<p>The Plant Genetic Resources Diversity Gateway accommodates in one place different data types: taxonomy, location, crop wild relatives, landraces, vernacular names, useful traits, checklists, inventories and conservation strategies. It paves the way for maintaining a wealth of data and information gathered from research results, which otherwise often become lost within a few years of an article’s publication.</p>
<p>The data can be searched or browsed from any data type, word or domain. It  offers three different entry points—search, national inventories and conservation strategies—as well as a generic search, which allows the user to retrieve information without having to choose a domain beforehand. The system is set up so that the user can use it as a gateway into other existing sources of information.</p>
