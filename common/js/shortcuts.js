/**
* Shortcut functions
*
* Here you can define available shortcuts for the interface.
* Note that browsers may confuse keypressing, so it's better redefine an if statement with key character code pressing.
* You can find all available key character code here: common/js/plugins/jquery.hotkeys/test-static-01.html
*
* @author Alessandro Gubitosi <gubi.ale@iod.io>
* @license http://www.gnu.org/licenses/gpl-3.0.html GNU General Public License, version 3
* @link https://github.com/bioversity/PGRDG/
*
*/


/*=======================================================================================
*	KEYBOARD SHORTCUTS
*======================================================================================*/

/**
* Enable shortcuts
*
* You can see all available characters key here:
* http://htmlpreview.github.io/?https://github.com/jeresig/jquery.hotkeys/master/test-static-05.html
*
* Note: consider that some browser can confuse keyboard layout.
*/
$.shortcuts = function() {
        /**
         * ALT + 0
         */
        $("body, #find_location input").bind("keydown", "alt+0", function(e) {
                if(current_path == "Map") {
                        e.preventDefault();
                        $.center_map_on("World");
                        $("#selected_zone").text(i18n[lang].interface.world).fadeIn(300);
                }
                return false;
	/**
	 * ALT + 1
	 */
        }).bind("keydown", "alt+1", function(e) {
                if(current_path == "Map") {
                        e.preventDefault();
                        $.center_map_on("Africa");
                        $("#selected_zone").text(i18n[lang].interface.africa).fadeIn(300);
                }
                return false;
	/**
	 * ALT + 2
	 */
        }).bind("keydown", "alt+2", function(e) {
                if(current_path == "Map") {
                        e.preventDefault();
                        $.center_map_on("Antarctica");
                        $("#selected_zone").text(i18n[lang].interface.anctartica).fadeIn(300);
                }
                return false;
	/**
	 * ALT + 3
	 */
        }).bind("keydown", "alt+3", function(e) {
                if(current_path == "Map") {
                        e.preventDefault();
                        $.center_map_on("Asia");
                        $("#selected_zone").text(i18n[lang].interface.asia).fadeIn(300);
                }
                return false;
	/**
	 * ALT + 4
	 */
        }).bind("keydown", "alt+4", function(e) {
                if(current_path == "Map") {
                        e.preventDefault();
                        $.center_map_on("Europe");
                        $("#selected_zone").text(i18n[lang].interface.europe).fadeIn(300);
                }
                return false;
	/**
	 * ALT + 5
	 */
        }).bind("keydown", "alt+5", function(e) {
                if(current_path == "Map") {
                        e.preventDefault();
                        $.center_map_on("North America");
                        $("#selected_zone").text(i18n[lang].interface.north_america).fadeIn(300);
                }
                return false;
	/**
	 * ALT + 6
	 */
        }).bind("keydown", "alt+6", function(e) {
                if(current_path == "Map") {
                        e.preventDefault();
                        $.center_map_on("South America");
                        $("#selected_zone").text(i18n[lang].interface.south_america).fadeIn(300);
                }
                return false;
	/**
	 * ALT + 7
	 */
        }).bind("keydown", "alt+7", function(e) {
                if(current_path == "Map") {
                        e.preventDefault();
                        $.center_map_on("Oceania");
                        $("#selected_zone").text(i18n[lang].interface.oceania).fadeIn(300);
                }
                return false;
	/**
	 * ALT + 8
	 */
        }).bind("keydown", "alt+8", function(e) {
                if(current_path == "Map") {
                        e.preventDefault();
                        // Unset
                }
                return false;
	/**
	 * ALT + 9
	 */
        }).bind("keydown", "alt+9", function(e) {
                if(current_path == "Map") {
                        e.preventDefault();
                	/**
                	 * Fix for ALT+I and F1 confusion
                	 */
                        if(e.keyCode == 105){
                                return false;
                        } else {
                                return false;
                        }
                }
                return false;
	/**
	 * ALT + i and ALT + F1
	 */
        }).bind("keydown", "alt+i F1", function(e) {
                if(current_path == "Map") {
                        e.preventDefault();
                        if(e.keyCode != 105){
                                $.show_help();
                        }
                }
                return false;
	/**
	 * ALT + F
	 */
        }).bind("keydown", "alt+f", function(e) {
                if(current_path == "Map") {
                        e.preventDefault();
                	/**
                	 * Fix for ALT+6 confusion
                	 */
                        if(e.keyCode == 70){
                                if(!$("#pgrdg_map").hasClass("locked")) {
                                        $.sub_toolbox("find_location");
                                }
                                return false;
                        } else {
                                return false;
                        }
                }
                return false;
	/**
	 * ALT + L
	 */
        }).bind("keydown", "alt+l", function(e) {
                if(current_path == "Map") {
                        e.preventDefault();
                        $.toggle_lock_view();
                }
                return false;
	/**
	 * ALT + T
	 */
        }).bind("keydown", "alt+t", function(e) {
                if(current_path == "Map") {
                        e.preventDefault();
                        if(!$("#pgrdg_map").hasClass("locked")) {
                                $.sub_toolbox("change_map");
                        }
                }
                return false;
	/**
	 * ALT + "+" (plus key)
	 */
        }).bind("keydown", "alt++", function(e) {
                if(current_path == "Map") {
                        e.preventDefault();
                        if(!$("#pgrdg_map").hasClass("locked")) {
                                $("#selected_zone").text(i18n[lang].interface.zoom_in).fadeIn(300);
                                $.increase_zoom();
                        }
                }
                return false;
	/**
	 * ALT + "-" (minus key)
	 */
        }).bind("keydown", "alt+-", function(e) {
                if(current_path == "Map") {
                        e.preventDefault();
                        if(!$("#pgrdg_map").hasClass("locked")) {
                                $("#selected_zone").text(i18n[lang].interface.zoom_out).fadeIn(300);
                                $.decrease_zoom();
                        }
                }
                return false;
	/**
	 * ALT + (left arrow key)
	 */
        }).bind("keydown", "alt+left", function(e) {
                $.left_panel("close");
                return false;
	/**
	 * ALT + (right arrow key)
	 */
        }).bind("keydown", "alt+right", function(e) {
                $.left_panel("open");
                return false;
	/**
	 * ESC
	 */
        }).bind("keydown", "esc", function(e) {
                e.preventDefault();
                //$.left_panel("close");
                if(current_path == "Map") {
                        //$.stop_measurements();
                        $.hide_guides();
                        $.sub_toolbox("close");
                }
                return false;
	/**
	 * ALT [keydown]
	 */
        }).bind("keydown", "alt", function(e) {
                if(current_path == "Map") {
                        e.preventDefault();
                        /*
                        $("#information_zone").html('<table><tr><th><tt>ALT<small style="font-weight: normal;">+</small>F</tt></th><td>Search a location inside a map</td></tr><tr><th><tt>ALT<small style="font-weight: normal;">+</small>L</tt></th><td>Lock/unlock map navigation</td></tr><tr><th><tt>ALT<small style="font-weight: normal;">+</small>T</tt></th><td>Open/close map background layer preferences</td></tr><tr><th><br /><tt>ALT<small style="font-weight: normal;">+</small>+</tt></th><td><br />Zoom in</td></tr><tr><th><tt>ALT<small style="font-weight: normal;">+</small>-</tt></th><td>Zoom out</td></tr><tr><th><br /><tt>ALT<small style="font-weight: normal;">+</small>0</tt></th><td><br />Entire world</td></tr><tr><th><tt>ALT<small style="font-weight: normal;">+</small>1</tt></th><td>Africa</td></tr><tr><th><tt>ALT<small style="font-weight: normal;">+</small>2</tt></th><td>Antarctica</td></tr><tr><th><tt>ALT<small style="font-weight: normal;">+</small>3</tt></th><td>Asia</td></tr><tr><th><tt>ALT<small style="font-weight: normal;">+</small>4</tt></th><td>Europe</td></tr><tr><th><tt>ALT<small style="font-weight: normal;">+</small>5</tt></th><td>North America</td></tr><tr><th><tt>ALT<small style="font-weight: normal;">+</small>6</tt></th><td>Oceania</td></tr><tr><th><tt>ALT<small style="font-weight: normal;">+</small>7</tt></th><td>South America</td></tr><tr><th><tt>ALT<small style="font-weight: normal;">+</small>9</tt></th><td>User position</td></tr></table>');
                        $("#selected_zone").delay(1000).fadeOut(600, function() { $(this).text(""); });
                        */
                }
	/**
	 * ALT [keyup]
	 */
        }).bind("keyup", "alt", function(e) {
                if(current_path == "Map") {
                        e.preventDefault();
                        /*
                        $("#information_zone").html("");
                        if(!$("#pgrdg_map").hasClass("locked")) {
                                $("#selected_zone").delay(1000).fadeOut(600, function() { $(this).text(""); });
                        }
                        */
                }
        });
	/**
	 * ENTER (when find_location input is focused)
	 */
        $("#find_location input").bind("keydown", "return", function() {
                //$.sub_toolbox("find_location");
                $(this).search_location($(this).val());
        });
};
