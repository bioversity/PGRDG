<?php

// Parse the menu defined by json object in "common/include/conf/menu.json"
class parse_json_config {
	function __construct($config = "") {
		if(trim($config) == "") {
			$config = "common/include/conf/menu.json";
		}
		$this->json_conf = json_decode(file_get_contents($config), true);
	}
	private function walk($array, $key) {
		if( !is_array( $array)) {
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

	public function menu($menu_position, $ul_class = "") {
		$menu_list = '<ul' . (trim($ul_class) !== "" ? ' class="' . $ul_class . '"' : '') . '>';
		foreach($this->walk($this->json_conf, $menu_position) as $obj => $map_toolbox) {
			if(!is_array($obj) && $obj == "divider") {
				$menu_list .= '<li class="divider"></li>' . "\n";
			} else {
				if($obj !== "_comment") {
					$menu_list .= '<li><a ';
					$attributes = array();
					foreach($map_toolbox as $mo_key => $mo_val) {
						if($mo_key == "attributes") {
							foreach($mo_val as $attr_key => $attr_val) {
								$attributes[] = $attr_key . '="' . $attr_val . '"';
							}
						}
					}
					$menu_list .= implode(" ", $attributes) . '><span class="fa ' . $map_toolbox["content"]["icon"] . '"></span>&nbsp;' . $map_toolbox["content"]["text"] . '</a></li>' . "\n";
				}
			}
		}
		$menu_list .= "</ul>";
		return $menu_list;
	}
}