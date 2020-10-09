<template>
    <div class="tab-window">
        <h3>UAVSAR</h3>
        <hr />

        <input
                type="checkbox"
                v-model="overview"
                id="overview"
                @change="showOverview"
        ><label for="overview">Show Overview</label>



        <div v-if="overview">
            <p>Fill one of the following fields to search catalog:</p>
            <b-button variant="dark" @click="uavsarDrawRect()"><b-icon-pencil></b-icon-pencil> Draw Area</b-button>
            <b-button variant="dark" @click="uavsarPinDrop()"><b-icon-hand-index></b-icon-hand-index> Drop Pin </b-button>
            <br/>
            <br/>
            <b-input-group prepend="Flight name/path">
                <b-form-input v-model="flight_path" name="flight_path" placeholder=""></b-form-input>
            </b-input-group>
            <br/>
            <b-input-group prepend="Latitude, Longitude">
                <b-form-input v-model="lat_lon" name="lat_lon" placeholder=""></b-form-input>
            </b-input-group>
            <br/>
            <b-button variant="success" @click="uavsarQuery()">Search KMLs</b-button>
        </div>
        <br />

        <div v-if="layers.length !== 0 && !activeQuery">
            <br/>
            <div class="layer-options">
                <b-button @click="selDeselAll">
                    Select/Deselect All
                </b-button>
                <b-button @click="clearQuery" variant="warning">
                    Clear Query
                </b-button>
                <br />

                <br />
                <b-input-group prepend="Filter by Heading">
                    <b-form-input v-model="path" name="path" placeholder="" @update="filterHeading"></b-form-input>

                </b-input-group>


                <b-form-select v-model="sortBy" @change="sortEntries" name="Sort By" class="mb-3">
                    <b-form-select-option :value="null">Sort By</b-form-select-option>
                    <b-select-option value="rating">Rating</b-select-option>
                </b-form-select>


            </div>
            <br/>


            <div id="queryWindow">
                <div class="collapsed"  v-for="entry in filteredLayers" :key="entry.info['uid']">

                    <b-col>
                        <input type="checkbox" v-model="entry.active" @change="kmlLayerChange(entry)"><br>
                    </b-col>
                    <b-col @click="extendEntry(entry)" style="cursor:pointer;" >
                        <div id="dataname">{{entry.info['dataname']}}</div>
                        <b-icon-clock></b-icon-clock>  <b>{{entry.info['time1']}}</b> - <b>{{entry.info['time2']}}</b>
                        <br />
                        <div id="rating">
                            <div v-if="entry.info['rating'] === '0'">
                                <b-icon-star/>
                                <b-icon-star/>
                                <b-icon-star/>

                            </div>
                            <div v-else-if="entry.info['rating'] === '1'">
                                <b-icon-star-fill/>
                                <b-icon-star/>
                                <b-icon-star/>
                            </div>
                            <div v-else-if="entry.info['rating'] === '2'">
                                <b-icon-star-fill/>
                                <b-icon-star-fill/>
                                <b-icon-star/>
                            </div>
                            <div v-else-if="entry.info['rating'] === '3'">
                                <b-icon-star-fill/>
                                <b-icon-star-fill/>
                                <b-icon-star-fill/>
                            </div>
                        </div>
                        <div  v-if="!entry.extended && !entry.clicked" @click="extendEntry(entry)">
                            <b-icon-arrows-expand ></b-icon-arrows-expand>
                        </div>
                        <!--                shows history of entry clicks-->
                        <div  v-if="!entry.extended && entry.clicked" style="background-color: #A5B9CC; border-radius: 5px">
                            <b-icon-eye></b-icon-eye>
                        </div>

                        <div v-if="entry.extended" class="extended" v-bind:style="{backgroundColor: extendedColor, border: extendedBorder }">
                            <div class="extended">
                                <b>Heading: </b> {{entry.info['heading']}}  <b>Radar Dir: </b> {{entry.info['radardirection']}} <br/>
                                <b>{{layerFound ? 'Layer Found' : 'Layer Not Found'}}</b>
                            </div>
                            <div v-if="layerFound">
                                <b-button variant="success" @click="activatePlotButton(entry)">Hide LOS Plot</b-button>
                                <br/>
                                <i style="font-size: small">Click UAVSAR tile to instantiate LOS plot</i>

                                <br />

                                <div v-if="LosPlot && layerFound" class="extended" id="active-plot" v-bind:style="{backgroundColor: extendedColor, border: extendedBorder }">
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
                                    <b-button variant="success" @click="updatePlot(activeEntry, lat1, lon1, lat2, lon2, azimuth, losLength)">Update LOS Plot</b-button>
                                    <br/>
                                    <br />
                                    <label for="opacity"><i style="font-size: small; color: #222222">Set Layer Opacity</i></label>
                                    <b-form-input id="opacity" @change="updateOpacity(opVal)" v-model="opVal" type="range" min="0" max="100"></b-form-input>
                                    <div class="mt-2">Value: {{ opVal }}% </div>
                                    <br/>
                                    <span @click="openDataSource" style="cursor: pointer; color: #2e6da4"><b-icon-chart></b-icon-chart><b>Open Data Source</b></span>
                                </div>
                            </div>

                        </div>
                    </b-col>
                </div>
            </div>
        </div>
        <div v-else-if="activeQuery" style="overflow: hidden">
            <b-spinner variant="success" label="Spinning"></b-spinner>
        </div>
    </div>
