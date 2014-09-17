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
			param_nob64 = config.service.url + "Service.php?" + kAPI_REQUEST_OPERATION + "=" + options + "&" + kAPI_REQUEST_LANGUAGE + "=" + lang + "&" + kAPI_REQUEST_PARAMETERS + "={}";
			verbose_param = config.service.url + "Service.php?" + kAPI_REQUEST_OPERATION + " BASE64(" + options + ") &" + kAPI_REQUEST_LANGUAGE + "=" + lang + "&" + kAPI_REQUEST_PARAMETERS + "={}";

			object_param[kAPI_REQUEST_OPERATION] = options;
			object_param[kAPI_REQUEST_LANGUAGE] = lang;
			object_param[kAPI_REQUEST_PARAMETERS] = {};
		} else {
			param = kAPI_REQUEST_OPERATION + "=" + $.utf8_to_b64(opt[kAPI_REQUEST_OPERATION] + "&" + kAPI_REQUEST_LANGUAGE + "=" + opt.parameters[kAPI_REQUEST_LANGUAGE] + "&" + kAPI_REQUEST_PARAMETERS + "=" + JSON.stringify(opt.parameters[kAPI_REQUEST_PARAMETERS]));
			param_nob64 = config.service.url + "Service.php?" + kAPI_REQUEST_OPERATION + "=" + opt[kAPI_REQUEST_OPERATION] + "&" + kAPI_REQUEST_LANGUAGE + "=" + opt.parameters[kAPI_REQUEST_LANGUAGE] + "&" + kAPI_REQUEST_PARAMETERS + "=" + encodeURI(JSON.stringify(opt.parameters[kAPI_REQUEST_PARAMETERS]));
			verbose_param = config.service.url + "Service.php?" + kAPI_REQUEST_OPERATION + "= BASE64(" + opt[kAPI_REQUEST_OPERATION] + "&" + kAPI_REQUEST_LANGUAGE + "=" + opt.parameters[kAPI_REQUEST_LANGUAGE] + "&" + kAPI_REQUEST_PARAMETERS + "= URL_ENCODED(" + JSON.stringify(opt.parameters[kAPI_REQUEST_PARAMETERS]) + "))";

			object_param[kAPI_REQUEST_OPERATION] = opt[kAPI_REQUEST_OPERATION];
			object_param[kAPI_REQUEST_LANGUAGE] = opt.parameters[kAPI_REQUEST_LANGUAGE];
			object_param[kAPI_REQUEST_PARAMETERS] = opt.parameters[kAPI_REQUEST_PARAMETERS];
		}
		if($.storage_exists(opt.storage_group + "." + $.md5(param)) && opt.storage_group !== "") {
			var response = storage.get("pgrdg_cache." + opt.storage_group + "." + $.md5(param) + ".response");
			if(response[kAPI_RESPONSE_STATUS][kAPI_STATUS_STATE] == "ok") {
				response.id = $.md5(param);
				response.extra_data = opt.extra;
				response.query = {
					effective: param,
					nob64: param_nob64,
					verbose: verbose_param,
					obj: object_param
				};

				callback(response);
			} else {
				$("#loader").fadeOut(0);
				if(config.site.developer_mode) {
					alert("There's an error in the response:<br />See the console for more informations");
					console.group("The Service has returned an error");
						console.warn(param);
						console.warn(param_nob64);
						console.warn(verbose_param);
						console.warn(object_param);
						console.dir(response);
						console.error(response[kAPI_RESPONSE_STATUS][kAPI_STATUS_STATE]);
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
						if(opt.storage_group == "local" || opt.storage_group == "ask") {
							$("#loader").addClass("system");
						} else {
							$("#loader").removeClass("system");
						}
						$("#loader").fadeIn(0);
						// if($("#apprise.ask_service").length === 0) {
						// 	apprise("", {class: "ask_service", title: "Extracting data...", titleClass: "text-info", icon: "fa-circle-o-notch fa-spin", progress: true, allowExit: false});
						// } else {
						// 	if($("#apprise.ask_service").css("display") == "none") {
						// 		$("#apprise.ask_service").modal("show");
						// 	}
						// }
					}
				}
			} else {
				var $element = opt.loaderType,
				element_data = $element.html();
				$element.html('<span class="fa fa-fw fa-refresh fa-spin"></span>' + ((opt.loaderText !== "") ? opt.loaderText : ""));
			}
			if(config.site.developer_mode) {
				console.log("Fetching:\n", param);
				console.log("(", param_nob64, ")");
			}
			$.cryptAjax({
				url: "API/",
				dataType: "json",
				// dataFilter: function(data, type) {
				// 	if(type !== "json") {
				// 		return JSON.parse(data);
				// 	}
				// },
				type: "POST",
				timeout: 30000,
				data: {
					jCryption: $.jCryption.encrypt(param, password),
					type: "ask_service"
				},
				success: function(response) {
					response.id = $.md5(param);
					response.extra_data = opt.extra;
					response.query = {
						effective: param,
						nob64: param_nob64,
						verbose: verbose_param,
						obj: object_param
					};

					if($.type(response) == "object") {
						if(response[kAPI_RESPONSE_STATUS][kAPI_STATUS_STATE] == "ok") {
							if(options.colour !== undefined && options.colour !== null && options.colour === true) {
								var rgba = {r:255, g:0, b:0, a:1},
								g = 0,
								b = 0,
								h = $.obj_len(response[kAPI_RESPONSE_RESULTS]);
								i = 0;
								$.each(response[kAPI_RESPONSE_RESULTS], function(k, v){
									g = Math.round(i/($.obj_len(response[kAPI_RESPONSE_RESULTS]) - 1) * 255);
									b = Math.round(h/($.obj_len(response[kAPI_RESPONSE_RESULTS])) * 100);
									h--;
									i++;
									rgba.g = g;
									rgba.b = b;
									v.colour = $.set_colour({colour: rgba});
									if(!$.storage_exists("search")) {
										storage.set("pgrdg_cache.search", {});
									}
									storage.set("pgrdg_cache.search.domain_colours." + k, $.set_colour({colour: rgba}));
								});
							}
							if(opt.storage_group !== "") {
								storage.set("pgrdg_cache." + opt.storage_group + "." + $.md5(param), {
									"date": {"utc": new Date(), "timestamp": $.now()},
									"query": {
										"effective": param,
										"nob64": param_nob64,
										"verbose": verbose_param,
										"obj": object_param
									},
									"response": response
								});
								if(config.site.developer_mode) {
									console.group("Storage \"" + opt.storage_group + "\" saved...");
									console.warn("id: ", $.md5(param));
									console.warn(param_nob64);
									console.groupEnd();
								}
							}
							if(typeof(opt.loaderType) == "string") {
								$("#loader").fadeOut(0);
								// $("#apprise.ask_service").modal("hide");
								callback(response);
							} else {
								$element.html(element_data);
								callback(response);
							}
						} else {
							$("#loader").fadeOut(0);
							if(config.site.developer_mode) {
								console.warn("!!!", param_nob64, response);
								alert("There's an error in the response:<br />See the console for more informations");
								console.group("The Service has returned an error");
									console.warn(param);
									console.warn(param_nob64);
									console.warn(verbose_param);
									console.warn(object_param);
									console.dir(response);
									console.error(response[kAPI_RESPONSE_STATUS][kAPI_STATUS_STATE]);
								console.groupEnd();
							}
						}
					} else {
						console.warn("!!!", param_nob64, response);
						alert("There's an error in the response:<br />See the console for more informations");
						console.group("The Service has returned an error");
							console.warn(param);
							console.warn(param_nob64);
							console.warn(verbose_param);
							console.warn(object_param);
							console.dir(response);
						console.groupEnd();
					}
				},
				error: function(x, t, response) {
					$("#loader").fadeOut(0);
					$.display_error_msg("There was an error in your request, please try again later");
					if(t === "timeout") {
						if(config.site.developer_mode) {
							console.log("got timeout");
						}
				        } else {
						if(config.site.developer_mode) {
							console.warn("!!!", response);
							console.group("The Service has returned an error");
								console.warn(param);
								console.warn(param_nob64);
								console.warn(verbose_param);
								console.warn(object_param);
								console.warn(response);
							console.groupEnd();
						}
						$("#loader").fadeOut(0);
						// $("#apprise.ask_service").modal("destroy");
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
							$("#section #summary .panel_content-body.disabled:before, section #se_p .panel_content-body.disabled:before").css({
								"margin-left": "-15px",
								"text-indent": "15px"
							});
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
					if($.storage_exists("interface")) {
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
					$("#contents > .panel_content .panel_content-head, #contents > .panel_content .panel_content-body, #contents > .panel_content .panel_content-footer, #start > div").animate({
						"padding-left": (movement + 15) + "px"
					}, 150);

					// Save the left_panel position
					storage.set("pgrdg_cache.interface.left_panel", {status: "open"});
					break;
			}
		}
	};

	/**
	 * Add right buttons on the breadcrumb
	 */
	$.breadcrumb_right_buttons = function() {
		if($.storage_exists("search.criteria")) {
			if($("#breadcrumb").length > 0) {
				if($("#breadcrumb .breadcrumb li.no-divider.pull-right").length === 0) {
					var li_no_divider = $('<li class="no-divider pull-right">'),
					btn_group = $('<div class="btn-group">'),
					//a_show_history = $('<a class="btn btn-xs btn-default-grey" href="javascript: void(0);" onclick="$.show_storage_data(\'search.criteria\');" title="Manage search history"><span class="fa fa-fw fa-list text-center"></span></a>'),
					a_reset_history = $('<a class="btn btn-xs btn-default-grey text-danger" href="javascript: void(0);" onclick="$.clear_history();" title="Reset all search history"><span class="fa fa-fw fa-times text-center text-danger"></span>Reset all searches</a>');

					//a_show_history.appendTo(btn_group);
					a_reset_history.appendTo(btn_group);
					btn_group.appendTo(li_no_divider);
					$("#breadcrumb .breadcrumb").append(li_no_divider);
				}
			} else {
				//console.log($.obj_len(query), current_path);
				if((current_path == "Search" && $.obj_len(query) > 0) && current_path !== "Advanced_search") {
					var breadcrumb_div = $('<div id="breadcrumb" style="position: relative; top: 0; display: block;"></div>'),
					breadcrumb_ol = $('<ol class="breadcrumb">'),
					breadcrumb_li = $('<li id="goto_forms_btn"><a href="./Advanced_search#Forms"><span class="text-muted fa fa-tasks"></span><span class="txt">Active form</span></a></li>');

					breadcrumb_li.appendTo(breadcrumb_ol);
					breadcrumb_ol.appendTo(breadcrumb_div);
					$("section.container").prepend(breadcrumb_div);
				}
			}
		}
	}

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
					case "Summary":
						$("#results").hide();
						$("#map").hide();
						$("#pgrdg_map").hide();
						break;
					case "Results":
						$("#summary").hide();
						$("#map").hide();
						$("#pgrdg_map").hide();
						break;
					case "Map":
						$("#results").hide();
						$("#summary").hide();
						break;
				}
			} else {
				// Remove all other pages if user returns to the forms page
				switch(hash.toLowerCase()) {
					case "forms":
						$.remove_breadcrumb("summary");
						$.reset_contents("summary", true);
						$.remove_breadcrumb("results");
						$.reset_contents("results", true);
						$.remove_breadcrumb("map");
						$.reset_contents("map", true);
						break;
					case "summary":
						$.remove_breadcrumb("results");
						$.reset_contents("results", true);
						$.remove_breadcrumb("map");
						$.reset_contents("map", true);
						break;
				}
			}
			$.each($("#breadcrumb .breadcrumb li:visible:not(:last-child)"), function(i, v) {
				var $this = $(v);
				var item_id = $this.attr("id"),
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
						$.each($("#se_results > div"), function(i, $v) {
							if($(this).attr("id") !== hash.toLowerCase() && $(this).attr("id") !== "loader_bg"){
								$(this).hide();
							}
						});
						if($("#contents #" + hash.toLowerCase() + " h1").html().length > 0) {
							$("#contents #" + hash.toLowerCase()).fadeIn(300);
						}
						storage.set("pgrdg_cache.search.criteria.fulltext", $("#search_form").val());
					}
				}
			}
		}
	};

	/**
	 * Reset the entire storage and reload current page
	 */
	$.clear_history = function() {
		apprise("Are you sure you want to clear all searches?", {title: "Warning", icon: "warning", confirm: true}, function(r) {
			if(r) {
				storage.remove("pgrdg_cache.search.criteria");
				if(current_path == "Search" && $.obj_len(query) > 0) {
					window.location.href = "./Search";
				} else {
					document.location.reload();
				}
			}
		});
	};

	/**
	 * Check the latest version on config and compare it with saved.
	 * Note that if you want to reset the user storage, you need to update the site's config file
	 */
	$.check_version = function() {
		$.reset_storage = function(last_version) {
			//storage.remove("pgrdg_cache");
			storage.set("pgrdg_cache.version", last_version);
		};

		if($.storage_exists("version")) {
			if(storage.get("pgrdg_cache.version") !== config.site.version) {
				$.reset_storage(config.site.version);
			}
		} else {
			$.reset_storage(config.site.version);
		}
	};


