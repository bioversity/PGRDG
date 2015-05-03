/**
* Configs functions
*
* @author Alessandro Gubitosi <gubi.ale@iod.io>
* @license http://www.gnu.org/licenses/gpl-3.0.html GNU General Public License, version 3
* @link https://github.com/bioversity/PGRDG/
*/

/*=======================================================================================
*	CONFIGS FUNCTIONS
*======================================================================================*/

/**
 * Save a config file
 * @param  {[type]} config [description]
 * @return {[type]}        [description]
 */
$.save_data = function(config) {
        var k = {};
        k[kAPI_REQUEST_USER] = $.get_current_user_id();
        k[kAPI_PARAM_OBJECT] = config;
        $.ask_cyphered_to_service({
                data: k,
                type: "save_config",
                force_renew: true
        }, function(response) {
                console.log(response);
        });
};

/**
 * GET a config file
 * @param  {[type]} config [description]
 * @return {[type]}        [description]
 */
$.get_data = function(config, id) {
        var k = {};
        k[kAPI_REQUEST_USER] = $.get_current_user_id();
        k[kAPI_PARAM_OBJECT] = config;
        $.ask_cyphered_to_service({
                data: k,
                type: "get_config",
                force_renew: true
        }, function(response) {
                console.log(response);
        });
};
