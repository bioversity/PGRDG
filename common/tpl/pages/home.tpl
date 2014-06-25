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

<p>Around every crop that is used by people huge amounts of data are generated. These data may be about useful traits found in certain varieties <em>in situ</em> or on farm, how varieties fared in trials in the field, different names used for the same plant, location, species, crop wild relatives, landraces and many more. Further data is found in inventories in <em>ex situ</em> plant collections in genebanks. </p>

<p>The plant genetic resources diversity gateway was developed to accommodate all these different data types and link them together in such a way as to allow the information to continue to grow while facilitating retrieval and use. The system paves the way for maintaining a wealth of data and information gathered from research results, which otherwise often become lost within a few years of an article’s publication.</p>

<p>The Plant Genetic Resource Diversity Gateway includes inventories and trait information on crop wild relatives and landraces from various sources, including data generated within the “PGR Secure project”. <a href="http://www.pgrsecure.org/">PGR Secure</a> is the short name given to a collaborative project funded under the EU Seventh Framework Programme, ‘Characterization of biodiversity resources for wild crop relatives to improve crops by breeding’. </p>

<p>The data can be searched or browsed from any data type, word or domain besides offering three different entry points — national inventories and conservation strategies, and generic search-allowing the user to retrieve information without having to choose a domain beforehand. The system is set up so that the user can use it as a gateway into other existing sources of information.</p>

<p>The main target of the Plant Genetic Resource Diversity Gateway is to promote and facilitate the use of crop wild relatives and landraces in breeding and crop improvement. At the same time, it provides a system to manage conservation data about these important resources, which can be used as a decision-making support tool for policymakers.</p>

<p>PGR Secure has received funding from the European Union’s Seventh Framework Programme for research, technological development and demonstration under grant agreement no 266394</p>
