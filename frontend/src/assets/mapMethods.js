import L from "leaflet";
// import {icon} from "leaflet/dist/leaflet-src.esm";

export function perc2color(perc) {
    var r, g, b = 0;
    if(perc < 50) {
        r = 255;
        g = Math.round(5.1 * perc);
    }
    else {
        g = 255;
        r = Math.round(510 - 5.10 * perc);
    }
    var h = r * 0x10000 + g * 0x100 + b * 0x1;
    return '#' + ('000000' + h.toString(16)).slice(-6);
}


export function circleMaker(feature, latlng, iconScale, startDate, endDate){
    var eventUTC = new Date(feature.properties.time);

    var eventDate = convertEpochToSpecificTimezone(-10, eventUTC)
    var diff = (endDate - eventDate)
    var range = (endDate - startDate)

    var color = perc2color(Math.abs(((diff/range)*100) - 100))

    var circleProps = {
        radius: feature.properties.mag * iconScale,
        color: color,
        fillColor: color,
        fillOpacity: .5,
    }

    var circle = L.circleMarker(latlng, circleProps);
    return circle;
}

export function popupMaker (feature, layer) {
    var eventTime =new Date(feature.properties.time);
    var d = convertEpochToSpecificTimezone(-10, eventTime)
    layer.bindPopup(
        '<p><b>Magnitude</b>: ' + feature.properties.mag + '</p>' +
        '<p><b>Place</b>: ' + feature.properties.place + '</p>' +
        '<p><b>Time</b>: ' + d.toLocaleString() + '</p>' +
        '<a href=' + feature.properties.url + '>' + 'USGS Event' + '</a>'
    );
}
//GMT offset = -10
export function convertEpochToSpecificTimezone(offset, d){
    var utc = d.getTime() + (d.getTimezoneOffset() * 60000);  //This converts to UTC 00:00
    var nd = new Date(utc + (3600000*offset));
    return nd
}

export function gnssPopup(feature, layer){
    layer.bindPopup(
        feature.properties.description
    );
}

export function gdacsPopup(feature, layer){
    layer.bindPopup(
        '<p><b>Date</b>: ' + feature.properties.fromdate + '</p>' +
        '<p><b>Location</b>: ' + feature.properties.latitude + ", " +
        feature.properties.longitude + '</p>'
    );
}