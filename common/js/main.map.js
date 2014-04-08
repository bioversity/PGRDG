// Initial map position
var lat = 50,
lon = 12,
zoom = 4,
fromProjection = new OpenLayers.Projection("EPSG:4326"),
toProjection = new OpenLayers.Projection("EPSG:900913"),
map,
layers = {
	gphy: new OpenLayers.Layer.Google("Google Physical", {
		type: google.maps.MapTypeId.TERRAIN,
		sphericalMercator: true,
		'maxExtent': new OpenLayers.Bounds(-20037508.34, -20037508.34, 20037508.34, 20037508.34),
		buffer: 0
		// used to be {type: G_PHYSICAL_MAP}
	}),
	gmap: new OpenLayers.Layer.Google("Google Streets", {
		numZoomLevels: 20,
		sphericalMercator: true,
		'maxExtent': new OpenLayers.Bounds(-20037508.34, -20037508.34, 20037508.34, 20037508.34),
		buffer: 1
	}),
	ghyb: new OpenLayers.Layer.Google("Google Hybrid", {
		type: google.maps.MapTypeId.HYBRID,
		numZoomLevels: 20,
		sphericalMercator: true,
		'maxExtent': new OpenLayers.Bounds(-20037508.34, -20037508.34, 20037508.34, 20037508.34),
		buffer: 2
	}),
	gsat: new OpenLayers.Layer.Google("Google Satellite", {
		type: google.maps.MapTypeId.SATELLITE,
		numZoomLevels: 22,
		sphericalMercator: true,
		'maxExtent': new OpenLayers.Bounds(-20037508.34, -20037508.34, 20037508.34, 20037508.34),
		buffer: 3
	})
},
lonLat = new OpenLayers.LonLat(lon, lat).transform(
	new OpenLayers.Projection("EPSG:4326"),
	new OpenLayers.Projection("EPSG:3857")
);

$.init_map = function() {
	var selected_map = $("#selected_map").text();
	map = new OpenLayers.Map ("pgrdg_map", {
		controls: [
			new OpenLayers.Control.Navigation(),
			new OpenLayers.Control.PanZoomBar(),
			//new OpenLayers.Control.ScaleLine(),
			//new OpenLayers.Control.Permalink('permalink'),
			new OpenLayers.Control.MousePosition(),
			//new OpenLayers.Control.LayerSwitcher()
			//new OpenLayers.Control.Attribution()
		],
		projection: new OpenLayers.Projection("EPSG:900913"),
		displayProjection: new OpenLayers.Projection("EPSG:4326"),
		allOverlays: true,
		minResolution: "auto",
		maxResolution: "auto"
	});
	var layers_arr = [];
	$.each(layers, function(lk, lv) {
		//registerEvents(lk);
		layers_arr.push(lv);
	});
	var control = new OpenLayers.Control();
	OpenLayers.Util.extend(control, {
		draw: function () {
			// this Handler.Box will intercept the shift-mousedown
			// before Control.MouseDefault gets to see it
			this.box = new OpenLayers.Handler.Box(
				control,
				{"done": this.notice},
				{keyMask: OpenLayers.Handler.MOD_SHIFT | OpenLayers.Handler.MOD_ALT}
			);
			this.box.activate();
		},
		notice: function (bounds) {
			alert(bounds);
		}
	});
	map.addControl(control);
	map.addLayers(layers_arr);

	//$.change_map_layer(selected_map, $("a." + selected_map.replace(" ", " ")));
	
	map.setCenter(lonLat, zoom);
};
function registerEvents(layer) {
	layer.logEvent = function(event) {
		console.log("(" + getTimeStamp() + ") " + this.name + ": " + event);
	};
	
	layer.events.register("loadstart", layer, function() {
		console.log("Load Start");
	});
	
	layer.events.register("tileloaded", layer, function() {
		console.log("Tile loaded. " + this.numLoadingTiles + " left.");
	});
	
	layer.events.register("loadend", layer, function() {
		console.log("Load End. Grid:" + this.grid.length + "x" + this.grid[0].length);
	});
	
	map.addLayer(layer);
}

