$.browser_cookie_status = function() { var cookieEnabled = (navigator.cookieEnabled) ? true : false; if (typeof navigator.cookieEnabled == "undefined" && !cookieEnabled) { document.cookie = "testcookie"; cookieEnabled = (document.cookie.indexOf("testcookie") != -1) ? true : false; } return (cookieEnabled); }
$.rawurlencode = function(str) { str = (str+'').toString(); return encodeURIComponent(str).replace(/!/g, '%21').replace(/'/g, '%27').replace(/\(/g, '%28').replace(/\)/g, '%29').replace(/\*/g, '%2A'); };
$.rawurldecode = function(str) { return decodeURIComponent((str + '').replace(/%(?![\da-f]{2})/gi, function () { return '%25'; })); };
$.utf8_to_b64 = function(str) { return window.btoa(unescape(encodeURIComponent(str))); };
$.b64_to_utf8 = function(str) { return decodeURIComponent(escape(window.atob(str))); };
$.ucfirst = function(str) { str += ""; var f = str.charAt(0).toUpperCase(); return f + str.substr(1); };
$.makeid = function() { var text = "", possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"; for(var i = 0; i <= 16; i++) { text += possible.charAt(Math.floor(Math.random() * possible.length)); } return text; };
$.fn.serializeObject = function() { var o = {}; var a = this.serializeArray(); $.each(a, function() { if (o[this.name] !== undefined) { if (!o[this.name].push) { o[this.name] = [o[this.name]]; } o[this.name].push(this.value || ''); } else { o[this.name] = this.value || ''; }}); return o; };

/**
* Global vars
*/
var lang = "en",
service_url = "API/?type=service&proxy=",
system_constants,
operators = [],
password = $.makeid(),
auth = false,
storage = $.localStorage,
url = $.url().attr(),
url_paths = url.path.split("/"),
current_path = url_paths[url_paths.length - 1];
/*
-----------------------------------------------------------------------
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
$.ask_to_service = function(options, callback) {
	var opt = $.extend({
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
	var param, param_nob64, verbose_param;
	if(typeof(options) == "string") {
		param = "address=" + $.utf8_to_b64(options) + "&" + kAPI_REQUEST_LANGUAGE + "=" + lang + "&" + kAPI_REQUEST_PARAMETERS + "={}";
		param_nob64 = "address=" + options + "&" + kAPI_REQUEST_LANGUAGE + "=" + lang + "&" + kAPI_REQUEST_PARAMETERS + "={}";
		verbose_param = "address= BASE64(" + options + ") &" + kAPI_REQUEST_LANGUAGE + "=" + lang + "&" + kAPI_REQUEST_PARAMETERS + "={}";
	} else {
		param = "address=" + $.utf8_to_b64(opt[kAPI_REQUEST_OPERATION] + "&" + kAPI_REQUEST_LANGUAGE + "=" + opt.parameters[kAPI_REQUEST_LANGUAGE] + "&" + kAPI_REQUEST_PARAMETERS + "=" + JSON.stringify(opt.parameters.param));
		param_nob64 = "address=" + opt[kAPI_REQUEST_OPERATION] + "&" + kAPI_REQUEST_LANGUAGE + "=" + opt.parameters[kAPI_REQUEST_LANGUAGE] + "&" + kAPI_REQUEST_PARAMETERS + "=" + encodeURI(JSON.stringify(opt.parameters.param));
		verbose_param = "address= BASE64(" + opt[kAPI_REQUEST_OPERATION] + "&" + kAPI_REQUEST_LANGUAGE + "=" + opt.parameters[kAPI_REQUEST_LANGUAGE] + "&" + kAPI_REQUEST_PARAMETERS + "= URL_ENCODED(" + JSON.stringify(opt.parameters.param) + "))";
	}
	if(!storage.isEmpty("pgrdg_cache.ask") && storage.isSet("pgrdg_cache.ask." + $.md5(param))) {
		var response = storage.get("pgrdg_cache.ask." + $.md5(param) + ".response");
		if(response.status.state == "ok") {
			response.id = $.md5(param);
			callback(response);
		} else {
			alert("There's an error in the response:<br />See the console for more informations");
			console.group("The Service has returned an error");
				console.error(response.status.message);
				console.warn(param);
				console.warn(param_nob64);
				console.warn(verbose_param);
				console.dir(response);
				console.groupEnd();
			
			
			$("body").bind("keydown", "esc", function(e) {
				$(".modal").modal("hide");
			});
		}
	} else {
		//if(options != __["kAPI_OP_LIST_CONSTANTS"]) {
			//console.log("address=" + opt.op + "&lang=" +opt.parameters.lang + "&param=" + JSON.stringify(opt.parameters.param));
			if(typeof(opt.loaderType) == "string") {
				if($("#apprise.ask_service").length == 0) {
					apprise("", {class: "ask_service", title: "Extracting data...", titleClass: "text-info", icon: "fa-spinner fa-spin", progress: true, allowExit: false});
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
					storage.set("pgrdg_cache.ask." + $.md5(param), {"query": {"effective": param, "verbose": verbose_param}, "response": response});
					response.id = $.md5(param);
					if(response.status.state == "ok") {
						if(typeof(opt.loaderType) == "string") {
							$("#apprise.ask_service").modal("hide");
							callback(response);
						} else {
							$element.html(element_data);
							callback(response);
						}
					} else {
						alert("There's an error in the response:<br />See the console for more informations");
						console.group("The Service has returned an error");
							console.error(response.status.message);
							console.warn(param);
							console.warn(param_nob64);
							console.warn(verbose_param);
							console.dir(response);
							console.groupEnd();
					}
				},
				error: function() {
					$("#apprise.ask_service").modal("destroy");
					if($("#apprise.service_coffee").length == 0) {
						apprise("The Service is temporarily unavailable.<br />Try again later...", {class: "service_coffee", title: "Taking coffee...", titleClass: "text-warning", icon: "fa-coffee", progress: true, allowExit: false});
					}
					setTimeout(function() {
						$.ask_to_service(options, callback);
					}, 3000);
				}
			});
		//}
	}
};
$.resize_forms_mask = function() { $.each($(".panel-mask"), function(i, d) { $(this).css("width", (parseInt($(this).closest(".vcenter").find(".panel").css("width")) - 1) + "px"); }); }
$.left_panel = function(subject, width, callback) {
	if(width == "" || width == undefined) {
		var width = 488;
	}
	movement = width;
	width += "px";
	$("#left_panel").css({
		"width": width
	});
	var content_witdth = $("#forms-body").css("width");
	if($("#left_panel").hasClass("visible") && subject !== "open") {
		if(subject == "close") {
			$(".olControlZoom").animate({"left": "10px"}, 200);
			$("#left_panel").animate({"left": "-" + width}, 200, "swing", function() {
				$.resize_forms_mask();
				$(this).removeClass("visible");
				
				// Callback
				if (typeof callback == "function") {
					callback.call(this);
				}
			});
			$("#breadcrumb").animate({"padding-left": "0px"}, 200).find(".breadcrumb").animate({"padding-left": "35px"}, 200);
			$(".panel_content-head, .panel_content-body").animate({"padding-left": "35px"}, 200, function() {
				$("#left_panel .folder_menu").animate({"right": "-258px"}, 200);
			});
		} else {
			$.left_panel("close");
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
			});
			$("#breadcrumb").delay(200).animate({"padding-left": width}, 250).find(".breadcrumb").animate({"padding-left": "15px"}, 250);
			$(".panel_content-head, .panel_content-body").delay(200).animate({"padding-left": (movement+15) + "px"}, 150);
		}
	}
};

$.shortcuts = function() {
	/*
	You can see all available characters key here:
	http://htmlpreview.github.io/?https://github.com/jeresig/jquery.hotkeys/master/test-static-05.html
	*/
	
	// Shortcuts ever available
	$("body, #find_location input").bind("keydown", "alt+0", function(e) {
		if($("header").hasClass("map")) {
			e.preventDefault();
			$.center_map_on("World");
			$("#selected_zone").text("World").fadeIn(300);
		}
		return false;
	}).bind("keydown", "alt+1", function(e) {
		if($("header").hasClass("map")) {
			e.preventDefault();
			$.center_map_on("Africa");
		}
		return false;
	}).bind("keydown", "alt+2", function(e) {
		if($("header").hasClass("map")) {
			e.preventDefault();
			$.center_map_on("Antarctica");
		}
		return false;
	}).bind("keydown", "alt+3", function(e) {
		if($("header").hasClass("map")) {
			e.preventDefault();
			$.center_map_on("Asia");
		}
		return false;
	}).bind("keydown", "alt+4", function(e) {
		if($("header").hasClass("map")) {
			e.preventDefault();
			$.center_map_on("Europe");
		}
		return false;
	}).bind("keydown", "alt+5", function(e) {
		if($("header").hasClass("map")) {
			e.preventDefault();
			$.center_map_on("North America");
		}
		return false;
	}).bind("keydown", "alt+6", function(e) {
		if($("header").hasClass("map")) {
			e.preventDefault();
			$.center_map_on("Oceania");
		}
		return false;
	}).bind("keydown", "alt+7", function(e) {
		if($("header").hasClass("map")) {
			e.preventDefault();
			$.center_map_on("South America");
		}
		return false;
	}).bind("keydown", "alt+8", function(e) {
		if($("header").hasClass("map")) {
		}
		return false;
	}).bind("keydown", "alt+9", function(e) {
		if($("header").hasClass("map")) {
			e.preventDefault();
			// Fix for ALT+I and F1 confusion
			if(e.keyCode == 105){
				//$.center_map_on("Your position");
				return false;
			} else {
				return false;
			}
		}
		return false;
	}).bind("keydown", "alt+i F1", function(e) {
		if($("header").hasClass("map")) {
			e.preventDefault();
			if(e.keyCode != 105){
				$.show_help();
			}
		}
		return false;
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
	}).bind("keydown", "alt+l", function(e) {
		if($("header").hasClass("map")) {
			e.preventDefault();
			$.toggle_lock_view();
		}
		return false;
	}).bind("keydown", "alt+t", function(e) {
		if($("header").hasClass("map")) {
			e.preventDefault();
			if(!$("#pgrdg_map").hasClass("locked")) {
				$.sub_toolbox("change_map");
			}
		}
		return false;
	}).bind("keydown", "alt++", function(e) {
		if($("header").hasClass("map")) {
			e.preventDefault();
			if(!$("#pgrdg_map").hasClass("locked")) {
				$("#selected_zone").text("Zoom in").fadeIn(300);
				$.increase_zoom();
			}
		}
		return false;
	}).bind("keydown", "alt+-", function(e) {
		if($("header").hasClass("map")) {
			e.preventDefault();
			if(!$("#pgrdg_map").hasClass("locked")) {
				$("#selected_zone").text("Zoom out").fadeIn(300);
				$.decrease_zoom();
			}
		}
		return false;
	}).bind("keydown", "alt+left", function(e) {
		$.left_panel("close");
		return false;
	}).bind("keydown", "alt+right", function(e) {
		$.left_panel("open");
		return false;
	}).bind("keydown", "esc", function(e) {
		//e.preventDefault();
		//$.left_panel("close");
		if($("header").hasClass("map")) {
			$.stop_measurements();
			$.sub_toolbox("close");
		}
		return false;
	}).bind("keydown", "alt", function(e) {
		if($("header").hasClass("map")) {
			e.preventDefault();
			$("#information_zone").html('<table><tr><th><tt>ALT<small style="font-weight: normal;">+</small>F</tt></th><td>Search a location inside a map</td></tr><tr><th><tt>ALT<small style="font-weight: normal;">+</small>L</tt></th><td>Lock/unlock map navigation</td></tr><tr><th><tt>ALT<small style="font-weight: normal;">+</small>T</tt></th><td>Open/close map background layer preferences</td></tr><tr><th><br /><tt>ALT<small style="font-weight: normal;">+</small>+</tt></th><td><br />Zoom in</td></tr><tr><th><tt>ALT<small style="font-weight: normal;">+</small>-</tt></th><td>Zoom out</td></tr><tr><th><br /><tt>ALT<small style="font-weight: normal;">+</small>0</tt></th><td><br />Entire world</td></tr><tr><th><tt>ALT<small style="font-weight: normal;">+</small>1</tt></th><td>Africa</td></tr><tr><th><tt>ALT<small style="font-weight: normal;">+</small>2</tt></th><td>Antarctica</td></tr><tr><th><tt>ALT<small style="font-weight: normal;">+</small>3</tt></th><td>Asia</td></tr><tr><th><tt>ALT<small style="font-weight: normal;">+</small>4</tt></th><td>Europe</td></tr><tr><th><tt>ALT<small style="font-weight: normal;">+</small>5</tt></th><td>North America</td></tr><tr><th><tt>ALT<small style="font-weight: normal;">+</small>6</tt></th><td>Oceania</td></tr><tr><th><tt>ALT<small style="font-weight: normal;">+</small>7</tt></th><td>South America</td></tr><tr><th><tt>ALT<small style="font-weight: normal;">+</small>9</tt></th><td>User position</td></tr></table>');
			$("#selected_zone").delay(1000).fadeOut(600, function() { $(this).text(""); });
		}
	}).bind("keyup", "alt", function(e) {
		if($("header").hasClass("map")) {
			e.preventDefault();
			$("#information_zone").html("");
			if(!$("#pgrdg_map").hasClass("locked")) {
				$("#selected_zone").delay(1000).fadeOut(600, function() { $(this).text(""); });
			}
		}
	});
	
	if($("header").hasClass("map")) {
		$("#find_location input").bind("keydown", "return", function() {
			$.sub_toolbox("find_location");
			$.search_location($(this).val());
		});
	}
};
$.show_help = function() {
	if($("header").hasClass("map")) {
		$.reset_map_toolbox();
		$("#map_toolbox_help").modal("show");
	}
}
$.manage_url = function(hash) {
	var active_li = 0,
	visible_div = 0;
	
	if(hash == undefined || hash == null || hash == "") {
		var hash = (window.location.hash.length > 0) ? window.location.hash.replace("#", "") : "";
	}
	$.each($("#contents > div:not(:hidden)"), function() {
		visible_div++;
	});
	/*
	if(visible_div == 0 && hash.length > 0 && hash !== "Map") {
		document.location.hash = "";
	} else {
		console.log("97e070da6433b360fd33fac3a1400ba4");
	*/
		document.location.hash = hash;
	/*
	}
	*/
	if($("#breadcrumb #goto_" + hash.toLowerCase() + "_btn").css("display") == "none") {
		$("#breadcrumb #goto_" + hash.toLowerCase() + "_btn").fadeIn(300);
	}
	if(hash == "Map") {
		$("header.main, section.container, #left_panel").addClass("map");
		$("#logo img").attr("src", "common/media/svg/bioversity-logo_small.svg");
		if($("#breadcrumb").css("top") == "110px") {
			$("#breadcrumb").css("top", "75px");
		}
	} else {
		if(visible_div > 0 && hash.length > 0) {
			$("header.main, section.container, #left_panel").removeClass("map");
			$("#logo img").attr("src", "common/media/svg/bioversity-logo.svg");
			if($("#breadcrumb").css("top") == "75px") {
				$("#breadcrumb").css("top", "110px");
			}
		}
	}
	
	$.each($("#breadcrumb .breadcrumb li:visible"), function(i, v) {
		if($.trim($(this).text()) !== hash) {
			$(this).html($(this).find("span.text-muted").clone().wrap('<div>').parent().html() + ' <a href="javascript:void(0);" onclick="$.manage_url(\'' + $.trim($(this).text()) + '\');" title="Return to ' + $.trim($(this).text()).toLowerCase() + ' panel">' + $.trim($(this).text()) + '</a>');
		} else {
			$(this).html($(this).find("span.text-muted").clone().wrap('<div>').parent().html() + " " + hash).closest("li").addClass("active");
		}
	});
	
	if(hash == "Map") {
		$("#contents").hide();
		$.left_panel("close");
	} else {
		if(current_path !== "Map") {
			if(visible_div > 0 && hash.length > 0) {
				$("#contents > div:not(#" + hash.toLowerCase() + ")").hide();
				$("#contents #" + hash.toLowerCase()).fadeIn(300);
			}
		}
	}
};

$(document).ready(function() {
	if(!$.browser_cookie_status()) {
		apprise('Your browser has cookies disabled.<br />Please, activate your cookies to let the system works properly, and then <a href="javascript:void(0);" onclick="location.reload();">reload the page</a>.', {title: "Enable yor cookie", icon: "warning", progress: true, allowExit: false});
	} else {
		// Use bootstrap apprise instead javascript's alert
		window.alert = function(string, args, callback) {
			if(args == undefined) {
				args = [];
				args["title"] = "Warning";
				args["icon"] = "warning";
			}
			return apprise(string, args, callback);
		};
		$("#loginform").jCryption();
		$("#map_toolbox").delay(600).animate({"right": "0"}, 300);
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
						//console.log(response);
					}
				});
			});
			$("#login-username").focus();
			if (!data) return e.preventDefault()
		});
		
		window.onhashchange = function() {
			$.manage_url();
		}
		$.manage_url();
	}
});