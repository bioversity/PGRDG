<?php
// header("Content-type: text/plain");
/**
* JSON Parser
*
* Parse the menu defined by json object in "common/include/conf/menu.json"
*
* @author Alessandro Gubitosi <gubi.ale@iod.io>
* @version 1.0 13/05/2014
*/

if(!defined("SYSTEM_ROOT")) {
        define("SYSTEM_ROOT", $_SERVER["DOCUMENT_ROOT"] . DIRECTORY_SEPARATOR);
}
if(!defined("INCLUDE_DIR")) {
        define("INCLUDE_DIR", SYSTEM_ROOT . "common/include/");
}

class Parse_json {
	function __construct($config = "") {
		if(trim($config) == "") {
			// include("common/include/conf/menu.php");
			// $config = $menu;
			$config = json_decode(file_get_contents(INCLUDE_DIR . "conf/__menu.json"), 1);
		} else {
                        if(file_exists($config)) {
                                $ext = pathinfo($config, PATHINFO_EXTENSION);
                                if(trim($ext) == "php") {
                                        ob_start();
                                        include($config);
                                        $json = ob_get_clean();
                                        $config = json_decode($json, 1);
                                }
                        }
                }
                // print_r($config);
		// Same as comment before
		$this->json_conf = $config;
	}
/* -------------------------------------------------------------------------- */
/* PRIVATE FUNCTIONS
/* -------------------------------------------------------------------------- */
	private function walk($array, $key) {
		if(!is_array($array)) {
			return false;
		}
		foreach ($array as $k => $v) {
			if($k == $key && is_array($v)){
				return $v;
			}
			$data = $this->walk($v, $key);
			if($data != false){
				return $data;
			}
		}
		return false;
	}

        /**
         * Build the menu html
         * @param  array                        $menu                           The object with all menu items
         * @param  string                       $menu_position                  The section of the interested part of menu
         * @param  string                       $num                            The item object key wich contains the menu data
         * @return string                                                       The builded html menu
         */
        private function build_menu($menu, $menu_position, $num = null) {
		if($num === null || $num === 0) {
			$the_array = $menu[$menu_position];
		} else {
			$the_array = $menu[$menu_position][$num];
		}
		$menu_list = '';
		if(!isset($the_array["show_on_page"]) || $the_array["show_on_page"] == $_GET["p"]) {
			$menu_list .= '	<li' . (isset($the_array["childs"]) ? ($menu_position == "admin" ? (isset($the_array["content"]["class"]) ? ' class="' . $the_array["content"]["class"] . '"' : "") : ' class="btn-group"') : '') . '><a ';
				$menu_list_icon = '<span class="' . $the_array["content"]["icon"] . ($menu_position == "admin" ? " fa-lg fa-fw": "") . '"></span>';
				$menu_list_text = ($menu_position == "admin" ? '<span class="menu-item-parent">' . $the_array["content"]["text"] . '</span>' : $the_array["content"]["text"]);
				$menu_list_text .= (isset($the_array["childs"]) ? ($menu_position == "admin" ? '' : ' <span class="caret"></span>') : '');
			$menu_list .= implode(" ", $this->build_html_attributes($the_array, ($menu_position == "admin" ? true : false))) . '>' . $menu_list_icon . '&nbsp;' . $menu_list_text . '</a>';
			if(isset($the_array["childs"])) {
                                $menu_list .= '<ul class="' . ($menu_position == "admin" ? '' : 'dropdown-menu') . '" ' . (isset($the_array["content"]["class"]) ? 'style="display:block;"' : "") . 'role="menu">';
                                foreach($the_array["childs"] as $ck => $cv) {
                                        $menu_list .= $this->build_menu($the_array, "childs", $ck);
                                }
                                $menu_list .= '</ul>';
			}
			$menu_list .= '</li>' . "\n";
			if(isset($v["divider"])) {
				if($menu_position == "admin") {
					$menu_list .= '	<li class="nav-divider"></li>' . "\n";
				} else {
					$menu_list .= '	<li class="' . $v["divider"] . '"></li>' . "\n";
				}
			}
		}

		return $menu_list;
	}

