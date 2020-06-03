<template>

       <div id="map">
    </div>


</template>

<script>


    import L from 'leaflet';
    import "../assets/leaflet-kml"
    export default {
        name: 'MyMap',
        components: {
        },
        mounted() {
            this.initMap();
        },

        computed: {
            ucerfLayer(){
                return this.$store.state.layers[0].active;
            }
        },
        methods: {
            initMap(){
                var mymap = L.map('map').setView([51.505, -0.09], 3);

                this.tileLayer = L.tileLayer(
                    'https://cartodb-basemaps-{s}.global.ssl.fastly.net/rastertiles/voyager/{z}/{x}/{y}.png',
                    {
                        maxZoom: 18,
                        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>, &copy; <a href="https://carto.com/attribution">CARTO</a>',
                    }
                );
                this.tileLayer.addTo(mymap);
            },

            ucerfShow(map) {
                fetch('https://raw.githubusercontent.com/GeoGateway/GeoGatewayStaticResources/master/kmz/ucerf3_black.kml')
                    .then(res => res.text())
                    .then(kmltext => {
                        // Create new kml overlay
                        const parser = new DOMParser();
                        const kml = parser.parseFromString(kmltext, 'text/xml');
                        const track = new L.KML(kml);
                        map.addLayer(track);

                        // Adjust map to show the kml
                        const bounds = track.getBounds();
                        map.fitBounds(bounds);
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
        width: auto;
        margin-left: auto;
        padding: 0px;
    }
</style>
