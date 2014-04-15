/*
OpenLayers 3 based map
*/

// Initial map position
var lat = 50,
lon = 12,
zoom = 4,
map, view,
exampleNS = {};

exampleNS.getRendererFromQueryString = function() {
	var obj = {},
	queryString = location.search.slice(1),
	re = /([^&=]+)=([^&]*)/g,
	m;
	
	while (m = re.exec(queryString)) {
		obj[decodeURIComponent(m[1])] = decodeURIComponent(m[2]);
	}
	if ("renderers" in obj) {
		return obj['renderers'].split(",");
	} else if ("renderer" in obj) {
		return [obj["renderer"]];
	} else {
		return undefined;
	}
};

$.init_map = function() {
	var selected_map = $("#selected_map").text();
	view = new ol.View2D({
		center: $.set_lonlat(lon, lat),
		zoom: 4
	}),
	layers = [
		/*
		new ol.layer.Tile({
			style: "Terrain labels",
			source: new ol.source.Stamen({
				layer: "terrain-labels"
			}),
			visible: false
		}),
		*/
		new ol.layer.Tile({
			style: "Satellite",
			minResolution: 80,
			source: new ol.source.MapQuest({
				layer: "sat",
				crossOrigin: "anonymous"
			}),
			visible: true
		}),
		new ol.layer.Tile({
			style: "Road",
			source: new ol.source.MapQuest({layer: "osm"}),
			visible: false
		}),
		new ol.layer.Tile({
			style: "Watercolor",
			source: new ol.source.Stamen({
				layer: "watercolor"
			}),
			visible: false
		}),
		new ol.layer.Tile({
			style: "Labels",
			parentLayer: ["Satellite", "Watercolor"],
			//maxResolution: 2000,
			source: new ol.source.TileJSON({
				url: "http://api.tiles.mapbox.com/v3/mapbox.world-borders-light.jsonp",
				crossOrigin: "anonymous"
			})
		})
	];
	
	map = new ol.Map({
		target: "pgrdg_map",
		layers: layers,
		view: view,
		controls: ol.control.defaults().extend([
			new ol.control.FullScreen(),
			new ol.control.ScaleLine(),
			new ol.control.Zoom(),
			/*
			new ol.control.ZoomToExtent({
				extent: 2
			})
			*/
		]),
		renderer: exampleNS.getRendererFromQueryString()
	});
	view = map.getView();
	//view.fitExtent([-180, -90, 180, 90], map.getSize());
	map.on("moveend", $.get_visible_boundingbox);
};

/**
Position functions
*/
$.wrapLon = function(value) { return value - (Math.floor((value + 180) / 360) * 360); }
$.get_visible_boundingbox = function(evt) {
	var map = evt.map,
	extent = map.getView().calculateExtent(map.getSize()),
	lonlat = ol.extent.getBottomLeft(extent),
	bottomLeft = $.set_lonlat(lonlat[0], lonlat[1]),
	topRight = $.set_lonlat(lonlat[0], lonlat[1]),
	boundingbox = [topRight[1], $.wrapLon(topRight[0]), bottomLeft[1], $.wrapLon(bottomLeft[0])];
	
	if(topRight[1] > 85 || isNaN(topRight[1])) {
		//console.log($.wrapLon(bottomLeft[0]), topRight[1]);
		//view.setCenter($.set_lonlat($.wrapLon(bottomLeft[0]), topRight[1]));
	}
	if($.get_current_zoom() < 2) {
		$.set_zoom(2);
	}
	
	return boundingbox;
};
$.set_lonlat = function(lon, lat) { return ol.proj.transform([lon, lat], "EPSG:4326", "EPSG:3857"); };
$.set_lonlat_bbox = function(a, b, c, d) { return ol.extent.transform([a, b, c, d], ol.proj.getTransform("EPSG:4326", "EPSG:3857")); };
$.set_center = function(lon, lat) { view.setCenter($.set_lonlat(lon, lat)); };
$.set_center_bbox = function(a, b, c, d) { view.setCenter($.set_lonlat_bbox(a, b, c, d)); };

