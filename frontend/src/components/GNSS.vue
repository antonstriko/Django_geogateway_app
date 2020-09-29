<template>
    <div id="GNSS-panel">
        <div class="col-11" style="align-content: center" >

            <h3 style="text-align: center">GPS Data Analysis</h3>
            <label class="control-label requiredField">
                Select GPS data
            </label>
            <form>

                <!-- <label for="sel1">Select list:</label> -->
                <select class="form-control" v-model="kmltype_sel" id="kmltype_sel" >
                    <option value='getvelocities'>Velocities</option>
                    <option value='getcoseismic'>Coseismic</option>
                    <option value='getpostseismic'>Postseismic</option>
                    <option value='getdisplacement'>Displacement</option>
                    <option value='getmodel'>Model</option>
                </select>
                <br/>

                <b-button variant="dark" id="sp_windowpicker" class="btn btn-light" v-b-tooltip.hover title="Use toolbar -->" @click="drawToolbar()">
                    <b-icon-pencil></b-icon-pencil> Draw an area on map</b-button>
                <b-button variant="warning" id="clearGnss" @click="clearGnss()"><b-icon-trash></b-icon-trash> Clear GNSS Layers</b-button>
                <br/>
                <br/>

                <b-input-group prepend="Latitude">
                    <b-form-input v-model="gs_latitude"  name="gs_latitude"></b-form-input>
                </b-input-group>

                <b-input-group prepend="Longitude">
                    <b-form-input v-model="gs_longitude" placeholder="" name="gs_longitude"></b-form-input>
                </b-input-group>

                <b-input-group prepend="Width">
                    <b-form-input v-model="gs_width"  name="gs_width" placeholder="1 degree"></b-form-input>
                </b-input-group>

                <b-input-group prepend="Height">
                    <b-form-input v-model="gs_height" placeholder="1 degree" name="gs_height"></b-form-input>
                </b-input-group>

                <div class="input-group" id="epoch_show" v-if="this.kmltype_sel === 'getcoseismic' || this.kmltype_sel === 'getpostseismic'">
                    <b-input-group prepend="Epoch">
                        <b-form-input v-model="gs_epoch" placeholder="YYYY-MM-DD" name="gs_epoch"></b-form-input>
                    </b-input-group>
                </div>

                <b-input-group prepend="Epoch 1" v-if="this.kmltype_sel === 'getdisplacement' || this.kmltype_sel === 'getmodel'">
                    <b-form-input v-model="gs_epoch1" placeholder="YYYY-MM-DD" name="gs_epoch1"></b-form-input>
                </b-input-group>

                <b-input-group prepend="Epoch 2" v-if="this.kmltype_sel === 'getdisplacement' || this.kmltype_sel === 'getmodel'">
                    <b-form-input v-model="gs_epoch2" placeholder="YYYY-MM-DD" name="gs_epoch2"></b-form-input>
                </b-input-group>

                <b-input-group prepend="Ref. Site">
                    <b-form-input v-model="gs_refsite" placeholder="4-letter code" name="gs_refsite"></b-form-input>
                    <b-input-group-append>
                        <b-button variant="outline-primary" href="https://sideshow.jpl.nasa.gov/post/tables/table2.html" target="_blank">Stations</b-button>
                    </b-input-group-append>
                </b-input-group>

                <b-input-group prepend="Scale">
                    <b-form-input v-model="gs_scale" placeholder="320 mm/yr/deg" name="gs_scale"></b-form-input>
                </b-input-group>

                <b-input-group prepend="Coseismic Win." v-if="this.kmltype_sel === 'getcoseismic' || this.kmltype_sel === 'getpostseismic'">
                    <b-form-input v-model="gs_ctwin" name="gs_ctwin" placeholder="0.1 years"></b-form-input>
                </b-input-group>

                <b-input-group prepend="Postseismic Win." v-if="this.kmltype_sel === 'getpostseismic' ">
                    <b-form-input v-model="gs_ptwin" name="gs_ptwin" placeholder="2 years"></b-form-input>
                </b-input-group>

                <b-input-group prepend="Av. Win. 1" v-if="this.kmltype_sel === 'getdisplacement'">
                    <b-form-input v-model="gs_dwin1" name="gs_dwin1" placeholder="10 days"></b-form-input>
                </b-input-group>

                <b-input-group prepend="Av. Win. 2" v-if="this.kmltype_sel === 'getdisplacement'">
                    <b-form-input v-model="gs_dwin2" name="gs_dwin2" placeholder="10 days"></b-form-input>
                </b-input-group>

                <b-input-group prepend="Output Prefix">
                    <b-form-input v-model="gs_outputprefix" name="gs_outputprefix"></b-form-input>
                </b-input-group>

                <br />
                <div class="checkbox">
                    <label class="checkbox">
                        <input v-model="markerSize" name="vabs" type="checkbox" id="markerSize"/>
                        Minimize Marker Size
                    </label>
                </div>
                <div class="checkbox">
                    <label class="checkbox">
                        <input v-model="gs_vabs" name="vabs" type="checkbox" id="gs_vabs" value= ""/>
                        Display absolute verticals
                    </label>
                </div>
                <div class="checkbox">
                    <label class="checkbox">
                        <input v-model="gs_eon" name="mon" type="checkbox" id="gs_eon" value=""/>
                        Include error ellipses
                    </label>
                </div>

                <br />
                <button  class="btn btn-success" id="gs_submit" name="submit" type="submit" v-on:click.prevent="rungpsservice()">        Run
                </button>
                <br />
                <br />

                <div id="gpsservice_results"></div>
                <div><strong>Data source: <a href="https://sideshow.jpl.nasa.gov/post/series.html" target="_blank">GNSS Time Series</a></strong></div>
            </form>

            <!--            <span :v-for="item in ranLayers">-->
            <!--                <input type="checkbox" v-model="activeLayers" :value="item.active">-->
            <!--                <label :for="item.pre">{{ item.pre }} {{ item.active }}</label>-->
            <!--            </span>-->
            <br/>
            <br/>
            <div v-if="ranLayers.length!==0" style="color: #343a40; text-align: left">
                <div v-for="layer in ranLayers" :key="layer.name">
                    <input type="checkbox" :value="layer.active" v-model="layer.active" @change="showHideLayers(layer.active, layer)"> <span class="checkbox-label"> <a :href="layer.url">{{layer.name}}</a> </span> <br>
                    <hr/>
                </div>
            </div>

        </div>
    </div>


