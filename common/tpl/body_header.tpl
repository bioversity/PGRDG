<?php
if(strtolower($page->current) == "map" || !$page->exists || $page->need_login && !LOGGED) {
	$page_class = "map";
} else {
	if(isset($page->class) && count($page->class) > 1) {
		$page_class = implode(" ", $page->class);
	} else {
		$page_class = "";
	}
}
?>
<header class="main <?php print $page_class; ?>">
	<div class="container">
		<div class="top">
			<div id="logo"<?php print (strtolower($page->current) == "map") ? ' class="map"' : ""; ?>>
				<a href="/">
					<img alt="Bioversity logo" src="<?php print '' . local2host(MEDIA_DIR) . 'svg/bioversity-logo_small' . ((strtolower($page->current) == "map" || strtolower($page->current) == "activation" || $page->has_error) ? "_white" : ""); ?>.svg" />
				</a>
				<p class="tagline">Bioversity International: research for development in agricultural and forest biodiversity</p>
			</div>
		</div>

		<nav role="navigation" id="nav" class="navbar right<?php print (strtolower($page->current) == "map") ? " map" : ""; ?>">
			<div class="container-fluid">
				<div class="navbar-header">
					<button type="button" class="navbar-toggle" data-toggle="collapse" data-target="#bs-example-navbar-collapse-1">
						<span class="sr-only">Toggle navigation</span>
						Menu <span class="fa fa-bars"></span>
					</button>
				</div>
				<div class="collapse navbar-collapse" id="bs-example-navbar-collapse-1">
					<?php
					if (LOGGED) {
						print str_replace("{USER_NAME}", $user[kTAG_ENTITY_FNAME][kAPI_PARAM_RESPONSE_FRMT_DISP], $global_menu->menu("top", "lvl1 nav navbar-nav navbar-right"));
					} else {
						print $global_menu->menu("top", "lvl1 nav navbar-nav navbar-right");
					}
					?>
				</div>
			</div>
		</nav>
	</div>
</header>
<?php require_once(TEMPLATE_MODALS_DIR . "markers.modal.tpl"); ?>
<?php require_once(TEMPLATE_MODALS_DIR . "map_toolbox_help.modal.tpl"); ?>
<?php require_once(TEMPLATE_MODALS_DIR . "summary_ordering.modal.tpl"); ?>
<?php require_once(TEMPLATE_MODALS_DIR . "storage_data.modal.tpl"); ?>
