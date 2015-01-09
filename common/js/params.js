/**
* Defined global variables
*
* @author Alessandro Gubitosi <gubi.ale@iod.io>
* @license http://www.gnu.org/licenses/gpl-3.0.html GNU General Public License, version 3
* @link https://github.com/bioversity/PGRDG/
*/

/*=======================================================================================
*	COMMON FUNCTIONS
*======================================================================================*/

/**
* PHP ported
*/
        /**
        * Convert all applicable characters to HTML entities
        *
        * This function is a porting of php's htmlentities()
        *
        * @param  {string} 	The html string to encode
        * @return {string}         The string encoded
        */
        $.html_encode = function(str){ return $("<div/>").text(str).html(); };

        /**
        * Convert all HTML entities to their applicable characters
        *
        * This function is a porting of php's html_entity_decode()
        *
        * @param  {string} 	The htmlentity string to decode
        * @return {string}         The string decoded
        */
        $.html_decode = function(str){ return $("<div/>").html(str).text(); };

        /**
        * URL-encode according to RFC 3986
        *
        * This function is a porting of php's rawurlencode()
        *
        * @param  {string} 	The string to encode
        * @return {string}         The string encoded
        */
        $.rawurlencode = function(str) { str = (str+'').toString(); return encodeURIComponent(str).replace(/!/g, '%21').replace(/'/g, '%27').replace(/\(/g, '%28').replace(/\)/g, '%29').replace(/\*/g, '%2A'); };

        /**
        * Decode URL-encoded strings
        *
        * This function is a porting of php's rawurldecode()
        *
        * @param  {string} 	The string to decode
        * @return {string}         The string decoded
        */
        $.rawurldecode = function(str) { return decodeURIComponent((str + '').replace(/%(?![\da-f]{2})/gi, function () { return '%25'; })); };

        /**
        * Encodes data with MIME base64
        *
        * This function is a porting of php's base64_encode()
        *
        * @param  {string} 	The string to encode
        * @return {string}         The string encoded
        */
        $.utf8_to_b64 = function(str) { return window.btoa(unescape(encodeURIComponent(str))); };

        /**
        * Decodes data encoded with MIME base64
        *
        * This function is a porting of php's base64_decode()
        *
        * @param  {string} 	The string to decode
        * @return {string}         The string decoded
        */
        $.b64_to_utf8 = function(str) { return decodeURIComponent(escape(window.atob(str))); };

        /**
        * Make a string's first character uppercase
        *
        * This function is a porting of php's ucfirst()
        *
        * @param  {string}      The string to manipulate
        * @return {string}      Ucase converted string
        */
        $.ucfirst = function(str) { str += ""; var f = str.charAt(0).toUpperCase(); return f + str.substr(1); };

        /**
         * Repeat a string for 'n' times
         *
         * @param  {string}     The string to repeat
         * @return {string}     Repeated string
         */
        $.str_repeat = function(string, n) { return new Array(parseInt(num) + 1).join(string); };

        /**
         * Removes duplicate values from an array
         *
         * @param  {array}      The array to parse
         * @return {array}      The filtered array
         */
        $.array_unique = function(array){ return array.filter(function(el, index, arr) { return index == arr.indexOf(el); }); };

/**
 * Clean an array from empty fields
 * @param  {array}      The array to clean
 * @return {array}      The array cleaned
 */
$.array_clean = function(array) { return array.filter(function(v){ return v !== ""; }); };

/**
* Return if browser has cookie allowed
* @return {bool}   Browser cookie permission
*/
$.browser_cookie_status = function() { var cookieEnabled = (navigator.cookieEnabled) ? true : false; if (typeof navigator.cookieEnabled == "undefined" && !cookieEnabled) { document.cookie = "testcookie"; cookieEnabled = (document.cookie.indexOf("testcookie") != -1) ? true : false; } return (cookieEnabled); };


/**
* Generates a random id
* @return {string} Random uuid
*/
$.makeid = function() { var text = "", possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"; for(var i = 0; i <= 16; i++) { text += possible.charAt(Math.floor(Math.random() * possible.length)); } return text; };

/**
* Generates a random uuid
* @return {string} Random uuid
*/
$.uuid = function() { return Math.round(new Date().getTime() + (Math.random() * 100)); };

/**
* Like $.serializeArray(), serialize a form as object
* @return {object}     Forms data
*/
$.fn.serializeObject = function() { var o = {}; var a = this.serializeArray(); $.each(a, function() { if (o[this.name] !== undefined) { if (!o[this.name].push) { o[this.name] = [o[this.name]]; } o[this.name].push(this.value || ''); } else { o[this.name] = this.value || ''; }}); return o; };

/**
* Determine the length of an object
* @param  {object}  The object to analize
* @return {int}     The object length
*/
$.obj_len = function(obj) { var count = 0, i; for(i in obj) { if (obj.hasOwnProperty(i)) { count++; }} return count; };

/**
 * Detect if given item is an object
 * @param  {void}  item    The item to analyze
 * @return {Boolean}
 */
$.is_obj = function(item) { return ($.type(item) == "object" ? true : false); };

/**
 * An utility function to find all URLs - FTP, HTTP(S) and Email - in a text string
 * and return them in an html link.
 * Taken from http://stackoverflow.com/a/3890175
 *
 * @param text the text to be searched.
 * @return an array of URLs.
 */
$.linkify = function(inputText) {
        if(inputText !== undefined) {
                if($.type(inputText) == "array") {
                        inputText = inputText.join(", ");
                }
                var replacedText, replacePattern1, replacePattern2, replacePattern3;

                //URLs starting with http://, https://, or ftp://
                replacePattern1 = /(\b(https?|ftp):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/gim;
                if(replacePattern1 !== undefined) {
                        replacedText = inputText.replace(replacePattern1, '<a href="$1" target="_blank">$1</a> <sup class="fa fa-external-link"></sup>');
                } else {
                        replacedText = inputText;
                }

                //URLs starting with "www." (without // before it, or it'd re-link the ones done above).
                replacePattern2 = /(^|[^\/])(www\.[\S]+(\b|$))/gim;
                if(replacePattern2 !== undefined) {
                        replacedText = replacedText.replace(replacePattern2, '$1 <a href="http://$2" target="_blank">$2</a> <sup class="fa fa-external-link"></sup>');
                } else {
                        replacedText = inputText;
                }

                //Change email addresses to mailto:: links.
                replacePattern3 = /(([a-zA-Z0-9\-\_\.])+@[a-zA-Z\_]+?(\.[a-zA-Z]{2,6})+)/gim;
                if(replacePattern3 !== undefined) {
                        replacedText = replacedText.replace(replacePattern3, '<a href="mailto:$1">$1</a> <sup class="fa fa-envelope-o"></sup>');
                } else {
                        replacedText = inputText;
                }

                return replacedText;
        }
};

/**
 * Detect the type of value for table sorting purposes
 */
$.detect_type = function(value) {
        if($.isNumeric(value)) {
                if(value % 1 === 0){
                        return "int";
                } else{
                        return "float";
                }
        } else if(Date.parse(value)) {
                return "date";
        } else {
                return "string-ins";
        }
};


/**
 * Detect the date type and returns in readable format
 * @param  {string} date The string to parse
 * @return {string}      The date in readable format
 */
$.right_date = function(date) {
        $.addZero = function(i) {
                if (i < 10) {
                        i = "0" + i;
                }
                return i;
        }
        $.datepicker.regional[lang]

        // Is year
        if(date.length == 4) {
                return date;
        } else if(date.length == 6) {
                return $.datepicker.formatDate("MM, yy", date);
        } else if(date.length == 8) {
                var d = date.split("");
                return $.datepicker.formatDate("MM dd, yy", new Date(d[0]+d[1]+d[2]+d[3]+ "/" + d[4]+d[5] + "/" + d[6]+d[7]));
        } else {
                var dd = new Date(date),
                time = $.addZero(dd.getHours()) + ":" + $.addZero(dd.getMinutes()) + ":" + $.addZero(dd.getSeconds());
                return $.datepicker.formatDate("MM dd, yy", new Date(date)) + " " +  time;
        }
}

/**
 * Parse query string paramaters into an object.
 * taken from https://gist.github.com/kares/956897
 *
 * @param {string} query
 */
$.parse_params = function(query) {
        var re = /([^&=]+)=?([^&]*)/g,
        decodeRE = /\+/g, // Regex for replacing addition symbol with a space
        decode = function(str) {
                return decodeURIComponent(str.replace(decodeRE, " "));
        },
        params = {},
        e;
        while(e = re.exec(query)) {
                var k = decode(e[1]),
                v = decode(e[2]);
                if (k.substring(k.length - 2) === '[]') {
                        k = k.substring(0, k.length - 2);
                        (params[k] || (params[k] = [])).push(v);
                } else {
                        params[k] = v;
                }
        }
        return params;
};

/**
 * Detect touch device
 * @return {Boolean}
 */
$.is_touch_device = function() { return "ontouchstart" in window || "onmsgesturechange" in window; };

/**
* Encrypt asynchronous requests with jCryption
*
* Usage: call $.cryptAjax instead of simple $.ajax function
*
* @param {string} url     The request target
* @param {object} options Request params
*/
$.cryptAjax = function(url, options) {
        if(!config.site.developer_mode) {
                $.jCryption.authenticate(password, "common/include/funcs/_ajax/_decrypt.php?getPublicKey=true", "common/include/funcs/_ajax/_decrypt.php?handshake=true", function(AESKey) {
                        auth = true;
                        $.ajax(url, options);
                }, function(fail) {
                        console.warn("error");
                });
        } else {
                $.ajax(url, options);
        }
};

/**
* Display the coffee message
*/
$.service_coffee = function(options) {
        options = $.extend({
                message: "The Service is temporarily unavailable.<br />Try again later...",
                class: "service_coffee",
                title: "Taking coffee...",
                titleClass: "text-warning",
                icon: "fa-coffee"
        }, options);

        if($("#apprise.service_coffee").length === 0) {
                apprise(options.message, {
                        class: options.class,
                        title: options.title,
                        titleClass: options.titleClass,
                        icon: options.icon,
                        progress: true,
                        allowExit: false
                });
        } else {
                $("#apprise.service_coffee").modal("show");
        }
};

/**
* Load site configurations
*/
$.site_conf = function(callback) {
        if(config.site.developer_mode) {
                //console.log("Check maintenance status...");
        }
        $.cryptAjax({
                url: "common/include/conf/interface/maintenance.json",
                dataType: "json",
                success: function(maintenance) {
                        if(maintenance.status) {
                                $.service_coffee({
                                        titleClass: "text-danger",
                                        icon: "fa-wrench",
                                        title: i18n[lang].maintenance.title,
                                        message: i18n[lang].maintenance.message
                                });
                                setTimeout(function() {
                                        $.site_conf(callback);
                                }, maintenance.check_time.true_state);

                                load = false;
                                return false;
                        } else {
                                if($("#apprise.service_coffee").length > 0) {
                                        $("#apprise.service_coffee").modal("hide");
                                }
                                if (typeof callback == "function") {
                                        if(!load) {
                                                load = true;
                                                callback.call(this);
                                        }
                                }
                                setTimeout(function() {
                                        $.site_conf(callback);
                                }, maintenance.check_time.false_state);
                        }
                },
                error: function(maintenance) {
                        setTimeout(function() {
                                $.site_conf(callback);
                        }, maintenance.check_time.true_state);

                        load = false;
                        return false;
                }
        });
};


/*=======================================================================================
*	GLOBAL VARIABLES
*======================================================================================*/
// System
//
var system_constants,
storage = $.localStorage,
lang = (($.cookie("lang") !== undefined && $.cookie("lang") !== null && $.cookie("lang") !== "") ? $.cookie("lang") : config.site.default_language),
operators = [],
password = $.makeid(),
load = false, // Default status for continue to load javascript, do not edit
auth = false, // Default status for jcryption authentication, do not edit
url = $.url().attr(),
url_paths = url.path.split("/"),
query = $.parse_params(url.query),
current_path = url_paths[url_paths.length - 1],
is_error_page = $("body").attr("data-error");

$.site_conf(function() {
        if(!load) {
                return false;
        } else {
                if(!$.browser_cookie_status()) {
                        apprise('Your browser has cookies disabled.<br />Please, activate your cookies to let the system works properly, and then <a href="javascript:void(0);" onclick="location.reload();">reload the page</a>.', {title: "Enable yor cookie", icon: "warning", progress: true, allowExit: false});
                } else {
                        // Use bootstrap apprise instead javascript's alert
                        window.alert = function(string, args, callback) {
                                if(args === undefined) {
                                        args = [];
                                        args.title = "Warning";
                                        args.icon = "warning";
                                }
                                return apprise(string, args, callback);
                        };
                }
        }
});
