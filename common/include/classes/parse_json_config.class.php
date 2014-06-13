<?php

// Parse the menu defined by json object in "common/include/conf/menu.json"
class parse_json_config {
	function __construct($config = "") {
		if(trim($config) == "") {
			// Uncomment if you want to remote json menu
			//$config = "common/include/conf/menu.json";
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
	private function build_menu($menu, $menu_position) {
		foreach($this->walk($menu, $menu_position) as $obj => $map_toolbox) {
			if($obj !== "_comment") {
				if(!isset($map_toolbox["show_on_page"]) || $map_toolbox["show_on_page"] == $_GET["p"]) {
					$menu_list .= '	<li' . (isset($map_toolbox["childs"]) ? ' class="btn-group"' : '') . '><a ';
					$menu_list .= implode(" ", $this->extract_attributes($map_toolbox)) . '><span class="' . $map_toolbox["content"]["icon"] . '"></span>&nbsp;' . $map_toolbox["content"]["text"] . (isset($map_toolbox["childs"]) ? ' <span class="caret"></span>' : '') . '</a>' . (isset($map_toolbox["childs"]) ? '<ul class="dropdown-menu" role="menu">' . $this->build_menu($map_toolbox, "childs") . '</ul>' : '') . '</li>' . "\n";
					if(isset($map_toolbox["divider"])) {
						$menu_list .= '	<li class="vertical-divider"></li>' . "\n";
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
				$attributes[] = '"class="btn btn-default dropdown-toggle" data-toggle="dropdown"';
			}
		}
		return $attributes;
	}
	public function menu($menu_position, $ul_class = array()) {
		$menu_list = '<ul';
		if(!is_array($ul_class)) { 
			$menu_list .= (trim($ul_class) !== "" ? ' class="' . $ul_class . '"' : '');
		} else {
			foreach($ul_class as $k => $v) {
				$menu_list .= " " . $k . '="' . $v . '"';
			}
		}
		$menu_list .=  ">\n";
		$menu_list .= $this->build_menu($this->json_conf, $menu_position);
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
		$menu_list .= "</ul>";
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
}