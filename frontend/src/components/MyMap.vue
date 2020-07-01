<template>
    <div id="map-window">
        <link rel="stylesheet" href="https://unpkg.com/leaflet@1.6.0/dist/leaflet.css"
              integrity="sha512-xwE/Az9zrjBIphAcBb3F6JVqxf46+CDLwfLMHloNu6KEQCAWi6HcDUbeOfBIptF7tcCzusKFjFw2yuvEpDL9wQ=="
              crossorigin=""/>
        <TopNav />
        <ToolBar />
        <div id="map">
        </div>
        <b-button id="clearMap" @click="resetMap">Clear Map</b-button>
    </div>
</template>

<script>

    import 'leaflet/dist/leaflet.css';
    import L from 'leaflet';
    import "leaflet-kml"
    import ToolBar from "./ToolBar";
    import {bus} from '../main'
    import 'leaflet-draw'
    import "leaflet-draw/dist/leaflet.draw.css";
    import TopNav from "./TopNav";
    import {circleMaker, popupMaker} from '../assets/mapMethods'
    // import axios from "axios";
    // import GeometryUtil from 'leaflet-geometryutil'

    export default {
        name: 'MyMap',
        components: {
            ToolBar,
            TopNav
        },
        data() {
            return {
                map: null,
                drawToolShow: false,
                layers: {
                    'ucerfL': null,
                    'woForecastL': null,
                    'caForecastL': null,
                    'boundariesL': null,
                    'coastsL': null,
                    'gdacsL': null,
                    'gnssV': null,
                    'gnssH': null,
                    'nowcastL': null,
                    'usgs_layer': null,
                    'markerLayer': null,
                },


            };
        },
        mounted() {

            //create layers
            this.map = L.map('map').setView([51.505, -0.09], 3);
            this.tileLayer();

            // var url = 'http://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/4.5_month.geojsonp'
            // var geojsonLayer = new L.GeoJSON.AJAX(url, {dataType:"jsonp"});
            // this.map.addLayer(geojsonLayer)
            //

            //global map layer event listeners

            bus.$on('UrlAddLayer', (url, layerName) =>
                this.kmlUrl(url, layerName));

            bus.$on('TextAddLayer', (text, layerName)=>
                this.kmlText(text, layerName));

            bus.$on('drawToolbar', () =>
                this.drawToolbar());

            bus.$on('addExisting', (layerName) =>
                this.addExistingLayer(layerName));

            //convert to above abstracted event listener

            bus.$on('gnssLayer', (text) =>
                this.kmlText(text));

            bus.$on('RemoveLayer', (name) =>
                this.removeLayer(name));
            bus.$on('newRemoveLayer', (name)=>
                this.newRemoveLayer(name));

            bus.$on('nowcast', (data, lat, lon)=>
                this.seismicityPlots(data, lat, lon));

            bus.$on('filterCat', (text, dFilter, mFilter, iconScale, startDate, endDate) =>
                this.catalogFilter(text, dFilter, mFilter, iconScale, startDate, endDate));


        },


        methods: {

            resetMap(){
                for(var key in this.layers){
                    if(this.layers[key]!==null) {
                        this.map.removeLayer(this.layers[key]);
                    }
                }
                bus.$emit('clearLayers');
            },

            drawToolbar(){
                if(!this.drawToolShow) {
                    this.drawToolShow = true
                    var drawnItems = new L.FeatureGroup();
                    this.map.addLayer(drawnItems);
                    var drawControl = new L.Control.Draw({
                        draw: {
                            polygon: false,
                            marker: true,
                            polyline: false,
                            circle: false,
                            rectangle: true,
                        },
                        edit: {
                            featureGroup: drawnItems
                        }
                    });
                    this.map.addControl(drawControl);
                    this.map.addLayer(drawnItems);

                    //gets lat long width height of drawn rectangle and prints in console.
                    // TODO dynamically fill form input with results from drawn rectangle

                    this.map.on('draw:created', function (e) {
                        var type = e.layerType;
                        if (type === 'rectangle') {
                            var layer = e.layer;
                            this.addLayer(layer);
                            var centerLat = layer.getCenter().lat;
                            var centerLng = layer.getCenter().lng;
                            var maxLat = layer.getLatLngs()[0][1].lat;
                            var maxLon = layer.getLatLngs()[0][2].lng;
                            var minLat = layer.getLatLngs()[0][3].lat;
                            var minLon = layer.getLatLngs()[0][0].lng;
                            // var ne = layer.getLatLngs()[0][3];

                            // console.log(this.gs_latitude, this.gs_longitude);
                            // console.log(this.gs_height, this.gs_width)
                            bus.$emit('rectDim', maxLat, minLon, minLat, maxLon, centerLat, centerLng);
                        }
                        else if(type === 'marker'){
                            this.markerLayer = e.layer;
                            this.addLayer(this.markerLayer);
                            var lat = this.markerLayer.getLatLng().lat;
                            var lng = this.markerLayer.getLatLng().lng;
                            bus.$emit('markPlace', lat, lng);
                        }
                    });
                }
            },
            tileLayer(){
                L.tileLayer(
                    'https://cartodb-basemaps-{s}.global.ssl.fastly.net/rastertiles/voyager/{z}/{x}/{y}.png',
                    {
                        maxZoom: 18,
                        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>, &copy; <a href="https://carto.com/attribution">CARTO</a>',
                    }).addTo(this.map);
            },
            // TODO make addLayer and removeLayer methods for use with $emit $on
            // ie refine layer logic so this method is not necessary
            kmlText(text, layerName){
                // console.log(this.globalLayers.gnss1)
                const parser = new DOMParser();
                const kml = parser.parseFromString(text, 'text/xml');
                this.layers[layerName] = new L.KML(kml);
                this.map.addLayer(this.layers[layerName]);
                const bounds = this.layers[layerName].getBounds();
                this.map.fitBounds(bounds);

            },
            kmlUrl(url, layerName) {
                fetch(url).then(res => res.text())
                    .then(kmltext => {
                        const parser = new DOMParser();
                        var kml = parser.parseFromString(kmltext, "text/xml");
                        this.layers[layerName] = new L.KML(kml);
                        this.map.addLayer(this.layers[layerName]);
                        this.map.fitBounds(this.layers[layerName].getBounds());
                    });
            },
            removeLayer(layerName){
                this.map.removeLayer(this.layers[layerName])
            },
            addExistingLayer(layerName){
              this.map.addLayer(this[layerName]);
            },
            deleteLayer(layerName){
                this.map.removeLayer(this[layerName]);
                this[layerName] = null;
            },
            newRemoveLayer(layername){
                this.map.removeLayer(this.layers[layername])
            },
            seismicityPlots(data, lat, lon){
                var style = " style=width:200px;height:150px;"
                //fa-line-chart
                var latlng = L.latLng(lat,lon);
                var plotReadyMarker = L.circleMarker(latlng,{
                    color: 'green',
                    fillColor: 'lightgreen',
                    radius:10,
                }).addTo(this.map);

                var eps = data.urls[0]
                var numMag = data.urls[1]
                var seis = data.urls[2]

                //TODO make images clickable

                plotReadyMarker.bindPopup("<img src=" + eps + style + " >" + "<br/>"
                    + "<img src=" + numMag + style + " >"
                    + "<img src=" + seis + style + " >");

                this.map.panTo(new L.latLng(lat, lon));
            },
            catalogFilter(text, dFilter, mFilter, iconScale, startDate, endDate) {
                var toFilterM;
                if (this.layers['usgs_layer'] != null) {
                    this.map.removeLayer(this.layers['usgs_layer'])
                }
                //Better way to do this?
                //To add depth filter (what feature property represents depth?)
                if(mFilter === ''){
                    toFilterM = () => true
                }else {
                    toFilterM = function(feature){
                        return feature.properties.mag > parseInt(mFilter);
                    }
                }
                this.layers['usgs_layer'] = L.geoJSON(text, {
                    onEachFeature: function (feature, layer) {
                        //what properties of each feature are most important to display?
                        popupMaker(feature, layer);
                    },
                    filter: toFilterM,
                    pointToLayer: function(feature, layer){
                        return circleMaker(feature, layer, iconScale, startDate, endDate);
                    }
                }).addTo(this.map)
            },

        },

    };
</script>
<style scoped>
    #map {
        position: relative;
        height: 96%;
        width: auto;
        margin-left: auto;
        /*float: right;*/

    }
    #map-window {
        position: inherit;
        height: 100%;
        width: auto;
        padding: 0;
        /*float: right;*/
    }
    #clearMap {
        position: absolute;
        top: 140px;
        right: 20px;
        padding: 10px;
        z-index: 400;
    }
    .leaflet-draw-toolbar a {
        background-image: url('../assets/spritesheet.png');
        background-repeat: no-repeat;
        color: transparent !important;
    }
</style>
