<?php
// Parse the menu defined by json object in "common/include/conf/menu.json"
class Parse_json {
	function __construct($config = "") {
		if(trim($config) == "") {
			// Uncomment if you want to remote json menu
			// $config = "common/include/conf/menu.json";
			// include("../conf/menu.php");
			include("common/include/conf/menu.php");
			$config = $menu;
		}
		// Same as comment before
		//$this->json_conf = json_decode(file_get_contents($config), true);
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
	private function build_menu($menu, $menu_position, $num = null) {
		if($num === null) {
			$the_array = $menu[$menu_position];
		} else {
			$the_array = $menu[$menu_position][$num];
		}
		// print_r($the_array);
		// exit();
		$menu_list = '';
		foreach($the_array as $k => $v) {
			if($k !== "_comment") {
				if(!isset($v["show_on_page"]) || $v["show_on_page"] == $_GET["p"]) {
					$menu_list .= '	<li' . (isset($v["childs"]) ? ($menu_position == "admin" ? (isset($v["content"]["class"]) ? ' class="' . $v["content"]["class"] . '"' : "") : ' class="btn-group"') : '') . '><a ';
						$menu_list_icon = '<span class="' . $v["content"]["icon"] . ($menu_position == "admin" ? " fa-lg fa-fw": "") . '"></span>';
						$menu_list_text = ($menu_position == "admin" ? '<span class="menu-item-parent">' . $v["content"]["text"] . '</span>' : $v["content"]["text"]);
						$menu_list_text .= (isset($v["childs"]) ? ($menu_position == "admin" ? '' : ' <span class="caret"></span>') : '');
					$menu_list .= implode(" ", $this->extract_attributes($v)) . '>' . $menu_list_icon . '&nbsp;' . $menu_list_text . '</a>';
					if(isset($v["childs"])) {
						$menu_list .= '<ul class="' . ($menu_position == "admin" ? '' : 'dropdown-menu') . '" ' . (isset($v["content"]["class"]) ? 'style="display:block;"' : "") . 'role="menu">' . $this->build_menu($v, "childs") . '</ul>';
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
			}
		}
		return $menu_list;
	}
	private function extract_attributes($map_toolbox) {
		$attributes = array();
		foreach($map_toolbox as $mo_key => $mo_val) {
			if($mo_key !== "childs") {
				if($mo_key == "attributes") {
					foreach($mo_val as $attr_key => $attr_val) {
						$attributes[] = $attr_key . '="' . $attr_val . '"';
					}
				}
			} else {
				//print_r($this->walk($map_toolbox, $mo_key));
				$attributes[] = 'class="dropdown-toggle" data-toggle="dropdown"';
			}
		}
		return $attributes;
	}

	/**
	* Search recursive a value in an array and returns its parent key
	* @param  array  $array        The target array
	* @param  string $key          Which key must have the searched value
	* @param  string $value        The value to search
	* @return object               An object with the entire part of array
	*/
	private function search($array, $key, $value) {
		$results = array();
		if (is_array($array)){
			if (isset($array[$key]) && $array[$key] == $value)
			$results[] = $array;

			foreach ($array as $subarray)
			$results = array_merge($results, $this->search($subarray, $key, $value));
		}
		return $results;
	}

/* -------------------------------------------------------------------------- */
/* PUBLIC FUNCTIONS
/* -------------------------------------------------------------------------- */

	public function menu($menu_position, $ul_class = array()) {
			// header("Content-type: text/plain");
			// print_r(json_encode($this->json_conf));
			// exit();
		$menu_list = "";
		foreach($this->json_conf["menu"][$menu_position] as $i => $j) {
			if(!is_numeric($i)) {
				$num = 0;
			} else {
				$num = $i;
			}
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
			$menu_list .= $this->build_menu($this->json_conf["menu"], $menu_position, $num);
			$menu_list .= "</ul>\n";
		}
		/*
		foreach($this->walk($this->json_conf, $menu_position) as $obj => $map_toolbox) {
			if($obj !== "_comment") {
				$menu_list .= '	<li' . (isset($map_toolbox["childs"]) ? ' class="btn-group"' : '') . '><a ';
				$menu_list .= implode(" ", $this->extract_attributes($map_toolbox)) . '><span class="' . $map_toolbox["content"]["icon"] . '"></span>&nbsp;' . $map_toolbox["content"]["text"] . (isset($map_toolbox["childs"]) ? ' <span class="caret"></span>' : '') . '</a>' . (isset($map_toolbox["childs"]) ? '<ul class="dropdown-menu" role="menu"></ul>' : '') . '</li>' . "\n";
				if(isset($map_toolbox["divider"])) {
					$menu_list .= '	<li class="' . $divider . '"></li>' . "\n";
				}
			}
		}
		*/
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

	public function parse_js_config($variable) {
		return json_decode(trim(str_replace(array('var ' . $variable . ' = {', '};'), array('{', '}'), file_get_contents($this->json_conf))), 1);
	}

	/**
	* Parse
	* @param  [type] $pp [description]
	* @return [type]     [description]
	*/
	public function parse_page_config($variable) {
		$pp = json_decode(trim(file_get_contents($this->json_conf)), 1);
		// print_r($pp);
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
			$page->current = "";
		}
		if(is_array($pp)) {
		// print_r($variable);
		// print_r($pp[$variable]);
		// print_r($this->search($pp, "address", $page->current));
		// exit();
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
			// print_r($pages_list);
			// exit();
			if(strlen($page->current) == 0 || array_key_exists($page->current, $pages_list)) {
				$page->exists = true;
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
		// print_r($page);
		return $page;
	}

}
// header("Content-type: text/plain");
// $site_config = new Parse_json();
// print $site_config->menu("top", "list-unstyled text-center");
// exit();
?>
