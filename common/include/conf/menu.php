<?php
require_once($_SERVER["DOCUMENT_ROOT"] . DIRECTORY_SEPARATOR . "common/tpl/defines.tpl");
$allow_signup = true;
if(session_status() == PHP_SESSION_NONE) {
	session_start();
}
if(isset($_COOKIE["l"]) && trim($_COOKIE["l"]) !== "") {
	if(isset($_SESSION["user"])) {
		$user = json_decode(json_encode($_SESSION["user"]), 1);
	}
	$logged = (md5($user[kTAG_ENTITY_PGP_FINGERPRINT][kAPI_PARAM_RESPONSE_FRMT_DISP]) == $_COOKIE["l"]) ? true : false;
}
if(!defined("LOGGED")) {
	define("LOGGED", $logged);
}
$menu["menu"]["top"][] = array(
	/*"Left panel" => array(
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
	),*/
	"Home" => array(
		"content" => array(
			"icon" => "fa fa-home",
			"text" => "Home"
		),
		"attributes" => array(
			"href" => "./",
			"title" => "Go to Main Page",
			"class" => "btn btn-link"
		)
	),
	/*
	"Blog" => array(
		"content" => array(
			"icon" => "fa fa-comments-o",
			"text" => "Blog"
		),
		"attributes" => array(
			"href" => "./Blog",
			"title" => "The PGRDG Blog"
		)
	),
	*/
	"About us" => array(
		"content" => array(
			"icon" => "fa fa-leaf",
			"text" => "About us"
		),
		"attributes" => array(
			"href" => "javascript: void(0);",
			"class" => "btn btn-link"
		),
		"childs" => array(
			"About us" => array(
				"content" => array(
					"icon" => "fa fa-comment-o",
					"text" => "About us"
				),
				"attributes" => array(
					"href" => "./About_us"
				)
			),
			"How_the_system_works" => array(
				"content" => array(
					"icon" => "fa fa-gears",
					"text" => "How the system works"
				),
				"attributes" => array(
					"href" => "./How_the_system_works"
				)
			),
			"Feedback" => array(
				"content" => array(
					"icon" => "fa fa-comments-o",
					"text" => "Give us your feedback"
				),
				"attributes" => array(
					"href" => "./Feedback"
				)
			),
		)
	),
	"National Inventories" => array(
		"content" => array(
			"icon" => "fa fa-sitemap",
			"text" => "National Inventories"
		),
		"attributes" => array(
			"href" => "javascript: void(0);",
			"class" => "btn btn-link"
		),
		"childs" => array(
			"National Inventories" => array(
				"content" => array(
					"icon" => "fa fa-list",
					"text" => "National Inventories"
				),
				"attributes" => array(
					"href" => "./National_Inventories"
				)
			),
			"Conservation Strategies" => array(
				"content" => array(
					"icon" => "ionicons ion-fork-repo",
					"text" => "Conservation Strategies"
				),
				"attributes" => array(
					"href" => "./Conservation_Strategies"
				)
			),
			"Links" => array(
				"content" => array(
					"icon" => "fa fa-link",
					"text" => "Links"
				),
				"attributes" => array(
					"href" => "./Links"
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
			"href" => "./Search",
			"class" => "btn btn-link"
		)
	),
	"Graphs" => array(
		"content" => array(
			"icon" => "fa fa-pie-chart",
			"text" => "Graphs"
		),
		"attributes" => array(
			//"href" => "./Map"
			"href" => "./Graph",
			"title" => "Collected graphs",
			"class" => "btn btn-link"
		),
		"divider" => "vertical-divider"
	),
	"Map" => array(
		"content" => array(
			"icon" => "fa fa-globe",
			"text" => "Map"
		),
		"attributes" => array(
			//"href" => "./Map"
			"href" => "./Map",
			"title" => "Go to map view",
			"class" => "btn btn-link"
		),
		"divider" => "vertical-divider"
	),
	/*
	"Data" => array(
		"content" => array(
			"icon" => "fa fa-code-fork",
			"text" => "Data"
		),
		"attributes" => array(
			"href" => "./Data"
		)
	),
	"Charts" => array(
		"content" => array(
			"icon" => "fa fa-bar-chart-o",
			"text" => "Charts"
		),
		"attributes" => array(
			"href" => "./Charts"
		),
		"divider" => "vertical-divider"
	),
	*/
);

if($allow_signup) {
	if(!LOGGED) {
		$menu["menu"]["top"][0]["Sign in"] = array(
			"content" => array(
				"icon" => "fa fa-sign-in",
				"text" => "Sign in"
			),
			"attributes" => array(
				"href" => "./Signin",
				"class" => "btn btn-link"
			)
		);
	} else {
		$menu["menu"]["top"][0]["User"] = array(
			"content" => array(
				"icon" => "fa fa-cogs",
				"text" => $user[kTAG_ENTITY_FNAME][kAPI_PARAM_RESPONSE_FRMT_DISP],
			),
			"attributes" => array(
				"href" => "javascript: void(0);",
				"class" => "btn btn-link"
			),
			"childs" => array(
				"Profile" => array(
					"content" => array(
						"icon" => "fa fa-user",
						"text" => "Profile"
					),
					"attributes" => array(
						"href" => "./Profile"
					),
					"divider" => "divider"
				),
				"Signout" => array(
					"content" => array(
						"icon" => "fa fa-sign-out",
						"text" => "Sign out"
					),
					"attributes" => array(
						"href" => "./Signout"
					)
				)
			)
		);

		require_once(INCLUDE_DIR . "conf/menu_admin.php");
	}
}

$menu["menu"]["map_toolbox"][] = array(
	"Show_hide_menu" => array(
		"content" => array(
			"icon" => "ion-navicon",
			"text" => ""
		),
		"attributes" => array(
			"onclick" => "$.sh_menu()",
			"href" => "javascript:void(0);",
			"class" => "btn",
			"id" => "show_hide_menu_btn",
			"title" => "Show or hide main menu (ALT+M)"
		),
		"divider" => "divider nav_divider"
	),
	"Show_hide_breadcrumb" => array(
		"content" => array(
			"icon" => "fa fa-history",
			"text" => ""
		),
		"attributes" => array(
			"onclick" => "$.sh_breadcrumb()",
			"href" => "javascript:void(0);",
			"class" => "btn",
			"id" => "show_hide_breadcrumb_btn",
			"title" => "Show or hide breadcrumb (ALT+B)"
		)
	)
);
$menu["menu"]["map_toolbox"][] = array(
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
		)
	),
	"Change_map" => array(
		"content" => array(
			"icon" => "ion-map",
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
	// "User_layers" => array(
	// 	"content" => array(
	// 		"icon" => "ion-social-buffer",
	// 		"text" => ""
	// 	),
	// 	"attributes" => array(
	// 		"onclick" => "$.sub_toolbox('user_layers');",
	// 		"href" => "javascript:void(0);",
	// 		"class" => "btn",
	// 		"style" => "display: none;",
	// 		"id" => "user_level_btn",
	// 		"title" => "Show/hide layers"
	// 	)
	// ),
	"Selection" => array(
		"content" => array(
			"icon" => "icon-vector-selection",
			"text" => ""
		),
		"attributes" => array(
			"onclick" => "$.sub_toolbox('tools');",
			"href" => "javascript:void(0);",
			"class" => "btn",
			"id" => "selection_btn",
			"title" => "Show/hide selection tools"
		),
		"divider" => "divider"
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
	)
);
$menu["menu"]["map_toolbox"][] = array(
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
$menu["menu"]["tools"][] = array(
	// "Add_marker" => array(
	// 	"content" => array(
	// 		"icon" => "ion-location",
	// 		"text" => ""
	// 	),
	// 	"attributes" => array(
	// 		"onclick" => "javascript:void(0);",
	// 		"href" => "javascript:void(0);",
	// 		"class" => "btn",
	// 		"title" => "Add marker"
	// 	)
	// ),
	// "Add_tooltip" => array(
	// 	"content" => array(
	// 		"icon" => "ion-chatbox-working",
	// 		"text" => ""
	// 	),
	// 	"attributes" => array(
	// 		"onclick" => "javascript:void(0);",
	// 		"href" => "javascript:void(0);",
	// 		"class" => "btn",
	// 		"title" => "Add tooltip"
	// 	),
	// 	"divider" => "divider"
	// ),
	// "Measure_distances" => array(
	// 	"content" => array(
	// 		"icon" => "ion-fork-repo",
	// 		"text" => ""
	// 	),
	// 	"attributes" => array(
	// 		"onclick" => "$.gui_measure_distances();",
	// 		"href" => "javascript:void(0);",
	// 		"class" => "btn",
	// 		"id" => "measure_distances_btn",
	// 		"title" => "Measure distances"
	// 	)
	// )
	"Draw_polygon" => array(
		"content" => array(
			"icon" => "icon-vector-polygon",
			"text" => ""
		),
		"attributes" => array(
			"onclick" => "$.draw_polygon();",
			"href" => "javascript:void(0);",
			"class" => "btn",
			"id" => "draw_polygon_btn",
			"title" => "Select custom area"
		)
	),
	"Draw_rectangle" => array(
		"content" => array(
			"icon" => "icon-vector-rectangle",
			"text" => ""
		),
		"attributes" => array(
			"onclick" => "$.draw_rectangle();",
			"href" => "javascript:void(0);",
			"class" => "btn",
			"id" => "draw_rectangle_btn",
			"title" => "Select squared area"
		)
	),
	"Draw_circle" => array(
		"content" => array(
			"icon" => "icon-vector-circle",
			"text" => ""
		),
		"attributes" => array(
			"onclick" => "$.draw_circle();",
			"href" => "javascript:void(0);",
			"class" => "btn",
			"id" => "draw_circle_btn",
			"title" => "Select circular area"
		)
	)
);
$menu["menu"]["map_contextmenu"][] = array(
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
$menu["menu"]["map_knob_contextmenu"][] = array(
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
// print_r($menu["menu"]);
// exit();
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
