<template>
    <div id="map-window">
        <link rel="stylesheet" href="https://unpkg.com/leaflet@1.6.0/dist/leaflet.css"
              integrity="sha512-xwE/Az9zrjBIphAcBb3F6JVqxf46+CDLwfLMHloNu6KEQCAWi6HcDUbeOfBIptF7tcCzusKFjFw2yuvEpDL9wQ=="
              crossorigin=""/>
        <TopNav />
        <ToolBar />
        <div v-if="plotActive" class="plot-window">
            <div id="dygraph-LOS"></div>
        </div>

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
    import TopNav from "./TopNav";
    import {bus} from '../main'
    import 'leaflet-draw'
    import "leaflet-draw/dist/leaflet.draw.css";

    import {circleMaker, gdacsPopup, gnssPopup, popupMaker} from '../assets/mapMethods'
    import Dygraph from "dygraphs";
    // import axios from "axios";
    // import GeometryUtil from 'leaflet-geometryutil'

    export default {
        name: 'MyMap',
        components: {
            ToolBar,
            TopNav,
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
                    'kmlUpload': null,
                    'nowcastLayer': null,
                    'uavsarWMS': null,
                    'uavsarOverlay': null,
                    'highResUavsar': null,
                },
                uavsarLayers: [],
                savedLayers: [],
                plottingMarker1: null,
                plottingMarker2: null,
                plotLine: null,
                plotActive: false,


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

            bus.$on('gnssLayer', (text, type) =>
                this.gnssGeoJson(text, type));

            bus.$on('RemoveLayer', (name) =>
                this.removeLayer(name));
            bus.$on('newRemoveLayer', (name)=>
                this.newRemoveLayer(name));

            bus.$on('nowcast', (data, lat, lon)=>
                this.seismicityPlots(data, lat, lon));

            bus.$on('filterCat', (text, dFilter, mFilter, iconScale, startDate, endDate) =>
                this.catalogFilter(text, dFilter, mFilter, iconScale, startDate, endDate));

            bus.$on('addGeoJson', (text, layer) =>
                this.addGeoJson(text,layer));

            bus.$on('gdacsGeoJSON', (text) =>
                this.addGdacsLayers(text));

            bus.$on('saveMapState', () =>
                this.saveState());

            bus.$on('displaySave', (layers) =>
                this.displaySave(layers));

            bus.$on('clearSaveLayer', (layers) =>
                this.clearSave(layers));

            bus.$on('UAVSAR_overview', () =>
                this.uavsarOverview());

            bus.$on('uavsarKMLs', (results) =>
                this.uavsarOverlay(results));

            bus.$on('reactivateUavsarLayer', (name) =>
                this.reactivateUavsarLayer(name));

            bus.$on('removeUavsarLayer', (name) =>
                this.removeUavsarLayer(name))

            bus.$on('uavsarWMS', (layer, latlon) =>
                this.uavsarWMS(layer, latlon));

            // this.map.on('click', (e) =>
            //     this.mapListener(e));

            bus.$on('updatePlotLine', (entry)=>
                this.updatePlotLine(entry));
            bus.$on('showPlot', (csv_final)=>
                this.showPlot(csv_final));
            bus.$on('activatePlot', (csv_final)=>
                this.activatePlot(csv_final));
        },


        methods: {
            showPlot(csv_final){
                new Dygraph(
                    document.getElementById("dygraph-LOS"),
                    csv_final,{drawPoints:true,
                        pointSize:2,
                        strokeWidth:0.0,
                        titleHeight:20,
                        xLabelHeight:16,
                        yLabelWidth:16,
                        xlabel:'Distance (km)',
                        ylabel:'Ground Range Change (cm)'
                    }
                );

            },
            activatePlot(csv_final){
                this.plotActive = true;
                this.showPlot(csv_final)
            },
            resetMap(){
                for(var key in this.layers){
                    if(this.layers[key]!==null) {
                        this.map.removeLayer(this.layers[key]);
                        this.layers[key] = null;
                    }
                }
                for(var uid in this.uavsarLayers) {
                    if (this.uavsarLayers[uid] !== null) {
                        this.map.removeLayer(this.uavsarLayers[uid]);
                        this.uavsarLayers[uid] = null;
                    }
                }
            },

            updatePlotLine(entry){
                this.plotLine.remove();
                this.plotLine = L.polyline([this.plottingMarker1.getLatLng(),this.plottingMarker2.getLatLng()], {color: 'red'}).addTo(this.map)
                var latlon = [this.plottingMarker1.getLatLng().lat, this.plottingMarker1.getLatLng().lng, this.plottingMarker2.getLatLng().lat, this.plottingMarker2.getLatLng().lng]
                bus.$emit('updatedPlot', latlon, entry)
            },
            saveState(){
                bus.$emit('saved', this.layers);
            },
            displaySave(layers){
                for(var key in layers){
                    if(layers[key] !== null){
                        this.map.addLayer(layers[key])
                    }
                }
            },
            uavsarWMS(entry, latlon){
                if(this.layers['highResUavsar'] !== null){
                    this.map.removeLayer(this.layers['highResUavsar']);
                    this.layers['highResUavsar'] = null;
                }
                var baseURI = "http://js-168-89.jetstream-cloud.org/geoserver/InSAR/wms?"

                var layername = 'InSAR:' + 'uid' + entry.info['uid'] + '_unw'


                this.layers['highResUavsar'] = L.tileLayer.wms(baseURI, {
                    layers: layername,
                    transparent: true,
                    format: 'image/png',
                    zIndex: 2
                })

                console.log(this.layers['highResUavsar']._container)

                this.map.addLayer(this.layers['highResUavsar']);
                console.log(this.layers['highResUavsar'])

                var lat1 = latlon[0][1];
                var lon1 = latlon[0][0];
                var lat2 = latlon[2][1];
                var lon2 = latlon[2][0];

                //set markers for LOS plotting

                console.log(lon1, lon2)

                var factor = (lon2 - lon1)/6

                var updatedLon2 = lon1 + factor;

                var updatedLat2 = ((lat2 - lat1)/5) + lat1

                bus.$emit('getCSV', entry,  [lat1, lon1, updatedLat2, updatedLon2]);

                if(this.plottingMarker1 !== null){
                    this.plottingMarker1.remove();
                    this.plottingMarker2.remove();
                    this.plotLine.remove();
                }
                this.plottingMarker1 = L.marker([lat1, lon1],
                    {draggable: true}).addTo(this.map)
                // console.log(this.plottingMarker1)
                this.plottingMarker2 = L.marker([updatedLat2, updatedLon2],
                    {draggable: true}).addTo(this.map)

                this.plotLine = L.polyline([this.plottingMarker1.getLatLng(),this.plottingMarker2.getLatLng()], {color: 'red'}).addTo(this.map)

                this.plottingMarker1.on('dragend', function(){
                    bus.$emit('updatePlotLine', entry);
                })

                this.plottingMarker2.on('dragend', function(){
                    bus.$emit('updatePlotLine', entry);
                })


            },
            clearSave(layers){
                for(var key in layers) {
                    if (layers[key] !== null) {
                        this.map.removeLayer(layers[key]);
                    }
                }
            },
            removeUavsarLayer(name){
                this.map.removeLayer(this.uavsarLayers[name]);
            },
            reactivateUavsarLayer(name){
                this.map.addLayer(this.uavsarLayers[name]);
            },
            uavsarOverview(){
                this.layers['uavsarWMS'] = L.tileLayer.wms('http://gf8.ucs.indiana.edu/geoserver/InSAR/wms?', {
                        layers: 'InSAR:thumbnailmosaic',
                        transparent: true,
                        format: 'image/png',
                        zIndex: 2
                    }
                ).addTo(this.map);
            },
            uavsarOverlay(entries){
                if(this.layers['uavsarWMS']) {
                    this.removeLayer('uavsarWMS');
                }
                for(let k = 0;k<entries.length;k++){
                    let entry = entries[k];
                    var id = entry.info['uid']
                    let text = entry.kml;
                    const parser = new DOMParser();
                    const kml = parser.parseFromString(text, 'text/xml');
                    this.uavsarLayers[id] = new L.KML(kml);
                    this.map.addLayer(this.uavsarLayers[id]);
                    const bounds = this.uavsarLayers[id].getBounds();
                    this.map.fitBounds(bounds);
                }

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
                            polyline: true,
                            circle: false,
                            rectangle: true,
                            circlemarker: false,
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
                            this.removeLayer(layer)
                            // var ne = layer.getLatLngs()[0][3];

                            // console.log(this.gs_latitude, this.gs_longitude);
                            // console.log(this.gs_height, this.gs_width)
                            bus.$emit('rectDim', maxLat, minLon, minLat, maxLon, centerLat, centerLng);
                        }
                        else if(type === 'marker'){
                            this.markerLayer = e.layer;
                            var lat = this.markerLayer.getLatLng().lat;
                            var lng = this.markerLayer.getLatLng().lng;
                            bus.$emit('markPlace', lat, lng);
                        }
                        else if(type === 'polyline'){
                            var displacementLine = e.layer;
                            var arrLatLon = displacementLine.getLatLngs();
                            console.log(arrLatLon);
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
                        zIndex: 1,
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
            addGeoJson(text, layer){
                this.layers[layer] = L.geoJSON(text, {
                }).addTo(this.map);
            },
            gnssGeoJson(text, type){
                if(type === 'gnssV'){
                    this.layers['gnssV'] = L.geoJSON(text, {
                        onEachFeature: function (feature, layer) {
                            //what properties of each feature are most important to display?
                            gnssPopup(feature, layer);
                        },
                    }).addTo(this.map);
                }else {
                    this.layers['gnssH'] = L.geoJSON(text).addTo(this.map);
                }
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
                this.map.addLayer(this.layers[layerName]);
            },
            newRemoveLayer(layername){
                this.map.removeLayer(this.layers[layername])
            },
            seismicityPlots(data, lat, lon){
                var style = " style=width:200px;height:150px;"
                //fa-line-chart
                var latlng = L.latLng(lat,lon);
                this.layers['nowcastLayer'] = L.circleMarker(latlng,{
                    color: 'green',
                    fillColor: 'lightgreen',
                    radius:10,
                }).addTo(this.map);

                var eps = data.urls[0]
                var numMag = data.urls[1]
                var seis = data.urls[2]

                //TODO make images clickable

                this.layers['nowcastLayer'].bindPopup("<img src=" + eps + style + " >" + "<br/>"
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

            addGdacsLayers(text){
                this.layers['gdacsL'] = L.geoJSON(text, {
                    onEachFeature: function (feature, layer) {
                        //what properties of each feature are most important to display?
                        gdacsPopup(feature, layer);
                    },
                    pointToLayer: function(feature){
                        var gdacsIcon = L.icon({
                            iconUrl: feature.properties.iconitemlink,
                            iconSize:     [30, 35],
                            iconAnchor:   [15, 35],
                        });
                        var lat = feature.properties.latitude;
                        var lon = feature.properties.longitude;
                        return L.marker([lat, lon], {icon: gdacsIcon})
                    }
                }).addTo(this.map)
            }


        },

    };
</script>
<style scoped>
    #map {
        position: relative;
        height: 96%;
        width: auto;
        margin-left: auto;
        margin-bottom: auto;
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
    /*.plot{*/
    /*    position: absolute;*/
    /*    height: 200px;*/
    /*    width: 500px;*/
    /*    z-index: 400;*/
    /*}*/
    #dygraph-LOS {
        position: absolute;
        height: 300px;
        width: 950px;
        margin-left: 200px;
        margin-top: 25px;
        border-color: #5cb85c;

    }
    .plot-window {
        position: relative;
        height: 350px;
        width: 100%;
        margin-left: 500px;
        background-color: #CCFFCC;
    }

</style>
