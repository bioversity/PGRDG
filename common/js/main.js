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
	$(document).bind("keydown", "alt+s", function() {
		$.sub_toolbox("find_location");
		return false;
	}).bind("keydown", "alt+l", function() {
		$.sub_toolbox("change_map");
		return false;
	});
};

$(document).ready(function() {
	$("#loginform").jCryption();
	$("#map_toolbox").delay(600).animate({"right": "0"}, 300);
	$("#map_toolbox a").tooltip({placement: "left", container: "body"}).click(function() {
		$(this).tooltip("hide");
	});
	
	$("#btn-login").click(function() {
		
	});
	$.shortcuts();
});