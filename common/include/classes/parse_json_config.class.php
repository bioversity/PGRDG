<?php
// Parse the menu defined by json object in "common/include/conf/menu.json"
class parse_json_config {
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
		$menu_list = '';
		foreach($the_array as $k => $v) {
			if($k !== "_comment") {
				if(!isset($v["show_on_page"]) || $v["show_on_page"] == $_GET["p"]) {
					$menu_list .= '	<li' . (isset($v["childs"]) ? ' class="btn-group"' : '') . '><a ';
					$menu_list .= implode(" ", $this->extract_attributes($v)) . '><span class="' . $v["content"]["icon"] . '"></span>&nbsp;' . $v["content"]["text"] . (isset($v["childs"]) ? ' <span class="caret"></span>' : '') . '</a>';
					if(isset($v["childs"])) {
						$menu_list .= '<ul class="dropdown-menu" role="menu">' . $this->build_menu($v, "childs") . '</ul>';
					}
					$menu_list .= '</li>' . "\n";
					if(isset($v["divider"])) {
						$menu_list .= '	<li class="' . $v["divider"] . '"></li>' . "\n";
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
	public function menu($menu_position, $ul_class = array()) {
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
}
// header("Content-type: text/plain");
// $site_config = new parse_json_config();
// print $site_config->menu("top", "list-unstyled text-center");
// exit();
?>