/*=======================================================================================
*	STORAGE
*======================================================================================*/

	/**
	* Split and iterate a given storage address and return false if encounter a non-existing level
	*/
	$.storage_exists = function(path) {
		path = path.replace("pgrdg_cache", "");
		var all_path = $.array_clean(path.split(".")),
		vv = "",
		is_set = true;
		for(var i = 0; i < all_path.length; i++) {
			vv += ((i === 0) ? "" : ".") + all_path[i];
			if(storage.isSet("pgrdg_cache." + vv)) {
				if($.type(storage.get("pgrdg_cache." + vv)) == "object") {
					if($.obj_len(storage.get("pgrdg_cache." + vv)) > 0) {
						is_set = true;
					} else {
						is_set = false;
					}
				} else {
					if(storage.get("pgrdg_cache." + vv) !== "") {
						is_set = true;
					} else {
						is_set = false;
					}
				}
			} else {
				is_set = false;
			}
		}
		return is_set;
	};

	/**
	* Remove given storage checking before if exists or is empty
	*/
	$.remove_storage = function(name) {
		if($.storage_exists(name)) {
			storage.remove(name);
		}
	};

	/**
	* Show all data of searches saved on the storage.
	* Function disabled, only for future purposes
	*/
	$.show_storage_data = function(subject) {
		$.recurse_obj = function(obj) {
			var container = $('<div>'),
			ul = $('<ul class="list-unstyled">'),
			li = $('<li>'),
			p = $('<p>'),
			hr = $('<hr />');

			switch($.type(obj)) {
				case "object":
					$.each(obj, function(k, v) {
						if($.type(v) == "object") {
							li.append($.recurse_obj(v));
						} else if($.type(v) == "array"){
							li.html(v.join(", "));
						} else {
							li.html(v);
						}
						if(li.length > 0 && li.html() !== "") {
							ul.append(li);
						}
					});
					container.html(ul).append(hr);
					break;
				case "array":
					li.html(obj.join(", "));
					ul.append(li);
					container.append(ul);
					break;
				default:
					p.html(obj);
					container.html(p).append(hr);
					break;
			}
			return container.html();
		};
		if($.storage_exists(subject.replace("pgrdg_cache", ""))) {
			$("#saved_history").html("");
			$.each(storage.get("pgrdg_cache." + subject), function(k, v) {
				// if(k == "forms") {
				// 	//$("#saved_history").append('<h5>' + $.ucfirst(k) + '</h5>');
				// })
				$("#saved_history").append('<h4>' + $.ucfirst(k) + '</h4>' + $.recurse_obj(v));
			});
			$("#storage").modal("show");
		}
	};


