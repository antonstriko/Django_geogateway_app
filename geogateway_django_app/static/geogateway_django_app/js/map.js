// initializing leaflet map

var mymap = L.map('map-canvas').setView([36.7783, -119.4179], 13);

L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18,
    id: 'mapbox/streets-v11',
    tileSize: 512,
    zoomOffset: -1,
    accessToken: 'pk.eyJ1IjoibmJtb3dlcnkiLCJhIjoiY2thZ3k1amp4MGR5ODJ5bzNmaXoxdHVpbiJ9.4T8MReydBSU0yAg0WtY5rw'
}).addTo(mymap);


function showUCERF3FaultLayer(faultcolor) {
    if(document.getElementById("maptools.UCERF3FaultLayer").checked==true) {
                    omnivore.kml('https://raw.githubusercontent.com/GeoGateway/GeoGatewayStaticResources/master/kmz/ucerf3_black.kml').addTo(mymap);

    }
    else {

    }

}