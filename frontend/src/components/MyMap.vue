<template>
        <div id="map-window">
                <TopNav />
                <ToolBar />
                <div id="map">
                </div>
                <!--                <b-button id="refreshButton" @click="refreshLayers()">Refresh</b-button>-->
        </div>

</template>

<script>
        import L from 'leaflet';
        import 'leaflet/dist/leaflet.css';
        import "leaflet-kml"
        import ToolBar from "./ToolBar";
        import {bus} from '../main'
        import 'leaflet-draw'
        import "leaflet-draw/dist/leaflet.draw.css";
        import TopNav from "./TopNav";
        import "leaflet-kmz"
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

                                'woForecastL': null,
                                'caForecastL': null,
                                'ucerfL': null,
                                'boundariesL': null,
                                'coastsL': null,


                        };
                },
                mounted() {

                        //create layers
                        this.map = L.map('map').setView([51.505, -0.09], 3);
                        L.tileLayer(
                                'https://cartodb-basemaps-{s}.global.ssl.fastly.net/rastertiles/voyager/{z}/{x}/{y}.png',
                                {
                                        maxZoom: 18,
                                        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>, &copy; <a href="https://carto.com/attribution">CARTO</a>',
                                }).addTo(this.map);


                        //global map layer event listeners

                        bus.$on('UrlAddLayer', (url, layerName) =>
                                this.kmlUrl(url, layerName));

                        bus.$on('TextAddLayer', (text, layerName)=>
                                this.kmlText(text, layerName));

                        bus.$on('drawToolbar', () =>
                                this.drawToolbar());

                        //convert to above abstracted event listener

                        bus.$on('gnssLayer', (text) =>
                                this.kmlText(text));

                        bus.$on('WoForecast', (text) =>
                                this.kmlText(text, 'woForecastL'));

                        bus.$on('CaForecast', (text) =>
                                this.kmlText(text, 'caForecastL'));

                        bus.$on('RemoveLayer', (name) =>
                                this.removeLayer(name));


                },


                methods: {
                        drawToolbar(){
                                var drawnItems = new L.FeatureGroup();
                                this.map.addLayer(drawnItems);
                                var drawControl = new L.Control.Draw({
                                        draw: {
                                                polygon: false,
                                                marker: false,
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
                                        var type = e.layerType,
                                                layer = e.layer;
                                        drawnItems.addLayer(layer);
                                        if (type === 'rectangle') {

                                                this.gs_latitude = layer.getCenter().lat;
                                                this.gs_longitude = layer.getCenter().lng;
                                                var sw = layer.getLatLngs()[0][1];
                                                var ne = layer.getLatLngs()[0][3];
                                                this.gs_height = Math.abs(ne.lat - sw.lat);
                                                this.gs_width = Math.abs(ne.lng - sw.lng);
                                                console.log(this.gs_latitude, this.gs_longitude);
                                                console.log(this.gs_height, this.gs_width)

                                        }
                                });
                        },
                        // TODO make addLayer and removeLayer methods for use with $emit $on
                        // ie refine layer logic so this method is not necessary
                        kmlText(text, layerName){
                                // console.log(this.globalLayers.gnss1)
                                const parser = new DOMParser();
                                const kml = parser.parseFromString(text, 'text/xml');
                                this[layerName] = new L.KML(kml);
                                this.map.addLayer(this[layerName]);
                                const bounds = this[layerName].getBounds();
                                this.map.fitBounds(bounds);

                        },
                        kmlUrl(url, layerName) {
                                fetch(url).then(res => res.text())
                                        .then(kmltext => {
                                                const parser = new DOMParser();
                                                var kml = parser.parseFromString(kmltext, "text/xml");
                                                this[layerName] = new L.KML(kml);
                                                this.map.addLayer(this[layerName]);
                                                this.map.fitBounds(this[layerName].getBounds());
                                        });
                        },
                        removeLayer(layerName){

                                this.map.removeLayer(this[layerName])
                                this[layerName] = null;

                        }
                },
                computed: {
                        mapToolsState(){
                                return this.$store.state.mapToolsState;
                        },
                        gnssState() {
                                return this.$store.state.gnssState;
                        },
                        globalLayers() {
                                return this.$store.state.globalLayers;
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
                /*float: right;*/

        }
        #map-window {
                position: inherit;
                height: 100%;
                width: auto;
                padding: 0;
                /*float: right;*/
        }
        #refreshButton {
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
