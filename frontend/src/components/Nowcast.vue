<template>
    <div class="tool">
        <div class="tool-title"><h3> Global Natural Hazard Viewer</h3><hr/> </div>
        <div class="tool-content">
            <div id="panel_forecast" style="margin-top: 10px; margin-bottom:10px;">
                <h6><i> Global Forecast Heat Map: M &gt; 6.5, 1 Year. <br> California Forecast Heat Map: M &gt; 5, 1 Year <br>(Open Hazards Group)</i></h6>
                <hr />
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
                ><label for="ucerfLayer">Show California faults </label>
                <br/>
                <input
                        type="checkbox"
                        v-model="gdacsL"
                        @change="gdacsLayer"
                        id="gdacs"
                ><label for="gdacs">Show GDACS Data </label>
                <br/>
                <br/>
                <h3>Nowcast Plots</h3>
                <h5>Magnitude-Frequency relations and Nowcast</h5>
                <hr/>
                <div id="nowcast_input">
                    <b-button variant="outline-primary" id="sp_windowpicker" class="btn btn-light" @click="drawToolbar()">
                        <b-icon-pencil></b-icon-pencil> Place Marker</b-button>
                    <br/>
                    <br/>
                    <b-input-group prepend="Place Name">
                        <b-form-input v-model="p_name" name="p_name"></b-form-input>
                    </b-input-group>
                    <b-input-group prepend="Latitude">
                        <b-form-input v-model="lat" name="lat"></b-form-input>
                    </b-input-group>
                    <b-input-group prepend="Longitude">
                        <b-form-input v-model="lon" name="lon"></b-form-input>
                    </b-input-group>
                </div>
                <br />

                <br />
                <b-button variant="success" id="run_plot"  @click="runPlot()">
                    Run</b-button>
            </div>
        </div>
    </div>

</template>

<script>
    import {bus} from '../main'
    import axios from "axios";
    // import toGeoJSON from "../../togeojson";
    export default {
        name: "nowcast",
        data() {
            return {
                ucerfL: false,
                woLayer: false,
                caLayer: false,
                gdacsL: false,
                ucerfUrl: "https://raw.githubusercontent.com/GeoGateway/GeoGatewayStaticResources/master/kmz/ucerf3_black.kml",
                p_name: '',
                lat: '',
                lon: '',


            }

        },
        mounted() {
            bus.$on('markPlace', (lat, lng)=>
                this.setMarker(lat, lng));

            // bus.$on('clearLayers', () =>
            //     this.uncheckAll());


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
                        responseType: "text",
                        params : {
                            'loc': 'global'
                        }
                    }).then(function (response) {
                        bus.$emit('TextAddLayer', response.data, 'woForecastL')
                    })
                }else {
                    bus.$emit('RemoveLayer', 'woForecastL')
                }

            },
            caForecastLayer() {
                if(this.caLayer) {
                    var caForecastUrl = 'http://127.0.0.1:8000/geogateway_django_app/ca_forecast';
                    axios.get(caForecastUrl, {
                        responseType: "text",
                        params : {
                            'loc': 'cali'
                        }
                    }).then(function (response) {
                        bus.$emit('TextAddLayer', response.data, 'caForecastL')
                    })
                }else {
                    bus.$emit('RemoveLayer', 'caForecastL')
                }
            },
            gdacsLayer(){
                if(this.gdacsL) {
                    var gdacsUrl = 'http://127.0.0.1:8000/geogateway_django_app/gdacs';
                    axios.get(gdacsUrl, {
                        responseType: "text",
                    }).then(function (response) {
                        // var geojson = toGeoJSON.kml((new DOMParser()).parseFromString(response.data, 'text/xml'))
                        // console.log(geojson)
                        bus.$emit('TextAddLayer', response.data, 'gdacsL')
                    })
                }else {
                    bus.$emit('RemoveLayer', 'gdacsL')
                }
            },
            drawToolbar() {
                bus.$emit('drawToolbar');
            },
            runPlot(){
                var lat = this.lat
                var lon = this.lon
                if(this.formCheck()){
                    const baseURI = 'http://127.0.0.1:8000/geogateway_django_app/nowcast'

                    axios.get(baseURI, {
                        params: {
                            "place": this.p_name,
                            "lat": this.lat,
                            "lon": this.lon,
                        },
                    }).then(function (response){
                        console.log(response.data)
                        bus.$emit('nowcast', response.data, lat, lon)
                    })
                    //add logic for layer removal
                }
                else alert("Please fill out required fields")
            },
            formCheck(){
                return (this.p_name != '' && this.lat != '' && this.lon != '')
            },
            setMarker(lat, lng){
                this.lat = lat;
                this.lon = lng;
            }
        },
    }
</script>

<style scoped>
    .checkbox-group {

    }
    i {
        color: #2e6da4;
    }
    label {
        font-weight: bold;
    }
    .checkbox {
        position: relative;
    }
</style>