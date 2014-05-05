/*
OpenLayers 3 based map
*/

// Initial map position
var lon = 12,
lat = 55,
zoom = 4,
map, view,
exampleNS = {};

exampleNS.getRendererFromQueryString = function() {
	var obj = {}, queryString = location.search.slice(1), re = /([^&=]+)=([^&]*)/g, m;
	
	while (m = re.exec(queryString)) {
		obj[decodeURIComponent(m[1])] = decodeURIComponent(m[2]);
	}
	if ("renderers" in obj) {
		return obj["renderers"].split(",");
	} else if ("renderer" in obj) {
		return [obj["renderer"]];
	} else {
		return undefined;
	}
};

$.init_map = function() {
	//var selected_map = $("#selected_map").text();
	$("#pgrdg_map").bind("dragstart", function() {
		$(this).css("cursor", "move");
	}).bind("dragstop", function() {
		$(this).css("cursor", "default");
	});
	view = new ol.View2D({
		center: $.set_lonlat(lon, lat),
		zoom: 4
	}),
	layers = [
		new ol.layer.Tile({
			style: "Toner",
			displayOnMenu: false,
			maxResolution: 80,
			source: new ol.source.Stamen({
				layer: "toner",
				crossOrigin: "anonymous"
			}),
			visible: true
		}),
		new ol.layer.Tile({
			style: "Satellite",
			displayOnMenu: true,
			minResolution: 80,
			source: new ol.source.MapQuest({
				layer: "sat",
				crossOrigin: "anonymous"
			}),
			visible: true
		}),
		new ol.layer.Tile({
			style: "Road",
			displayOnMenu: true,
			source: new ol.source.MapQuest({
				layer: "osm",
				crossOrigin: "anonymous"
			}),
			visible: false
		}),
		new ol.layer.Tile({
			style: "Watercolor",
			displayOnMenu: true,
			source: new ol.source.Stamen({
				layer: "watercolor",
				crossOrigin: "anonymous"
			}),
			visible: false
		}),
		new ol.layer.Tile({
			style: "Labels",
			minResolution: 80,
			displayOnMenu: true,
			parentLayer: ["Satellite", "Watercolor"],
			hasSeparator: true,
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
			new ol.control.MousePosition({
				className: "custom-mouse-position",
				target: document.getElementById("location"),
				coordinateFormat: ol.coordinate.createStringXY(5),
				undefinedHTML: "&nbsp;"
			}),
			new ol.control.ScaleLine(),
			new ol.control.Zoom(),
			/*
			new ol.control.FullScreen(),
			new ol.control.ZoomToExtent({
				extent: 2
			})
			*/
		]),
		renderer: exampleNS.getRendererFromQueryString()
	});
	view = map.getView();
	
	//map.on("moveend", $.get_visible_bbox);
};

/**
Position functions
*/
$.wrapLon = function(value) { return value - (Math.floor((value + 180) / 360) * 360); }
$.get_current_bbox = function() { return map.getView().getView2D().calculateExtent(map.getSize()); }

$.set_lonlat = function(lon, lat) { return ol.proj.transform([parseFloat(lon), parseFloat(lat)], "EPSG:4326", "EPSG:3857"); };
$.set_lonlat_bbox = function(a, b, c, d) { return ol.extent.transform([parseFloat(a), parseFloat(b), parseFloat(c), parseFloat(d)], ol.proj.getTransform("EPSG:4326", "EPSG:3857")); };
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
------------------------------------------------------------------------------------------------------------------------
*/

