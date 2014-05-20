$.browser_cookie_status = function() { var cookieEnabled = (navigator.cookieEnabled) ? true : false; if (typeof navigator.cookieEnabled == "undefined" && !cookieEnabled) { document.cookie = "testcookie"; cookieEnabled = (document.cookie.indexOf("testcookie") != -1) ? true : false; } return (cookieEnabled); }
$.rawurlencode = function(str) { str = (str+'').toString(); return encodeURIComponent(str).replace(/!/g, '%21').replace(/'/g, '%27').replace(/\(/g, '%28').replace(/\)/g, '%29').replace(/\*/g, '%2A'); };
$.rawurldecode = function(str) { return decodeURIComponent((str + '').replace(/%(?![\da-f]{2})/gi, function () { return '%25'; })); };
$.utf8_to_b64 = function(str) { return window.btoa(unescape(encodeURIComponent(str))); };
$.b64_to_utf8 = function(str) { return decodeURIComponent(escape(window.atob(str))); };
$.ucfirst = function(str) { str += ""; var f = str.charAt(0).toUpperCase(); return f + str.substr(1); };
$.makeid = function() { var text = "", possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"; for(var i = 0; i <= 16; i++) { text += possible.charAt(Math.floor(Math.random() * possible.length)); } return text; };


/**
* Global vars
*/
var lang = "en",
service_url = "API/?type=service&proxy=",
system_constants, operators = [],
password = $.makeid(),
auth = false;
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
		op: "",
		parameters: {
			lang: "en",
			limit: 50,
			param: {
				"log-request": "true",
				tag: ""
			}
		}
	}, options);
	var param,
	obj_len = $.map(opt.parameters, function(n, i) { return i; }).length;
	
	if(obj_len > 0) {
		
	}
	if(typeof(options) == "string") {
		param = "address=" + $.utf8_to_b64(options) + "&lang=" + lang + "&param={}";
	} else {
		param = "address=" + $.utf8_to_b64(opt.op + "&lang=" +opt.parameters.lang + "&param=" + JSON.stringify(opt.parameters.param));
	}
	//console.log("address=" + opt.op + "&lang=" +opt.parameters.lang + "&param=" + JSON.stringify(opt.parameters.param));
	$.cryptAjax({
		url: "API/",
		dataType: "json",
		type: "POST",
		data: {
			jCryption: $.jCryption.encrypt(param, password),
			type: "ask_service"
		},
		success: function(response) {
			if(response.status.state == "ok") {
				callback(response);
			} else {
				alert("There's an error in the response:<br />See the console for more informations");
				console.group("The Service has returned an error");
				console.error(response.status.message);
				console.dir(response);
				console.groupEnd();
			}
		}
	});
};

$.left_panel = function(subject, width, callback) {
	if(width == "" || width == undefined) {
		var width = 488;
	}
	movement = width;
	width += "px";
	$("#left_panel").css({
		"width": width
	});
	var content_witdth = $("#content").css("width");
	if($("#left_panel").hasClass("visible") && subject !== "open") {
		if(subject == "close") {
			$(".olControlZoom").animate({"left": "10px"}, 300);
			$("#left_panel").animate({"left": "-" + width}, 300, "swing", function() {
				$(this).removeClass("visible");
				
				// Callback
				if (typeof callback == "function") {
					callback.call(this);
				}
			});
			$("#content").animate({"padding-left": "10px"}, 300);
		} else {
			$.left_panel("close");
		}
	} else {
		if(subject !== "close") {
			$(".olControlZoom").animate({"left": width}, 300);
			$("#left_panel").animate({"left": "0"}, 300, "easeOutExpo", function() {
				$(this).addClass("visible");
				
				$(this).find("input[type=search]").focus();
				
				// Callback
				if (typeof callback == "function") {
					callback.call(this);
				}
			});
			$("#content").animate({"padding-left": (movement+15) + "px"}, 250);
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
	}
});