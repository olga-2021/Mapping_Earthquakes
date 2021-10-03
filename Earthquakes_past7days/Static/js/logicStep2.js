// Create the tile layer that will be the background of the map.
let light = L.tileLayer('https://api.mapbox.com/styles/v1/mapbox/navigation-guidance-day-v4/tiles/{z}/{x}/{y}?access_token={accessToken}', {
attribution: 'Map data © <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery (c) <a href="https://www.mapbox.com/">Mapbox</a>',
	maxZoom: 18,
	accessToken: API_KEY
});

// Create the dark view tile layer that will be an option for the map.
let dark = L.tileLayer('https://api.mapbox.com/styles/v1/mapbox/navigation-guidance-night-v4/tiles/{z}/{x}/{y}?access_token={accessToken}', {
attribution: 'Map data © <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery (c) <a href="https://www.mapbox.com/">Mapbox</a>',
	maxZoom: 18,
	accessToken: API_KEY
});

// Create a base layer that holds both maps.
let baseMaps = {
  Light: light,
  Dark: dark
};

// Create the map object with center, zoom level and default layer.
let map = L.map('mapid', {
	center: [44.0, -80.0],
	zoom: 2,
	layers: [dark]
});

// Pass map layers into layers control and add the layers control to the map.
L.control.layers(baseMaps).addTo(map);

let torontoData = "https://raw.githubusercontent.com/peterg7/Mapping_Earthquakes_GISH/Mapping_GeoJSON_Linestrings/torontoRoutes.json";

// Create a style for the lines.
let myStyle = {
	color: "#ffffa1", // yellow
	weight: 2
}

// Retrieve the earthquake GeoJSON data.
d3.json("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson").then(function(data) {
	// This function returns the style data for each of the earthquakes plotted on
	// the map. Then pass the magnitude of the earthquake into a function
	// to calculate the radius.
	function styleInfo(feature) {
	  return {
	    opacity: 1,
	    fillOpacity: 1,
	    fillColor: "#ffae42",
	    color: "#000000",
	    radius: getRadius(),
	    stroke: true,
	    weight: 0.5
	  };
	}
	// This function determines the radius of the earthquake marker based on its magnitude.
	// Earthquakes with a magnitude of 0 will be plotted with a radius of 1.
	function getRadius(magnitude) {
		if (magnitude === 0) {
			return 1;
		}
		return magnitude * 4;
	}
	// Creating a GeoJSON layer with the retrieved data.
	L.geoJson(data, {
		// Turn each feature into a circleMarker on the map.
		pointToLayer: function(feature, latlng) {
			console.log(data);
			return L.circleMarker(latlng);
		},
		// Set the style for each circleMarker using styleInfo function.
		style: styleInfo
	}).addTo(map);

});