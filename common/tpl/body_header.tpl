<header class="main map">
	<div class="container">
		<div class="top">
			<div id="logo"<?php print (strtolower($page) == "map") ? ' class="map"' : ""; ?>>
				<a href="/">
					<img alt="Bioversity logo" src="common/media/svg/bioversity-logo_small.svg" />
				</a>
				<p class="tagline">Bioversity International: research for development in agricultural and forest biodiversity</p>
			</div>
		</div>

		<nav role="navigation" id="nav" class="navbar right<?php print (strtolower($page) == "map") ? " map" : ""; ?>">
			<div class="container-fluid">
				<div class="navbar-header">
					<button type="button" class="navbar-toggle" data-toggle="collapse" data-target="#bs-example-navbar-collapse-1">
						<span class="sr-only">Toggle navigation</span>
						Menu <span class="fa fa-bars"></span>
					</button>
				</div>
				<div class="collapse navbar-collapse" id="bs-example-navbar-collapse-1">
					<?php
					print $site_config->menu("top", "lvl1 nav navbar-nav navbar-right");
					?>
				</div>
			</div>
		</nav>
	</div>
</header>
<?php require_once("common/tpl/modals/markers.modal.tpl"); ?>
<?php require_once("common/tpl/modals/login.modal.tpl"); ?>
<?php require_once("common/tpl/modals/map_toolbox_help.modal.tpl"); ?>
