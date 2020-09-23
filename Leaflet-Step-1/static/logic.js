const map_a = L.map("map", {
    center: [
        39.82, -120.57
    ],
    zoom: 5

    });
// Establish API call
const streetmap = L.tileLayer("https://api.azuremaps.com/v2/{id}/tiles/{z}/{x}/{y}?=API_KEY", {
    tileSize: 450,
    maxZoom: 15,
    zoomOffset: -1,
    API_KEY: KEY
}).addTo(map_a);

const link = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/4.5_week.geojson"
const geojson;
const colors = ["blue","pink","teal","orange","green","red"];
d3.json(link, function(data) {
    for (const i = 0; i<data.features.length; i++) {
        const location = [data.features[i].geometry.coordinates[1],data.features[i].geometry.coordinates[0]];
        const t_marker = data.features[i].properties.place;
        const magnitude = data.features[i].properties.mag;
        const marker = L.circle(location,{
            title: t_marker,
            fillOpacity: 0.90,
            fillColor: my_map_colors(),
            radius: Math.pow(magnitude,4)*1000
        }).addTo(map_a)
        marker.bindPopup("<h3> Magnitude: " + magnitude + "</h3>")
    }
    console.log(data.features);

    function my_map_colors() {
        const color = "";
        if (magnitude > 5) {color=colors[5]}
        else if (magnitude > 4) {color=colors[4]}
        else if (magnitude > 3) {color=colors[3]}
        else if (magnitude > 2) {color=colors[2]}
        else if (magnitude > 1) {color=colors[1]}
        else {color=colors[0]}
        return color;
    };

    const map_legend = L.control({ position: "bottomright" });
    map_legend.onAdd = function() {
        const div = L.DomUtil.create("div", "info legend");
        const magnitudeLimits = [0,1,2,3,4,5];
        const labels = ["Magnitude"];

        magnitudeLimits.forEach(function(limit, index) {
            if (index<(magnitudeLimits.length-1)) {
                labels.push("<li style=\"background-color: " + colors[index] + "\">" + magnitudeLimits[index] + " - " + magnitudeLimits[index+1] + "</li>");
            }
            else {
                labels.push("<li style=\"background-color: " + colors[index] + "\">" + magnitudeLimits[index] + "+</li>");
            }
        });

        div.innerHTML += "<ul>" + labels.join("") + "</ul>";
        return div;
    };

    map_legend.addTo(map_a);

});