/*=======================================================================================
*	LOGIN AND LOGGED USER INTERFACE
*======================================================================================*/

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
			if($.storage_exists("session." + username)) {
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
				// 	apprise("Are you sure you want to leave this page?", {"confirm": "true"}, function(r) {
				// 		if(r) {
				// 			return false;
				// 		}
				// 	});
				// };
				/*
				window.onbeforeunload = function() {
					return "You have unsaved changes\nAre you sure you want to leave this page?";
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

	/**
	 * Create the form for user personal data
	 */
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

	/**
	 * Get the authority type from given domain
	 */
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


/*=======================================================================================
*	OTHER FUNCTIONS
*======================================================================================*/

	/**
	 * Generate colours
	 */
	$.set_colour = function(options, alpha) {
		var opt = $.extend({
			range: [],
			colour: {r:252, g:193, b:83}
		}, options);
		var rgba = {};

		if(alpha === undefined || alpha === null) {
			alpha = 1;
		} else {
			if(alpha == "random") {
				alpha = "0." + (Math.floor(Math.random() * 9));
			} else {
				if(alpha > 1) {
					alpha = 1;
				} else if(alpha < 0) {
					alpha = 0;
				}
			}
		}
		if($.type(options) == "string") {
			if(options == "random") {
				rgba = {
					r: (Math.floor(Math.random() * 256)),
					g: (Math.floor(Math.random() * 256)),
					b: (Math.floor(Math.random() * 256))
				};
			} else {
				switch(options) {
					// Black & white scale
					case "white":		rgba = {r: 255, g: 255, b: 255};	break;							return "rgba(255, 255, 255, " + alpha + ")";		break;
					case "light-grey": 	rgba = {r:204, g:204, b:204};		break;
					case "dark-grey": 	rgba = {r:102, g:102, b:102};		break;
					case "black":		rgba = {r:0, g:0, b:0};			break;
					// Colour scale
					case "red": 		rgba = {r:255, g:0, b:0};		break;
					case "orange": 		rgba = {r:255, g:150, b:0};		break;
					case "yellow": 		rgba = {r:255, g:255, b:0};		break;
					case "green": 		rgba = {r:0, g:255, b:0};		break;
					case "aqua": 		rgba = {r:0, g:255, b:255};		break;
					case "blue": 		rgba = {r:0, g:0, b:255};		break;
					case "turquoise":	rgba = {r:150, g:100, b:255};		break;
					case "violet": 		rgba = {r:150, g:0, b:255};		break;
					case "pink": 		rgba = {r:255, g:0, b:255};		break;
					case "purple": 		rgba = {r:255, g:0, b:150};		break;
					case "brown": 		rgba = {r:150, g:100, b:0};		break;
					// Bioversity colours
					case "bio-green": 	rgba = {r:193, g:216, b:47};		break;
					case "bio-orange": 	rgba = {r:238, g:170, b:48};		break;
					default:
						rgba = {r:opt.colour.r, g:opt.colour.g, b:opt.colour.b};
						break;
				}
			}
		} else {
			rgba = {r:opt.colour.r, g:opt.colour.g, b:opt.colour.b};
		}

		return "rgba(" + rgba.r + ", " + rgba.g + ", " + rgba.b + ", " + alpha + ")";
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
		objp.colour = true;

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

/*======================================================================================*/

$(document).ready(function() {
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
			$.manage_url(document.location.hash.replace("#", ""));
		};
		$.manage_url();

		$("#search_tips").click(function(){
			apprise(i18n[lang].interface.search_tips, {
				tag: "p",
				title: "Search tips",
				icon: "fa-keyboard-o",
				titleClass: "text-info",
				textOk: "Close",
				okBtnClass: "btn-default-grey",
				allowExit: true
			});
		});
		$.get_operators_list();

		if(config.site.developer_mode) {
			var li_dev = $('<li class="btn-group">'),
			a_dev = $('<a class="btn btn-link" data-toggle="dropdown" href="javascript: void(0);"><span class="fa fa-wrench"></span> Developer <span class="caret"></span>'),
			sub_ul_dev = $('<ul role="menu" class="dropdown-menu">')
			li_divider_dev = $('<li class="divider">');

			sub_ul_dev.append('<li><a href="javascript: void(0);" onclick="storage.remove(\'pgrdg_cache\'); location.reload();"><span class="fa fa-eraser"></span>&nbsp;Reset storage</a></li>');
			sub_ul_dev.append('<li class="divider"></li>');
			sub_ul_dev.append('<li><a href="javascript: void(0);" onclick="load_firebug();"><span class="fa fa-bug"></span>&nbsp;Load Firebug-Lite</a></li>');
				li_dev.append(a_dev);
			li_dev.append(sub_ul_dev);
			$("header #nav.navbar.right .navbar-collapse > ul").append(li_dev)
		}
	}
	$.check_logged_user();
	if(current_path == "Profile") {
		if($.cookie("l") !== undefined && $.cookie("l") !== null && $.cookie("l") !== "") {
			//$.generate_personal_form(storage.get("pgrdg_cache.session." + $.cookie("l") + ".data"));
		}
	}

	$.breadcrumb_right_buttons();
	if(current_path == "Search" && $("#breadcrumb").length > 0) {
		$("#breadcrumb .breadcrumb").prepend('<li id="goto_forms_btn"><a href="./Advanced_search#Forms"><span class="text-muted fa fa-tasks"></span><span class="txt">Active form</span></a></li>');
	}
});