<template>
        <div id="map-window">
                <TopNav />
                <ToolBar />
                <div id="map">
                </div>
                <b-button id="refreshButton" @click="refreshLayers()">Refresh</b-button>
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

                        bus.$on('mapToolsLayer', () =>
                                this.mapToolsLayer());
                        bus.$on('drawToolbar', () =>
                                this.drawToolbar());
                        bus.$on('gnssLayer', (text) =>
                                this.gnssLayer(text));



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
                        mapToolsLayer(){
                                for(var key in this.mapToolsState){
                                        if(this.mapToolsState[key][0] &&
                                                this.globalLayers[key] === null){
                                                this.kmlLayer(this.mapToolsState[key][1], key);
                                        }else if(!(this.mapToolsState[key][0]) &&
                                                this.globalLayers[key] != null) {
                                                this.map.removeLayer(this.globalLayers[key]);
                                                this.globalLayers[key] = null;
                                        }
                                }
                        },
                        gnssLayer(kmltext){
                                // console.log(this.globalLayers.gnss1)
                                const parser = new DOMParser();
                                const kml = parser.parseFromString(kmltext, 'text/xml');
                                const track = new L.KML(kml);
                                this.map.addLayer(track);
                                const bounds = track.getBounds();
                                this.map.fitBounds(bounds);





                        },
                        kmlLayer(url, layer) {
                                fetch(url).then(res => res.text())
                                        .then(kmltext => {
                                                const parser = new DOMParser();
                                                var kml = parser.parseFromString(kmltext, "text/xml");
                                                this.globalLayers[layer] = new L.KML(kml);
                                                this.map.addLayer(this.globalLayers[layer]);
                                                this.map.fitBounds(this.globalLayers[layer].getBounds());
                                        });
                        },
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
                        // kmltype_sel: {
                        //         get(){
                        //                 return this.GNSS.formData.kmltype_sel;
                        //         },
                        //         set(value){
                        //                 this.$store.commit('setkml', value);
                        //         }
                        // },
                        //  latitude: {
                        //         get(){
                        //                 return this.GNSS.formData.gs_latitude;
                        //         },
                        //         set(value){
                        //                 this.$store.commit('setLat', value);
                        //         }
                        // },
                        // gs_longitude: {
                        //         get(){
                        //                 return this.GNSS.formData.gs_longitude;
                        //         },
                        //         set(value){
                        //                 this.$store.commit('setLng', value);
                        //         }
                        // },
                        // gs_width: {
                        //         get(){
                        //                 return this.GNSS.formData.gs_width;
                        //         },
                        //         set(value){
                        //                 this.$store.commit('setWidth', value);
                        //         }
                        // },
                        // height: {
                        //         get(){
                        //                 return this.GNSS.formData.gs_height;
                        //         },
                        //         set(value){
                        //                 this.$store.commit('setHeight', value);
                        //         }
                        // },
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