</template>

<script>
    // TODO add checkbox for removing gnss layer

    import {bus} from '../main'
    import axios from 'axios'

    export default {

        name: "GNSS-tools",
        data() {
            return {
                selected: [],
                kmltype_sel: 'getvelocities',
                gs_latitude: '38.89103282648846',
                gs_longitude: '-120.49804687500001',
                gs_width: '1.966552734375',
                gs_height: '1.966552734375',
                gs_epoch: '',
                gs_epoch1: '',
                gs_epoch2: '',
                gs_refsite: 'CCCC',
                gs_scale: '320',
                gs_ctwin: '',
                gs_ptwin: '',
                gs_dwin1: '',
                gs_dwin2: '',
                gs_outputprefix: 'test',
                kmlData: '',
                gs_eon: '',
                gs_vabs: '',
                ranLayers: [],
                activeLayers: [],
                markerSize: false,
                layersActive: false,
                horizUrl: '',
                vertUrl: '',


            }
        },
        mounted() {
            bus.$on('rectDim', (maxLat, minLon, minLat, maxLon, centerLat, centerLng) =>
                this.setRect(maxLat, minLon, minLat, maxLon, centerLat, centerLng));
        },

        methods: {
            showHideLayers(active, layer){
                var hName = 'gnssH'.concat(layer.pre);
                var vName = 'gnssV'.concat(layer.pre);
                if(active){
                    layer.type === 'H' ? bus.$emit('addExisting', hName) :
                        bus.$emit('addExisting', vName);
                }else{
                    layer.type === 'H' ? bus.$emit('RemoveLayer', hName) :
                        bus.$emit('RemoveLayer', vName);
                }
            },
            rungpsservice(){
                //if service has already been run and not cleared, replace old layer with new

                var fileNameH;
                var fileNameV;
                var folder;
                var props;
                var markerSize = this.markerSize;
                var queries = this.ranLayers;
                var verticalUrl;
                var horizontalUrl;
                var prefix = this.gs_outputprefix;
                if(this.kmltype_sel === ''){
                    alert("Please select as least one plot!");
                }
                else {
                    // this.layerCheckbox = true;
                    const baseURI = 'https://beta.geogateway.scigap.org/geogateway_django_app/gps_service'
                    //request JSON dict of GPS_service details with query params from form
                    axios.get(baseURI, {
                        params: {
                            //
                            "function": this.kmltype_sel,
                            "lat": this.gs_latitude,
                            "lon": this.gs_longitude,
                            //"width":$('#gs_width').val(),
                            //"height":$('#gs_height').val(),
                            "width": this.gs_width,
                            "height": this.gs_height,
                            "epoch": this.gs_epoch,
                            "epoch1": this.gs_epoch1,
                            "epoch2": this.gs_epoch2,
                            "scale": this.gs_scale,
                            "ref": this.gs_refsite,
                            "ct": this.gs_ctwin,
                            "pt": this.gs_ptwin,
                            "dwin1": this.gs_dwin1,
                            "dwin2": this.gs_dwin2,
                            "prefix": this.gs_outputprefix,
                            //need default false value?
                            "mon":this.markerSize,
                            "eon": this.gs_eon,
                            "vabs": this.gs_vabs
                            //
                        }
                    })
                        //use JSON results (filename and folder) to request raw kml text
                        .then(function (response) {
                            props = response.data
                            function getExtension(f) {
                                var parts = f.split('_');
                                return parts[parts.length - 1];
                            }
                            for(var i = 0;i < 3;i++){
                                var ext = getExtension(props.urls[i]);
                                if(ext == 'vertical.kml'){
                                    verticalUrl = props.urls[i];
                                    fileNameV = props.results[i];
                                }else if(ext == 'horizontal.kml'){
                                    horizontalUrl = props.urls[i];
                                    fileNameH = props.results[i];
                                }
                            }
                            console.log(props)

                            folder = props.folder;
                            queries.push({
                                pre: prefix,
                                name: fileNameH,
                                folder: folder,
                                active: true,
                                url: verticalUrl,
                                type: 'H',
                            })
                            queries.push({
                                pre: prefix,
                                name: fileNameV,
                                folder: folder,
                                active: true,
                                url: horizontalUrl,
                                type: 'V',
                            })
                            const kmlURI = 'https://beta.geogateway.scigap.org/geogateway_django_app/get_kml'
                            axios.get(kmlURI, {
                                params: {
                                    "file": fileNameH,
                                    "folder": folder
                                },
                                responseType: 'text',
                                //emit raw kml text to parent map component
                            }).then(function (response) {
                                // console.log(toGeoJSON.kml(response.data));
                                console.log(response.data)
                                bus.$emit('addGnssLayer', response.data, 'gnssH', prefix);
                            })
                            axios.get(kmlURI, {
                                params: {
                                    "file": fileNameV,
                                    "folder": folder
                                },
                                responseType: 'text',
                                //emit raw kml text to parent map component
                            }).then(function (response) {
                                // console.log(toGeoJSON.kml(response.data));
                                // var geojson = toGeoJSON.kml((new DOMParser()).parseFromString(response.data, 'text/xml'))
                                // console.log(geojson)

                                bus.$emit('addGnssLayer', response.data, 'gnssV', prefix);
                                console.log(markerSize)
                            })
                        })
                    this.horizUrl = horizontalUrl;
                    this.vertUrl = verticalUrl;

                    this.layersActive = true;
                }

            },
            drawToolbar() {
                bus.$emit('drawToolbar');
            },
            clearGnss(){
                this.layersActive = false;
                for(var i = 0; i < this.ranLayers.length; i++){
                    var layer = this.ranLayers[i];
                    var hName = 'gnssH'.concat(layer.pre);
                    var vName = 'gnssV'.concat(layer.pre);
                    bus.$emit('RemoveLayer', hName);
                    bus.$emit('RemoveLayer', vName);
                }
                this.ranLayers = [];
            },
            setRect(maxLat, minLon, minLat, maxLon, centerLat, centerLng){
                this.gs_latitude = centerLat;
                this.gs_longitude = centerLng;
                this.gs_height = Math.abs(maxLat - minLat);
                this.gs_width = Math.abs(maxLon - minLon);
            }

        },
    }
</script>

<style scoped>
    #GNSS-panel {
        overflow: auto;
        height: auto;
        width: 500px;
    }
    .input-group {
        width: 440px;
    }
    strong {
        color: #343a40;
    }
</style>