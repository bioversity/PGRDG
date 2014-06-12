/*
OpenLayers 3 based map
*/

// Initial map position
var lon = 12,
lat = 55,
zoom = 4,
map, view,
vector_measurement, source_measurement, draw,
select, modify,
exampleNS = {},
overlayStyle = (function() {
	/* jshint -W069 */
	var styles = {};
	styles["Polygon"] = [
		new ol.style.Style({
			fill: new ol.style.Fill({
				color: [255, 255, 255, 0.5]
			})
		}),
		new ol.style.Style({
			stroke: new ol.style.Stroke({
				color: [255, 255, 255, 1],
				width: 5
			})
		}),
		new ol.style.Style({
			stroke: new ol.style.Stroke({
				color: [0, 153, 255, 1],
				width: 3
			})
		})
	];
	styles["MultiPolygon"] = styles["Polygon"];

	styles["LineString"] = [
		new ol.style.Style({
			stroke: new ol.style.Stroke({
				color: [255, 255, 255, 1],
				width: 5
			})
		}),
		new ol.style.Style({
			stroke: new ol.style.Stroke({
				color: [0, 153, 255, 1],
				width: 3
			})
		})
	];
	styles["MultiLineString"] = styles["LineString"];

	styles["Point"] = [
		new ol.style.Style({
			image: new ol.style.Circle({
				radius: 7,
				fill: new ol.style.Fill({
					color: [0, 153, 255, 1]
				}),
				stroke: new ol.style.Stroke({
					color: [255, 255, 255, 0.75],
					width: 1.5
				})
			}),
			zIndex: 100000
		})
	];
	styles["MultiPoint"] = styles["Point"];

	styles["GeometryCollection"] = styles["Polygon"].concat(styles["Point"]);

	return function(feature, resolution) {
		return styles[feature.getGeometry().getType()];
	};
	/* jshint +W069 */
})();
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
	source_measurement = new ol.source.Vector();
	view = new ol.View2D({
		center: $.set_lonlat(lon, lat),
		zoom: 4
	}),
	select = new ol.interaction.Select({
		style: overlayStyle
	}),
	modify = new ol.interaction.Modify({
		features: select.getFeatures(),
		style: overlayStyle
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
				layer: "sat"
			}),
			visible: true
		}),
		new ol.layer.Tile({
			style: "Road",
			displayOnMenu: true,
			source: new ol.source.MapQuest({
				layer: "osm"
			}),
			visible: false
		}),
		new ol.layer.Tile({
			style: "Watercolor",
			displayOnMenu: true,
			source: new ol.source.Stamen({
				layer: "watercolor"
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
		}),
		new ol.layer.Vector({
			source: source_measurement,
			style: new ol.style.Style({
				fill: new ol.style.Fill({
					color: "rgba(255, 255, 255, 0.2)"
				}),
				stroke: new ol.style.Stroke({
					color: "#ffcc33",
					width: 2
				}),
				image: new ol.style.Circle({
					radius: 7,
					fill: new ol.style.Fill({
						color: "#ffcc33"
					})
				})
			})
		})
	];

	map = new ol.Map({
		// Taken from http://ol3js.org/en/master/examples/modify-test.html
		interactions: ol.interaction.defaults().extend([select, modify]),
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
	
	var featureOverlay = new ol.FeatureOverlay({
		map: map,
		style: new ol.style.Style({
			stroke: new ol.style.Stroke({
				color: "rgba(255, 0, 0, 0.5)",
				width: 5
			}),
			fill: new ol.style.Fill({
				color: "rgba(255, 0, 0, 1)"
			})
		})
	}),
	highlight,
	previous_cursor = "",
	displayFeatureInfo = function(pixel) {
		var feature = map.forEachFeatureAtPixel(pixel, function(feature, layer) {
			return feature;
		});
		if (feature !== highlight) {
			if (feature) {
				featureOverlay.addFeature(feature);
				previous_cursor = $("#pgrdg_map").css("cursor");
				if(previous_cursor == "pointer") {
					previous_cursor = "grab";
				}
				$("#pgrdg_map").css("cursor", "pointer").bind("mousedown", function(e) {
					if(previous_cursor == "crosshair") {
						if(highlight) {
							$.stop_measurements();
							$("#guides").show();
						} else {
							$("#pgrdg_map").css("cursor", previous_cursor);
							$("#guides").hide();
						}
					} else {
						if(highlight) {
							console.log("hilighted");
							$("#guides").show();
							$("#pgrdg_map").css("cursor",  "crosshair");
						} else {
							console.log("not hilighted");
							$("#pgrdg_map").css("cursor",  previous_cursor);
							$("#guides").hide();
						}
					}
				});
			}
			if (highlight) {
				featureOverlay.removeFeature(highlight);
			}
			highlight = feature;
		}
	};
	
	$(map.getViewport()).on("mousemove", function(evt) {
		var pixel = map.getEventPixel(evt.originalEvent);
		displayFeatureInfo(pixel);
	});
	
	$(".ol-attribution").append('<a class="info" href="javascript: void(0);" onclick="$(\'.ol-attribution ul\').fadeToggle().parent(\'div\').toggleClass(\'open\');"><span class="fa fa-info-circle"></span></a>');
		if(!$("#pgrdg_map").hasClass("locked")) {
			$("#pgrdg_map").on("mousedown touchstart", function(em) {
				var startX = em.clientX,
				startY = em.clientY;
				$("#pgrdg_map").mousemove(function(emm) {
					console.log(startX, startY, "dragging...");
					if(Math.abs(startX - emm.clientX) > 1 && Math.abs(startY - emm.clientY) > 1) {
						$("#pgrdg_map").addClass("grabbing");
					} else {
						$(this).removeClass("grabbing");
					}
				});
			}).on("mouseup touchend", function() {
				$("#pgrdg_map").unbind("mousemove");
				$(this).removeClass("grabbing");
			});
			$.contextMenu(true);
		} else {
			$.contextMenu(false);
		}
		$("#pgrdg_map.locked canvas").on("dragstart touchmove", function(e) { e.preventDefault(); return false; });
		$.render_layers_on_menu();
		$(".popover a[title]").tooltip();
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
		$.reset_map_toolbox();
		
		$("#" + action + "_btn").parent("li").addClass("selected");
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
			$("#" + action + "_btn").parent("li").removeClass("selected");
		} else {
			$("#" + action + "_btn").parent("li").removeClass("selected");
			$("#" + action).fadeOut(300, function() {
				switch(action) {
					case "change_map":
						break;
					case "tools":
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
		$("#map_toolbox #find_location_btn span").removeClass("ion-search").addClass("ion-loading-c").parent("a").addClass("disabled");
		$.ajax({
			url: "API/",
			type: "get",
			format: "json",
			crossDomain: true,
			data: {proxy: "true", type: "get", header: "text/json", address: "http://nominatim.openstreetmap.org/search.php", params: {q: encodeURIComponent(input), format: "json", addressdetails: 1, bounded: 1, limit: 10, polygon_geojson: 1}},
			error: function(data) {
				alert("An error occurred while communicating with the OpenLS service. Please try again.");
				$("#map_toolbox span.ion-loading-c").removeClass("ion-loading-c").addClass("ion-search").parent("a").removeClass("disabled");
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
				$("#map_toolbox span.ion-loading-c").removeClass("ion-loading-c").addClass("ion-search").parent("a").removeClass("disabled");
				$("#" + datap[0].place_id).popover("show");
				$.set_center(Math.floor(datap[0].lon), Math.floor(datap[0].lat));
			}
		});
	}
};
$.toggle_lock_view = function() {
	var current_view = $.get_current_bbox();
	
	if(!$("#pgrdg_map").hasClass("locked")) {
		$("#pgrdg_map").removeClass("grabbing");
		$("#pgrdg_map").addClass("locked");
		$("#lock_view_btn").addClass("pulse");
		$.reset_map_toolbox();
		$.disable_map_toolbox();
		$("#selected_zone").text("Map locked").show();
		$("#goto_map_btn").append('<sup class="lock"> <span class="fa fa-lock text-danger"></span></sup>');
	} else {
		$("#pgrdg_map").removeClass("locked");
		$("#lock_view_btn").removeClass("pulse");
		$.enable_map_toolbox();
		$("#selected_zone").text("Map unlocked").show().delay(2000).fadeOut(600);
		$("#goto_map_btn").find("sup.lock").remove();
	}
};
$.show_guides = function() {
	$(document).on("mousemove", function(e){
		$("#guides").find("#gx").css({
			top: e.pageY,
			left: 0,
			width: e.pageX-5
		});
		$("#guides").find("#gxx").css({
			top: e.pageY,
			left: e.pageX+5,
			width: ($(document).width() - e.pageX)
		});
		$("#guides").find("#gy").css({
			left: e.pageX,
			top: 0,
			height: e.pageY-5
		});
		$("#guides").find("#gyy").css({
			left: e.pageX,
			top: e.pageY+5,
			height: ($(document).height() - e.pageY)
		});
	});
};
$.start_measurements = function(click_on_start) {
	$("#pgrdg_map").css("cursor", "crosshair");
	$("#guides").show();
		
	if(click_on_start !== null && typeof(click_on_start) == "array") {
		// Add function to preselect starting point
	}
}
$.pause_measurements = function() {
	$("#guides").hide();
};
$.stop_measurements = function() {
	map.removeInteraction(draw);
	$("#measure_distances_btn").removeClass("selected").parent("li").removeClass("selected");
	$("#selected_zone").text("");
	$("#pgrdg_map").css("cursor", "grab");
	$("#guides").hide();
	
	$("#measure_distances_btn").removeClass("selected").parent("li").removeClass("selected");
	$("#selected_zone").text("");
};
$.gui_measure_distances = function(type, options) {
	if(type == undefined) {
		type = "";
	}
	var options = $.extend({
		lon: 0,
		lat: 0,
		click_on_start: null,
		title: "",
		callback: function() {}	
	}, options);
	if (typeof callback == "function") {
		callback.call(this);
	}
	$("#pgrdg_map").css("cursor", "crosshair");
	if(!$("#measure_distances_btn").hasClass("selected")) {
		var sketch,
		sketchElement;
		formatLength = function(line) {
			var length = Math.round(line.getLength() * 100) / 100,
			edit_btn = '<a href="javascript:void(0);" onclick="" class="btn btn-xs btn-default"><span class="fa fa-edit"></span></a> ',
			remove_btn = '<a href="javascript:void(0);" onclick="" class="btn btn-xs btn-default"><span class="fa fa-trash-o"></span></a> ',
			export_btn = '<a href="javascript:void(0);" onclick="" class="btn btn-xs btn-default"><span class="fa fa-floppy-o"></span></a> ',
			output;
			
			//console.log(line.getCoordinates());
			if (length > 100) {
				output = '<td style="vertical-align: middle;">' + (Math.round(length / 1000 * 100) / 100) + " " + "km" + '</td><td class="text-right" style="vertical-align: middle; width: 50%;"><!--div class="btn-group">' + edit_btn + remove_btn + '</div-->' + export_btn + '</td>';
			} else {
				output = (Math.round(length * 100) / 100) + " " + "m";
			}
			return output;
		},
		formatArea = function(polygon) {
			var area = polygon.getArea(),
			output;
			
			if (area > 10000) {
				output = (Math.round(area / 1000000 * 100) / 100) + " " + "km<sup>2</sup>";
			} else {
				output = (Math.round(area * 100) / 100) + " " + "m<sup>2</sup>";
			}
			return output;
		},
		mouseMoveHandler = function(evt) {
			if (sketch) {
				var output,
				geom = (sketch.getGeometry());
				
				if (geom instanceof ol.geom.Polygon) {
					output = formatArea(/** @type {ol.geom.Polygon} */ (geom));
				} else if (geom instanceof ol.geom.LineString) {
					output = formatLength( /** @type {ol.geom.LineString} */ (geom));
				}
				sketchElement.innerHTML = output;
			}
		};
		switch(type) {
			case "length":
				$("#measure_distances_btn").addClass("selected").parent("li").addClass("selected");
				$("#selected_zone").text("Distance measurement");
				$("#left_panel .panel-body:not(.text-right)").html('<div id="measurements"><h5 class="text-primary">Measuring distances between points</h5><table class="table table-condensed"><thead><tr><th>Distance</th><th></th></tr></thead><tbody id="measure_output"></tbody></table></div>');
				$.left_panel("filter");
				$.show_guides();
				
				draw = new ol.interaction.Draw({
					source: source_measurement,
					type: "LineString"
				});
				map.addInteraction(draw);
				$(document.elementFromPoint(100, 100)).click();
				$(map.getViewport()).on("mousemove", mouseMoveHandler);
				
				draw.on("drawstart", function(evt) {
					$.start_measurements(options.click_on_start);
					
					// set sketch
					sketch = evt.feature;
					sketchElement = document.createElement("tr");
					var outputList = document.getElementById("measure_output");
					
					outputList.appendChild(sketchElement);
				}, this);
				draw.on("drawend", function(evt) {
					$.stop_measurements();
					
					// unset sketch
					sketch = null;
					sketchElement = null;
				}, this);
				break;
			case "area":
				$("#measure_distances_btn").addClass("selected").parent("li").addClass("selected");
				$("#selected_zone").text("Area measurement");
				$("#left_panel .panel-body:not(.text-right)").html('<div id="measurements"><h5 class="text-primary">Measuring distances between points</h5><table class="table table-condensed"><thead><tr><th>Distance</th><th></th></tr></thead><tbody id="measure_output"></tbody></table></div>');
				$.left_panel("filter");
				$.show_guides();
				
				draw = new ol.interaction.Draw({
					source: source_measurement,
					type: "Polygon"
				});
				map.addInteraction(draw);
				$(map.getViewport()).on("mousemove", mouseMoveHandler);
				
				draw.on("drawstart", function(evt) {
					$.start_measurements(options.click_on_start);
					
					// set sketch
					sketch = evt.feature;
					sketchElement = document.createElement("li");
					var outputList = document.getElementById("measure_output");
					
					if (outputList.childNodes) {
						outputList.insertBefore(sketchElement, outputList.firstChild);
						//console.log(sketchElement, outputList.firstChild);
					} else {
						outputList.appendChild(sketchElement);
						//console.log(sketchElement);
					}
				}, this);
				draw.on("drawend", function(evt) {
					$("#guides").hide();
					
					// unset sketch
					sketch = null;
					sketchElement = null;
				}, this);
				
				break;
			case "point":
				$("#measure_distances_btn").addClass("selected").parent("li").addClass("selected");
				$("#selected_zone").text("Distance measurement");
				$.gui_measure_distances({type: "length", click_on_start: [10, 10]});
				/*
				apprise("Search a location to calculate distances.<br ><p>From:<br />this point (" + ((options.title.length > 0) ? ' "' + options.title + '" - ' : "") + "lon: " + options.lon + ", lat: " + options.lat + ")</p>To:<br />", {"title": "Measure distance between two points", "input": true}, function(r) {
					if(r) {
						$.search_location(r);
						$(".popover").popover("hide");
					}
				});
				*/
				break;
			default:
				apprise('<div id="measure_btns" class="row"><div class="col-sm-6"><a class="btn btn-lg" href="javascript: void(0);" onclick="$.gui_measure_distances(\'length\'); $(\'#apprise\').modal(\'hide\');"><span class="picol picol_route"></span>Length</a></div><div class="col-sm-6"><a class="btn btn-lg" href="javascript: void(0);" onclick="$.gui_measure_distances(\'area\'); $(\'#apprise\').modal(\'hide\');"><span class="picol picol_point_of_interest"></span>Area</a></div><div class="col-sm-6"></div></div>', {"title": "Measure", "showFooter": false});
				break;
		}
	} else {
		$.stop_measurements();
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
		cloud: true,
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
	var measure_distance_btn = '<a class="btn btn-default btn-sm right" title="Calculate distance" href="javascript:void(0);" onclick="$.gui_measure_distances(\'point\', {lon: \'' + options.lon + '\', lat:\'' + options.lat + '\', title:\'' + options.name + '\'})"><span class="ion-fork-repo"></span></a>';
	var marker = new ol.Overlay({
		position: $.set_lonlat(options.lon, options.lat),
		positioning: "center-center",
		element: (options.cloud) ? $('<div class="marker ' + options.marker_class + '" id="' + options.uuid + '"></div>').css({
					cursor: "pointer"
				}).popover({
					html: true,
					title: options.title + '<a href="javascript:void(0);" onclick="$(\'#' + options.uuid + '\').popover(\'hide\');" class="close">&times;</a>',
					content: options.content + '<br /><br />' + '<div class="popup_btns row"><div class="col-sm-12 btn-group">' + set_center_btn + set_zoom_btn + remove_point_btn + measure_distance_btn + '</div></div>',
					placement: "top",
					trigger: "click"
				}).bind("click", function() {
					console.log(options.lon, options.lat);
				}) : $('<div class="marker ' + options.marker_class + '" id="' + options.uuid + '"></div>'),
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
		name: "",
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
	var measure_distance_btn = '<a class="btn btn-default btn-sm right" title="Calculate distance" href="javascript:void(0);" onclick="$.gui_measure_distances(\'point\', {lon: \'' + options.lon + '\', lat:\'' + options.lat + ', title:\'' + options.name + '\'})"><span class="ion-fork-repo"></span></a>';
	var popup = new ol.Overlay({
		position: $.set_lonlat(options.lon, options.lat),
		positioning: "center-center",
		element: $('<div class="marker draggable ' + ((options.marker_class != undefined) ? options.marker_class : "") + '" id="' + options.uuid + '"></div>').css({
					cursor: "pointer"
				}).popover({
					html: true,
					title: options.title + '<a href="javascript:void(0);" onclick="$(\'#' + options.uuid + '\').popover(\'hide\');" class="close">&times;</a>',
					content: '<div class="content">' + options.content + '<br /><br />' + '<code>' + ol.coordinate.toStringHDMS([options.lon, options.lat]) + '</code>' + '</div><br /><br />' + '<div class="popup_btns row"><div class="col-sm-12 btn-toolbar"><div class="btn-group">' + set_center_btn + set_zoom_btn + '</div><div class="btn-group right">' + edit_point_btn + remove_point_btn + measure_distance_btn + '</div></div></div>',
					placement: "top",
					trigger: "click"
				}),
		stopEvent: false
	});
	map.addOverlay(popup);
	$("#" + options.uuid).popover("show");
}

$.center_map_on = function(location) {
	if(!$("#pgrdg_map").hasClass("locked")) {
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
}
/*
------------------------------------------------------------------------------------------------------------------------
*/

/*
Map Toolbox
*/
$.reset_map_toolbox = function() { $("#map_sub_toolbox div").fadeOut(100); $("#map_toolbox li").removeClass("selected"); };
$.disable_map_toolbox = function() { $("#map_toolbox a:not(#lock_view_btn)").addClass("disabled").parent("li").addClass("disabled"); };
$.enable_map_toolbox = function() { $("#map_toolbox li, #map_toolbox a").removeClass("disabled"); };


$.contextMenu = function() {
	$("#knob").hide();
	$("#pgrdg_map").removeClass("grabbing");
	var $contextMenu = $("#knob");
	$("body").on("contextmenu", "#pgrdg_map:not(.locked), #knob:not(header)", function(e) {
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
});