<template>
    <div class="tool">
        <div class="tool-title"><h5><strong> Global Natural Hazard Viewer </strong></h5><br/> </div>
        <div class="divider"></div>
        <div class="tool-content">
            <div id="panel_forecast" style="margin-top: 10px; margin-bottom:10px;">
                <h6>Global Forecast Heat Map: M &gt; 6.5, 1 Year.   &nbsp; &nbsp; California Forecast Heat Map: M &gt; 5, 1 Year (Open Hazards Group)</h6> <br/>

                <input
                        type="checkbox"
                        v-model="woLayer"
                        @change="woForecastLayer()"
                        id="woLayer"
                ><label for="woLayer">Global Forecast</label>
                <br/>
                <input
                        type="checkbox"
                        v-model="caLayer"
                        @change="caForecastLayer()"
                        id="caLayer"
                ><label for="caLayer">California Forecast</label>
                <br/>
                <input
                        type="checkbox"
                        v-model="ucerfL"
                        @change="ucerfAdd()"
                        id="ucerfLayer"
                ><label for="ucerfLayer">Show California faults</label>
                <br/>
            </div>
        </div>
        {{woLayer}}
    </div>

</template>

<script>
    import {bus} from '../main'
    import axios from "axios";
    export default {
        name: "nowcast",
        data() {
            return {
                ucerfL: false,
                woLayer: false,
                caLayer: false,
                ucerfUrl: "https://raw.githubusercontent.com/GeoGateway/GeoGatewayStaticResources/master/kmz/ucerf3_black.kml",

            }

        },
        methods: {
            ucerfAdd(){
                if(this.ucerfL){
                    bus.$emit('UrlAddLayer', this.ucerfUrl, 'ucerfL');
                }else{
                    bus.$emit('RemoveLayer', 'ucerfL')
                }
            },
            woForecastLayer() {
                if(this.woLayer) {
                    var woForecastUrl = 'http://127.0.0.1:8000/geogateway_django_app/wo_forecast';
                    axios.get(woForecastUrl, {
                        responseType: "text"
                    }).then(function (response) {
                        bus.$emit('WoForecast', response.data)
                    })
                }else {
                    bus.$emit('RemoveLayer', 'woForecastL')
                }

            },
            caForecastLayer() {
                if(this.caLayer) {
                    var caForecastUrl = 'http://127.0.0.1:8000/geogateway_django_app/ca_forecast';
                    axios.get(caForecastUrl, {
                        responseType: "text"
                    }).then(function (response) {
                        bus.$emit('CaForecast', response.data)
                    })
                }else {
                    bus.$emit('RemoveLayer', 'caForecastL')
                }
            }
        },
    }
</script>

<style scoped>
    .checkbox-group {

    }
    .checkbox {
        position: relative;
    }
</style>