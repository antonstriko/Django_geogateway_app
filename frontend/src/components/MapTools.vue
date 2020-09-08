<template>
    <div class="tab-window">
        <h3>Map Tools</h3>
        <hr>
        <div>
                <input
                        type="checkbox"
                        v-model="ucerf"
                        @change="updateLayer('ucerf')"
                        id="ucerf"
                ><label for="ucerf"> UCERF3 Faults</label>
                <br/>
            <input
                    type="checkbox"
                    v-model="kml"
                    @change="updateLayer('kml')"
                    id="kml"
            ><label for="kml">KML Uploader</label>
            <br/>
            <input
                    type="checkbox"
                    v-model="boundaries"
                    @change="updateLayer('boundaries')"
                    id="boundaries"
            ><label for="boundaries">Show State Boundaries</label>
            <br/>
            <input
                    type="checkbox"
                    v-model="coasts"
                    @change="updateLayer('coasts')"
                    id="coasts"
            ><label for="coasts">Show Coastlines</label>
            <br/>
        </div>
        <div id="tools-show">
            <div v-if="this.ucerf">
                <b-form-radio-group>
                    <b-form-radio label="black" name="some-radios" :value="selected" @change="updateColor('black')"><p>black</p></b-form-radio>
                    <b-form-radio label="red" name="some-radios" :value="selected" @change="updateColor('red')"><p>red</p></b-form-radio>
                    <b-form-radio vlabel="yellow" name="some-radios" :value="selected" @change="updateColor('yellow')"><p>yellow</p></b-form-radio>
                    <b-form-radio label="grey" name="some-radios" :value="selected" @change="updateColor('grey')"><p>grey</p></b-form-radio>
                </b-form-radio-group>
            </div>

            <div v-if="this.kml">
                <br />
                <h4>KML File Upload</h4>
                <p>Upload a KML from your local file system</p>
                <label>File
                    <input  type="file" id="file" ref="file" @change="handleFileUpload"/>
                </label>
                <button @click="submitFile()">Submit</button>
            </div>
<!--            <div v-if="boundaries">-->
<!--                <label for="opacity">Example range with min and max</label>-->
<!--                <b-form-input id="opacity" @change="updateOpacity(value)" v-model="value" type="range" min="0" max="100"></b-form-input>-->
<!--                <div class="mt-2">Value: {{ value }}</div>-->
<!--            </div>-->
        </div>
    </div>
</template>

<script>
    import {bus} from '../main'
    import axios from "axios";
    export default {
        name: "MapTools",
        data() {
            return {
                ucerfUrlGrey: "https://raw.githubusercontent.com/GeoGateway/GeoGatewayStaticResources/master/kmz/ucerf3_grey.kml",
                ucerfUrlBlack: "https://raw.githubusercontent.com/GeoGateway/GeoGatewayStaticResources/master/kmz/ucerf3_black.kml",
                ucerfUrlRed: "https://raw.githubusercontent.com/GeoGateway/GeoGatewayStaticResources/master/kmz/ucerf3_red.kml",
                ucerfUrlYellow: "https://raw.githubusercontent.com/GeoGateway/GeoGatewayStaticResources/master/kmz/ucerf3_yellow.kml",
                boundariesUrl: 'https://raw.githubusercontent.com/GeoGateway/GeoGatewayStaticResources/master/kmz/gz_2010_us_040_00_20m.kml',
                coastsUrl: 'https://raw.githubusercontent.com/GeoGateway/GeoGatewayStaticResources/master/kmz/ne_50m_coastline.kml',
                ucerf: false,
                boundaries: false,
                coasts: false,
                kml: false,
                kmlFile: null,
                selected: 'grey',
                value: 50,


            }
        },
        methods: {
            // updateOpacity(value){
            //   bus.$emit('stateBoundaryOpacity', (value/100))
            // },
            updateColor(selected){
                this.selected = selected;
                bus.$emit('RemoveLayer', 'ucerfL');
                this.updateLayer('ucerf', selected)
            },
            updateLayer(l, color){
                switch (l) {

                    case 'ucerf':
                        if(this.ucerf) {
                            var url;
                            if(color === 'black'){
                                url = this.ucerfUrlBlack
                            }else if(color === 'red'){
                                url = this.ucerfUrlRed;
                            }else if(color === 'yellow'){
                                url = this.ucerfUrlYellow;
                            }else url = this.ucerfUrlGrey;

                            bus.$emit('UrlAddLayer', url, 'ucerfL');
                        }else bus.$emit('RemoveLayer', 'ucerfL');
                        break;
                    case 'kml':
                        break;
                    case 'boundaries':
                        if(this.boundaries) {
                            bus.$emit('UrlAddLayer', this.boundariesUrl, 'boundariesL');
                        }else bus.$emit('RemoveLayer', 'boundariesL');
                        break;
                    case 'coasts':
                        if(this.coasts) {
                            bus.$emit('UrlAddLayer', this.coastsUrl, 'coastsL');
                        }else bus.$emit('RemoveLayer', 'coastsL');
                        break;

                }

            },
            handleFileUpload(event){
                console.log(event)
                this.kmlFile = event.target.files[0];
                console.log(this.kmlFile)
            },
            submitFile(){
                var uploadUrl = 'https://beta.geogateway.scigap.org/geogateway_django_app/kml_upload/';
                let formData = new FormData();
                formData.append('file', this.kmlFile);
                console.log(formData)
                axios.post( uploadUrl, formData
                ).then(function(response){
                    console.log('SUCCESS!!');
                    bus.$emit('TextAddLayer', response.data, 'kmlUpload');
                })
                    .catch(function(response){
                        console.log(response)
                        console.log('FAILURE!!');
                    });
            },
        },

    }
</script>

<style scoped>



</style>

<style>
    label {
        color: #71A7DD;
    }
    p {
        color: #71A7DD;
    }
</style>