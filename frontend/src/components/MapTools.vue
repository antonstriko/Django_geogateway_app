<template>
    <div>
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
                <hr class="divider" />
                <b-form-radio-group  >
                    <b-form-radio v-model="selected" name="some-radios" value="black"><p>black</p></b-form-radio>
                    <b-form-radio v-model="selected" name="some-radios" value="red"><p>red</p></b-form-radio>
                    <b-form-radio v-model="selected" name="some-radios" value="yellow"><p>yellow</p></b-form-radio>
                    <b-form-radio v-model="selected" name="some-radios" value="grey"><p>grey</p></b-form-radio>
                </b-form-radio-group>
            </div>

            <div v-if="this.kml">
                <hr class="divider" />
                <h2>KML File Upload</h2>
                <label>File
                    <input  type="file" id="file" ref="file" @change="handleFileUpload"/>
                </label>
                <button @click="submitFile()">Submit</button>
            </div>
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
                ucerfUrl: "https://raw.githubusercontent.com/GeoGateway/GeoGatewayStaticResources/master/kmz/ucerf3_black.kml",
                boundariesUrl: 'https://raw.githubusercontent.com/GeoGateway/GeoGatewayStaticResources/master/kmz/gz_2010_us_040_00_20m.kml',
                coastsUrl: 'https://raw.githubusercontent.com/GeoGateway/GeoGatewayStaticResources/master/kmz/ne_50m_coastline.kml',
                ucerf: false,
                boundaries: false,
                coasts: false,
                kml: false,
                kmlFile: null,


            }
        },
        methods: {
            updateLayer(l){
                // Should the store be used in this case or is the event bus sufficient?
                // TODO improve efficiency and utilize vue mutations to do this
                switch (l) {
                    case 'ucerf':
                        if(this.ucerf) {
                            bus.$emit('UrlAddLayer', this.ucerfUrl, 'ucerfL');
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
                var uploadUrl = 'http://127.0.0.1:8000/geogateway_django_app/kml_upload/';
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


    .divider {
        border: 2px solid #cccccc;
        border-radius: 1px;
    }

</style>