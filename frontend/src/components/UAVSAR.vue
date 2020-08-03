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

        <div v-if="LosPlot" class="extended" v-bind:style="{backgroundColor: extendedColor, border: extendedBorder }">
            <p><b>Plot UID: </b>{{activePlot}}</p>
           <b-input-group>
               <b-input-group prepend="Start Lat/Lon" class="mb-2">
                   <b-form-input v-model="lat1" name="lat1" placeholder=""></b-form-input>
                   <b-form-input v-model="lon1" name="lon1" placeholder=""></b-form-input>
               </b-input-group>
            </b-input-group>
            <b-input-group>
                <b-input-group prepend="End Lat/Lon" class="mb-2">
                    <b-form-input v-model="lat2" name="lat2" placeholder=""></b-form-input>
                    <b-form-input v-model="lon2" name="lon2" placeholder=""></b-form-input>
                </b-input-group>
            </b-input-group>

            <b-input-group prepend="LOS Length">
                <b-form-input v-model="losLength" name="length" placeholder=""></b-form-input>
            </b-input-group>
            <b-input-group prepend="Azimuth">
                <b-form-input v-model="azimuth" name="azimuth" placeholder=""></b-form-input>
            </b-input-group>
            <br/>
        </div>

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
                    <div v-if="layerFound">
                        <b-button variant="success" @click="activatePlotButton(entry)">Show/Hide LOS Plot</b-button>
                    </div>

                </div>

            </div>
        </div>
    </div>
</template>

<script>
    import {bus} from '../main'
    import axios from "axios";
    // import Zingchart from 'zingchart'
    // import Chart from 'chart.js'
    // import * as d3 from 'd3'
    // import Dygraph from 'dygraphs'

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
                LosPlot: false,
                lat1: '',
                lat2: '',
                lon1: '',
                lon2: '',
                losLength: '',
                azimuth: '',
                activePlot: '',
                csv_final: '',


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
            bus.$on('getCSV', (entry, latlons)=>
                this.getCSV(entry, latlons));
            bus.$on('updatedPlot', (latlon, entry)=>
                this.getCSV(entry, latlon));
            bus.$on('chartData', (csv)=>
                this.chartData(csv));
        },
        methods: {
            dynamicExtended(found){
                if(found){
                    this.layerFound = true;
                    this.extendedColor = '#CCFFCC'
                    this.extendedBorder = '1px solid #99FF99'
                    // add markers for plotting
                    bus.$emit('uavsarPlotMarkers')


                }else {
                    this.layerFound = false;
                    this.extendedColor = '#ffbab5'
                    this.extendedBorder = '1px solid #fc8077'
                }
            },
            chartData(csv){
                var csv2=csv.split("\n");
                var csv_final="";
                for(var i=0;i<csv2.length;i++) {
                    var csv3=csv2[i].split(",");
                    //                console.log(csv2[i],csv3)
                    if(csv3[2] && csv3[3]) {
                        csv_final+=csv3[2]+","+csv3[3]+"\n";
                    }
                    //                console.log(csv_final);
                }
                this.csv_final = csv_final;

                bus.$emit('activatePlot', csv_final);
            },
            activatePlotButton(entry){
                this.showLosPlot(entry);
                bus.$emit('showPlot', this.csv_final);
            },
            getCSV(entry, latlon){
                var losLength = this.setLosLength(latlon);
                var azimuth = this.setAzimuth(latlon);
                this.losLength = losLength;
                this.azimuth = azimuth;
                this.lat1 = latlon[0];
                this.lon1 = latlon[1];
                this.lat2 = latlon[2];
                this.lon2 = latlon[3];

              axios.get('http://127.0.0.1:8000/geogateway_django_app/UAVSAR_csv/', {
                  params: {
                      'entry':JSON.stringify(entry),
                      'lat1':this.lat1,
                      'lon1':this.lon1,
                      'lat2':this.lat2,
                      'lon2':this.lon2,
                      'losLength':losLength,
                      'azimuth':azimuth,

                  }
              }).then(function (response){
                  bus.$emit('chartData', response.data);
              })
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


                            bus.$emit('uavsarWMS', entry, entry.info.geometry.coordinates[0]);
                        }
                        else if(Object.prototype.hasOwnProperty.call(datajson,'exceptions')) {
                            layerFound = false;
                        }
                        bus.$emit('layerAlert', layerFound);
                    })


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
            showLosPlot(entry){
              this.LosPlot = true;
              this.activePlot = entry.info['uid'];
            },
            clearQuery(){
                this.layers = [];
                this.
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
                        // let findDuplicates = arr => arr.filter((item, index) => results.indexOf(item) != index)
                        bus.$emit('uavsarKMLs', results);
                    })

            },
            assignKmls(results){
                this.layers = results;
            },

            setLosLength(latlon){
                var latStart = latlon[0];
                var lonStart = latlon[1];
                var latEnd = latlon[2];
                var lonEnd = latlon[3];

                var d2r = Math.PI / 180.0;
                var flatten = 1.0 / 298.247;
                var theFactor = d2r * Math.cos(d2r * latStart) * 6378.139 * (
                    1.0 - Math.sin(d2r * latStart) * Math.sin(d2r * latStart) * flatten);

                var xdiff = (lonEnd - lonStart) * theFactor;
                var ydiff = (latEnd - latStart) * 111.32;

                var losLength = Math.sqrt(xdiff * xdiff + ydiff * ydiff);
                losLength = losLength.toFixed(3);
                return losLength;
            },
            setAzimuth(latlon){
                var swLat = latlon[0];
                var swLon = latlon[1];
                var neLat = latlon[2];
                var neLon = latlon[3];
                //Using http://www.movable-type.co.uk/scripts/latlong.html
                var d2r=Math.PI/180.0;
                var flatten=1.0/298.247;

                var theFactor=d2r* Math.cos(d2r * swLat) * 6378.139 * (1.0 - Math.sin(d2r * swLat) * Math.sin(d2r * swLat) * flatten);
                var x=(neLon-swLon)*theFactor;
                var y=(neLat-swLat)*111.32;

                var azimuth=Math.atan2(x,y)/d2r;
                azimuth=azimuth.toFixed(1);
                if(azimuth>180) azimuth=azimuth-360;
                if(azimuth<-180) azimuth=azimuth+360;

                return azimuth;
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