var queryUrl = "https://earthquake.usgs.gov/fdsnws/event/1/query?format=geojson&starttime=2014-01-01&endtime=" +
  "2014-01-02&maxlongitude=-69.52148437&minlongitude=-123.83789062&maxlatitude=48.74894534&minlatitude=25.16517337";

// Perform a GET request to the query URL
d3.json(queryUrl, function(data) {
  // Once we get a response, send the data.features object to the createFeatures function
  createFeatures(data.features);
});

// Creating our initial map object
// We set the longitude, latitude, and the starting zoom level
// This gets inserted into the div with an id of 'map'
var myMap = L.map("map", {
  center: [
    39.09, -95.71
  ],
  zoom: 5,
  //layers: [streetmap, earthquakes]
});

// Adding a tile layer (the background map image) to our map
// We use the addTo method to add objects to our map
L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18,
    id: 'mapbox/streets-v11',
    tileSize: 512,
    zoomOffset: -1,
    accessToken: 'pk.eyJ1IjoiYXJ1bnNoYW1saSIsImEiOiJjazNwZHlveHUwMjVpM290b211ZjFmNWt1In0.BSnIbnr_uCkkuyIFQlBCZA'
}).addTo(myMap);


// An array containing each city's name, location, and population
var url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

d3.json(url).then ( function(response) {

  //console.log(response.features[0].geometry.coordinates);

var legend = L.control({position: 'bottomright'});

legend.onAdd = function (map) {

    var div = L.DomUtil.create('div', 'info legend'),
        grades = [0, 1, 2, 3, 4, 5],
        colors = ['Green', 'GreenYellow', 'Yellow', 'Orange', 'IndianRed', 'DarkRed']
        labels = [];

    // loop through our density intervals and generate a label with a colored square for each interval
    for (var i = 0; i < grades.length; i++) {
        div.innerHTML +=
            '<i style="background:' + colors[i] + '"></i> ' +
            grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
    }

    return div;
};

legend.addTo(myMap);

  for (var i = 0; i < response.features.length; i++) {

    var colorCircle = 'DarkRed';
    var location = response.features[i].geometry.coordinates;
    var magnitude = response.features[i].properties.mag;

    if(magnitude < 5.0){colorCircle = 'IndianRed'}
    if(magnitude < 4.0){colorCircle = 'orange'}
    if(magnitude < 3.0){colorCircle = 'yellow'}
    if(magnitude < 2.0){colorCircle = 'GreenYellow'}
    if(magnitude < 1.0){colorCircle = 'green';}
    
     console.log(magnitude);
    var circle = L.circle([location[1],location[0]],
      {
      fill: true,
      fillColor: colorCircle,
      fillOpacity: 1,
      radius: 10000 * magnitude,
      stroke: true,
      color: 'black',
      weight: 1

    }).bindPopup("<h1>Magnitude: " + response.features[i].properties.mag + "</h1> <hr> <h3>Location " + response.features[i].properties.place + "</h3>")
    .addTo(myMap);

    }

});


// popup1.openOn(myMap)
// popup2.openOn(myMap)
// popup3.openOn(myMap)


