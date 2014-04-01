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
$.sub_toolbox = function(action) {
	$("#map_sub_toolbox").fadeIn(300);
	console.log(action);
};


$(document).ready(function() {
	$("#loginform").jCryption();
	$("#map_toolbox").delay(600).animate({"right": "0"}, 300);
	$("#map_toolbox a").tooltip({placement: "left", container: "body"}).click(function() {
		$(this).tooltip("hide");
	});
	
	$("#btn-login").click(function() {
		
	});
});