/**
Layers functions
*/
$.render_layers_on_menu = function() {
	$("#change_map").append('<ul class="list-unstyled">');
	
	for (var i = 0, ii = layers.length; i < ii; ++i) {
		var label = layers[i].get("style");
		
		if(layers[i].get("displayOnMenu")) {
			if(layers[i].getVisible()) {
				if(layers[i].get("hasSeparator")) {
					$("#change_map ul").append('<li class="divider"></li>');
				}
				$("#change_map ul").append('<li class="selected"><a title="Change layer" onclick="$.change_map_layer(\'' + label + '\')" href="javascript: void(0);" class="btn change_map_btn ' + label.replace(" ", "_") + '"><span class="fa fa-check-circle"></span>&nbsp;' + label + '</a>');
			} else {
				$("#change_map ul").append('<li><a title="Change layer" onclick="$.change_map_layer(\'' + label + '\')" href="javascript: void(0);" class="btn change_map_btn ' + label.replace(" ", "_") + '"><span class="fa fa-circle-o"></span>&nbsp;' + label + '</a>');
			}
		}
	}
}

$.show_layer = function(selected_layer) {
	for (var i = 0, ii = layers.length; i < ii; ++i) {
		var style = layers[i].get("style");
		if(style == selected_layer) {
			layers[i].setVisible(1);
			//$("#change_map a." + selected_layer.replace(" ", "_")).parent("li").addClass("selected").find("span").removeClass("fa-circle-o").addClass("fa-check-circle");
		}
	}
}
$.hide_layer = function(selected_layer) {
	for (var i = 0, ii = layers.length; i < ii; ++i) {
		var style = layers[i].get("style");
		//$("#change_map a." + style.replace(" ", "_")).parent("li").removeClass("selected").find("span").removeClass("fa-check-circle").addClass("fa-circle-o");
		if(style == selected_layer) {
			layers[i].setVisible(0);
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
					// Check if the previous selected layer is able to support Labels layer
					if(jQuery.inArray($("#previous_selected_layer").text(), pls) !== -1) {
						$.show_layer($("#previous_selected_layer").text());
						$("#change_map a." + $("#previous_selected_layer").text()).parent("li").addClass("selected").find("span").removeClass("fa-circle-o").addClass("fa-check-circle");
					} else {
						$.hide_layer($("#previous_selected_layer").text());
						$("#change_map a." + label.replace(" ", "_")).parent("li").removeClass("selected").find("span").removeClass("fa-check-circle").addClass("fa-circle-o");
						
						$.show_layer("Satellite");
						$("#change_map a.Satellite").parent("li").addClass("selected").find("span").removeClass("fa-circle-o").addClass("fa-check-circle");
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
								next = liSelected.nextAll('li[class!="divider"]').first();
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
								next = liSelected.prevAll('li[class!="divider"]').first();
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
				case "tools":
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
				
				//console.log(datap[0].lon, datap[0].lat);
				//console.log(typeof datap[0].lon);
				//$.set_zoom(7);
				//view.fitExtent([minLat, maxLat, minLng, maxLng], map.getSize());
				
				//var textent = ol.extent.transform([minLat, minLng, maxLat, maxLng], ol.proj.getTransform('EPSG:4326', 'EPSG:3857'));
				//console.log(textent);
				$.each(datap, function(k, v) {
					var mc;
					//console.log(datap[k].lon, datap[k].lat);
					if(k == 0) {
						mc = "primary";
					} else {
						mc = "secondary";
					}
					$.add_marker({uuid: datap[k].place_id, lon: datap[k].lon, lat: datap[k].lat, marker_class: mc, name: datap[k].display_name, title: "Search: \"" + input + "\"", content: datap[k].display_name});
				});
				$("#map_toolbox span.fa-spinner").removeClass("fa-spinner fa-spin").addClass("fa-search").parent("a").removeClass("disabled");
				$("#" + datap[0].place_id).popover("show");
				$.set_center(Math.floor(datap[0].lon), Math.floor(datap[0].lat));
			}
		});
	}
};
$.toggle_lock_view = function() {
	var current_view = $.get_current_bbox(),
	map_status_txt;
	
	if(!$("#pgrdg_map").hasClass("locked")) {
		$("#pgrdg_map").removeClass("grabbing");
		$("#pgrdg_map").addClass("locked");
		$("#map_toolbox span.fa-lock").parent("a").addClass("selected");
		map_status_txt = "locked";
	} else {
		$("#pgrdg_map").removeClass("locked");
		$("#map_toolbox span.fa-lock").parent("a").removeClass("selected");
		map_status_txt = "unlocked";
	}
	$("#selected_zone").text("Map " + map_status_txt).show();
};

