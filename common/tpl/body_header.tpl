<header class="main<?php print (strtolower($page) == "map") ? " map" : ""; ?>">
	<div class="container">
		<div class="top">
			<div id="logo"<?php print (strtolower($page) == "map") ? ' class="map"' : ""; ?>>
				<a href="/">
					<img alt="Bioversity logo" src="common/media/svg/<?php print (strtolower($page) == "map") ? "bioversity-logo_small.svg" : "bioversity-logo.svg"; ?>" />
				</a>
				<p class="tagline">Bioversity International: research for development in agricultural and forest biodiversity</p>
			</div>
		</div>
		
		<nav role="navigation" id="nav" class="navbar right<?php print (strtolower($page) == "map") ? " map" : ""; ?>">
			<?php
			print $site_config->menu("top", "lvl1 nav navbar-nav navbar-right");
			?>
		</nav>
	</div>
</header>
<?php require_once("common/tpl/modals/login.modal.tpl"); ?>
<?php require_once("common/tpl/modals/map_toolbox_help.modal.tpl"); ?>