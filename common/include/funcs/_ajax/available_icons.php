<?php
/**
* Available Font Awesome icons
*
* Get all icons from a font-awesome.css file and list in json mode
*
* @author Alessandro Gubitosi <gubi.ale@iod.io>
* @license http://www.gnu.org/licenses/gpl-3.0.html GNU General Public License, version 3
*/


header("Content-type: text/json");

/**
 * Remove items from an array
 * @param  array                $array                  The array to manage
 * @param  void                 $element                An array or a string of the item to remove
 * @return array                                        The cleaned array with resetted keys
 */
function array_delete($array, $element) {
        return (is_array($element)) ? array_values(array_diff($array, $element)) : array_values(array_diff($array, array($element)));
}

$icons_file = "../../../css/font-awesome/css/font-awesome.css";
$parsed_file = file_get_contents($icons_file);
preg_match_all("/fa\-([a-zA-z0-9\-]+[^\:\.\,\s])/", $parsed_file, $matches);
$exclude_icons = array("fa-lg", "fa-2x", "fa-3x", "fa-4x", "fa-5x", "fa-ul", "fa-li", "fa-fw", "fa-border", "fa-pulse", "fa-rotate-90", "fa-rotate-180", "fa-rotate-270", "fa-spin", "fa-flip-horizontal", "fa-flip-vertical", "fa-stack", "fa-stack-1x", "fa-stack-2x", "fa-inverse");
$icons = (object) array("icons" => array_delete($matches[0], $exclude_icons));

print json_encode($icons);
?>
