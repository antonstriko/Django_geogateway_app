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
                computed: {
                        mapTools(){
                                return this.$store.state.mapTools;
                        }
                },

                methods: {
                        refreshLayers(){
                                for(var key in this.mapTools){
                                        if(this.mapTools[key][0] &&
                                                this.mapTools[key][2] === null){
                                                this.kmlLayer(this.mapTools[key][1], key);
                                        }else if(!(this.mapTools[key][0]) &&
                                                this.mapTools[key][2] != null) {
                                                this.map.removeLayer(this.mapTools[key][2]);
                                                this.mapTools[key][2] = null;
                                        }
                                }
                        },
                        kmlLayer(url, layer) {
                                fetch(url).then(res => res.text())
                                        .then(kmltext => {
                                                const parser = new DOMParser();
                                                var kml = parser.parseFromString(kmltext, "text/xml");
                                                this.$store.state.mapTools[layer][2] = new L.KML(kml);
                                                this.map.addLayer(this.$store.state.mapTools[layer][2]);
                                                this.map.fitBounds(this.$store.state.mapTools[layer][2].getBounds());
                                        });
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
                padding: 0px;
                /*float: right;*/
        }
        #refreshButton {
                position: absolute;
                top: 140px;
                right: 20px;
                padding: 10px;
                z-index: 400;
        }
</style>
