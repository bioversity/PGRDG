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
	$(window).bind("keydown", "alt+f", function() {
		$.sub_toolbox("find_location");
		return false;
	}).bind("keydown", "alt+l", function() {
		$.sub_toolbox("change_map");
		if($("#change_map").css("display") != "none") {
			var li = $("#change_map li");
			var liSelected;
			$(window).bind("keydown", "down", function() {
				$.each(li, function(item, value) {
					$(this).removeClass("selected");
				});
				if(liSelected){
					liSelected.removeClass("selected");
					next = liSelected.next();
					if(next.length > 0){
						liSelected = next.addClass("selected").focus();
					} else {
						liSelected = li.eq(0).addClass("selected").focus();
					}
				} else {
					liSelected = li.eq(0).addClass("selected").focus();
				}
			});
			$(window).bind("keydown", "up", function() {
				$.each(li, function(item, value) {
					$(this).removeClass("selected");
				});
				if(liSelected){
					liSelected.removeClass("selected");
					next = liSelected.prev();
					if(next.length > 0){
						liSelected = next.addClass("selected").focus();
					} else {
						liSelected = li.last().addClass("selected").focus();
					}
				} else {
					liSelected = li.last().addClass("selected").focus();
				}
			});
			$(window).bind("keydown", "return space insert", function() {
				var item = liSelected.find("a"),
				selected_map = $.trim(item.attr("class").replace("btn change_map_btn ", "").replace("_", " "));
				$.change_map_layer(selected_map, item);
			});
		}
		return false;
	}).bind("keydown", "alt+0", function() {
		map.setCenter([0, 0], 1); // Entire world
		return false;
	}).bind("keydown", "alt+1", function() {
		map.setCenter([18, 13], 4); // Africa
		return false;
	}).bind("keydown", "alt+2", function() {
		map.setCenter([-135,  -82], 0); //Antarctica
		return false;
	}).bind("keydown", "alt+3", function() {
		map.setCenter(lonLat, zoom);
		return false;
	}).bind("keydown", "alt+4", function() {
		map.setCenter(lonLat, zoom);
		return false;
	}).bind("keydown", "alt+5", function() {
		map.setCenter(lonLat, zoom);
		return false;
	}).bind("keydown", "alt+6", function() {
		map.setCenter(lonLat, zoom);
		return false;
	}).bind("keydown", "alt+7", function() {
		map.setCenter(lonLat, zoom);
		return false;
	}).bind("keydown", "alt+i F1", function() {
		$("#map_toolbox_help").modal("show");
		return false;
	}).bind("keydown", "alt++", function() {
		$.increase_zoom();
		return false;
	}).bind("keydown", "alt+-", function() {
		$.decrease_zoom();
		return false;
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
	$("#login").on("shown.bs.modal", function(e) {
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