$.change_map_layer = function(selected_map, item) {
	$("#selected_map").text(selected_map);
	//console.log("loading");
	$.each($("#change_map ul li span"), function(i, l) {
		$(this).removeClass("fa-check-circle").addClass("fa-circle-o");
	});
	//item.find("span").removeClass("fa-circle-o").addClass("fa-check-circle");
	$("a." + selected_map.replace(" ", "_") + " span").removeClass("fa-circle-o").addClass("fa-check-circle").closest("li").addClass("selected");
	$("#map_toolbox span.fa-tasks").removeClass("fa-tasks").addClass("fa-spinner fa-spin").parent("a").addClass("disabled");
	$("#change_map").delay(1000).fadeOut(450);
	
	var layer = map.getLayersByName(selected_map)[0],
	lastIndex = map.getNumLayers() -1;
	
	map.events.register("loadstart", layer, function(event) {
		console.log("Load Start");
		//this.redraw();
	});
	map.setLayerIndex(layer, lastIndex);
	layer.redraw(true);
	
	//console.log("finished loading");
	$("#map_toolbox span.fa-spinner").removeClass("fa-spinner fa-spin").addClass("fa-tasks").parent("a").removeClass("disabled");
};
$.sub_toolbox = function(action) {
	if($("#" + action).css("display") == "none") {
		$("#" + action).fadeIn(function() {
			switch(action) {
				case "find_location":
					if($(this).find("input").val().length == 0) {
						$(this).find("input").focus();
					} else {
						$(this).find("input").select();
					}
					break;
				case "change_map":
					$(".change_map_btn." + $("#selected_map").text().replace(" ", "_") + " span").removeClass("fa-circle-o").addClass("fa-check-circle").closest("li").addClass("selected");
					break;
			}
		});
	} else {
		$("#" + action).fadeOut(300, function() {
			switch(action) {
				case "change_map":
					$.each($("#" + action + " li"), function(item, value) {
						$(this).removeClass("selected");
					});
					break;
			}
		});
	}
};
$.search_location = function(input) {
	if(input.length > 0) {
		$.ajax({
			url: "API/",
			type: "get",
			format: "json",
			crossDomain: true,
			data: {proxy: "true", type: "get", header: "text/json", address: "http://nominatim.openstreetmap.org/search.php", params: {q: encodeURIComponent(input), format: "json", addressdetails: 1, bounded: 1, limit: 1}},
			error: function(data) {
				alert("An error occurred while communicating with the OpenLS service. Please try again.");
				$("#map_toolbox span.fa-spinner").removeClass("fa-spinner fa-spin").addClass("fa-search").parent("a").removeClass("disabled");
			},
			success: function(data) {
				datap = $.parseJSON(data);
				var lonLat = new OpenLayers.LonLat(datap[0].lon, datap[0].lat).transform(
					new OpenLayers.Projection("EPSG:4326"),
					new OpenLayers.Projection("EPSG:3857")
				),
				minLat = datap[0].boundingbox[0],
				maxLat = datap[0].boundingbox[1],
				minLng = datap[0].boundingbox[2],
				maxLng = datap[0].boundingbox[3];
				
				map.setCenter(
					new OpenLayers.LonLat(datap[0].lon, datap[0].lat).transform(
						new OpenLayers.Projection("EPSG:4326"),
						new OpenLayers.Projection("EPSG:900913")
					), map.zoomToExtent(new OpenLayers.Bounds(minLng, minLat, maxLng, maxLat).transform("EPSG:4326", "EPSG:900913"))
				);
				$("#map_toolbox span.fa-spinner").removeClass("fa-spinner fa-spin").addClass("fa-search").parent("a").removeClass("disabled");
			}
		});
	}
};
$(document).ready(function() {
	$.init_map();
	$("#find_location input").bind("keydown", "return", function() {
		$.sub_toolbox("find_location");
		$("#map_toolbox span.fa-search").removeClass("fa-search").addClass("fa-spinner fa-spin").parent("a").addClass("disabled");
		$.search_location($(this).val());
	}).bind("keydown", "alt+f", function() {
		$.sub_toolbox("find_location");
		return false;
	});
});