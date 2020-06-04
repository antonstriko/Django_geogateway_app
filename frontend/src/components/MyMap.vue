<template>
        <div id="map-window">
                <div id="map">
                </div>
                <b-button id="refreshButton" v-on:click="refreshLayers()">Refresh</b-button>
        </div>


</template>

<script>
        import L from 'leaflet';
        import 'leaflet/dist/leaflet.css';
        import "leaflet-kml"
        export default {
                name: 'MyMap',
                components: {
                },
                data() {
                        return {
                                ucerfLayer: null,
                                boundariesLayer: null,
                                coastsLayer: null,
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

                },

                methods: {
                        refreshLayers(){
                                if (this.$store.state.mapTools.ucerf) {
                                        this.ucerfLoad();
                                }else {this.map.removeLayer(this.ucerfLayer);}

                                if (this.$store.state.mapTools.boundaries) {
                                        this.boundariesLoad();
                                }else {this.map.removeLayer(this.boundariesLayer);}

                                if (this.$store.state.mapTools.coasts) {
                                        this.coastsLoad();
                                }else {this.map.removeLayer(this.coastsLayer);}
                        },
                        ucerfLoad() {
                                fetch('https://raw.githubusercontent.com/GeoGateway/GeoGatewayStaticResources/master/kmz/ucerf3_black.kml').then(res => res.text())
                                        .then(kmltext => {
                                                const parser = new DOMParser();
                                                var kml = parser.parseFromString(kmltext, "text/xml");
                                                this.ucerfLayer = new L.KML(kml);
                                                this.map.addLayer(this.ucerfLayer);
                                                this.map.fitBounds(this.ucerfLayer.getBounds());
                                        });
                        },
                        boundariesLoad() {
                                fetch('https://raw.githubusercontent.com/GeoGateway/GeoGatewayStaticResources/master/kmz/gz_2010_us_040_00_20m.kml').then(res => res.text())
                                        .then(kmltext => {
                                                const parser = new DOMParser();
                                                var kml = parser.parseFromString(kmltext, "text/xml");
                                                this.boundariesLayer = new L.KML(kml);
                                                this.map.addLayer(this.boundariesLayer);
                                                this.map.fitBounds(this.boundariesLayer.getBounds());
                                        });
                        },
                        coastsLoad() {
                                fetch('https://raw.githubusercontent.com/GeoGateway/GeoGatewayStaticResources/master/kmz/ne_50m_coastline.kml').then(res => res.text())
                                        .then(kmltext => {
                                                const parser = new DOMParser();
                                                var kml = parser.parseFromString(kmltext, "text/xml");
                                                this.coastsLayer = new L.KML(kml);
                                                this.map.addLayer(this.coastsLayer);
                                                this.map.fitBounds(this.coastsLayer.getBounds());
                                        });
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
                padding: 0px;
                /*float: right;*/

        }
        #map-window {
                position: relative;
                height: 100%;
                width: calc(100% - 400px);
                margin-left: auto;
                padding: 0px;
        }
        #refreshButton {
                position: absolute;
                top: 20px;
                right: 20px;
                padding: 10px;
                z-index: 400;
        }
</style>
