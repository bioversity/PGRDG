$.left_panel = function(subject) {
	if($("#left_panel").hasClass("visible")) {
		if(subject == "close") {
			$("#left_panel").animate({"left": "-221px"}, 300).removeClass("visible");
			$(".olControlPanZoomBar").animate({"left": "10px"}, 300);
		} else {
			$.left_panel("close");
		}
	} else {
		$("#left_panel").animate({"left": "0"}, 300).addClass("visible");
		$(".olControlPanZoomBar").animate({"left": "225px"}, 300);
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
				console.log(selected_map, item);
				$.change_map_layer(selected_map, item);
			});
		}
		return false;
	}).bind("keydown", "alt+0", function() {
		map.setCenter(lonLat, zoom);
		return false;
	}).bind("keydown", "alt+i F1", function() {
		$("#map_toolbox_help").modal("show");
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
});