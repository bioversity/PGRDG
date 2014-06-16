<?php
$menu["menu"]["top"] = array(
	"Left panel" => array(
		"show_on_page" => "Search",
		// Here you are defining the <a> tag
		"content" => array(
			// You can see all available icons here => http://fortawesome.github.io/Font-Awesome/icons/
			"icon" => "fa fa-sort fa-rotate-90",
			"text" => "Left panel",
			"title" => "Open/close left panel"
		),
		"attributes" => array(
			"onclick" => "$.left_panel('filter');",
			"href" => "javascript:void(0);",
			"title" => "Open/close left panel"
		),
		"divider" => "vertical-divider"
	),
	"Home" => array(
		"content" => array(
			"icon" => "fa fa-home",
			"text" => "Home"
		),
		"attributes" => array(
			"href" => "/",
			"title" => "Go to Main Page"
		)
	),
	"About us" => array(
		"content" => array(
			"icon" => "fa fa-leaf",
			"text" => "About us"
		),
		"attributes" => array(
			"href" => "/About_us"
		)
	),
	"National Inventories" => array(
		"content" => array(
			"icon" => "fa fa-sitemap",
			"text" => "National Inventories"
		),
		"attributes" => array(
			"href" => "/National_Inventories"
		),
		"childs" => array(
			"National Inventories" => array(
				"content" => array(
					"icon" => "fa fa-list",
					"text" => "National Inventories"
				),
				"attributes" => array(
					"href" => "/National_Inventories"
				)
			),
			"Conservation Strategies" => array(
				"content" => array(
					"icon" => "ionicons ion-fork-repo",
					"text" => "Conservation Strategies"
				),
				"attributes" => array(
					"href" => "/Conservation_Strategies"
				)
			)
		)
	),
	"Search" => array(
		"content" => array(
			"icon" => "fa fa-search",
			"text" => "Search"
		),
		"attributes" => array(
			"href" => "/Search"
		),
		"divider" => "vertical-divider"
	),
	/*
	"Map" => array(
		"content" => array(
			"icon" => "fa fa-globe",
			"text" => "Map"
		),
		"attributes" => array(
			//"href" => "/Map"
			"href" => "#Map"
		)
	),
	"Data" => array(
		"content" => array(
			"icon" => "fa fa-code-fork",
			"text" => "Data"
		),
		"attributes" => array(
			"href" => "/Data"
		)
	),
	"Charts" => array(
		"content" => array(
			"icon" => "fa fa-bar-chart-o",
			"text" => "Charts"
		),
		"attributes" => array(
			"href" => "/Charts"
		),
		"divider" => "vertical-divider"
	),
	*/
	"Sign in" => array(
		"content" => array(
			"icon" => "fa fa-sign-in",
			"text" => "Sign in"
		),
		"attributes" => array(
			"href" => "javascript:void(0);",
			"data-toggle" => "modal",
			"data-target" => "#login"
		)
	)
);
$menu["menu"]["map_toolbox"] = array(
	"Find_location" => array(
		"content" => array(
			"icon" => "ion-search",
			"text" => ""
		),
		"attributes" => array(
			"onclick" => "$.sub_toolbox('find_location');",
			"href" => "javascript:void(0);",
			"class" => "btn",
			"id" => "find_location_btn",
			"title" => "Find a location (ALT+F)"
		),
		"divider" => "divider"
	),
	"Change_map" => array(
		"content" => array(
			"icon" => "ion-social-buffer",
			"text" => ""
		),
		"attributes" => array(
			"onclick" => "$.sub_toolbox('change_map');",
			"href" => "javascript:void(0);",
			"class" => "btn",
			"id" => "change_map_btn",
			"title" => "Change map type (ALT+T)"
		)
	),
	"Lock_view" => array(
		"content" => array(
			"icon" => "fa fa-lock",
			"text" => ""
		),
		"attributes" => array(
			"onclick" => "$.toggle_lock_view();",
			"href" => "javascript:void(0);",
			"class" => "btn",
			"id" => "lock_view_btn",
			"title" => "Lock/unlock this view (ALT+L)"
		)
	),
	"Tools" => array(
		"content" => array(
			"icon" => "ion-settings",
			"text" => ""
		),
		"attributes" => array(
			"onclick" => "$.sub_toolbox('tools');",
			"href" => "javascript:void(0);",
			"class" => "btn",
			"id" => "tools_btn",
			"title" => "Show/hide tools"
		),
		"divider" => "divider"
	),
	"Help" => array(
		"content" => array(
			"icon" => "ion-help",
			"text" => ""
		),
		"attributes" => array(
			"href" => "javascript:void(0);",
			"class" => "btn",
			"id" => "help_btn",
			"title" => "Help (F1)",
			"onclick" => "$.show_help();"
		)
	)
);
$menu["menu"]["tools"] = array(
	"Add_marker" => array(
		"content" => array(
			"icon" => "ion-location",
			"text" => ""
		),
		"attributes" => array(
			"onclick" => "javascript:void(0);",
			"href" => "javascript:void(0);",
			"class" => "btn",
			"title" => "Add marker"
		)
	),
	"Add_tooltip" => array(
		"content" => array(
			"icon" => "ion-chatbox-working",
			"text" => ""
		),
		"attributes" => array(
			"onclick" => "javascript:void(0);",
			"href" => "javascript:void(0);",
			"class" => "btn",
			"title" => "Add tooltip"
		),
		"divider" => "divider"
	),
	"Measure_distances" => array(
		"content" => array(
			"icon" => "ion-fork-repo",
			"text" => ""
		),
		"attributes" => array(
			"onclick" => "$.gui_measure_distances();",
			"href" => "javascript:void(0);",
			"class" => "btn",
			"id" => "measure_distances_btn",
			"title" => "Measure distances"
		)
	)
);
$menu["menu"]["map_contextmenu"] = array(
	"Get_point" => array(
		"content" => array(
			"icon" => "fa fa-crosshairs",
			"text" => "Get informations of this point"
		),
		"attributes" => array(
			"href" => "javascript:void(0);",
			"class" => "btn",
			"title" => "Help",
			"onclick" => "$.get_click_info();"
		),
		"divider" => "divider"
	)
);
$menu["menu"]["map_knob_contextmenu"] = array(
	"Point_info" => array(
		"content" => array(
			"icon" => "fa fa-info-circle",
			"text" => ""
		),
		"attributes" => array(
			"href" => "javascript:void(0);",
			"class" => "",
			"title" => "Get informations of this point",
			"onclick" => "$.get_click_info();"
		)
	)
);

if(isset($_GET["debug"]) == "true") {
	header("Content-type: text/plain;");
	
	switch($_GET["format"]) {
		case "array":
			print_r($menu);
			break;
		case "dump":
			var_dump($menu);
			break;
		case "json":
		default:
			print json_encode($menu);
			break;
	}
}
?>