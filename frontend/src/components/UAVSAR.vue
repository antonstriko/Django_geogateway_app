<template>
    <div>
        <input
                type="checkbox"
                v-model="overview"
                id="overview"
                @click="showOverview"
        ><label for="overview">UAVSAR</label>

        <div v-if="overview">
            <b-input-group prepend="Flight name/path">
                <b-form-input v-model="flight_path" name="flight_path" placeholder=""></b-form-input>
            </b-input-group>
            <b-input-group prepend="Latitude, Longitude">
                <b-form-input v-model="lat_lon" name="lat_lon" placeholder=""></b-form-input>
            </b-input-group>
        </div>
        <br />
        <div v-if="layers.length !== 0">
            <br/>
            <div class="layer-options">
                <b-button @click="selDeselAll">
                    Select/Deselect All
                </b-button>
                <b-button @click="originalQuery">
                    Original Query
                </b-button>
            </div>
            <br/>
            <div class="collapsed"  v-for="entry in layers" :key="entry.info['dataname']">
                <input type="checkbox" v-model="entry.active" @change="kmlLayerChange(entry)"> <span style="font-size: 15px">{{entry.info['dataname']}}</span><br>
                <div  v-if="!entry.extended" @click="extendEntry(entry)">
                    <b-icon-arrows-expand ></b-icon-arrows-expand>
                </div>

                <div v-if="entry.extended" class="extended">
                        <div class="extended">
                            <b-icon-clock></b-icon-clock>  <b>{{entry.info['time1']}}</b> - <b>{{entry.info['time2']}}</b>
                        </div>
                        <div class="extended">
                            <b>UID: </b>{{entry.info['uid']}}  |  <b>Heading: </b> {{entry.info['heading']}} | <b>Radar Dir: </b> {{entry.info['radardirection']}}
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
                uavsarQueries: [],
                layers: [],
                displayTable: [],


            }
        },
        mounted() {
            bus.$on('markPlace', (lat, lon) =>
                this.pointQuery(lat, lon));
            bus.$on('uavsarGeom', (json) =>
                this.uavsarKML(json));
            bus.$on('uavsarKMLs', (results)=>
                this.assignKmls(results));
        },
        methods: {
            extendEntry(entry){
                if(!entry.extended) {
                    for (var i = 0; i < this.layers.length; i++) {
                        this.layers[i].extended = false
                        this.layers[i].active = false
                        this.kmlLayerChange(this.layers[i]);

                    }
                    entry.extended = true;
                        bus.$emit('uavsarWMS', entry);
                }
                else {
                    entry.extended = false;
                }
            },
            selDeselAll(){
              for(var i = this.layers.length-1; i >= 0; i--){
                  this.layers[i].active = !this.layers[i].active;
                  this.kmlLayerChange(this.layers[i]);
              }
            },
            originalQuery(){

            },
            showOverview(){
                // var overviewUrl = 'http://127.0.0.1:8000/geogateway_django_app/UAVSAR_overview/'
                // axios.get(overviewUrl).then( function(response){
                //     console.log(response.data)
                // })
                bus.$emit('UAVSAR_overview');
                bus.$emit('drawToolbar');
            },
            pointQuery(lat, lon){
                var queryResponse
                this.lat_lon = lat.toString() + ',' + lon.toString();
                console.log(lat, lon)
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
                    bus.$emit('reactivateUavsarLayer', entry.info['dataname']);
                }else {
                    bus.$emit('removeUavsarLayer', entry.info['dataname'])
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
                        console.log(results)
                        bus.$emit('uavsarKMLs', results);
                    })

            },
            assignKmls(results){
                this.layers = results;
                console.log(this.layers)
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
        border: 1px solid #99FF99;
        box-sizing: border-box;
        font-size: 15px;
        background-color: #CCFFCC;
    }
</style>