</template>

<script>
    import {bus} from '../main'
    import axios from "axios";
    import 'leaflet-kmz';


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
                activeEntry: null,
                opVal: 50,
                uid: '',
                filteredLayers: [],
                path: '',
                activeRating: '',
                sortBy: 'null',
                activeQuery: false,


            }
        },
        components: {

        },
        mounted() {
            bus.$on('markPlace', (lat, lon) =>
                this.pointQuery(lat, lon));
            bus.$on('uavsarGeom', (entries) =>
                this.kmlQueries(entries));
            bus.$on('assignEntry', (entry)=>
                this.assignKmls(entry));
            bus.$on('layerAlert', (found)=>
                this.dynamicExtended(found));
            bus.$on('getCSV', (entry, latlons)=>
                this.getCSV(entry, latlons));
            bus.$on('updatedPlot', (latlon, entry)=>
                this.getCSV(entry, latlon));
            bus.$on('chartData', (csv)=>
                this.chartData(csv));
            bus.$on('polyDrawn', (latlngs)=>
                this.polyQuery(latlngs));
            //tool argument for identifying currently active tool
            bus.$on('uavsarDrawQuery', (maxLat, minLon, minLat, maxLon, centerLat, centerLng)=>
                this.rectQuery(maxLat, minLon, minLat, maxLon, centerLat, centerLng));
            bus.$on('uavsarQueryDone', () => {
                    this.queryToMap();
                }
            );
            bus.$on('addEntry', (entry) =>
                this.addEntry(entry));
        },
        methods: {
            queryToMap(){
                this.activeQuery = false;
                this.filteredLayers = this.layers;

            },
            uavsarDrawRect(){
                bus.$emit('uavsarDraw', 'rect');
            },
            uavsarPinDrop(){
                bus.$emit('uavsarDraw', 'point');
            },

            filterHeading(){
                var pathSearch = this.path;
                function checkPath(entry){
                    return entry.info['heading'].includes(pathSearch);
                }
                this.filteredLayers = this.layers.filter(checkPath);
            },

            sortEntries(){
                if(this.sortBy === 'rating') {
                    this.filteredLayers = this.layers.sort((a, b) =>
                        (a.info['rating'] > b.info['rating']) ? -1 : 1);
                }
            },

            uavsarQuery(){
                if(this.lat_lon === '') {
                    if (this.flight_path === '') {
                        alert('Please fill one of the input boxes');
                    } else {
                        this.flightPathQuery(this.flight_path);
                    }
                }else {
                    this.pointQuery(this.lat_lon.split(',')[0], this.lat_lon.split(',')[1]);
                }

            },
            openDataSource(){
                window.open('http://gf2.ucs.indiana.edu/quaketables/uavsar?uid='+this.activePlot, '_blank');
            },
            dynamicExtended(found){
                //set background color dynamically according to wms description
                if(found){
                    this.layerFound = true;
                    this.extendedColor = '#CCFFCC'
                    this.extendedBorder = '1px solid #ADD673'
                    // add markers for plotting
                    // https://lh5.googleusercontent.com/proxy/f1YEx_QBYQtFSXw7QKtmGBQQWUYHZa6U1Zu0ktt3bgAwynGJ99sYdVksg1ItCmfeEsWCBy3EVSZYRvqVTgHEY9Kzji8=s0-d
                    bus.$emit('uavsarPlotMarkers')


                }else {
                    this.layerFound = false;
                    this.extendedColor = '#D6A7A3'
                    this.extendedBorder = '1px solid #C26259'
                }
            },
            updateOpacity(value){
                bus.$emit('changeLayerOpacity', (value/100));
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
                this.LosPlot = true;
                bus.$emit('activatePlot', csv_final);
            },
            activatePlotButton(){

                this.LosPlot = false;
                bus.$emit('hidePlot');

            },
            updatePlot(activeEntry, lat1, lon1, lat2, lon2, azimuth, losLength){
                bus.$emit('FormUpdatePlotLine', activeEntry, lat1, lon1, lat2, lon2, azimuth, losLength );
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

                axios.get('https://beta.geogateway.scigap.org/geogateway_django_app/UAVSAR_csv/', {
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
                if(!entry.extended) {
                    var layerFound = null;
                    bus.$emit('hidePlot');
                    this.activeEntry = entry;
                    this.activePlot = entry.info['uid'];
                    entry.clicked = true;
                    if (!entry.extended) {
                        for (var i = 0; i < this.filteredLayers.length; i++) {
                            this.filteredLayers[i].extended = false
                            this.filteredLayers[i].active = false
                            this.kmlLayerChange(this.filteredLayers[i]);

                        }
                        entry.extended = true;

                        var testURI = 'https://beta.geogateway.scigap.org/geogateway_django_app/UAVSAR_test/'

                        var layername = 'InSAR:' + 'uid' + entry.info['uid'] + '_unw'

                        bus.$emit('removeLayer', 'highResUavsar');


                        //get wms description and check for exception

                        axios.get(testURI, {
                            params: {
                                'uid': layername,
                            }
                        }).then(function (response) {
                            var datajson = response.data
                            if (Object.prototype.hasOwnProperty.call(datajson, 'layerDescriptions')) {
                                layerFound = true;

                                bus.$emit('uavsarWMS', entry, entry.info.geometry.coordinates[0]);
                            } else if (Object.prototype.hasOwnProperty.call(datajson, 'exceptions')) {
                                layerFound = false;
                            }
                            bus.$emit('layerAlert', layerFound);

                        })
                    } else {
                        entry.extended = false;
                    }
                }
            },
            selDeselAll(){
                for(var i = this.filteredLayers.length-1; i >= 0; i--){
                    this.filteredLayers[i].active = this.selDesel;
                    this.kmlLayerChange(this.filteredLayers[i]);
                }
                this.selDesel = !this.selDesel;
            },
            clearQuery(){
                this.filteredLayers = [];
                this.layers = [];
                this.LosPlot = false;
                bus.$emit('resetUavsar');
                this.showOverview();
            },
            showOverview(){
                if(this.overview) {
                    bus.$emit('UAVSAR_overview');

                }else {
                    this.layers = [];
                    this.filteredLayers = [];
                    this.LosPlot = false;
                    bus.$emit('deactivateUavsar');

                }
            },
            flightPathQuery(path){
                if(this.overview) {
                    var baseURI = 'https://beta.geogateway.scigap.org/geogateway_django_app/UAVSAR_flight/'
                    axios.get(baseURI, {
                        params: {
                            //
                            "type": "path",
                            "queryStr": path + '',
                        }
                    }).then(function (response) {
                        var entries = response.data;

                        for (var i = 0; i < entries.length; i++) {
                            var baseURI = 'https://beta.geogateway.scigap.org/geogateway_django_app/UAVSAR_KML/'
                            axios.get(baseURI, {
                                params: {
                                    //
                                    "json": JSON.stringify(entries[i]),
                                }
                            }).then(function (response) {
                                var entry = response.data;
                                bus.$emit('addEntry', entry);
                            })
                        }

                    }).then(function (){
                        bus.$emit('uavsarQueryDone');
                    })
                }
            },

            addEntry(entry){
                this.layers.push(entry);
                bus.$emit('addEntryToUavsar', entry);
            },
            pointQuery(lat, lon){
                this.activeQuery = true;
                if(this.overview) {
                    this.lat_lon = lat.toString() + ',' + lon.toString();
                    var queryStr = '(' + this.lat_lon + ')'
                    var baseURI = 'https://beta.geogateway.scigap.org/geogateway_django_app/UAVSAR_geom/'
                    axios.get(baseURI, {
                        params: {
                            //
                            "type": "point",
                            "queryStr": queryStr,
                        }
                    }).then(function (response) {
                        var entries = response.data;

                        for (var i = 0; i < entries.length; i++) {
                            var baseURI = 'https://beta.geogateway.scigap.org/geogateway_django_app/UAVSAR_KML/'
                            axios.get(baseURI, {
                                params: {
                                    //
                                    "json": JSON.stringify(entries[i]),
                                }
                            }).then(function (response) {
                                var entry = response.data;
                                bus.$emit('addEntry', entry);
                            })
                        }

                    }).then(function (){
                        bus.$emit('uavsarQueryDone');
                    })
                }
            },
            polyQuery(latlngs){
                this.activeQuery = true;
                var queryResponse;
                var queryStr = '';
                for(var i = 0;i<latlngs[0].length;i++){
                    queryStr += '(' + latlngs[0][i].lat + ',' + latlngs[0][i].lng + '),'
                }
                queryStr = queryStr.replace(/,\s*$/, "");

                var baseURI = 'https://beta.geogateway.scigap.org/geogateway_django_app/UAVSAR_geom/'
                axios.get(baseURI, {
                    params: {
                        //
                        "type":'polygon',
                        "queryStr":queryStr
                    }
                }).then(function (response){
                    queryResponse = response.data;
                    bus.$emit('uavsarGeom', queryResponse)
                    // bus.$emit('uavsarKMLs', this.filteredLayers)

                })
            },
            rectQuery(maxLat, minLon, minLat, maxLon, centerLat, centerLng){
                this.activeQuery = true;
                bus.$emit('drawListenerOff');
                if(this.overview) {
                    console.log(centerLng, centerLat);
                    var queryStr = '';
                    queryStr += '(' + '(' + minLat.toFixed(3) + ',' + minLon.toFixed(3) + '),' + '(' + maxLat.toFixed(3) + ',' + maxLon.toFixed(3) + '))'
                    var baseURI = 'https://beta.geogateway.scigap.org/geogateway_django_app/UAVSAR_geom/'
                    axios.get(baseURI, {
                        params: {
                            //
                            "type": 'rectangle',
                            "queryStr": queryStr
                        }
                    }).then(function (response) {
                        var entries = response.data;

                        for (var i = 0; i < entries.length; i++) {
                            var baseURI = 'https://beta.geogateway.scigap.org/geogateway_django_app/UAVSAR_KML/'
                            axios.get(baseURI, {
                                params: {
                                    //
                                    "json": JSON.stringify(entries[i]),
                                }
                            }).then(function (response) {
                                var entry = response.data;
                                bus.$emit('addEntry', entry);
                            })
                        }

                    }).then(function (){
                        bus.$emit('uavsarQueryDone');
                    })

                }
            },
            kmlLayerChange(entry){
                if(entry.active) {
                    bus.$emit('reactivateUavsarLayer', entry.info['uid']);
                }else {
                    bus.$emit('removeUavsarLayer', entry.info['uid'])
                }
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
        border: 2px solid #B3B3CC;
        box-sizing: border-box;
        border-radius: 8px;
        background-color: #8494a3;
        overflow-y: auto;
        /*A5B9CC*/
    }

    .extended {
        width: auto;
        height: auto;
        box-sizing: border-box;
        font-size: 15px;
        border-radius: 8px;
    }
    #active-plot {
        border-radius: 8px;
    }
    #dataname {
        width:100%;
        font-size:14px;
        word-break:break-all;

    }
    .entryWindow {
        width: 200px;
        height: 400px;
        overflow-y: auto;
    }

    #queryWindow {
        height: 600px;
        width: 100%;
        overflow-y: auto;
    }
</style>

<style>
    html, body {margin:0;padding:0;height:100%;}
    .tab-window {
        background-color: #e6e6ff;
        height:100%;
        overflow-x: hidden;
        overflow-y: hidden;
    }
    h3, h4, h5 {
        color: #343a40;
    }

</style>