/**
Zoom functions
*/
$.get_current_zoom = function() { return view.getZoom(); }
$.set_zoom = function(zoom) { return view.setZoom(zoom); }
$.increase_zoom = function() { view.setZoom((view.getZoom() + 1)); };
$.decrease_zoom = function() { view.setZoom((view.getZoom() - 1)); };
/*
$.get_click_info = function() {
	var clicked_coords = $.parseJSON($("#clicked_coords").text());
	//console.log(clicked_coords);
	
	$.find_location({
		lon: clicked_coords.lon,
		lat: clicked_coords.lat,
		addressdetails: 1,
		error: function(data) {
			alert("An error occurred while communicating with the OpenLS service. Please try again.");
		},
		success: function(data) {
			datap = $.parseJSON(data);
			$.add_popup({
				lon: clicked_coords.lon,
				lat: clicked_coords.lat,
				title: "Location info",
				html: datap.display_name
			});
		}
	});
};
*/
$.add_marker = function(lon, lat, name) {
	/*
	if(new_layer == undefined || new_layer == null) {
		new_layer = false
	}
	var markers = new OpenLayers.Layer.Markers("Markers"),
	size = new OpenLayers.Size(48, 48),
	offset = new OpenLayers.Pixel(-(size.w/2), -size.h),
	icon = new OpenLayers.Icon("common/media/img/red_marker.png", size, offset);

	if(new_layer) {
		map.addLayer(markers);
		markers.addMarker(new OpenLayers.Marker($.set_lonlat(lon, lat), icon));
	} else {
		layers.mrk.addMarker(new OpenLayers.Marker($.set_lonlat(lon, lat), icon));
	}
	*/
};
/*
$.add_popup = function(options, callback) {
	var options = $.extend({
		div: "Popup",
		lon: 0,
		lat: 0,
		size: {
			width: 200,
			height: 200
		},
		title: "Selected location",
		html: "Sample text",
		callback: function() {}	
	}, options);
	
	if (typeof callback == "function") {
		callback.call(this);
	}
	var location = new OpenLayers.Geometry.Point(options.lon, options.lat).transform("EPSG:4326", "EPSG:3857");
	
	var popup = new OpenLayers.Popup.Popover(
		options.div,
		location.getBounds().getCenterLonLat(),
		options.html,
		options.title,
		options.callback
	);
	* /
	map.addPopup(new OpenLayers.Popup.FramedCloud(
		options.div, 
		location.getBounds().getCenterLonLat(),
		null,
		options.html,
		//new OpenLayers.Size(options.size.w, options.size.h),
		null,
		true,
		callback
	));
}
*/
$.center_map_on = function(location) {
	var loc_data = {};
	switch(location) {
		case "World":
			loc_data.lon = 0;
			loc_data.lat = 35;
			loc_data.zoom = 2.3;
			break;
		case "Africa":
			loc_data.lon = 16;
			loc_data.lat = 5;
			loc_data.zoom = 3.7;
			break;
		case "Antarctica":
			loc_data.lon = -50;
			loc_data.lat = 68;
			loc_data.zoom = 3;
			break;
		case "Asia":
			loc_data.lon = 100;
			loc_data.lat = 60;
			loc_data.zoom = 3;
			break;
		case "Europe":
			loc_data.lon = 12;
			loc_data.lat = 55;
			loc_data.zoom = 4;
			break;
		case "North America":
			loc_data.lon = -98;
			loc_data.lat = 39;
			loc_data.zoom = 4;
			break;
		case "Oceania":
			loc_data.lon = 130;
			loc_data.lat = -12;
			loc_data.zoom = 4;
			break;
		case "South America":
			loc_data.lon = -58;
			loc_data.lat = -23;
			loc_data.zoom = 4;
			break;
		case "Your position":
			navigator.geolocation.getCurrentPosition(function(position) {
				// Success
				$.find_location({
					lon: position.coords.longitude,
					lat: position.coords.latitude,
					addressdetails: 0,
					success: function(data) {
						datap = $.parseJSON(data);
						//$.add_marker(position.coords.longitude, position.coords.latitude);
						$.set_center(position.coords.longitude, position.coords.latitude);
						$.set_zoom(13);
						$("#selected_zone").text(datap.display_name).fadeIn(300);
					}
				});
				return false;
			}, function(position) {
				// Fail
				$("#selected_zone").html("<i>Unable to find position</i>").fadeIn(300);
				return false;
			});
			break;
	}
	if(location != "Your position") {
		$.set_center(loc_data.lon, loc_data.lat);
		$.set_zoom(loc_data.zoom);
		$("#selected_zone").text(location).fadeIn(300);
	}
}


