/**
* Main functions
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
		* @return {[type]}      Ucase converted string
		*/
		$.ucfirst = function(str) { str += ""; var f = str.charAt(0).toUpperCase(); return f + str.substr(1); };

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
	 * An utility function to find all URLs - FTP, HTTP(S) and Email - in a text string
	 * and return them in an html link.
	 * Taken from http://stackoverflow.com/a/3890175
	 *
	 * @param text the text to be searched.
	 * @return an array of URLs.
	 */
	$.linkify = function(inputText) {
		var replacedText, replacePattern1, replacePattern2, replacePattern3;

		//URLs starting with http://, https://, or ftp://
		replacePattern1 = /(\b(https?|ftp):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/gim;
		replacedText = inputText.replace(replacePattern1, '<a href="$1" target="_blank">$1</a>');

		//URLs starting with "www." (without // before it, or it'd re-link the ones done above).
		replacePattern2 = /(^|[^\/])(www\.[\S]+(\b|$))/gim;
		replacedText = replacedText.replace(replacePattern2, '$1<a href="http://$2" target="_blank">$2</a>');

		//Change email addresses to mailto:: links.
		replacePattern3 = /(([a-zA-Z0-9\-\_\.])+@[a-zA-Z\_]+?(\.[a-zA-Z]{2,6})+)/gim;
		replacedText = replacedText.replace(replacePattern3, '<a href="mailto:$1">$1</a>');

		return replacedText;
	};

/*=======================================================================================
*	GLOBAL VARIABLES
*======================================================================================*/
	var lang = "en",
	service_url = "API/?type=service&proxy=",
	system_constants,
	operators = [],
	password = $.makeid(),
	auth = false,
	storage = $.localStorage,
	url = $.url().attr(),
	url_paths = url.path.split("/"),
	current_path = url_paths[url_paths.length - 1],
	developer_mode = false;


/*=======================================================================================
*	MAIN FUNCTIONS
*======================================================================================*/

	/**
	* Encrypt asynchronous requests with jCryption
	*
	* Usage: call $.cryptAjax instead of simple $.ajax function
	*
	* @param {string} url     The request target
	* @param {object} options Request params
	*/
	$.cryptAjax = function(url, options) {
		if(!auth) {
			$.jCryption.authenticate(password, "common/include/funcs/_ajax/_decrypt.php?getPublicKey=true", "common/include/funcs/_ajax/_decrypt.php?handshake=true", function(AESKey) {
				auth = true;
				$.ajax(url, options);
			});
		} else {
			$.ajax(url, options);
		}
	};

	/**
	* Creates and send the request to Service
	* @param  {void}  options  String or object of the request to Service
	* @param  {Function} callback
	*/
	$.ask_to_service = function(options, callback) {
		var opt = $.extend({
			storage_group: "ask",
			loaderType: "external",
			kAPI_REQUEST_OPERATION: "",
			parameters: {
				kAPI_REQUEST_LANGUAGE: lang,
				kAPI_REQUEST_PARAMETERS: {
					kAPI_PAGING_LIMIT: 50,
					kAPI_PARAM_LOG_REQUEST: "true",
					kAPI_PARAM_TAG: ""
				}
			}
		}, options);
		var param, param_nob64, verbose_param, object_param = {};
		if(typeof(options) == "string") {
			param = kAPI_REQUEST_OPERATION + "=" + $.utf8_to_b64(options) + "&" + kAPI_REQUEST_LANGUAGE + "=" + lang + "&" + kAPI_REQUEST_PARAMETERS + "={}";
			param_nob64 = "http://pgrdg.grinfo.private/Service.php?" + kAPI_REQUEST_OPERATION + "=" + options + "&" + kAPI_REQUEST_LANGUAGE + "=" + lang + "&" + kAPI_REQUEST_PARAMETERS + "={}";
			verbose_param = "http://pgrdg.grinfo.private/Service.php?" + kAPI_REQUEST_OPERATION + " BASE64(" + options + ") &" + kAPI_REQUEST_LANGUAGE + "=" + lang + "&" + kAPI_REQUEST_PARAMETERS + "={}";

			object_param[kAPI_REQUEST_OPERATION] = options;
			object_param[kAPI_REQUEST_LANGUAGE] = lang;
			object_param[kAPI_REQUEST_PARAMETERS] = {};
		} else {
			param = kAPI_REQUEST_OPERATION + "=" + $.utf8_to_b64(opt[kAPI_REQUEST_OPERATION] + "&" + kAPI_REQUEST_LANGUAGE + "=" + opt.parameters[kAPI_REQUEST_LANGUAGE] + "&" + kAPI_REQUEST_PARAMETERS + "=" + JSON.stringify(opt.parameters[kAPI_REQUEST_PARAMETERS]));
			param_nob64 = "http://pgrdg.grinfo.private/Service.php?" + kAPI_REQUEST_OPERATION + "=" + opt[kAPI_REQUEST_OPERATION] + "&" + kAPI_REQUEST_LANGUAGE + "=" + opt.parameters[kAPI_REQUEST_LANGUAGE] + "&" + kAPI_REQUEST_PARAMETERS + "=" + encodeURI(JSON.stringify(opt.parameters[kAPI_REQUEST_PARAMETERS]));
			verbose_param = "http://pgrdg.grinfo.private/Service.php?" + kAPI_REQUEST_OPERATION + "= BASE64(" + opt[kAPI_REQUEST_OPERATION] + "&" + kAPI_REQUEST_LANGUAGE + "=" + opt.parameters[kAPI_REQUEST_LANGUAGE] + "&" + kAPI_REQUEST_PARAMETERS + "= URL_ENCODED(" + JSON.stringify(opt.parameters[kAPI_REQUEST_PARAMETERS]) + "))";

			object_param[kAPI_REQUEST_OPERATION] = opt[kAPI_REQUEST_OPERATION];
			object_param[kAPI_REQUEST_LANGUAGE] = opt.parameters[kAPI_REQUEST_LANGUAGE];
			object_param[kAPI_REQUEST_PARAMETERS] = opt.parameters[kAPI_REQUEST_PARAMETERS];
		}
		if(!storage.isEmpty("pgrdg_cache." + opt.storage_group) && storage.isSet("pgrdg_cache." + opt.storage_group + "." + $.md5(param))) {
			var response = storage.get("pgrdg_cache." + opt.storage_group + "." + $.md5(param) + ".response");
			if(response[kAPI_RESPONSE_STATUS][kAPI_STATUS_STATE] == "ok") {
				response.id = $.md5(param);
				callback(response);
			} else {
				if(developer_mode) {
					alert("There's an error in the response:<br />See the console for more informations");
					console.group("The Service has returned an error");
						console.error(response[kAPI_RESPONSE_STATUS][kAPI_STATUS_STATE]);
						console.warn(param);
						console.warn(param_nob64);
						console.warn(verbose_param);
						console.warn(object_param);
						console.dir(response);
					console.groupEnd();
				}

				$("body").bind("keydown", "esc", function(e) {
					$(".modal").modal("hide");
				});
			}
		} else {
			if(typeof(opt.loaderType) == "string") {
				if($("#apprise.ask_service").length === 0) {
					apprise("", {class: "ask_service", title: "Extracting data...", titleClass: "text-info", icon: "fa-circle-o-notch fa-spin", progress: true, allowExit: false});
				} else {
					if($("#apprise.ask_service").css("display") == "none") {
						$("#apprise.ask_service").modal("show");
					}
				}
			} else {
				var $element = opt.loaderType,
				element_data = $element.html();
				$element.html('<span class="fa fa-fa fa-refresh fa-spin"></span>');
			}
			if(developer_mode) {
				console.group("Storage \"" + opt.storage_group + "\" saved...");
				console.warn("id: ", $.md5(param));
			}
			$.cryptAjax({
				url: "API/",
				dataType: "json",
				type: "POST",
				timeout: 30000,
				data: {
					jCryption: $.jCryption.encrypt(param, password),
					type: "ask_service"
				},
				success: function(response) {
					response.id = $.md5(param);
					if(response[kAPI_RESPONSE_STATUS][kAPI_STATUS_STATE] == "ok") {
						storage.set("pgrdg_cache." + opt.storage_group + "." + $.md5(param), {"date": {"utc": new Date(), "timestamp": $.now()}, "query": {"effective": param, "nob64": param_nob64, "verbose": verbose_param, "obj": object_param}, "response": response});
						if(typeof(opt.loaderType) == "string") {
							$("#apprise.ask_service").modal("hide");
							callback(response);
						} else {
							$element.html(element_data);
							callback(response);
						}
					} else {
						if(developer_mode) {
							console.warn("!!!", param_nob64, response);
							alert("There's an error in the response:<br />See the console for more informations");
							console.group("The Service has returned an error");
								console.error(response[kAPI_RESPONSE_STATUS][kAPI_STATUS_STATE]);
								console.warn(param);
								console.warn(param_nob64);
								console.warn(verbose_param);
								console.warn(object_param);
								console.dir(response);
							console.groupEnd();
						}
					}
				},
				error: function(response) {
					if(developer_mode) {
						console.warn("!!!", response);
						console.group("The Service has returned an error");
							console.error(response[kAPI_RESPONSE_STATUS][kAPI_STATUS_STATE]);
							console.warn(param);
							console.warn(param_nob64);
							console.warn(verbose_param);
							console.warn(object_param);
							console.dir(response);
						console.groupEnd();
					}
					$("#apprise.ask_service").modal("destroy");
					if($("#apprise.service_coffee").length === 0) {
						apprise("The Service is temporarily unavailable.<br />Try again later...", {class: "service_coffee", title: "Taking coffee...", titleClass: "text-warning", icon: "fa-coffee", progress: true, allowExit: false});
					}
					setTimeout(function() {
						$.ask_to_service(options, callback);
					}, 3000);
				}
			});
		}
	};

	/**
	* Manage the left panel
	* @param  {string}   subject  Direct action to execute (open|close)
	* @param  {int}      width    The size in pixel of the panel. Default is 488px
	* @param  {Function} callback
	*/
	$.left_panel = function(subject, width, callback) {
		if(width === "" || width === undefined) {
			width = 488;
		}
		movement = width;
		width += "px";
		$("#left_panel").css({
			"width": width
		});
		var content_witdth = $("#forms-body").css("width");
		if($("#left_panel").hasClass("visible") && subject !== "open") {
			switch(subject) {
				case "close":
					$(".olControlZoom").animate({"left": "10px"}, 200);
					$("#left_panel").animate({"left": "-" + width}, 200, "swing", function() {
						$.resize_forms_mask();
						$(this).removeClass("visible");

						// Callback
						if (typeof callback == "function") {
							callback.call(this);
						}
					});
					$("#breadcrumb").animate({"padding-left": "0px"}, 200).find(".breadcrumb");
					if(document.location.hash !== "#Map") {
						$("#breadcrumb").animate({"padding-left": "0px"}, 200);
						$("#breadcrumb .breadcrumb").animate({"padding-left": "40px"}, 200);
					}
					$(".panel_content-head, .panel_content-body, #start h1").animate({"padding-left": "35px"}, 200, function() {
						if(document.location.hash !== "#Map") {
							$("#left_panel .folder_menu").animate({"right": "-258px"}, 200);
						}
					});
					break;
				case "is_closed":
					return ($("#left_panel").css("left") !== "0px") ? true : false;
				default:
					$.left_panel("close");
					break;
			}
		} else {
			if(subject !== "close") {
				$("#left_panel .folder_menu").animate({"right": "258px"}, 200, function() {
					$("#forms").animate({"left": "0"}, 200);
					$(".olControlZoom").animate({"left": width}, 200);
					$("#left_panel").animate({"left": "0"}, 200, "easeOutExpo", function() {
						$.resize_forms_mask();
						$(this).addClass("visible");

						$(this).find("input[type=search]").focus();
						// Callback
						if (typeof callback == "function") {
							callback.call(this);
						}
					});
					$("#breadcrumb").animate({"padding-left": width}, 200).find(".breadcrumb").animate({"padding-left": "15px"}, 200);
				});
				$(".panel_content-head, .panel_content-body, #start h1").delay(200).animate({"padding-left": (movement+15) + "px"}, 150);
			}
		}
	};

	/**
	* Dinamically adjust forms mask depending the document size
	*/
	$.resize_forms_mask = function() { $.each($(".panel-mask"), function(i, d) { $(this).css("width", (parseInt($(this).closest(".vcenter").find(".panel").css("width")) - 1) + "px"); }); };

	/**
	* Manage hash part of querystring
	* @param  {string} hash The hash to manage
	*/
	$.manage_url = function(hash) {
		var active_li = 0,
		visible_div = 0;

		if(hash === undefined || hash === null || hash === "") {
			hash = "";
		}
		$.each($("#contents > div:not(:hidden)"), function() {
			visible_div++;
		});
		if(hash.length > 0) {
			document.location.hash = hash;

			if($("#breadcrumb #goto_" + hash.toLowerCase() + "_btn").css("display") == "none") {
				$("#breadcrumb #goto_" + hash.toLowerCase() + "_btn").fadeIn(300);
			}
			if(hash == "Map") {
				$("header.main, section.container, #left_panel").addClass("map");
				$("#logo img").attr("src", "common/media/svg/bioversity-logo_small.svg");
				if($("#breadcrumb").css("top") == "110px") {
					$("#breadcrumb").css("top", "75px");
				}
				$("#pgrdg_map").fadeIn(600);
			} else {
				$("header.main, section.container, #left_panel").removeClass("map");
				$("#logo img").attr("src", "common/media/svg/bioversity-logo.svg");
				if($("#breadcrumb").css("top") == "75px") {
					$("#breadcrumb").css("top", "110px");
				}
			}
			// Show the content in page
			$("#" + hash.toLowerCase()).fadeIn(300);

			$.each($("#breadcrumb .breadcrumb li:visible"), function(i, v) {
				var item_id = $(this).attr("id"),
				ttext = item_id.replace("goto_", "").replace("_btn", "");

				if(hash.length > 0) {
					if($.trim($("#" + item_id).text()) !== hash) {
						var blink_title = "Return to " + ttext + " panel";

						$(this).find("span.txt").html('<a href="javascript:void(0);" onclick="$.manage_url(\'' + $.ucfirst(ttext) + '\');" title="' + blink_title + '">' + $.ucfirst(ttext) + '</a>').closest("li").removeClass("active");
					} else {
						$(this).find("span.txt").text(hash).closest("li").addClass("active");
					}
					$("#breadcrumb a").tooltip({container: "body"});
					$("#breadcrumb a").bind("click mousedown", function() { $(this).tooltip("hide"); });
				}

			});

			if(hash == "Map") {
				$.left_panel("close");
				$("#map_toolbox").delay(600).animate({"right": "0"}, 300);
			} else {
				if($.left_panel("is_closed")) {
					$.left_panel("open");
				}
				if(current_path !== "Map") {
					if(hash.length > 0) {
						$("#contents > div:not(#" + hash.toLowerCase() + ")").hide();
						$("#contents #" + hash.toLowerCase()).fadeIn(300);
					}
				}
			}
		}
	};

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
										// ALT + 0
		$("body, #find_location input").bind("keydown", "alt+0", function(e) {
			if($("header").hasClass("map")) {
				e.preventDefault();
				$.center_map_on("World");
				$("#selected_zone").text("World").fadeIn(300);
			}
			return false;
										// ALT + 1
		}).bind("keydown", "alt+1", function(e) {
			if($("header").hasClass("map")) {
				e.preventDefault();
				$.center_map_on("Africa");
			}
			return false;
										// ALT + 2
		}).bind("keydown", "alt+2", function(e) {
			if($("header").hasClass("map")) {
				e.preventDefault();
				$.center_map_on("Antarctica");
			}
			return false;
										// ALT + 3
		}).bind("keydown", "alt+3", function(e) {
			if($("header").hasClass("map")) {
				e.preventDefault();
				$.center_map_on("Asia");
			}
			return false;
										// ALT + 4
		}).bind("keydown", "alt+4", function(e) {
			if($("header").hasClass("map")) {
				e.preventDefault();
				$.center_map_on("Europe");
			}
			return false;
										// ALT + 5
		}).bind("keydown", "alt+5", function(e) {
			if($("header").hasClass("map")) {
				e.preventDefault();
				$.center_map_on("North America");
			}
			return false;
										// ALT + 6
		}).bind("keydown", "alt+6", function(e) {
			if($("header").hasClass("map")) {
				e.preventDefault();
				$.center_map_on("Oceania");
			}
			return false;
										// ALT + 7
		}).bind("keydown", "alt+7", function(e) {
			if($("header").hasClass("map")) {
				e.preventDefault();
				$.center_map_on("South America");
			}
			return false;
										// ALT + 8
		}).bind("keydown", "alt+8", function(e) {
			if($("header").hasClass("map")) {
			}
			return false;
										// ALT + 9
		}).bind("keydown", "alt+9", function(e) {
			if($("header").hasClass("map")) {
				e.preventDefault();
				// Fix for ALT+I and F1 confusion
				if(e.keyCode == 105){
					return false;
				} else {
					return false;
				}
			}
			return false;
										// ALT + i and ALT + F1
		}).bind("keydown", "alt+i F1", function(e) {
			if($("header").hasClass("map")) {
				e.preventDefault();
				if(e.keyCode != 105){
					$.show_help();
				}
			}
			return false;
										// ALT + F
		}).bind("keydown", "alt+f", function(e) {
			if($("header").hasClass("map")) {
				e.preventDefault();
				// Fix for ALT+6 confusion
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
										// ALT + L
		}).bind("keydown", "alt+l", function(e) {
			if($("header").hasClass("map")) {
				e.preventDefault();
				$.toggle_lock_view();
			}
			return false;
										// ALT + T
		}).bind("keydown", "alt+t", function(e) {
			if($("header").hasClass("map")) {
				e.preventDefault();
				if(!$("#pgrdg_map").hasClass("locked")) {
					$.sub_toolbox("change_map");
				}
			}
			return false;
										// ALT + + (plus key)
		}).bind("keydown", "alt++", function(e) {
			if($("header").hasClass("map")) {
				e.preventDefault();
				if(!$("#pgrdg_map").hasClass("locked")) {
					$("#selected_zone").text("Zoom in").fadeIn(300);
					$.increase_zoom();
				}
			}
			return false;
										// ALT + - (minus key)
		}).bind("keydown", "alt+-", function(e) {
			if($("header").hasClass("map")) {
				e.preventDefault();
				if(!$("#pgrdg_map").hasClass("locked")) {
					$("#selected_zone").text("Zoom out").fadeIn(300);
					$.decrease_zoom();
				}
			}
			return false;
										// ALT + (left arrow key)
		}).bind("keydown", "alt+left", function(e) {
			$.left_panel("close");
			return false;
										// ALT + (right arrow key)
		}).bind("keydown", "alt+right", function(e) {
			$.left_panel("open");
			return false;
										// ESC
		}).bind("keydown", "esc", function(e) {
			//e.preventDefault();
			//$.left_panel("close");
			if($("header").hasClass("map")) {
				$.stop_measurements();
				$.sub_toolbox("close");
			}
			return false;
										// ALT [keydown]
		}).bind("keydown", "alt", function(e) {
			if($("header").hasClass("map")) {
				e.preventDefault();
				$("#information_zone").html('<table><tr><th><tt>ALT<small style="font-weight: normal;">+</small>F</tt></th><td>Search a location inside a map</td></tr><tr><th><tt>ALT<small style="font-weight: normal;">+</small>L</tt></th><td>Lock/unlock map navigation</td></tr><tr><th><tt>ALT<small style="font-weight: normal;">+</small>T</tt></th><td>Open/close map background layer preferences</td></tr><tr><th><br /><tt>ALT<small style="font-weight: normal;">+</small>+</tt></th><td><br />Zoom in</td></tr><tr><th><tt>ALT<small style="font-weight: normal;">+</small>-</tt></th><td>Zoom out</td></tr><tr><th><br /><tt>ALT<small style="font-weight: normal;">+</small>0</tt></th><td><br />Entire world</td></tr><tr><th><tt>ALT<small style="font-weight: normal;">+</small>1</tt></th><td>Africa</td></tr><tr><th><tt>ALT<small style="font-weight: normal;">+</small>2</tt></th><td>Antarctica</td></tr><tr><th><tt>ALT<small style="font-weight: normal;">+</small>3</tt></th><td>Asia</td></tr><tr><th><tt>ALT<small style="font-weight: normal;">+</small>4</tt></th><td>Europe</td></tr><tr><th><tt>ALT<small style="font-weight: normal;">+</small>5</tt></th><td>North America</td></tr><tr><th><tt>ALT<small style="font-weight: normal;">+</small>6</tt></th><td>Oceania</td></tr><tr><th><tt>ALT<small style="font-weight: normal;">+</small>7</tt></th><td>South America</td></tr><tr><th><tt>ALT<small style="font-weight: normal;">+</small>9</tt></th><td>User position</td></tr></table>');
				$("#selected_zone").delay(1000).fadeOut(600, function() { $(this).text(""); });
			}
										// ALT [keyup]
		}).bind("keyup", "alt", function(e) {
			if($("header").hasClass("map")) {
				e.preventDefault();
				$("#information_zone").html("");
				if(!$("#pgrdg_map").hasClass("locked")) {
					$("#selected_zone").delay(1000).fadeOut(600, function() { $(this).text(""); });
				}
			}
		});
										// ENTER
		$("#find_location input").bind("keydown", "return", function() {
			//$.sub_toolbox("find_location");
			$.search_location($(this).val());
		});
	};


/*======================================================================================*/

$(document).ready(function() {
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
		$("#loginform").jCryption();
		$("nav a[title]").tooltip({placement: "bottom", container: "body"});
		$("#map_toolbox a, #map_sub_toolbox a").tooltip({placement: "left", container: "body"}).click(function() {
			$(this).tooltip("hide");
		});

		$("#btn-login").click(function() {

		});
		$.shortcuts();
		$("#login").on("shown.bs.modal", function() {
			$("#login_btn").removeClass("disabled").attr("disabled", false).click(function() {
				$.cryptAjax({
					url: "API/index.php",
					dataType: "json",
					type: "POST",
					data: {
						jCryption: $.jCryption.encrypt($("#loginform").serialize(), password),
						type: "login"
					},
					success: function(response) {
						if(developer_mode) {
							//console.log(response);
						}
					}
				});
			});
			$("#login-username").focus();
		});

		if(current_path == "Search") {
			document.location.hash = "";
			window.onhashchange = function() {
				$.manage_url();
			};
			$.manage_url();
		}
	}
});
