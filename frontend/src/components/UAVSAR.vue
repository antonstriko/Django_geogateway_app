<template>
    <div class="tab-window">
        <h3>UAVSAR</h3>
        <hr />
        <div class="overviewButtonGroup">
            <b-button
                    type="checkbox"
                    id="overview"
                    :pressed.sync="overview"
                    @click="showOverview"
            >Show Overview</b-button>
        </div>



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

        <div v-if="uavsarLayers.length !== 0 && !activeQuery">
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
                <div v-if="false">

                </div>
                <div hidden>
                    {{extendedColor}}
                    {{extendedBorder}}
                </div>
                <div class="collapsed"  v-for="entry in uavsarLayersFiltered" :key="entry.info['uid']">

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
                        <div  v-else-if="!entry.extended && entry.clicked" style="background-color: #A5B9CC; border-radius: 5px">
                            <b-icon-eye></b-icon-eye>
                        </div>
                        <div v-else-if="extendingActive && entry.extended">
                            <b-spinner type="grow" variant="warning">
                            </b-spinner>
                        </div>
                        <div v-else-if="entry.extended && !extendingActive" class="extended" v-bind:style="{backgroundColor: extendedColor, border: extendedBorder }">

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
                                        </b-input-group>UavsarKmlQuer
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
                                    <span @click="openDataSource" style="cursor: pointer; color: #2e6da4"><b>Open Data Source</b></span>
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
    import L from 'leaflet';
    import 'leaflet-kml'
    // import {store} from "../store/store";
    import { mapFields } from 'vuex-map-fields';


    // var kmlQuery = (entries) =>{
    //     var vm = this;
    //     var baseURI = 'http://127.0.0.1:8000/geogateway_django_app/UAVSAR_KML/'
    //     let promises = [];
    //     for (var i = 0; i < entries.length; i++) {
    //         promises.push(
    //             axios.get(baseURI, {
    //                 params: {
    //                     //
    //                     "json": JSON.stringify(entries[i]),
    //                 }
    //             }))
    //     }
    //     Promise.all(promises).then((responses) =>{
    //         for(let k = 0;k < responses.length;k++){
    //             vm.uavsarLayers[k] = responses[k].data;
    //         }
    //     })
    //
    //
    // }

    export default {
        name: "UAVSAR",
        data(){
            return {

            }
        },
        components: {


        },
        computed: {
            // exColor : function(){
            //   return this.extendedColor;
            // },
            // exBorder : function(){
            //   return this.extendedBorder;
            // },
            ...mapFields(['uavsar.overview',
                'uavsar.flight_path',
                'uavsar.lat_lon',
                'uavsar.uavsarLayers',
                // 'uavsar.extendedColor',
                // 'uavsar.extendedBorder',
                'uavsar.extendingActive',
                'uavsar.layerFound',
                'uavsar.selDesel',
                'uavsar.LosPlot',
                'uavsar.lat1',
                'uavsar.lat2',
                'uavsar.lon1',
                'uavsar.lon2',
                'uavsar.losLength',
                'uavsar.azimuth',
                'uavsar.activePlot',
                'uavsar.csv_final',
                'uavsar.activeEntry',
                'uavsar.opVal',
                'uavsar.uid',
                'uavsar.extendedBorder',
                'uavsar.extendedColor',
                'uavsar.uavsarLayersFiltered',
                'uavsar.activeQuery',
                'uavsar.geomEntries',
                'uavsar.path',
                'uavsar.sortBy',
                'uavsar.uavsarHighResLayer',
                'uavsar.uavsarDisplayedLayers',

                //Map objects
                'map.globalMap',
                'map.layers',
                'map.drawControl',
                'map.uavsarLegend',
                'map.uavsarEntry',
                'map.uavsarLatLon'
            ])
        },
        mounted() {
            bus.$on('markPlace', (lat, lon) =>
                this.pointQuery(lat, lon));
            bus.$on('uavsarGeom', (entries) =>
                this.kmlQueries(entries));
            bus.$on('assignEntry', (entry)=>
                this.assignKmls(entry));
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
            bus.$on('UavsarKmlQueryDone', (tempLayers) => {
                this.uavsarLayers.push(...tempLayers);
                this.uavsarLayersFiltered.push(...tempLayers);
                this.activeQuery = false;
                this.displayUavsarQuery();
            });
            bus.$on('uavsarHighRes', (entry) =>
                this.uavsarHighRes(entry));
        },
        methods: {

            uavsarDrawRect(){
                new L.Draw.Rectangle(this.globalMap, this.drawControl.options.rectangle).enable();

            },
            uavsarPinDrop(){
                var vm = this;
                new L.Draw.Marker(this.globalMap, this.drawControl.options.marker).enable();
                this.globalMap.on('draw:created', function (e) {
                    vm.markerLayer = e.layer;
                    var lat = e.layer.getLatLng().lat;
                    var lng = e.layer.getLatLng().lng;
                    vm.pointQuery(lat,lng);
                });
            },
            filterHeading(){
                var pathSearch = this.path;
                function checkPath(entry){
                    return entry.info['heading'].includes(pathSearch);
                }
                this.uavsarLayersFiltered = this.uavsarLayers.filter(checkPath);
            },

            sortEntries(){
                if(this.sortBy === 'rating') {
                    this.uavsarLayersFiltered = this.uavsarLayers.sort((a, b) =>
                        (a.info['rating'] > b.info['rating']) ? -1 : 1);
                }
            },

            uavsarQuery(){
                this.activeQuery = true;
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

            // high res plotting images + add map legend
            displayUavsarQuery() {




            },
            openDataSource(){
                window.open('http://gf2.ucs.indiana.edu/quaketables/uavsar?uid='+this.activePlot, '_blank');
            },
            // dynamicExtended(found){
            //     //set background color dynamically according to wms description
            //     if(found){
            //         this.layerFound = true;
            //
            //         // add markers for plotting
            //         // https://lh5.googleusercontent.com/proxy/f1YEx_QBYQtFSXw7QKtmGBQQWUYHZa6U1Zu0ktt3bgAwynGJ99sYdVksg1ItCmfeEsWCBy3EVSZYRvqVTgHEY9Kzji8=s0-d
            //
            //     }else {
            //
            //     }
            // },
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
                var vm = this;
                this.extendingActive = true;
                if(!entry.extended) {
                    for(let i = 0; i < this.uavsarLayersFiltered.length; i++){
                        this.uavsarLayersFiltered[i].extended = false;
                    }
                    bus.$emit('hidePlot');
                    this.activeEntry = entry;
                    entry.clicked = true;
                    entry.extended = true;
                    var testURI = 'http://127.0.0.1:8000/geogateway_django_app/UAVSAR_test/'

                    var layername = 'InSAR:' + 'uid' + entry.info['uid'] + '_unw'

                    if(this.uavsarHighResLayer !== null){
                        this.globalMap.removeLayer(this.uavsarHighResLayer);
                        this.uavsarHighResLayer = null;
                    }
                    //get wms description and check for exception

                    axios.get(testURI, {
                        params: {
                            'uid': layername,
                        }
                    }).then( (response) => {
                        var datajson = response.data
                        if (Object.prototype.hasOwnProperty.call(datajson, 'layerDescriptions')) {
                            vm.layerFound = true;
                            vm.extendedColor = '#CCFFCC'
                            vm.extendedBorder = '1px solid #ADD673'
                            vm.uavsarHighRes(entry);
                        } else if (Object.prototype.hasOwnProperty.call(datajson, 'exceptions')) {
                            vm.layerFound = false;
                            vm.extendedColor = '#D6A7A3'
                            vm.extendedBorder = '1px solid #C26259'
                        }
                        vm.extendingActive = false;
                    })
                } else {
                    entry.extended = false;
                    this.activeEntry = null;
                }
            },
            uavsarHighRes(entry) {
                var latlon = entry.info.geometry.coordinates[0];
                for(var i = this.uavsarLayersFiltered.length-1; i >= 0; i--){
                    this.uavsarLayersFiltered[i].active = false;
                    this.kmlLayerChange(this.uavsarLayersFiltered[i]);
                }
                if (this.uavsarLegend !== null) {
                    this.uavsarLegend.remove();
                }
                var baseURI = "http://js-168-89.jetstream-cloud.org/geoserver/InSAR/wms?"

                var layername = 'InSAR:' + 'uid' + entry.info['uid'] + '_unw'

                this.uavsarLatlon = latlon;
                this.uavsarEntry = entry;

                this.uavsarHighResLayer = L.tileLayer.wms(baseURI, {
                    layers: layername,
                    transparent: true,
                    format: 'image/png',
                    zIndex: 2
                })

                // https://lh5.googleusercontent.com/proxy/f1YEx_QBYQtFSXw7QKtmGBQQWUYHZa6U1Zu0ktt3bgAwynGJ99sYdVksg1ItCmfeEsWCBy3EVSZYRvqVTgHEY9Kzji8=s0-d

                this.globalMap.addLayer(this.uavsarHighResLayer);

                var baseUri = 'http://js-168-89.jetstream-cloud.org/uavsarlegend1/uid';

                var uidUri = entry.info['uid'] + '_unw_default.png';

                var finalUri = baseUri + uidUri;

                this.uavsarHighResLayer.setOpacity(.5)

                this.uavsarLegend = L.control({position: 'bottomleft'});
                this.uavsarLegend.onAdd = function () {
                    var div = L.DomUtil.create('div', 'uavsarLegend');
                    div.innerHTML = '<img src=' + finalUri + '>';
                    return div;
                };

                this.uavsarLegend.addTo(this.globalMap)

                this.globalMap.on('click', this.markerClick);

            },
            markerClick(e) {
                var clickloc = e.latlng;

                var latlon = this.uavsarLatlon;
                var entry = this.uavsarEntry;

                var southwest = L.latLng(latlon[0][1], latlon[0][0]);
                var northeast = L.latLng(latlon[3][1], latlon[3][0]);

                var rect = L.latLngBounds(southwest, northeast);

                console.log(southwest, northeast, rect.contains(clickloc));

                bus.$emit('placePlotMarkers', southwest, northeast, clickloc, latlon, entry);
            },
            selDeselAll(){
                for(var i = this.uavsarLayersFiltered.length-1; i >= 0; i--){
                    this.uavsarLayersFiltered[i].active = this.selDesel;
                    this.kmlLayerChange(this.uavsarLayersFiltered[i]);
                }
                this.selDesel = !this.selDesel;
            },
            clearQuery(){
                for (var i = 0; i < this.uavsarLayers.length; i++) {
                    this.uavsarLayers[i].extended = false
                    this.uavsarLayers[i].active = false
                    if(this.globalMap.hasLayer(this.uavsarDisplayedLayers[i])) {
                        this.globalMap.removeLayer(this.uavsarDisplayedLayers[i]);
                    }
                }
                this.uavsarDisplayedLayers = [];
                this.uavsarLayersFiltered = [];
                this.uavsarLayers = [];
                this.LosPlot = false;
                this.uavsarLegend.remove();
                this.showOverview();
            },
            showOverview(){
                if(this.overview) {
                    bus.$emit('UAVSAR_overview');

                }else {
                    this.uavsarLayers = [];
                    this.uavsarLayersFiltered = [];
                    this.LosPlot = false;
                    bus.$emit('deactivateUavsar');

                }
            },
            flightPathQuery(path){
                this.activeQuery = true;
                var vm = this;
                if(this.overview) {
                    var baseURI = 'http://127.0.0.1:8000/geogateway_django_app/UAVSAR_flight/'
                    axios.get(baseURI, {
                        params: {
                            //
                            "type": "path",
                            "queryStr": path + '',
                        }
                    }).then(function (response) {
                        let entries = response.data;
                        let baseURI = 'http://127.0.0.1:8000/geogateway_django_app/UAVSAR_KML/'
                        let promises = [];
                        for (var i = 0; i < entries.length; i++) {
                            promises.push(
                                axios.get(baseURI, {
                                    params: {
                                        //
                                        "json": JSON.stringify(entries[i]),
                                    }
                                }))
                        }
                        Promise.all(promises).then((responses) =>{
                            if (vm.layers['uavsarWMS']) {
                                vm.globalMap.removeLayer(vm.layers['uavsarWMS']);
                            }
                            for(let k = 0;k < responses.length;k++){
                                vm.uavsarLayers[k] = responses[k].data;
                                let uid = vm.uavsarLayers[k].info['uid'];
                                vm.uavsarLayersFiltered[k] = responses[k].data;
                                const parser = new DOMParser();
                                const kml = parser.parseFromString(vm.uavsarLayers[k].kml, 'text/xml');
                                const track = new L.KML(kml);
                                vm.uavsarDisplayedLayers[uid] = track;
                                vm.globalMap.addLayer(vm.uavsarDisplayedLayers[uid]);
                            }
                            vm.activeQuery = false;
                            console.log(vm.uavsarDisplayedLayers.length);

                        })
                    })
                }
            },
            pointQuery(lat, lon){
                this.globalMap.off('draw:created');
                this.activeQuery = true;
                var vm = this;
                if(this.overview) {
                    this.lat_lon = lat.toString() + ',' + lon.toString();
                    var queryStr = '(' + this.lat_lon + ')'
                    var baseURI = 'http://127.0.0.1:8000/geogateway_django_app/UAVSAR_geom/'
                    axios.get(baseURI, {
                        params: {
                            //
                            "type": "point",
                            "queryStr": queryStr,
                        }
                    }).then(function (response) {
                        let entries = response.data;
                        let baseURI = 'http://127.0.0.1:8000/geogateway_django_app/UAVSAR_KML/'
                        let promises = [];
                        for (var i = 0; i < entries.length; i++) {
                            promises.push(
                                axios.get(baseURI, {
                                    params: {
                                        //
                                        "json": JSON.stringify(entries[i]),
                                    }
                                }))
                        }
                        Promise.all(promises).then((responses) =>{
                            if (vm.layers['uavsarWMS']) {
                                vm.globalMap.removeLayer(vm.layers['uavsarWMS']);
                            }
                            for(let k = 0;k < responses.length;k++){
                                vm.uavsarLayers[k] = responses[k].data;
                                let uid = vm.uavsarLayers[k].info['uid'];
                                vm.uavsarLayersFiltered[k] = responses[k].data;
                                const parser = new DOMParser();
                                const kml = parser.parseFromString(vm.uavsarLayers[k].kml, 'text/xml');
                                const track = new L.KML(kml);
                                vm.uavsarDisplayedLayers[uid] = track;
                                vm.globalMap.addLayer(vm.uavsarDisplayedLayers[uid]);
                            }
                            vm.activeQuery = false;
                            console.log(vm.uavsarDisplayedLayers.length);
                        })
                    })
                }
            },

            // polyQuery(latlngs){
            //     this.activeQuery = true;
            //     var queryResponse;
            //     var queryStr = '';
            //     for(var i = 0;i<latlngs[0].length;i++){
            //         queryStr += '(' + latlngs[0][i].lat + ',' + latlngs[0][i].lng + '),'
            //     }
            //     queryStr = queryStr.replace(/,\s*$/, "");
            //
            //     var baseURI = 'http://127.0.0.1:8000/geogateway_django_app/UAVSAR_geom/'
            //     axios.get(baseURI, {
            //         params: {
            //             //
            //             "type":'polygon',
            //             "queryStr":queryStr
            //         }
            //     }).then(function (response){
            //         queryResponse = response.data;
            //         bus.$emit('uavsarGeom', queryResponse)
            //         // bus.$emit('uavsarKMLs', this.uavsarLayersFiltered)
            //
            //     })
            // },
            rectQuery(maxLat, minLon, minLat, maxLon, centerLat, centerLng){
                this.activeQuery = true;
                var vm = this;
                this.globalMap.off('draw:created');

                if(this.overview) {
                    console.log(centerLng, centerLat);
                    var queryStr = '';
                    queryStr += '(' + '(' + minLat.toFixed(3) + ',' + minLon.toFixed(3) + '),' + '(' + maxLat.toFixed(3) + ',' + maxLon.toFixed(3) + '))'
                    var baseURI = 'http://127.0.0.1:8000/geogateway_django_app/UAVSAR_geom/'
                    axios.get(baseURI, {
                        params: {
                            //
                            "type": 'rectangle',
                            "queryStr": queryStr
                        }
                    }).then(function (response) {
                        let entries = response.data;
                        let baseURI = 'http://127.0.0.1:8000/geogateway_django_app/UAVSAR_KML/'
                        let promises = [];
                        for (var i = 0; i < entries.length; i++) {
                            promises.push(
                                axios.get(baseURI, {
                                    params: {
                                        //
                                        "json": JSON.stringify(entries[i]),
                                    }
                                }))
                        }
                        Promise.all(promises).then((responses) =>{
                            if (vm.layers['uavsarWMS']) {
                                vm.globalMap.removeLayer(vm.layers['uavsarWMS']);
                            }
                            for(let k = 0;k < responses.length;k++){
                                vm.uavsarLayers[k] = responses[k].data;
                                let uid = vm.uavsarLayers[k].info['uid'];
                                vm.uavsarLayersFiltered[k] = responses[k].data;
                                const parser = new DOMParser();
                                const kml = parser.parseFromString(vm.uavsarLayers[k].kml, 'text/xml');
                                const track = new L.KML(kml);
                                vm.uavsarDisplayedLayers[uid] = track;
                                vm.globalMap.addLayer(vm.uavsarDisplayedLayers[uid]);
                            }
                            vm.activeQuery = false;
                            console.log(vm.uavsarDisplayedLayers.length);
                        })
                    })
                }
            },
            kmlLayerChange(entry){
                const uid = entry.info['uid'];
                if(entry.active) {
                    this.globalMap.addLayer(this.uavsarDisplayedLayers[uid]);
                }else {
                    this.globalMap.removeLayer(this.uavsarDisplayedLayers[uid]);
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
    .overviewButtonGroup .active {
        color: #fff !important;
        background-color: #3388ff !important;
        border-color: #3388ff !important;
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