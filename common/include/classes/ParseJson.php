<?php
// header("Content-type: text/plain");
/**
* JSON Parser
*
* This class parse input from API's page and returns relative content
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
if(!defined("CONF_DIR")) {
        define("CONF_DIR", INCLUDE_DIR . "conf/");
}
class Parse_json {
        function __construct($config = "") {
                if(trim($config) == "") {
			// Uncomment if you want to remote json menu
                        $menu = file_get_contents(CONF_DIR . "__menu.json");
			// $config = json_decode(file_get_contents($config), true);
			// include(CONF_DIR . "menu.php");
			// print_r(json_decode($menu, 1));
			// exit();
			// $config = $menu;
		}
                $this->json_conf = json_decode($menu, 1);
                print_r($this->json_conf);
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
                                // print_r($v);
                                        $menu_list .= '	<li' . (isset($v["childs"]) ? ($menu_position == "admin" ? (isset($v["content"]["class"]) ? ' class="' . $v["content"]["class"] . '"' : "") : ' class="btn-group"') : '') . '><a ';
                                                $menu_list_icon = '<span class="' . $v["content"]["icon"] . ($menu_position == "admin" ? " fa-lg fa-fw": "") . '"></span>';
                                                $menu_list_text = ($menu_position == "admin" ? '<span class="menu-item-parent">' . $v["content"]["text"] . '</span>' : $v["content"]["text"]);
                                                $menu_list_text .= (isset($v["childs"]) ? ($menu_position == "admin" ? '' : ' <span class="caret"></span>') : '');
                                        $menu_list .= implode(" ", $this->extract_attributes($v)) . '>' . $menu_list_icon . '&nbsp;' . $menu_list_text . '</a>';
                                        if(isset($v["childs"])) {
                                                $menu_list .= '<ul class="' . ($menu_position == "admin" ? '' : 'dropdown-menu') . '" ' . (isset($v["content"]["class"]) ? 'style="display:block;"' : "") . 'role="menu">' . $this->build_menu($v, "childs", $num) . '</ul>';
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
                // exit();
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
			// header("Content-type: text/plain");
			// print_r($this->json_conf);
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
                return $menu_list;
        }
}

$menu = new Parse_json();
print $menu->menu("top", "test");
?>