        /**
         * Get attributes from an object and create the corresponding html structure
         * @param  array                        $object                         The array of attributes
         * @param  bool                         $strip_btn_class                Remove "btn and "btn-link" from values (useful for certain menus)
         * @return array                                                        An array with html attributes
         */
        private function build_html_attributes($object, $strip_btn_class) {
		$attributes = array();
		foreach($object as $mo_key => $mo_val) {
			if($mo_key !== "childs") {
				if($mo_key == "attributes") {
					foreach($mo_val as $attr_key => $attr_val) {
                                                if($strip_btn_class) {
                                                        $attr_val = str_replace(array("btn", "btn-link"), "", $attr_val);
                                                }
						$attributes[] = $attr_key . '="' . $attr_val . '"';
					}
				}
			} else {
				$attributes[] = 'class="dropdown-toggle" data-toggle="dropdown"';
			}
		}
		return $attributes;
	}

	/**
	* Search recursive a value in an array and returns its parent key
	* @param  array                        $array                           The target array
	* @param  string                       $key                             Which key must have the searched value
	* @param  string                       $value                           The value to search
	* @return object                                                        An object with the entire part of array
	*/
	private function search($array, $key, $value) {
		$results = array();
		if (is_array($array)){
			if (isset($array[$key]) && $array[$key] == $value) {
                                $results[] = $array;
                        }

			foreach ($array as $k => $subarray) {
                                $results = array_merge($results, $this->search($subarray, $key, $value));
                        }
                // print_r($results);
		}
                // exit();
                return $results;
	}

/* -------------------------------------------------------------------------- */
/* PUBLIC FUNCTIONS
/* -------------------------------------------------------------------------- */

        /**
         * Create the menu
         * @param  string                       $menu_position                  The section of the interested part of menu
         * @param  array                        $ul_class                       An array with html ul classes
         * @return string                                                       The generated menu
         */
	public function menu($menu_position, $ul_class = array()) {
		$menu_list = "";
		$menu_list .= '<ul';
		if(!is_array($ul_class)) {
			$menu_list .= (trim($ul_class) !== "" ? ' class="' . $ul_class . '"' : '');
		} else {
			foreach($ul_class as $k => $v) {
				$menu_list .= " " . $k . '="' . $v . '"';
			}
		}
		if($menu_position == "admin") {
			$menu_list .= ' class="nav"';
		}
		$menu_list .=  ">\n";
		foreach($this->json_conf["menu"][$menu_position] as $i => $j) {
			if(!is_numeric($i)) {
				$num = 0;
			} else {
				$num = $i;
			}
			$menu_list .= $this->build_menu($this->json_conf["menu"], $menu_position, $i);
		}
		$menu_list .= "</ul>\n";
		return $menu_list;
	}


	public function contextmenu($menu_position, $ul_class = array()) {
		$menu_list = '<ul';
		if(!is_array($ul_class)) {
			$menu_list .= (trim($ul_class) !== "" ? ' class="' . $ul_class . '"' : '');
		} else {
			foreach($ul_class as $k => $v) {
				$menu_list .= " " . $k . '="' . $v . '"';
			}
		}
		$menu_list .=  ">\n";

		foreach($this->walk($this->json_conf, $menu_position) as $obj => $map_toolbox) {
			if($obj !== "_comment") {
				$divider = "";
				$menu_list .= '	<li><span><a ';
				$attributes = array();
				foreach($map_toolbox as $mo_key => $mo_val) {
					if($mo_key == "attributes") {
						foreach($mo_val as $attr_key => $attr_val) {
							$attributes[] = $attr_key . '="' . $attr_val . '"';
						}
					}
					if ($mo_key == "divider") {
						$divider = $mo_val;
					}
				}
				$menu_list .= implode(" ", $attributes) . '><small class="' . $map_toolbox["content"]["icon"] . '"></small></a></span></li>' . "\n";
				if($divider !== "") {
					$menu_list .= '	<li class="' . $divider . '"></li>' . "\n";
				}
			}
		}
		$menu_list .= "</ul>";
		return $menu_list;
	}

