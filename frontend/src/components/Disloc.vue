

<template>
    <div class="tab-window">
        <h3>Disloc</h3>
        <hr/>
        <div id="upload-container">
            <h5><b>Input File Upload</b>
                    <b-icon-question variant="success" v-b-modal.modal-1></b-icon-question></h5>
            <b-modal id="modal-1" title="Input File Format">
                <div>
                Use this form to upload one or more faults that are already in Disloc input file format. The following example shows formatting:
                    <hr/>
                <ul>
                    <li>Line 1: 32.904255 -115.526449 1 (this is the lat, lon of the origin; and "1" signifies use of a grid).</li>
                    <li>Line 2: -75 1 151 -40 1 41 (the grid: x0, x_delta, x_number, y0, y_delta, y_number).</li>
                    <li>Line 3: 20.489759271 -80.624111128 355.0 (first fault patch: x, y (km) from origin and strike (degrees).</li>
                    <li>Line 4: 0 1.21 45.0 1.0 1.0 -0.0 -0.0 0.0 3.0 3.0 (fault_type 0 for point dislocation, depth, dip (degrees), lambda, mu,u1,u2,u3, length, width).</li>
                    <li>Repeat the formats for Lines 3 and 4 for each additional fault.</li>
                </ul>
                </div>
            </b-modal>
            <label>File
                <input  type="file" id="file" ref="file" @change="handleFileUpload"/>
            </label>
            <button @click="submitFile()">Submit</button>
    </div>
    </div>
</template>

<script>
    import axios from "axios";
    import {bus} from '../main'

    axios.defaults.xsrfHeaderName = 'X-CSRFToken'
    axios.defaults.xsrfCookieName = 'csrftoken'
    export default {

        name: "Disloc",
        data(){
            return {
                file: null,
            }
        },
        methods: {
            handleFileUpload(event){
                console.log(event)
                this.file = event.target.files[0];
                console.log(this.file)
            },
            submitFile(){
                var uploadUrl = 'http://127.0.0.1:8000/geogateway_django_app/upload/';
                let formData = new FormData();
                formData.append('file', this.file);
                console.log(formData)
                axios.post( uploadUrl, formData
                ).then(function(response){
                    console.log(response)
                })
                    .catch(function(response){
                        console.log(response)
                        console.log('FAILURE!!');
                    });
            },
        }
    }
</script>

<style scoped>
#upload-container {
    float: left;
    text-align: left;
}
</style>