/**
Layers functions
*/
$.render_layers_on_menu = function() {
	$("#change_map").append('<ul class="list-unstyled">');
	
	for (var i = 0, ii = layers.length; i < ii; ++i) {
		var label = layers[i].get("style");
		
		if(layers[i].getVisible()) {
			$("#change_map ul").append('<li class="selected"><a title="Change layer" onclick="$.change_map_layer(\'' + label + '\')" href="javascript: void(0);" class="btn change_map_btn ' + label.replace(" ", "_") + '"><span class="fa fa-check-circle"></span>&nbsp;' + label + '</a>');
		} else {
			$("#change_map ul").append('<li><a title="Change layer" onclick="$.change_map_layer(\'' + label + '\')" href="javascript: void(0);" class="btn change_map_btn ' + label.replace(" ", "_") + '"><span class="fa fa-circle-o"></span>&nbsp;' + label + '</a>');
		}
	}
}

$.show_layer = function(selected_layer) {
	for (var i = 0, ii = layers.length; i < ii; ++i) {
		var style = layers[i].get("style");
		if(style == selected_layer) {
			layers[i].setVisible(1);
		}
	}
}
$.hide_layer = function(selected_layer) {
	for (var i = 0, ii = layers.length; i < ii; ++i) {
		var style = layers[i].get("style");
		if(style == selected_layer) {
			layers[i].setVisible(1);
		}
	}
}
$.change_map_layer = function(selected_layer) {
	var i, ii, parent_layer;
	
	for (var i = 0, ii = layers.length; i < ii; ++i) {
		var label = layers[i].get("style"),
		pls = layers[i].get("parentLayer");
		
		if(layers[i].getVisible() == 1) {
			$.hide_layer(layers[i].get("style"));
			$("#change_map a." + label.replace(" ", "_")).parent("li").removeClass("selected").find("span").removeClass("fa-check-circle").addClass("fa-circle-o");
			layers[i].setVisible(0);
		}
		if(label == selected_layer) {
			if(label == "Labels") {
				if(pls != undefined) {
					if($.inArray($("#previous_selected_layer").text(), pls) !== -1) {
						$.show_layer($("#previous_selected_layer").text());
						$("#change_map a." + $("#previous_selected_layer").text()).parent("li").addClass("selected").find("span").removeClass("fa-circle-o").addClass("fa-check-circle");
					} else {
						$.hide_layer($("#previous_selected_layer").text());
						$("#change_map a." + label.replace(" ", "_")).parent("li").removeClass("selected").find("span").removeClass("fa-check-circle").addClass("fa-circle-o");
					}
				}
			} else {
				$("#previous_selected_layer").text(label);
			}
			$.show_layer(selected_layer);
			$("#change_map a." + selected_layer.replace(" ", "_")).parent("li").addClass("selected").find("span").removeClass("fa-circle-o").addClass("fa-check-circle");
		}
	}
}

/**
Map functions
*/
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
					if($("#change_map").css("display") != "none") {
						var li = $("#change_map li");
						var liSelected;
						
						$(window).bind("keydown", "down", function(e) {
							e.preventDefault();
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
						}).bind("keydown", "up", function(e) {
							e.preventDefault();
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
						}).bind("keydown", "return space insert", function(e) {
							e.preventDefault();
							var item = liSelected.find("a"),
							selected_map = $.trim(item.attr("class").replace("btn change_map_btn ", "").replace("_", " "));
							$.change_map_layer(selected_map, item);
						});
					}
					//$(".change_map_btn." + $("#selected_map").text().replace(" ", "_") + " span").removeClass("fa-circle-o").addClass("fa-check-circle").closest("li").addClass("selected");
					break;
			}
		});
	} else {
		if(action == "close") {
			$("#map_sub_toolbox div").fadeOut(300);
		} else {
			$("#" + action).fadeOut(300, function() {
				switch(action) {
					case "change_map":
						break;
				}
			});
		}
	}
};

