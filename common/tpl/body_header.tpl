<header class="main<?php print (strtolower($page) == "map") ? " map" : ""; ?>">
	<div class="container">
		<div class="top">
			<div id="logo"<?php print (strtolower($page) == "map") ? ' class="map"' : ""; ?>>
				<a href="/">
					<!--object data="common/media/svg/<?php print (strtolower($page) == "map") ? "bioversity-logo_small.svg" : "bioversity-logo.svg"; ?>" type="image/svg+xml"-->
						<img alt="Bioversity logo" src="common/media/svg/<?php print (strtolower($page) == "map") ? "bioversity-logo_small.svg" : "bioversity-logo.svg"; ?>" />
					<!--/object-->
				</a>
				<p class="tagline">Bioversity International: research for development in agricultural and forest biodiversity</p>
			</div>
		</div>
		
		<nav role="navigation" id="nav" class="navbar right<?php print (strtolower($page) == "map") ? " map" : ""; ?>">
			<?php
			// Parse the menu defined by json object in "common/include/conf/menu.json"
			$site_conf = json_decode(file_get_contents("common/include/conf/menu.json"));
			$menu_list = '<ul class="lvl1 nav navbar-nav navbar-right">';
			foreach($site_conf->menu->top as $obj => $menu_top) {
				if(!is_object($obj) && $obj == "divider") {
					$menu_list .= '<li class="divider"></li>' . "\n";
				} else {
					if($obj !== "_comment") {
						$menu_list .= '<li><a ';
						$attributes = array();
						foreach($menu_top->attributes as $attr_key => $attr_val) {
							$attributes[] = $attr_key . '="' . $attr_val . '"';
						}
						$menu_list .= implode(" ", $attributes) . '><span class="fa ' . $menu_top->content->icon . '"></span>&nbsp;' . $menu_top->content->text . '</a></li>' . "\n";
					}
				}
			}
			$menu_list .= "</ul>";
			print $menu_list;
			?>
		</nav>
	</div>
</header>
<?php require_once("common/tpl/login_modal.tpl"); ?>