/**
* Main functions
*
* @author Alessandro Gubitosi <gubi.ale@iod.io>
* @license http://www.gnu.org/licenses/gpl-3.0.html GNU General Public License, version 3
* @link https://github.com/bioversity/PGRDG/
*/

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
			storage_group: "local",
			loaderType: "external",
			loaderText: "",
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
		if(!storage.isEmpty("pgrdg_cache." + opt.storage_group) && storage.isSet("pgrdg_cache." + opt.storage_group + "." + $.md5(param)) && opt.storage_group !== "") {
			var response = storage.get("pgrdg_cache." + opt.storage_group + "." + $.md5(param) + ".response");
			if(response[kAPI_RESPONSE_STATUS][kAPI_STATUS_STATE] == "ok") {
				response.id = $.md5(param);
				response.md5 = $.md5(param);
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
				if(!$("#marker_content").is(":visible")) {
					if(!$("#apprise.service_coffee").is(":visible")) {
						if($("#apprise.ask_service").length === 0) {
							apprise("", {class: "ask_service", title: "Extracting data...", titleClass: "text-info", icon: "fa-circle-o-notch fa-spin", progress: true, allowExit: false});
						} else {
							if($("#apprise.ask_service").css("display") == "none") {
								$("#apprise.ask_service").modal("show");
							}
						}
					}
				}
			} else {
				var $element = opt.loaderType,
				element_data = $element.html();
				$element.html('<span class="fa fa-fw fa-refresh fa-spin"></span>' + ((opt.loaderText !== "") ? opt.loaderText : ""));
			}
			if(developer_mode) {
				console.log("Fetching:\n", param);
				console.log("(", param_nob64, ")");
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
						if(opt.storage_group !== "") {
							storage.set("pgrdg_cache." + opt.storage_group + "." + $.md5(param), {
								"date": {"utc": new Date(), "timestamp": $.now()},
								"query": {
									"effective": param,
									"nob64": param_nob64,
									"verbose": verbose_param,
									"obj": object_param},
									"response": response
								}
							);
							if(developer_mode) {
								console.group("Storage \"" + opt.storage_group + "\" saved...");
								console.warn("id: ", $.md5(param));
								console.warn(param_nob64);
								console.groupEnd();
							}
						}
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
				error: function(x, t, response) {
					$.display_error_msg("There was an error in your request, please try again later");
					if(t === "timeout") {
						if(developer_mode) {
							console.log("got timeout");
						}
				        } else {
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
						$.service_coffee();
						setTimeout(function() {
							$.ask_to_service(options, callback);
						}, 3000);
					}
				}
			});
		}
	};

	/**
	 * Display an error message
	 */
	$.display_error_msg = function(message) {
		$("#apprise").modal("destroy");
		apprise(message, {"icon": "error"});
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
		if(!developer_mode) {
			$.cryptAjax({
				url: "common/include/conf/site.json",
				dataType: "json",
				success: function(site) {
					if(site.maintainance === true) {
						$.service_coffee({
							message: "The Service is temporarily under maintainance.<br />This alert will close once the maintainance is over.",
							title: "Under maintainance",
							titleClass: "text-danger",
							icon: "fa-wrench"
						});
					} else {
						if($("#apprise.service_coffee").length > 0) {
							$("#apprise.service_coffee").modal("hide");
						}
						if (typeof callback == "function") {
							callback.call(this);
						}
					}
					setTimeout(function() {
						$.site_conf(callback);
					}, 30000);
				}
			});
		} else {
			callback.call(this);
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
			width = ($(window).width() > 420) ? 300 : $(window).width();
		}
		movement = width;
		width += "px";
		$("#left_panel").css({
			"width": width
		});
		var content_witdth = $("#forms-body").css("width");

		//if($.is_touch_device()) {
			if($(window).width() < 420) {
				$(window).swipe({
					swipeStatus:function(event, phase, direction, distance, duration, fingerCount) {
						if(direction == "left") {
							if($("#left_panel").hasClass("visible") && distance >= 0 && distance < parseInt(width)) {
								$("#left_panel").css({"left": "-" + distance + "px"});
							//	$("header").css({"left": (parseInt($("#left_panel").css("left")) + parseInt(width)) + "px"});
							}
							$("section #contents").css({"left": ((parseInt($("#left_panel").css("left")) + parseInt(width)) + 5) + "px"});
						}
						if(direction == "right") {
							if(!$("#left_panel").hasClass("visible") && distance >= 0 && distance < parseInt(width)) {
								$("#left_panel").css({"left": "-" + (parseInt(width) - distance) + "px"});
							//	$("header").css({"left": ((parseInt($("#left_panel").css("left")) + parseInt(width)) + 5) + "px"});
							}
							$("section #contents").css({"left": ((parseInt($("#left_panel").css("left")) + parseInt(width)) + 5) + "px"});
						}
					},
					swipeLeft: function(event, direction, distance, duration, fingerCount) {
						if(parseInt($("#left_panel").css("left")) <= -(parseInt(width)/2)) {
							$.left_panel("close");
						} else {
							$.left_panel("open");
						}
					},
					swipeRight: function(event, direction, distance, duration, fingerCount) {
						if(parseInt($("#left_panel").css("left")) >= -(parseInt(width)/2)) {
							$.left_panel("open");
						} else {
							$.left_panel("close");
						}
					},
					treshold: 100
				});
			}
		//}
		if($("#left_panel").hasClass("visible") && subject !== "open") {
			switch(subject) {
				case "close":
					// Move all document to the left
					if($(window).width() < 420) {
						$("section #contents").animate({"left": "0px"}, 200, "swing");
						$("header").animate({"left": 0});
					}
					$(".olControlZoom, .leaflet-control-zoom").animate({"left": "0"}, 200);
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
					if($(window).width() >= 420) {
						$(".panel_content-head, .panel_content-body, .panel_content-footer, #start > div").animate({"padding-left": "15px"}, 200, function() {
							if(document.location.hash !== "#Map") {
								$("#left_panel .folder_menu").animate({"right": "-165px"}, 200);
								$("#start h1[unselectable]").animate({"margin-left": "35px"}, 200);
							}
						});
					} else {
						$(".panel_content-head, .panel_content-body, .panel_content-footer, #start > div").animate({"padding-left": "15px"}, 200, function() {
							if(document.location.hash !== "#Map") {
								//$("#left_panel .folder_menu").animate({"right": "-165px"}, 200);
							}
						});
					}
					break;
				case "is_closed":
					return ($("#left_panel").css("left") !== "0px") ? true : false;
				default:
					$.left_panel("close");
					break;
			}
			// Save the left_panel position
			storage.set("pgrdg_cache.interface.left_panel", {status: "closed"});
		} else {
			switch(subject) {
				case "check":
					// Check the last left_panel saved position and restore it
					var left_panel_status = "open";
					if(storage.isSet("pgrdg_cache.interface")) {
						left_panel_status = storage.get("pgrdg_cache.interface.left_panel.status");
					}
					if(left_panel_status == "open") {
						$.left_panel("open");
					} else {
						$("#left_panel").addClass("visible").css({"left": "-" + width});
						$.left_panel("close");
					}
					$.left_panel(left_panel_status);
					break;
				default:
					//console.log("open");
					// Move all document to the right
					if($(window).width() < 420) {
						if(current_path !== "Search") {
							$("section #contents").animate({"left": width}, 200);
						}
					//	$("header").animate({"left": width}, 200);
					}
					$("#left_panel .folder_menu").animate({"right": (parseInt(width) - 2) + "px"}, 200, function() {
						$("#forms").animate({"left": "0"}, 200);
						if($("#start > div").css("margin-top").replace("px", "") <= 120) {
							if($(window).width() > 420) {
								$("#start > div").animate({"margin-top": "50px"}, 200);
							}
						}
						if($(window).width() > 420) {
							$("#start h1[unselectable]").animate({"margin-left": "15px"}, 200);
						}
						$(".olControlZoom, .leaflet-control-zoom").animate({"left": width}, 200);
						$("#left_panel").animate({"left": "0"}, 200, "easeOutExpo", function() {
							$.resize_forms_mask();
							$(this).addClass("visible");

							$(this).find("input[type=search]");
							if($(window).width() < 420) {
								$(this).find("input[type=search]");
							} else {
								$(this).find("input[type=search]").focus();
							}
							// Callback
							if (typeof callback == "function") {
								callback.call(this);
							}
						});
						$("#breadcrumb").animate({"padding-left": width}, 200).find(".breadcrumb").animate({"padding-left": "15px"}, 200);
					});
					$("#contents > .panel_content .panel_content-head, #contents > .panel_content .panel_content-body, #contents > .panel_content .panel_content-footer, #start > div").animate({"padding-left": (movement + 15) + "px"}, 150);
					// Save the left_panel position
					storage.set("pgrdg_cache.interface.left_panel", {status: "open"});
					break;
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
		$.left_panel_behaviour = function(hash) {
			switch(hash) {
				case "Forms":
					//$.remove_storage("pgrdg_cache.interface.left_panel");
					if($(window).width() < 420) {
					//	$.left_panel("check");
					}
					break;
				case "Summary":
					if($(window).width() < 420) {
						$.left_panel("close");
					}
					break;
				case "Results":
					if($(window).width() < 420) {
						$.left_panel("close");
					}
					break;
				case "Map":
					if($(window).width() < 420) {
						$.left_panel("tmp_close");
					}
					break;
				default:
					if($.left_panel("is_closed")) {
						$.left_panel("check");
					}
					break;
			}
		};
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
			// Show the content in page
			//$("#" + hash.toLowerCase()).fadeIn(300);
			if(current_path == "Search") {
				switch(document.location.hash) {
					case "#Summary":
						$("#results").hide();
						$("#map").hide();
						$("#pgrdg_map").hide();
						break;
					case "#Results":
						$("#summary").hide();
						$("#map").hide();
						$("#pgrdg_map").hide();
						break;
					case "#Map":
						$("#results").hide();
						$("#summary").hide();
						break;
				}
			} else {
				// Remove all other pages if user returns to the forms page
				if(hash.toLowerCase() == "forms") {
					$.remove_breadcrumb("summary");
					$.reset_contents("summary", true);
					$.remove_breadcrumb("results");
					$.reset_contents("results", true);
					$.remove_breadcrumb("map");
					$.reset_contents("map", true);
				}
			}
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

		//	$.left_panel_behaviour(hash);
			if(hash == "Map") {
				$("#map_toolbox").delay(600).animate({"right": "0"}, 300);
				$("#contents .panel_content:not(#loader_bg)").hide();
				$("#map, #pgrdg_map").fadeIn(300);
			} else {
				if(current_path !== "Search" && (current_path !== "Map" || hash !== "Map")) {
					if(hash.length > 0) {
						$.each($("#contents > div"), function(i, $v) {
							if($(this).attr("id") !== hash.toLowerCase() && $(this).attr("id") !== "loader_bg"){
								$(this).hide();
							}
						});
						if($("#contents #" + hash.toLowerCase() + " h1").html().length > 0) {
							$("#contents #" + hash.toLowerCase()).fadeIn(300);
						}
					}
				} else if(current_path == "Search"){
					if(hash.length > 0) {
						if($("#contents #" + hash.toLowerCase() + " h1").html().length > 0) {
							$("#contents #" + hash.toLowerCase()).fadeIn(300);
						}
					}
				}
			}
		}
	};

	/**
	 * Remove storage checking before if exists or is empty
	 */

	$.remove_storage = function(name) {
		/*
		var a = "",
		names = name.split(".");
		if(names[0] == "pgrdg_cache") {
			names.shift();
		}
		$.each(names, function(k, v) {
			if(k === 0) {
				a = "pgrdg_cache." + v;
			} else {
				a += "." + names[k];
			}
			if(storage.isSet(a) || storage.isSet(a) && storage.isEmpty(a)) {
				storage.remove(a);
			}
		});*/
		if(storage.isSet(name)) {
			storage.remove(name);
		}
	};

	/**
	 * Check the latest version on Github an compare it with its own.
	 * Note that if you want to reset the user storage, you need to update Github repo's version tag
	 */
	$.check_version = function() {
		var local_version = "";
		$.reset_storage = function(last_version) {
			storage.remove("pgrdg_cache");
			storage.set("pgrdg_cache.version", last_version);
		};

		$.get("https://api.github.com/repos/bioversity/PGRDG/tags", function(v){
			last_version = v[0].name;

			if(storage.isSet("pgrdg_cache.version")) {
				if(storage.get("pgrdg_cache.version") !== last_version) {
					$.reset_storage(last_version);
				}
			} else {
				$.reset_storage(last_version);
			}
		});
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
			e.preventDefault();
			//$.left_panel("close");
			if($("header").hasClass("map")) {
				//$.stop_measurements();
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


	/**
	 *  Get statistics about indexed data
	 */
	$.get_statistics = function() {
		$("#se input").focus();

		var objp = {};
		objp.storage_group = "ask";
		objp.loaderType = $("#statistics_loader");
		objp.loaderText = "Acquiring data...";
		objp[kAPI_REQUEST_OPERATION] = kAPI_OP_MATCH_UNITS;
		objp.parameters = {};
		objp.parameters[kAPI_REQUEST_LANGUAGE] = lang;
		objp.parameters[kAPI_REQUEST_PARAMETERS] = {};
		objp.parameters[kAPI_REQUEST_PARAMETERS][kAPI_PARAM_LOG_REQUEST] = "true";
		objp.parameters[kAPI_REQUEST_PARAMETERS][kAPI_PARAM_CRITERIA] = [];
		objp.parameters[kAPI_REQUEST_PARAMETERS][kAPI_PARAM_GROUP] = kTAG_DOMAIN;
		$.ask_to_service(objp, function(response) {
			if(response[kAPI_RESPONSE_STATUS][kAPI_STATUS_STATE] == "ok") {
				var res = response[kAPI_RESPONSE_RESULTS],
				stats = [];
				$.each(res, function(domain, statistics) {
					stats.push(statistics[kAPI_PARAM_RESPONSE_FRMT_NAME] + ': <b>' + $.number(statistics[kAPI_PARAM_RESPONSE_COUNT]) + '</b>');
				});
				$("#statistics_loader").html(stats.join("<br />"));
			}
		});
	};


	/**
	 * Log users
	 */
	$.login = function() {
		if($("#login-username").val().length >= 4 && $("#login-password").val().length >= 6) {
			$("#loginform .input-group").removeClass("has-error");
			var data = [],
			user_data = {},
			objp = {},
			objpp = {},
			authority = "";
			data.push($.trim($("#login-username").val()));
			data.push($.trim($.sha1($("#login-password").val())));

			$.get_user_data = function(resp, callback) {
				if($.type(resp) == "object" && $.obj_len(resp) > 0) {
					user_data = resp;
					/*
					$.each(resp, function(obj, data){
						objpp.storage_group = "session";
						objpp[kAPI_REQUEST_OPERATION] = kAPI_OP_GET_UNIT;
						objpp.parameters = {};
						objpp.parameters[kAPI_REQUEST_LANGUAGE] = lang;
						objpp.parameters[kAPI_REQUEST_PARAMETERS] = {};
						objpp.parameters[kAPI_REQUEST_PARAMETERS][kAPI_PARAM_LOG_REQUEST] = "true";
						objpp.parameters[kAPI_REQUEST_PARAMETERS][kAPI_PARAM_ID] = data[kTAG_ENTITY_AFFILIATION][kAPI_PARAM_RESPONSE_FRMT_DISP];
						objpp.parameters[kAPI_REQUEST_PARAMETERS][kAPI_PARAM_DATA] = kAPI_RESULT_ENUM_DATA_FORMAT;
						$.ask_to_service(objpp, function(a) {
							if(a[kAPI_RESPONSE_STATUS][kAPI_STATUS_STATE] == "ok" && $.obj_len(a[kAPI_RESPONSE_RESULTS]) > 0) {
								$.each(a[kAPI_RESPONSE_RESULTS], function(domain, data) {
									authority = data[kTAG_NAME][kAPI_PARAM_RESPONSE_FRMT_DISP];
								});
								user_data = {
									local: {
										username: data[kTAG_CONN_USER][kAPI_PARAM_RESPONSE_FRMT_DISP],
										pass: data[kTAG_CONN_PASS][kAPI_PARAM_RESPONSE_FRMT_DISP],
										type: data[kTAG_ENTITY_TYPE][kAPI_PARAM_RESPONSE_FRMT_DISP][kAPI_PARAM_RESPONSE_FRMT_DISP],
										role: data[kTAG_ENTITY_LNAME][kAPI_PARAM_RESPONSE_FRMT_DISP],
										creation_date: data[kTAG_RECORD_CREATED][kAPI_PARAM_RESPONSE_FRMT_DISP]
									},
									domain: data[kTAG_DOMAIN][kAPI_PARAM_RESPONSE_FRMT_DISP][kAPI_PARAM_RESPONSE_FRMT_DISP],
									name: data[kTAG_ENTITY_FNAME][kAPI_PARAM_RESPONSE_FRMT_DISP],
									lastname: data[kTAG_ENTITY_LNAME][kAPI_PARAM_RESPONSE_FRMT_DISP],
									email: data[kTAG_ENTITY_EMAIL][kAPI_PARAM_RESPONSE_FRMT_DISP],
									role: data[kTAG_ROLES][kAPI_PARAM_RESPONSE_FRMT_DISP],
									job: {
										authority: authority,
										task: {
											label: data[kTAG_ENTITY_TYPE][kAPI_PARAM_RESPONSE_FRMT_DISP][kAPI_PARAM_RESPONSE_FRMT_DISP],
											description: data[kTAG_ENTITY_TYPE][kAPI_PARAM_RESPONSE_FRMT_DISP][kAPI_PARAM_RESPONSE_FRMT_INFO]
										}
									}

								};
							}
						});
					});
					*/
					if (typeof callback == "function") {
						callback.call(this, user_data);
					}
				}
			};

			objp.storage_group = "local";
			objp[kAPI_REQUEST_OPERATION] = kAPI_OP_GET_USER;
			objp.parameters = {};
			objp.parameters[kAPI_REQUEST_LANGUAGE] = lang;
			objp.parameters[kAPI_REQUEST_PARAMETERS] = {};
			objp.parameters[kAPI_REQUEST_PARAMETERS][kAPI_PARAM_LOG_REQUEST] = "true";
			objp.parameters[kAPI_REQUEST_PARAMETERS][kAPI_PARAM_DATA] = kAPI_RESULT_ENUM_DATA_FORMAT;
			objp.parameters[kAPI_REQUEST_PARAMETERS][kAPI_PARAM_ID] = data;
			$.ask_to_service(objp, function(response) {
				if(response[kAPI_RESPONSE_STATUS][kAPI_STATUS_STATE] == "ok" && $.obj_len(response[kAPI_RESPONSE_RESULTS]) > 0) {
					var $li = $("#login_menu_btn").closest("li"),
					user_data = {},
					permissions = [], roles_groups = [];
					$.get_user_data(response[kAPI_RESPONSE_RESULTS], function(user_data){
						$.each(user_data, function(domain, data) {
							$.each(data[kTAG_ROLES][kAPI_PARAM_RESPONSE_FRMT_DISP], function(k, v){
								roles_groups.push(k, v.charAt(0));
							});
							if($("#remember_login_btn").is(":checked")) {
								$.cookie("l", $.sha1(data[kTAG_CONN_USER][kAPI_PARAM_RESPONSE_FRMT_DISP]), {expires: 7, path: "/" });
							} else {
								$.cookie("l", $.sha1(data[kTAG_CONN_USER][kAPI_PARAM_RESPONSE_FRMT_DISP]), {expires: 1, path: "/" });
							}
							storage.set("pgrdg_cache.session." + $.sha1(data[kTAG_CONN_USER][kAPI_PARAM_RESPONSE_FRMT_DISP]) + ".data", data);
							$.create_user_menu(data, roles_groups);
						});
						//location.reload();
					});
				}
			});
		} else {
			$("#loginform .input-group").addClass("has-error");
			$("#login-username").focus();
		}
	};

	/**
	* Log out users
	*/
	$.logout = function(){
		$.removeCookie("l");
		$.remove_storage("pgrdg_cache.session");
		location.reload();
	};

	/**
	* Check if there's logged users
	*/
	$.check_logged_user = function() {
		//$("#login_menu_btn").addClass("disabled").html('<span class="fa fa-spin fa-refresh"></span> Wait...');
		var username = $.cookie("l"),
		user_data = "",
		roles_groups = [];
		if(username !== undefined && username !== null && username !== "null" && username !== "") {
			if(storage.isSet("pgrdg_cache.session." + username)) {
				user_data = storage.get("pgrdg_cache.session." + username + ".data");
				$.each(user_data[kTAG_ROLES][kAPI_PARAM_RESPONSE_FRMT_DISP], function(k, v){
					roles_groups.push(k, v.charAt(0));
				});
				$.create_user_menu(user_data, roles_groups);
			}

			if(current_path == "Profile") {
				$("#personal_form").html('<span class="fa fa-refresh fa-spin"></span> Waiting...');
				//console.log(user_data[kTAG_ENTITY_FNAME][kAPI_PARAM_RESPONSE_FRMT_DISP]);
				// $("#uname").val(user_data[kTAG_ENTITY_LNAME][kAPI_PARAM_RESPONSE_FRMT_DISP]);
				// $("#ulast").val(user_data[kTAG_ENTITY_FNAME][kAPI_PARAM_RESPONSE_FRMT_DISP]);
				// $("#uemail").val(user_data.email);
				// $("#ujob").val(user_data.job.authority);
				// $("#utask").val(user_data.job.task.description);
				// $("#username").val(user_data.local.username);
				// if(user_data.local.pgp_key === undefined || user_data.local.pgp_key.length == 0) {
				// 	$("#upgp").closest(".form-group").addClass("has-error");
				// 	$("#nopgp").fadeIn(300);
				// 	$("input[type=submit]").removeClass("btn-default").addClass("btn-danger disabled");
				// }

				// window.onbeforeunload = function() {
				// 	apprise("Are you sure that you want to leave this page?", {"confirm": "true"}, function(r) {
				// 		if(r) {
				// 			return false;
				// 		}
				// 	});
				// };
				/*
				window.onbeforeunload = function() {
					return "You have unsaved changes\nAre you sure that you want to leave this page?";
				};
				*/
				$("#personal_form").generate_personal_form(user_data);
			}
		} else {
			$.removeCookie("l");
			$.remove_storage("pgrdg_cache.session");
			$("#login_menu_btn").find("span").removeClass("fa-check fa-spin").addClass("fa-sign-in");

			if(current_path == "Profile") {
				$("#login").modal("show").on("hidden.bs.modal", function(e) {
					if($.cookie("l") === undefined) {
						$("#login").modal("show");
					}
				});
			}
		}
		$("#login_menu_btn").removeClass("disabled");
	};

	/**
	* Create the user menu
	*/
	$.create_user_menu = function(user_data, roles_groups) {
		if(user_data !== undefined && user_data !== null && user_data !== ""){
			var $li = $("#login_menu_btn").closest("li"), permissions = [];
			$.each(roles.dictionary.groups, function(gl, gd){
				if($.inArray(gl, roles_groups) !== -1) {
					var detailed_permissions = [];

					$.each(roles[gd.label], function(fl, fd){
						if($.inArray(fl, user_data.role) !== -1) {
							detailed_permissions.push(fd);
						}
					});
					var gdlabel = gd.label;
					permissions.push({
						gdlabel: {
							type: gd.type,
							label: gd.label,
							link: gd.link,
							icon: gd.icon,
							order: gd.order,
							separator: gd.separator,
							details: detailed_permissions
						},
						order: gd.order
					});
				}
			});

			permissions.sort(function(obj1, obj2) {
				// Ascending: first age less than the previous
				return obj1.order - obj2.order;
			});
			//$('<li class="vertical-divider">').insertBefore($li);
			$li.addClass("btn-group");
			$li.html('<a id="login_menu_btn" data-toggle="dropdown" href="javascript: void(0);" class="btn btn-link dropdown-toggle"><small class="fa fa-user"></small> ' + user_data[kTAG_ENTITY_FNAME][kAPI_PARAM_RESPONSE_FRMT_DISP] + ' <span class="fa fa-caret-down"></span></a>');
			if($li.find("ul.dropdown-menu").length === 0) {
				$li.append('<ul class="dropdown-menu" role="menu">');
				$li.find("ul").append('<li><a href="./Profile"><span class="fa fa-fw fa-gear"></span> Profile</a></li><li class="divider"></li>');
				$.each(permissions, function(group, details){
					if(details.gdlabel.type !== "static") {
						$li.find("ul").append('<li><a href="' + details.gdlabel.link + '"><small class="' + details.gdlabel.icon + '"></small> ' + details.gdlabel.label + '</a></li>');
						if(details.gdlabel.separator) {
							$li.find("ul").append('<li role="menu" class="divider"></li>');
						}
					}
				});
				$li.find("ul").append('<li class="divider"></li><li><a href="javascript: void(0);" onclick="$.logout();"><small class="fa fa-fw fa-sign-out"></small> Logout</a></li>');
			}
			$("#login").modal("hide");
		} else {
		}
	};

	$.fn.generate_personal_form = function(user_data) {
		$.fn.add_forms = function(options) {
			options = $.extend({
				form_id: $.makeid(),
				data: {},
				tags: [],
				readonly_tags: [],
				requested_tags: [],
				type: "",
				action: "append"
			}, options);

			$.recurse_disp = function(tag, data) {
				if($.type(data[tag][kAPI_PARAM_RESPONSE_FRMT_DISP]) == "object") {
					return data[tag][kAPI_PARAM_RESPONSE_FRMT_DISP][kAPI_PARAM_RESPONSE_FRMT_DISP];
				} else {
					return data[tag][kAPI_PARAM_RESPONSE_FRMT_DISP];
				}
			};

			if($.obj_len(options.data) > 0) {
				var form = $('<div>'),
				input_value = "",
				k = 0;
				// EDIT HERE
				// ---------------------------------------------------------------------------------------------
				$.each(options.data, function(tag, data) {
					if($.inArray(tag, options.tags) !== -1) {
						k++;
						if(k == 1) {
							form.append('<h3>' + options.type + '</h3>');
						}
						var form_group = $('<div class="form-group">'),
						label = $('<label>'),
						input_div = $('<div class="col-sm-8">'),
						asterisk = (($.inArray(tag, options.requested_tags) <= -1 || options.requested_tags.length === 0) ? '' : ' <span class="text-danger">*</span>');

						if(tag == kTAG_ENTITY_PGP_KEY && (options.data[tag][kAPI_PARAM_RESPONSE_FRMT_NAME] === "" || options.data[tag][kAPI_PARAM_RESPONSE_FRMT_NAME] === undefined)) {
							label.append('<span class="fa fa-lock"></span> ' + options.data[tag][kAPI_PARAM_RESPONSE_FRMT_NAME].replace("PGP", '<abbr title="Pretty Good Privacy">PGP</abbr>') + asterisk);
						} else {
							label.append(options.data[tag][kAPI_PARAM_RESPONSE_FRMT_NAME] + asterisk);
						}
						label.attr("for", $.md5(options.data[tag][kAPI_PARAM_RESPONSE_FRMT_NAME])).addClass("col-sm-4 control-label");
						label.appendTo(form_group);
						if($.inArray(tag, options.readonly_tags) <= -1 || options.readonly_tags.length === 0) {
							// PGP
							if(tag == kTAG_ENTITY_PGP_KEY && (options.data[tag][kAPI_PARAM_RESPONSE_FRMT_NAME] === "" || options.data[tag][kAPI_PARAM_RESPONSE_FRMT_NAME] === undefined)) {
								input_div.html('<textarea name="' + options.data[tag][kAPI_PARAM_RESPONSE_FRMT_NAME] + '" required class="form-control" id="' + $.md5(options.data[tag][kAPI_PARAM_RESPONSE_FRMT_NAME]) + '" placeholder="' + options.data[tag][kAPI_PARAM_RESPONSE_FRMT_NAME] + '">' + $.recurse_disp(tag, options.data) + '</textarea>');
							} else {
								input_div.html('<input type="text" name="' + options.data[tag][kAPI_PARAM_RESPONSE_FRMT_NAME] + '" required class="form-control" id="' + $.md5(options.data[tag][kAPI_PARAM_RESPONSE_FRMT_NAME]) + '" placeholder="' + options.data[tag][kAPI_PARAM_RESPONSE_FRMT_NAME] + '" value="' + $.recurse_disp(tag, options.data) + '" />');
							}
						} else {
							input_div.html('<p class="form-control-static">' + $.recurse_disp(tag, options.data) + '</p>');
						}

						input_div.appendTo(form_group);
						form_group.appendTo(form);
						form.append(form_group);
					}
				});
				if(options.action == "append") {
					$(this).append(form);
				} else {
					$(this).prepend(form);
				}
			} else {
				$(this).append('<div class="panel panel-danger">No user data to display</div>');
			}
		};
		var objpp = {},
		form_id = $.makeid(),
		tmp_val = "";

		console.warn(user_data);
		$(this).html("");
		$(this).add_forms({
			form_id: form_id,
			data: user_data,
			tags: [kTAG_ENTITY_FNAME, kTAG_ENTITY_LNAME, kTAG_ENTITY_EMAIL],
			requested_tags: [kTAG_ENTITY_FNAME, kTAG_ENTITY_LNAME, kTAG_ENTITY_EMAIL],
			type: "Personal"
		});
		$(this).add_forms({
			form_id: form_id,
			data: user_data,
			tags: [kTAG_ENTITY_AFFILIATION, kTAG_ENTITY_TYPE],
			readonly_tags: [kTAG_ENTITY_AFFILIATION],
			type: "Job"
		});
		$(this).add_forms({
			form_id: form_id,
			data: user_data,
			tags: [kTAG_RECORD_CREATED, kTAG_RECORD_MODIFIED, kTAG_CONN_USER, kTAG_ENTITY_PGP_FINGERPRINT, kTAG_ENTITY_PGP_KEY],
			readonly_tags: [kTAG_RECORD_CREATED, kTAG_RECORD_MODIFIED, kTAG_ENTITY_PGP_FINGERPRINT],
			requested_tags: [kTAG_CONN_USER, kTAG_ENTITY_PGP_FINGERPRINT, kTAG_ENTITY_PGP_KEY],
			type: "Account"
		});
		$(this).find("input").focus(function(e) {
			tmp_val = e.target.value;
		});
		$(this).find("input").blur(function(e) {
			if(e.target.value !== tmp_val) {
				apprise("Do you want to save \"" + e.target.value + "\"?", {"confirm": "true"}, function(r){
					if(r) {
						// Launch Service to save data
					}
				});
			}
		});

		// objpp.storage_group = "session";
		// objpp[kAPI_REQUEST_OPERATION] = kAPI_OP_GET_UNIT;
		// objpp.parameters = {};
		// objpp.parameters[kAPI_REQUEST_LANGUAGE] = lang;
		// objpp.parameters[kAPI_REQUEST_PARAMETERS] = {};
		// objpp.parameters[kAPI_REQUEST_PARAMETERS][kAPI_PARAM_LOG_REQUEST] = "true";
		// objpp.parameters[kAPI_REQUEST_PARAMETERS][kAPI_PARAM_ID] = user_data[kTAG_ENTITY_AFFILIATION][kAPI_PARAM_RESPONSE_FRMT_DISP];
		// objpp.parameters[kAPI_REQUEST_PARAMETERS][kAPI_PARAM_DATA] = kAPI_RESULT_ENUM_DATA_FORMAT;
		// $.ask_to_service(objpp, function(a) {
		// 	if(a[kAPI_RESPONSE_STATUS][kAPI_STATUS_STATE] == "ok" && $.obj_len(a[kAPI_RESPONSE_RESULTS]) > 0) {
		// 		$.each(a[kAPI_RESPONSE_RESULTS], function(domain, data) {
		// 			$("#personal_form #" + form_id).append('<div class="form-group"><label class="col-sm-4 control-label">' + user_data[kTAG_ENTITY_AFFILIATION][kAPI_PARAM_RESPONSE_FRMT_NAME] + '</label><div class="col-sm-8"><p class="form-control-static">' + data[kTAG_NAME][kAPI_PARAM_RESPONSE_FRMT_DISP] + '</p></div>');
		// 		});
		// 	}
		// });

	};

	$.get_authority = function(domain){
		var objpp = {};
		objpp.storage_group = "session";
		objpp[kAPI_REQUEST_OPERATION] = kAPI_OP_GET_UNIT;
		objpp.parameters = {};
		objpp.parameters[kAPI_REQUEST_LANGUAGE] = lang;
		objpp.parameters[kAPI_REQUEST_PARAMETERS] = {};
		objpp.parameters[kAPI_REQUEST_PARAMETERS][kAPI_PARAM_LOG_REQUEST] = "true";
		objpp.parameters[kAPI_REQUEST_PARAMETERS][kAPI_PARAM_ID] = domain;
		objpp.parameters[kAPI_REQUEST_PARAMETERS][kAPI_PARAM_DATA] = kAPI_RESULT_ENUM_DATA_FORMAT;
		$.ask_to_service(objpp, function(a) {
			if(a[kAPI_RESPONSE_STATUS][kAPI_STATUS_STATE] == "ok" && $.obj_len(a[kAPI_RESPONSE_RESULTS]) > 0) {
				$.each(a[kAPI_RESPONSE_RESULTS], function(domain, data) {
					console.log(data[kTAG_NAME]);
					return data[kTAG_NAME];
				});
			}
		});
	};

/*======================================================================================*/

$(document).ready(function() {
	$.site_conf(function() {
		$.check_version();

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
			$("nav a[title]").tooltip({placement: "bottom", container: "body"});
			$("#map_toolbox a, #map_sub_toolbox a").tooltip({placement: "left", container: "body"}).click(function() {
				$(this).tooltip("hide");
			});

			$.shortcuts();
			$("#login").on("shown.bs.modal", function(e) {
				e.preventDefault();
				$("#login_btn").removeClass("disabled").attr("disabled", false);
				$("#login-username").focus();

				$("#login_btn").on("click", function() {
					$.login();
				});
			});

			if(current_path == "Search") {
				$.get_statistics();

				if($.obj_len(query) > 0) {
					if($("#breadcrumb").css("display") == "none") {
						$("#breadcrumb").fadeIn(200);
					}

					$.search_fulltext(query.q);
				}
			}
			if(current_path == "Search" || current_path == "Advanced_search") {
				document.location.hash = "";
				window.onhashchange = function() {
					$.manage_url();
				};
				$.manage_url();

				$("#search_tips").click(function(){
					apprise('To search all occurrences of words, separate them with a space, for instance:<br /><kbd>Forest area managed for wood production</kbd> will select all records containing any of the following words: <i>forest</i>, <i>area</i>, <i>managed</i>, <i>wood</i> and <i>production</i>.<p>To search all occurrences matching a specific phrase, enclose it in double quotes <kbd><b style="color: #ff0000 !important;">&quot;</b></kbd>, for instance:<br /><kbd><b style="color: #ff0000 !important;">&quot;</b>forest area managed for wood production<b style="color: #ff0000 !important;">&quot;</b></kbd> will select all records matching the full phrase.</p><p>To exclude a term from the results prefix it with a minus <kbd><b style="color: #ff0000 !important;">-</b></kbd> sign, for instance:<br /><kbd>forest <b style="color: #ff0000 !important;">-</b>wood</kbd> will select all records matching the word <i>forest</i> and not matching the word <i>wood</i>.</p><p>The same is true for phrases, for instance:<br /><kbd><b style="color: #ff0000 !important;">-</b>&quot;research organization&quot; genebank</kbd> will select all records containing the word <i>genebank</i> but not the phrase <i>research organization</i>.</p><p>The search is case insensitive.</p>', {
						title: "Search tips",
						icon: "fa-keyboard-o",
						titleClass: "text-info",
						textOk: "Ok",
						allowExit: true
					});
				});
				$.get_operators_list();
			}
			$.check_logged_user();
			if(current_path == "Profile") {
				if($.cookie("l") !== undefined && $.cookie("l") !== null && $.cookie("l") !== "") {
					//$.generate_personal_form(storage.get("pgrdg_cache.session." + $.cookie("l") + ".data"));
				}
			}
		}
	});
});