$.gui_misure_distances = function(type) {
	if(type == "" || type == undefined) {
		type = "";
	}
	switch(type) {
		case "length":
			break;
		case "area":
			break;
		default:
			apprise('<div class="row"><div class="col-sm-6"><a class="btn btn-lg" href="javascript: void(0);"><h1 class="entypo flow-line"></h1>Length</a></div><div class="col-sm-6"></div></div>', {"title": "Measure", "showFooter": false});
			break;
	}
};

$.get_click_info = function() {
	var clicked_coords = $.parseJSON($("#clicked_coords").text());
	console.log(clicked_coords);
	
	$.find_location({
		lon: clicked_coords.lon,
		lat: clicked_coords.lat,
		addressdetails: 1,
		error: function(data) {
			alert("An error occurred while communicating with the OpenLS service. Please try again.");
		},
		success: function(data) {
			datap = $.parseJSON(data);
			console.log(datap);
			$.add_popup({
				lon: clicked_coords.lon,
				lat: clicked_coords.lat,
				title: "Location info",
				content: datap.display_name
			});
		}
	});
};

$.uuid = function() {
	return Math.round(new Date().getTime() + (Math.random() * 100));
};
$.add_marker = function(options) {
	var options = $.extend({
		lon: 0,
		lat: 0,
		uuid: $.uuid(),
		name: "",
		title: "",
		marker_class: "primary",
		content: "Sample text",
		callback: function() {}	
	}, options);
	if (typeof callback == "function") {
		callback.call(this);
	}
	//$("#map_hidden_elements").append('<div id="' + options.uuid + '" title="' + options.name + '"></div>');
	if($("#" + options.uuid).length > 0) {
		$("#" + options.uuid).remove();
	}
	var set_center_btn = '<a class="btn btn-default btn-sm" title="Center point on the screen" href="javascript:void(0);" onclick="$.set_center(\'' + options.lon + '\',\'' + options.lat + '\');"><span class="fa fa-crosshairs"></span></a>';
	var set_zoom_btn = '<a class="btn btn-default btn-sm" title="Zoom here" href="javascript:void(0);" onclick="$.set_center(\'' + options.lon + '\',\'' + options.lat + '\'); $.set_zoom(12); $(\'#' + options.uuid + '\').popover(\'hide\');"><span class="fa fa-search-plus"></span></a>';
	var remove_point_btn = '<a class="btn btn-default btn-sm right" title="Remove this point" href="javascript:void(0);" onclick="$(\'#' + options.uuid + '\').popover(\'hide\'); $(\'#' + options.uuid + '\').remove();"><span class="fa fa-trash-o"></span></a>';
	var marker = new ol.Overlay({
		position: $.set_lonlat(options.lon, options.lat),
		positioning: "center-center",
		element: $('<div class="marker ' + options.marker_class + '" id="' + options.uuid + '"></div>').css({
					cursor: "pointer"
				}).popover({
					html: true,
					title: options.title + '<a href="javascript:void(0);" onclick="$(\'#' + options.uuid + '\').popover(\'hide\');" class="close">&times;</a>',
					content: options.content + '<br /><br />' + '<div class="popup_btns row"><div class="col-sm-12 btn-group">' + set_center_btn + set_zoom_btn + remove_point_btn + '</div></div>',
					placement: "top",
					trigger: "click"
				}).bind("click", function() {
					console.log(options.lon, options.lat);
				}),
		stopEvent: false
	});
	map.addOverlay(marker);
};

