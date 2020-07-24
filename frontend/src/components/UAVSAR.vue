<template>
    <div>
        <input
                type="checkbox"
                v-model="overview"
                id="overview"
                @change="showOverview"
        ><label for="overview">UAVSAR</label>

        <div v-if="overview">
            <b-input-group prepend="Flight name/path">
                <b-form-input v-model="flight_path" name="flight_path" placeholder=""></b-form-input>
            </b-input-group>
            <b-input-group prepend="Latitude, Longitude">
                <b-form-input v-model="lat_lon" name="lat_lon" placeholder=""></b-form-input>
            </b-input-group>
            <br/>
            <b-button variant="success" @click="pointQuery(lat_lon.split(',')[0], lat_lon.split(',')[1])">Search KMLs</b-button>
        </div>
        <br />
        <div v-if="layers.length !== 0">
            <br/>
            <div class="layer-options">
                <b-button @click="selDeselAll">
                    Select/Deselect All
                </b-button>
                <b-button @click="clearQuery">
                    Clear Query
                </b-button>
            </div>
            <br/>
            <div class="collapsed"  v-for="entry in layers" :key="entry.info['uid']">
                <input type="checkbox" v-model="entry.active" @change="kmlLayerChange(entry)"> <span style="font-size: 15px">{{entry.info['dataname']}}</span><br>
                <div  v-if="!entry.extended" @click="extendEntry(entry)">
                    <b-icon-arrows-expand ></b-icon-arrows-expand>
                </div>

                <div v-if="entry.extended" class="extended" v-bind:style="{backgroundColor: extendedColor, border: extendedBorder }">
                        <div class="extended">
                            <b-icon-clock></b-icon-clock>  <b>{{entry.info['time1']}}</b> - <b>{{entry.info['time2']}}</b>
                        </div>
                        <div class="extended">
                            <b>UID: </b>{{entry.info['uid']}}  |  <b>Heading: </b> {{entry.info['heading']}} | <b>Radar Dir: </b> {{entry.info['radardirection']}} <br/>
                            <b>{{layerFound ? 'Layer Found' : 'Layer Not Found'}}</b>
                        </div>
                </div>

            </div>
        </div>
    </div>
</template>

<script>
    import {bus} from '../main'
    import axios from "axios";
    export default {
        name: "UAVSAR",
        data(){
            return {
                overview: false,
                flight_path: '',
                lat_lon: '',
                layers: [],
                extendedColor: '',
                extendedBorder: '',
                layerFound: false,
                selDesel: false,

            }
        },
        mounted() {
            bus.$on('markPlace', (lat, lon) =>
                this.pointQuery(lat, lon));
            bus.$on('uavsarGeom', (json) =>
                this.uavsarKML(json));
            bus.$on('uavsarKMLs', (results)=>
                this.assignKmls(results));

            bus.$on('layerAlert', (found)=>
                this.dynamicExtended(found));
        },
        methods: {
            dynamicExtended(found){
                if(found){
                    this.layerFound = true;
                    this.extendedColor = '#CCFFCC'
                    this.extendedBorder = '1px solid #99FF99'
                }else {
                    this.layerFound = false;
                    this.extendedColor = '#ffbab5'
                    this.extendedBorder = '1px solid #fc8077'
                }
            },
            extendEntry(entry){
                var layerFound = false;
                if(!entry.extended) {
                    for (var i = 0; i < this.layers.length; i++) {
                        this.layers[i].extended = false
                        this.layers[i].active = false
                        this.kmlLayerChange(this.layers[i]);

                    }
                    entry.extended = true;

                    var testURI =  'http://127.0.0.1:8000/geogateway_django_app/UAVSAR_test/'

                    var layername = 'InSAR:' + 'uid' + entry.info['uid'] + '_unw'

                    axios.get(testURI, {
                        params: {
                            'uid':layername,
                        }
                    }).then( function (response){
                        var datajson = response.data
                        if(Object.prototype.hasOwnProperty.call(datajson,'layerDescriptions')) {
                            layerFound = true;
                        }
                        else if(Object.prototype.hasOwnProperty.call(datajson,'exceptions')) {
                            layerFound = false;
                        }
                        bus.$emit('layerAlert', layerFound);
                    })


                        bus.$emit('uavsarWMS', entry);
                }
                else {
                    entry.extended = false;
                }
            },
            selDeselAll(){
              for(var i = this.layers.length-1; i >= 0; i--){
                  this.layers[i].active = this.selDesel;
                  this.kmlLayerChange(this.layers[i]);
              }
              this.selDesel = !this.selDesel;
            },
            clearQuery(){
                this.layers = [];
                this.showOverview();
            },
            showOverview(){
                if(this.overview) {
                    bus.$emit('UAVSAR_overview');
                    bus.$emit('drawToolbar');
                }else {
                    bus.$emit('RemoveLayer', 'uavsarWMS')
                }
            },
            pointQuery(lat, lon){
                var queryResponse
                this.lat_lon = lat.toString() + ',' + lon.toString();
                var baseURI = 'http://127.0.0.1:8000/geogateway_django_app/UAVSAR_geom/'
                axios.get(baseURI, {
                    params: {
                        //
                        "lat": lat,
                        "lon": lon,
                    }
                }).then(function (response){
                    queryResponse = response.data;
                    bus.$emit('uavsarGeom', queryResponse)
                })
            },
            kmlLayerChange(entry){
                if(entry.active) {
                    bus.$emit('reactivateUavsarLayer', entry.info['uid']);
                }else {
                    bus.$emit('removeUavsarLayer', entry.info['uid'])
                }
            },
            uavsarKML(json){
                // var rawJson = json.slice();
                var baseURI = 'http://127.0.0.1:8000/geogateway_django_app/UAVSAR_KML/'
                var results = [];
                // for(var i = 0; i < json.length; i++) {

                    // results[i] = {name:dataname, active:true, json:entryJson, extended:false};
                    axios.get(baseURI, {
                        params: {
                            //
                            "json": JSON.stringify(json),
                        }
                    }).then(function (response) {
                        results = response.data;
                        for(var i = 0; i < results.length; i++){
                            console.log(results[i].info['dataname'])
                        }
                        // let findDuplicates = arr => arr.filter((item, index) => results.indexOf(item) != index)
                        bus.$emit('uavsarKMLs', results);
                    })

            },
            assignKmls(results){
                this.layers = results;
            }
        }
    }
</script>

<style scoped>


    .collapsed {
        width: auto;
        height: auto;
        border: 2px solid #C0C0C0;
        box-sizing: border-box;
        background-color: #E0E0E0;
    }

    .extended {
        width: auto;
        height: auto;

        box-sizing: border-box;
        font-size: 15px;

    }
</style>