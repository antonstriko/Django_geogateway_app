<template>
    <div id="GNSS-panel">
        <div class="col-11" style="align-content: center" >

            <h2 style="text-align: center">GPS Data Analysis</h2>
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
                        <input v-model="gs_vabs" name="vabs" type="checkbox" id="gs_vabs" value=""/>
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
        </div>
    </div>


</template>

<script>
    import {bus} from '../main'
    import axios from 'axios'
    // import qs from 'qs'

    export default {

        name: "GNSS-tools",
        data() {
            return {
                gnss1: [false, ''],
                gnss2: [false, ''],
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

            }
        },

        methods: {
            rungpsservice(){
                if(this.kmltype_sel === ''){
                    alert("Please select as least one plot!");
                }
                else {
                    const baseURI = 'http://127.0.0.1:8000/geogateway_django_app/gps_service'
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

                    }).then(function (response){
                        var props = response.data
                        this.gnss1[0] = true;
                        this.gnss2[0] = true;
                        this.gnss1[1] = props.urls[0]
                        this.gnss2[1] = props.urls[2]
                    })
                }
                this.$store.state.gnssState.gnss1 = this.gnss1;
                this.$store.state.gnssState.gnss2 = this.gnss2;
                console.log(this.gnss1)
                console.log(this.$store.state.gnssState.gnss1)
                bus.emit('gnssLayer');

            },
            drawToolbar() {
                if (!this.$store.state.GNSS.drawToolbar) {
                    this.$store.state.GNSS.drawToolbar = true;
                    bus.$emit('drawToolbar');
                }
            }
        },
        computed: {
            gnssState() {
                return this.$store.state.gnssState;
            },
            // kmltype_sel: {
            //  get(){
            //   return this.GNSS.formData.kmltype_sel;
            //  },
            //  set(value){
            //   this.$store.commit('setkml', value);
            //  }
            // },
            // gs_latitude: {
            //  get(){
            //   return this.GNSS.formData.gs_latitude;
            //  },
            //  set(value){
            //   this.$store.commit('setLat', value);
            //  }
            // },
            // gs_longitude: {
            //  get(){
            //   return this.GNSS.formData.gs_longitude;
            //  },
            //  set(value){
            //   this.$store.commit('setLng', value);
            //  }
            // },
            // gs_width: {
            //  get(){
            //   return this.GNSS.formData.gs_width;
            //  },
            //  set(value){
            //   this.$store.commit('setWidth', value);
            //  }
            // },
            // gs_height: {
            //  get() {
            //   return this.GNSS.formData.gs_height;
            //  },
            //  set(value) {
            //   this.$store.commit('setHeight', value);
            //  },
            // },
            //  gs_refsite: {
            //   get() {
            //    return this.GNSS.formData.gs_refsite;
            //   },
            //   set(value) {
            //    this.$store.commit('setRef', value);
            //   }
            //  },
            //  gs_scale: {
            //  get(){
            //   return this.GNSS.formData.gs_scale;
            //  },
            //  set(value){
            //   this.$store.commit('setScale', value);
            //  }
            // },
            // gs_outputprefix: {
            //  get(){
            //   return this.GNSS.formData.gs_outputprefix;
            //  },
            //  set(value){
            //   this.$store.commit('setPrefix', value);
            //  }
            // },


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