$.add_point = function(options) {
	var options = $.extend({
		lon: 0,
		lat: 0,
		uuid: $.uuid(),
		name: "",
		title: "",
		marker_class: "primary",
		content: "Sample text",
		callback: function() {}	
	}, options);
	if (typeof callback == "function") {
		callback.call(this);
	}
	//$("#map_hidden_elements").append('<div id="' + options.uuid + '" title="' + options.name + '"></div>');
	if($("#" + options.uuid).length > 0) {
		$("#" + options.uuid).remove();
	}
	var set_center_btn = '<a class="btn btn-default btn-sm" title="Center point on the screen" href="javascript:void(0);" onclick="$.set_center(\'' + options.lon + '\',\'' + options.lat + '\');"><span class="fa fa-crosshairs"></span></a>';
	var set_zoom_btn = '<a class="btn btn-default btn-sm" title="Zoom here" href="javascript:void(0);" onclick="$.set_center(\'' + options.lon + '\',\'' + options.lat + '\'); $.set_zoom(12); $(\'#' + options.uuid + '\').popover(\'hide\');"><span class="fa fa-search-plus"></span></a>';
	var remove_point_btn = '<a class="btn btn-default btn-sm right" title="Remove this point" href="javascript:void(0);" onclick="$(\'#' + options.uuid + '\').popover(\'hide\'); $(\'#' + options.uuid + '\').remove();"><span class="fa fa-trash-o"></span></a>';
	var point = new ol.Overlay({
		position: $.set_lonlat(options.lon, options.lat),
		positioning: "center-center",
		element: $('<div class="marker ' + options.marker_class + '" id="' + options.uuid + '"></div>').css({
					cursor: "pointer"
				}).bind("click", function() {
					console.log(options.lon, options.lat);
				}),
		stopEvent: false
	});
	map.addOverlay(point);
};
$.move_point = function(uuid) {
	$("#" + uuid).addClass("draggable");
	$("#" + uuid).next().find(".popover-content .content").html('<span class="fa fa-refresh fa-spin"></span>');
	$("#pgrdg_map").on("mousemove", function(e) {
		if($("#" + uuid).hasClass("draggable")) {
			var $selected = $("#" + uuid).parent("div");
			$("#" + uuid).css({ cursor: "move" });
			$selected.css({
				top: parseInt(e.clientY - 9) + "px",
				left: parseInt(e.clientX - 9) + "px"
			});
		}
	}).on("mouseup", function(e) {
		// Stop dragging
		$("#" + uuid).removeClass("draggable");
		var clicked_coords = map.getCoordinateFromPixel([e.clientX, e.clientY]),
		hdms = ol.proj.transform(clicked_coords, "EPSG:3857", "EPSG:4326");
		
		$.find_location({
			lon: hdms[0],
			lat: hdms[1],
			addressdetails: 1,
			error: function(data) {
				alert("An error occurred while communicating with the OpenLS service. Please try again.");
			},
			success: function(data) {
				datap = $.parseJSON(data);
				console.log(datap);
				$("#" + uuid).next().find(".popover-content .content").html(datap.display_name + '<br /><br />' + '<code>' + ol.coordinate.toStringHDMS([hdms[0], hdms[1]]) + '</code>');
			}
		});
	});
};

