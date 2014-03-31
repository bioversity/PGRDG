
// Posizione iniziale della mappa
var lat = 50,
lon = 12,
zoom = 4,
fromProjection = new OpenLayers.Projection("EPSG:4326"),
toProjection = new OpenLayers.Projection("EPSG:900913");

function init() {
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
		displayProjection: new OpenLayers.Projection("EPSG:4326")
	});
 	var gphy = new OpenLayers.Layer.Google("Google Physical", {
		type: google.maps.MapTypeId.TERRAIN,
                sphericalMercator: true,
                'maxExtent': new OpenLayers.Bounds(-20037508.34, -20037508.34, 20037508.34, 20037508.34)
		// used to be {type: G_PHYSICAL_MAP}
	});
	var gmap = new OpenLayers.Layer.Google("Google Streets", {
		numZoomLevels: 20,
                sphericalMercator: true,
                'maxExtent': new OpenLayers.Bounds(-20037508.34, -20037508.34, 20037508.34, 20037508.34)
	});
	var ghyb = new OpenLayers.Layer.Google("Google Hybrid", {
		type: google.maps.MapTypeId.HYBRID,
		numZoomLevels: 20,
                sphericalMercator: true,
                'maxExtent': new OpenLayers.Bounds(-20037508.34, -20037508.34, 20037508.34, 20037508.34)
	});
	var gsat = new OpenLayers.Layer.Google("Google Satellite", {
		type: google.maps.MapTypeId.SATELLITE,
		numZoomLevels: 22,
                sphericalMercator: true,
                'maxExtent': new OpenLayers.Bounds(-20037508.34, -20037508.34, 20037508.34, 20037508.34)
	});
	
	map.addLayers([ghyb, gsat, gphy]);
	var lonLat = new OpenLayers.LonLat(lon, lat).transform(
		new OpenLayers.Projection("EPSG:4326"),
		new OpenLayers.Projection("EPSG:3857")
	);
	map.setCenter(lonLat, zoom);
}

$(document).ready(function() {
	init();
});