<template>
    <div id="tabs">
        <b-tabs v-model="tabIndex" pills card>
            <b-tab title="Map Tools" ><b-card-text><router-view></router-view></b-card-text></b-tab>
            <b-tab title="UAVSAR" ><b-card-text><router-view></router-view></b-card-text></b-tab>
            <b-tab title="GNSS" ><b-card-text><router-view></router-view></b-card-text></b-tab>
            <b-tab title="Seismicity" ><b-card-text><router-view></router-view></b-card-text></b-tab>
            <b-tab title="Nowcast" ><b-card-text><router-view></router-view></b-card-text></b-tab>
            <b-tab title="Magnitude"><b-card-text><router-view></router-view></b-card-text></b-tab>
            <b-tab title="Disloc" ><b-card-text><router-view></router-view></b-card-text></b-tab>
<!--            <b-tab title="Saves" disabled><b-card-text><router-view></router-view></b-card-text></b-tab>-->
            <b-tab title="Feedback" ><b-card-text><router-view></router-view></b-card-text></b-tab>
            <b-tab title="Help" ><b-card-text><router-view></router-view></b-card-text></b-tab>
        </b-tabs>
    </div>
</template>

<script>
    import 'vue-router'
    import L from 'leaflet'
    import { mapFields } from 'vuex-map-fields';
    export default {
        name: "ToolTabs",
        components: {
        },
        data (){
            return {
                tabIndex: 0,
            }
        },
        mounted() {
            this.toPage(this.tabIndex);
        },
        watch: {
            tabIndex: function(val){
                this.toPage(val);
            },
            tabUrl: function(val){
                this.directUrl(val);
            }
        },
        computed: {
            tabUrl: function(){
                return this.$route.fullPath;
            },
          ...mapFields(['uavsar.overview', 'map.globalMap', 'map.layers', 'uavsar.overviewLegend'])
        },
        methods: {
            toPage(page){
                switch (page) {
                    case 0:
                        this.$router.push('/maptools');
                        break;
                    case 1:
                        this.$router.push('/uavsar');
                        if(!this.overview) {
                          this.overview = true;
                          this.uavsarOverview();
                        }
                        break;
                    case 2:
                        this.$router.push('/gnss');
                        break;
                    case 3:
                        this.$router.push('/seismicity');
                        break;
                    case 4:
                        this.$router.push('/nowcast');
                        break;
                    case 5:
                        this.$router.push('/momentmagnitude');
                        break;
                    case 6:
                        this.$router.push('/disloc');
                        break;
                    case 7:
                        this.$router.push('/report');
                        break;
                    case 8:
                        this.$router.push('/help');
                        break;
                }
            },
          uavsarOverview(){
            this.layers['uavsarWMS'] = L.tileLayer.wms('http://gf8.ucs.indiana.edu/geoserver/InSAR/wms?', {
                  layers: 'InSAR:thumbnailmosaic',
                  transparent: true,
                  format: 'image/png',
                  zIndex: 2
                }
            );
            this.overviewLegend = L.control({position: 'bottomleft'});
            this.overviewLegend.onAdd = function () {
              var div = L.DomUtil.create('div', 'overviewLegend');
              div.innerHTML = '<img src=' + 'https://raw.githubusercontent.com/GeoGateway/GeoGatewayStaticResources/master/kmz/uavsarlegend.png' + '>';
              return div;
            };
            this.overviewLegend.addTo(this.globalMap);

            this.globalMap.addLayer(this.layers['uavsarWMS'])
            this.layers['uavsarWMS'].setOpacity(.7);
          },
            directUrl(page) {
                switch (page) {
                    case "/maptools":
                        this.tabIndex = 0;
                        break;
                    case "/uavsar":
                        this.tabIndex = 1;
                        break;
                    case "/gnss":
                        this.tabIndex = 2;
                        break;
                    case "/seismicity":
                        this.tabIndex = 3;
                        break;
                    case "/nowcast":
                        this.tabIndex = 4;
                        break;
                    case "/momentmagnitude":
                        this.tabIndex = 5;
                        break;
                    case "/disloc":
                        this.tabIndex = 6;
                        break;
                    case "/mapsaves":
                        this.tabIndex = 7;
                        break;
                    case "/report":
                        this.tabIndex = 8;
                        break;
                    case "/help":
                        this.tabIndex = 9;
                        break;
                }
            },
        }
    }
</script>

<style >
    #tabs {
        width: auto;
        background-color: #e6e6ff;

    }
    .tab-text {
        width: auto;
        position: relative;
        align-content: center;
        height: 100% ;
        overflow: auto;
    }

    .nav-pills .nav-link.active {
        background-color: #343a40;

    }
    .nav-link.tab {
        color: #343a40;
    }

    label {
        color: #343a40 ;
    }
    p {
        color: #343a40;
    }
</style>
