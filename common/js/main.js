$.ucfirst = function(str) {
	str += "";
	var f = str.charAt(0).toUpperCase();
	return f + str.substr(1);
};
function makeid() {
	var text = "",
	possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
	
	for(var i = 0; i <= 16; i++) {
		text += possible.charAt(Math.floor(Math.random() * possible.length));
	}
	return text;
}
var password = makeid(),
auth = false;
$.cryptAjax = function(url, options) {
	if(!auth) {
		$.jCryption.authenticate(password, "common/include/funcs/_ajax/decrypt.php?getPublicKey=true", "common/include/funcs/_ajax/decrypt.php?handshake=true", function(AESKey) {
			auth = true;
			
			$.ajax(url, options);
		});
	} else {
		$.ajax(url, options);
	}
};

$.left_panel = function(subject) {
	if($("#left_panel").hasClass("visible")) {
		if(subject == "close") {
			$("#left_panel").animate({"left": "-221px"}, 300).removeClass("visible");
			$(".olControlZoom").animate({"left": "10px"}, 300);
		} else {
			$.left_panel("close");
		}
	} else {
		$("#left_panel").animate({"left": "0"}, 300).addClass("visible");
		$(".olControlZoom").animate({"left": "230px"}, 300);
	}
};

$.shortcuts = function() {
	// You can see all available characters key here:
	// http://htmlpreview.github.io/?https://github.com/jeresig/jquery.hotkeys/master/test-static-05.html
	$(window).bind("keydown", "alt+0", function(e) {
		e.preventDefault();
		map.zoomTo(0);
		$("#selected_zone").text("World").fadeIn(300);
		return false;
	}).bind("keydown", "alt+1", function(e) {
		e.preventDefault();
		$.set_center("Africa");
		return false;
	}).bind("keydown", "alt+2", function(e) {
		e.preventDefault();
		$.set_center("Antarctica");
		return false;
	}).bind("keydown", "alt+3", function(e) {
		e.preventDefault();
		$.set_center("Asia");
		return false;
	}).bind("keydown", "alt+4", function(e) {
		e.preventDefault();
		$.set_center("Europe");
		return false;
	}).bind("keydown", "alt+5", function(e) {
		e.preventDefault();
		$.set_center("North America");
		return false;
	}).bind("keydown", "alt+6", function(e) {
		e.preventDefault();
		$.set_center("Oceania");
		return false;
	}).bind("keydown", "alt+7", function(e) {
		e.preventDefault();
		$.set_center("South America");
		return false;
	}).bind("keydown", "alt+8", function(e) {
		return false;
	}).bind("keydown", "alt+9", function(e) {
		return false;
	}).bind("keydown", "alt+i F1", function(e) {
		e.preventDefault();
		$("#map_toolbox_help").modal("show");
		return false;
	}).bind("keydown", "alt+f", function(e) {
		e.preventDefault();
		// Fix for ALT+6 confusion
		if(e.keyCode == 70){
			$.sub_toolbox("find_location");
			return false;
		} else {
			return false;
		}
	}).bind("keydown", "alt+l", function(e) {
		e.preventDefault();
		$.sub_toolbox("change_map");
		return false;
	}).bind("keydown", "alt++", function(e) {
		e.preventDefault();
		$("#selected_zone").text("Zoom in").fadeIn(300);
		$.increase_zoom();
		return false;
	}).bind("keydown", "alt+-", function(e) {
		e.preventDefault();
		$("#selected_zone").text("Zoom out").fadeIn(300);
		$.decrease_zoom();
		return false;
	}).bind("keydown", "esc", function(e) {
		e.preventDefault();
		$.sub_toolbox("close");
		return false;
	}).bind("keyup", "alt", function(e) {
		e.preventDefault();
		$("#selected_zone").delay(1000).fadeOut(600, function() { $(this).text(""); });
	});
};

$(document).ready(function() {
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
					console.log(response);
				}
			});
		});
		$("#login-username").focus();
		if (!data) return e.preventDefault()
	});
});