$.add_popup = function(options, callback) {
	var options = $.extend({
		div: "Popup",
		lon: 0,
		lat: 0,
		uuid: $.uuid(),
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
	var set_center_btn = '<a class="btn btn-default btn-sm" title="Center point on the screen" href="javascript:void(0);" onclick="$.set_center(\'' + options.lon + '\',\'' + options.lat + '\');"><span class="fa fa-crosshairs"></span></a>';
	var set_zoom_btn = '<a class="btn btn-default btn-sm" title="Zoom here" href="javascript:void(0);" onclick="$.set_center(\'' + options.lon + '\',\'' + options.lat + '\'); $.set_zoom(12);$(\'#' + options.uuid + '\').popover(\'hide\');"><span class="fa fa-search-plus"></span></a>';
	var edit_point_btn = '<a class="btn btn-default btn-sm" title="Move this point" href="javascript:void(0);" onclick="$.move_point(\'' + options.uuid + '\'); $(\'#' + options.uuid + '\').popover(\'hide\');"><span class="fa fa-arrows"></span></a>';
	var remove_point_btn = '<a class="btn btn-default btn-sm right" title="Remove this point" href="javascript:void(0);" onclick="$(\'#' + options.uuid + '\').popover(\'hide\');"><span class="fa fa-trash-o"></span></a>';
	var popup = new ol.Overlay({
		position: $.set_lonlat(options.lon, options.lat),
		positioning: "center-center",
		element: $('<div class="marker draggable ' + ((options.marker_class != undefined) ? options.marker_class : "") + '" id="' + options.uuid + '"></div>').css({
					cursor: "pointer"
				}).popover({
					html: true,
					title: options.title + '<a href="javascript:void(0);" onclick="$(\'#' + options.uuid + '\').popover(\'hide\');" class="close">&times;</a>',
					content: '<div class="content">' + options.content + '<br /><br />' + '<code>' + ol.coordinate.toStringHDMS([options.lon, options.lat]) + '</code>' + '</div><br /><br />' + '<div class="popup_btns row"><div class="col-sm-12 btn-toolbar"><div class="btn-group">' + set_center_btn + set_zoom_btn + '</div><div class="btn-group right">' + edit_point_btn + remove_point_btn + '</div></div></div>',
					placement: "top",
					trigger: "click"
				}),
		stopEvent: false
	});
	map.addOverlay(popup);
	$("#" + options.uuid).popover("show");
}

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
/*
------------------------------------------------------------------------------------------------------------------------
*/

$.contextMenu = function() {
	$("#knob").hide();
	$("#pgrdg_map").removeClass("grabbing");
	var $contextMenu = $("#knob");
	$("body").on("contextmenu", "#pgrdg_map:not(.locked), #knob", function(e) {
		e.preventDefault();
		if($("#clicked_coords").length == 0) {
			$("body").prepend('<span style="display: none;" id="clicked_coords"></span>');
		}
		var clicked_coords = map.getCoordinateFromPixel([e.clientX, e.clientY]);
		var hdms = ol.proj.transform(clicked_coords, "EPSG:3857", "EPSG:4326");
		
		$("#clicked_coords").text('{"lon": ' + hdms[0] + ',"lat": ' + hdms[1] + '}');
		
		$contextMenu.css({
			left: (e.pageX - 100),
			top: (e.pageY - 200),
		}).fadeIn(300);
		
		return false;
	});
	$contextMenu.on("click", "a", function() {
		$contextMenu.hide();
	});
	$("#knob, #pgrdg_map, #pgrdg_map > *").click(function(e) {
		$contextMenu.hide();
	});
}

$(document).ready(function() {
	$.init_map();
	$(".ol-attribution").append('<a class="info" href="javascript: void(0);" onclick="$(\'.ol-attribution ul\').fadeToggle().parent(\'div\').toggleClass(\'open\');"><span class="fa fa-info-circle"></span></a>');
	if(!$("#pgrdg_map").hasClass("locked")) {
		$("#pgrdg_map").on("mousedown touchstart", function() {
			$(this).addClass("grabbing");
		}).on("mouseup touchend", function() {
			$(this).removeClass("grabbing");
		});
		$.contextMenu(true);
	} else {
		$.contextMenu(false);
	}
	$("#pgrdg_map.locked canvas").on("dragstart touchmove", function(e) { e.preventDefault(); return false; });
	$.render_layers_on_menu();
	$(".popover a[title]").tooltip();
});