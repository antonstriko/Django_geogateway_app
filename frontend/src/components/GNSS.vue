<template>
    <div id="GNSS-panel">
        <div class="col-11" style="align-content: center" >

            <h3 style="text-align: center">GPS Data Analysis</h3>
            <label class="control-label requiredField">
                Select GPS data
            </label>
            <form>

                <!-- <label for="sel1">Select list:</label> -->
                <select class="form-control" v-model="kmltype_sel" id="kmltype_sel">
                    <option value='getvelocities'>Velocities</option>
                    <option value='getcoseismic'>Coseismic</option>
                    <option value='getpostseismic'>Postseismic</option>
                    <option value='getdisplacement'>Displacement</option>
                    <option value='getmodel'>Model</option>
                </select>
                <br/>

                <b-button variant="outline-primary" id="sp_windowpicker" class="btn btn-light" @click="drawToolbar()">
                    <b-icon-pencil></b-icon-pencil>Draw an area on map</b-button>
                <br/>
                <br/>

                <b-input-group prepend="Latitude">
                    <b-form-input v-model="gs_latitude" placeholder="1 degree" name="gs_latitude"></b-form-input>
                </b-input-group>

                <b-input-group prepend="Longitude">
                    <b-form-input v-model="gs_longitude" placeholder="1 degree" name="gs_longitude"></b-form-input>
                </b-input-group>

                <b-input-group prepend="Width">
                    <b-form-input v-model="gs_width"  name="gs_width"></b-form-input>
                </b-input-group>

                <b-input-group prepend="Height">
                    <b-form-input v-model="gs_height" placeholder="" name="gs_height"></b-form-input>
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

                <div class="checkbox">
                    <label class="checkbox">
                        <input v-model="gs_vabs" name="vabs" type="checkbox" id="gs_vabs" value= ""/>
                        Display absolute verticals
                    </label>
                </div>
                <div class="checkbox">
                    <label class="checkbox">
                        <input v-model="gs_mon" name="mon" type="checkbox" id="gs_mon" value=""/>
                        Minimize marker size
                    </label>
                </div>
                <div class="checkbox">
                    <label class="checkbox">
                        <input v-model="gs_eon" name="mon" type="checkbox" id="gs_eon" value=""/>
                        Include error ellipses
                    </label>
                </div>
                <button  class="btn btn-success" id="gs_submit" name="submit" type="submit" v-on:click.prevent="rungpsservice()">        Run
                </button>

                <div id="gpsservice_results"></div>
                <div><strong>Data source: <a href="https://sideshow.jpl.nasa.gov/post/series.html" target="_blank">GNSS Time Series</a></strong></div>
            </form>

            <!--            <span :v-for="item in ranLayers">-->
            <!--                <input type="checkbox" v-model="activeLayers" :value="item.active">-->
            <!--                <label :for="item.pre">{{ item.pre }} {{ item.active }}</label>-->
            <!--            </span>-->
            <div v-if="ranLayers.length!==0">
                <div v-for="layer in ranLayers" :key="layer.name">
                    <input type="checkbox" :value="layer.active" v-model="layer.active" @change="showHideLayers(layer.active, layer.pre)"> <span class="checkbox-label">{{layer.name}} {{layer.active}}</span> <br>
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
    import toGeoJSON from 'togeojson'
    // import {convertEpochToSpecificTimezone} from '../assets/mapMethods'
    // import qs from 'qs'

    export default {

        name: "GNSS-tools",
        data() {
            return {
                selected: [],
                kmltype_sel: '',
                gs_latitude: '',
                gs_longitude: '',
                gs_width: '',
                gs_height: '',
                gs_epoch: '',
                gs_epoch1: '',
                gs_epoch2: '',
                gs_refsite: '',
                gs_scale: '',
                gs_ctwin: '',
                gs_ptwin: '',
                gs_dwin1: '',
                gs_dwin2: '',
                gs_outputprefix: '',
                kmlData: '',
                gs_eon: '',
                gs_vabs: '',
                gs_mon: '',
                ranLayers: [],
                activeLayers: [],


            }
        },
        mounted() {
            bus.$on('rectDim', (maxLat, minLon, minLat, maxLon, centerLat, centerLng) =>
                this.setRect(maxLat, minLon, minLat, maxLon, centerLat, centerLng));
        },

        methods: {
            showHideLayers(active, layer){
                if(active){
                    layer === 'H' ? bus.$emit('addExisting', 'gnssH') :
                        bus.$emit('addExisting', 'gnssV');
                }else{
                    layer === 'H' ? bus.$emit('RemoveLayer', 'gnssH') :
                        bus.$emit('RemoveLayer', 'gnssV');
                }
            },
            rungpsservice(){
                var fileName1;
                var fileName2;
                var fileName3;
                var folder;
                var props;
                var queries = this.ranLayers;
                if(this.kmltype_sel === ''){
                    alert("Please select as least one plot!");
                }
                else {
                    // this.layerCheckbox = true;
                    const baseURI = 'http://127.0.0.1:8000/geogateway_django_app/gps_service'
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
                            "mon": this.gs_mon,
                            "eon": this.gs_eon,
                            "vabs": this.gs_vabs
                            //
                        }
                    })
                        //use JSON results (filename and folder) to request raw kml text
                        .then(function (response) {
                            props = response.data
                            console.log(props)
                            folder = props.folder;
                            fileName1 = props.results[0];
                            queries.push({
                                pre: 'H',
                                name: fileName1,
                                folder: folder,
                                active: true,
                            })

                            fileName2 = props.results[1];
                            queries.push({
                                name: fileName2,
                                folder: folder,
                                active: true,
                            })

                            fileName3 = props.results[2];
                            queries.push({
                                pre: 'V',
                                name: fileName3,
                                folder: folder,
                                active: true,
                            })
                        const kmlURI = 'http://127.0.0.1:8000/geogateway_django_app/get_kml'
                        axios.get(kmlURI, {
                            params: {
                                "file": fileName1,
                                "folder": folder
                            },
                            responseType: 'text',
                            //emit raw kml text to parent map component
                        }).then(function (response) {
                            // console.log(toGeoJSON.kml(response.data));
                            var geojson = toGeoJSON.kml((new DOMParser()).parseFromString(response.data, 'text/xml'), {styles: true})
                            bus.$emit('gnssLayer', geojson, 'gnssV');
                            })
                        axios.get(kmlURI, {
                            params: {
                                "file": fileName3,
                                "folder": folder
                            },
                            responseType: 'text',
                            //emit raw kml text to parent map component
                        }).then(function (response) {
                            // console.log(toGeoJSON.kml(response.data));
                            var geojson = toGeoJSON.kml((new DOMParser()).parseFromString(response.data, 'text/xml'))
                            console.log(geojson)
                            bus.$emit('gnssLayer', geojson, 'gnssH');

                        })

                    })
                }

            },
            drawToolbar() {

                bus.$emit('drawToolbar');

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
</style>