        /**
         * Parse a javascript config and return it as a php array
         * @param  string                       $variable                       The javascript variable that contains the config object
         * @return array                                                        The config as a php array
         */
	public function parse_js_config($variable) {
		return json_decode(trim(str_replace(array('var ' . $variable . ' = {', '};'), array('{', '}'), file_get_contents($this->json_conf))), 1);
	}

        /**
         * Parse a json file and return it as a php array
         */
	public function parseJson() {
                if(file_exists($this->json_conf)) {
                        $ext = pathinfo($this->json_conf, PATHINFO_EXTENSION);
                        if(trim($ext) == "php") {
                                ob_start();
                                include($this->json_conf);
                                $json = ob_get_clean();
                        }
                        return json_decode($json, 1);
                } else {
                        return json_decode(file_get_contents($this->json_conf), 1);
                }
	}

	/**
	* Parse the page configuration script
	* @param  string                       $variable                        The variable to load inside the json structure
	* @return object                                                        An object with all pages configuration
	*/
	public function parse_page_config($variable) {
		$pp = json_decode(trim(file_get_contents($this->json_conf)), 1);
		$page = new stdClass();
		$fp = new stdClass();
		$found = false;
		$logged = isset($_COOKIE["l"]);

		if (isset($_GET["p"]) && trim($_GET["p"]) !== "") {
			$page->current = $_GET["p"];
			if (isset($_GET["s"]) && trim($_GET["s"]) !== "") {
				$page->sub_page = $_GET["s"];
				if (isset($_GET["ss"]) && trim($_GET["ss"]) !== "") {
					$page->sub_subpage = $_GET["ss"];
				}
			}
		} else {
			$page->current = "Home";
		}
		if(is_array($pp)) {
			foreach($pp[$variable] as $k => $v) {
				if(count($v["subpages"]) == 1) {
					$pages_list[(($v["address"] !== "") ? $v["address"] : "Home")] = $v;
				} else {
					foreach($v as $kk => $vv) {
						if($kk !== "subpages") {
							$a[$kk] = $v[$kk];
						}
					}
					$pages_list[(($v["address"] !== "") ? $v["address"] : "Home")] = $a;

					foreach($v["subpages"] as $kkk => $vvv) {
						$pages_list[(($vvv["address"] !== "") ? $vvv["address"] : "Home")] = $vvv;
					}
				}
			}
			if(strlen($page->current) == "" || array_key_exists($page->current, $pages_list)) {
				$page->exists = true;
                                // print "ok";
				foreach($this->search($pages_list, "address", $page->current)[0] as $i => $v) {
					$page->$i = $v;
				};
			} else {
				$page->title = str_replace("_", " ", $page->current);
				$page->exists = false;
				$page->title_class = "";
				$page->address = $page->current;
				$page->template = "";
				$page->need_login = false;
				$page->is_main_page = false;
				$page->subpages = "";
			}
			$page->has_error = false;

			if(isset($page->is_system_page) && $page->is_system_page) {
				$page->has_error = false;
			} else {
				if($page->exists) {
					if($page->need_login && !$logged) {
						$page->class[] = "e405";
						$page->has_error = true;
					}
				} else {
					$page->class[] = "e404";
					$page->has_error = true;
				}
			}
		}
		return $page;
	}

}

// require_once("/var/www/pgrdg/common/include/funcs/defines.php");
//
// header("Content-type: text/plain");
// if(isset($_GET["m"]) && $_GET["m"] == "admin") {
//         $admin_menu = new Parse_json(CONF_DIR . "menu_admin.php");
//         print $admin_menu->menu("admin");
// } else {
//         $site_config = new Parse_json();
//         $site_config->menu("top", "lvl1 nav navbar-nav navbar-right");
// }
// $pages_config = new Parse_json(INTERFACE_CONF_DIR . "pages.json");
// $page = $pages_config->parse_page_config("pages");
// print_r($page);
?>