// Search location from given coordinates
$.find_location = function(options) {
	$.ajax({
		url: "API/",
		type: "get",
		format: "json",
		crossDomain: true,
		data: {proxy: "true", type: "get", header: "text/json", address: "http://nominatim.openstreetmap.org/reverse", params: {format: "json", lat: options.lat, lon: options.lon, zoom: 18, addressdetails: ((options.addressdetails == 1) ? 1 : 0)}},
		error: function(data) {
			options.error(data);
		},
		success: function(data) {
			options.success(data);
		}
	});
}
// Search location from given string
$.search_location = function(input) {
	if(input.length > 0) {
		$("#map_toolbox span.fa-search").removeClass("fa-search").addClass("fa-spinner fa-spin").parent("a").addClass("disabled");
		$.ajax({
			url: "API/",
			type: "get",
			format: "json",
			crossDomain: true,
			data: {proxy: "true", type: "get", header: "text/json", address: "http://nominatim.openstreetmap.org/search.php", params: {q: encodeURIComponent(input), format: "json", addressdetails: 1, bounded: 1, limit: 10, polygon_geojson: 1}},
			error: function(data) {
				alert("An error occurred while communicating with the OpenLS service. Please try again.");
				$("#map_toolbox span.fa-spinner").removeClass("fa-spinner fa-spin").addClass("fa-search").parent("a").removeClass("disabled");
			},
			success: function(data) {
				datap = $.parseJSON(data);
				$("#selected_zone").text(datap[0].display_name).fadeIn(300).delay(5000).fadeOut(600);
				$("#information_zone").html(datap[0].address.city + ", " + ((datap[0].address.county != undefined) ? "(" + datap[0].address.county + ") " : "") + datap[0].address.state + " - " + datap[0].address.country);
				
				var minLat = datap[0].boundingbox[0],
				maxLat = datap[0].boundingbox[1],
				minLng = datap[0].boundingbox[2],
				maxLng = datap[0].boundingbox[3];
				
				console.log(datap[0].lon, datap[0].lat);
				console.log(typeof datap[0].lon);
				$.set_center(Math.floor(datap[0].lon), Math.floor(datap[0].lat));
				$.set_zoom(7);
				//view.fitExtent([minLat, maxLat, minLng, maxLng], map.getSize());
				
				//var textent = ol.extent.transform([minLat, minLng, maxLat, maxLng], ol.proj.getTransform('EPSG:4326', 'EPSG:3857'));
				//console.log(textent);
				
				/*
				$.each(datap, function(k, v) {
					console.log(k);
					//$.add_marker(datap[k].lon, datap[k].lat);
				});
				*/
				
				$("#map_toolbox span.fa-spinner").removeClass("fa-spinner fa-spin").addClass("fa-search").parent("a").removeClass("disabled");
			}
		});
	}
};

$.contextMenu = function() {
	var $contextMenu = $("#contextMenu");
	$("body").on("contextmenu", "#pgrdg_map", function(e) {
		if($("#clicked_coords").length == 0) {
			$("body").prepend('<span style="display: none;" id="clicked_coords"></span>');
		}
		var clicked_coords = map.getLonLatFromPixel(new OpenLayers.Pixel(e.clientX, e.clientY)),
		center = new OpenLayers.LonLat(clicked_coords.lon, clicked_coords.lat);
		center.transform(new OpenLayers.Projection("EPSG:900913"), new OpenLayers.Projection("EPSG:4326"));
		var clicked_coords = {"lon": center.lon, "lat": center.lat};
		$("#clicked_coords").text('{"lon": ' + clicked_coords.lon + ',"lat": ' + clicked_coords.lat + '}');
		
		$contextMenu.css({
			display: "block",
			left: e.pageX,
			top: e.pageY
		});
		return false;
	});
	$contextMenu.on("click", "a", function() {
		$contextMenu.hide();
	});
	$("#pgrdg_map > *").click(function(e) {
		$contextMenu.hide();
	});
}

$(document).ready(function() {
	$.init_map();
	$.render_layers_on_menu();
	$.contextMenu();
});