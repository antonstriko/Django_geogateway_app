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
      <input
          type="checkbox"
          v-model="currLoc"
          @change="getLocation()"
          id="loc"
      ><label for="loc">Show Current Location</label>
      <br/>
    </div>
    <div id="tools-show">
      <div v-show="this.ucerf">
        <b-form-radio-group>
          <b-form-radio label="black" name="some-radios" v-model="selectedColor" @change="updateColor('black')"><p>black</p></b-form-radio>
          <b-form-radio label="red" name="some-radios" v-model="selectedColor" @change="updateColor('red')"><p>red</p></b-form-radio>
          <b-form-radio vlabel="yellow" name="some-radios" v-model="selectedColor" @change="updateColor('yellow')"><p>yellow</p></b-form-radio>
          <b-form-radio label="grey" name="some-radios" v-model="selectedColor" @change="updateColor('grey')"><p>grey</p></b-form-radio>
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
        <div v-for="entry in kmlLayers" :key="entry" >
          <div class="fileEntry" >
            <input type="checkbox" v-model="entry.active" @change="kmlLayerChange(entry)" > <span style="font-size: 15px; color: #222222">{{entry.name}}</span><br>
          </div>

        </div>

        <!--            <div v-if="boundaries">-->
        <!--                <label for="opacity">Example range with min and max</label>-->
        <!--                <b-form-input id="opacity" @change="updateOpacity(value)" v-model="value" type="range" min="0" max="100"></b-form-input>-->
        <!--                <div class="mt-2">Value: {{ value }}</div>-->
        <!--            </div>-->
      </div>
    </div>
  </div>
</template>

<script>
import {bus} from '../main'
import axios from "axios";
import { mapFields } from 'vuex-map-fields';
import L from 'leaflet';
axios.defaults.withCredentials = true;
axios.defaults.xsrfHeaderName = 'X-CSRFToken';
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
      userLocationPin: null, //vuex-map-fields does not correctly reference variables inside of event listeners
    }
  },
  computed: {
    // ucerf: false,
    // boundaries: false,
    // coasts: false,
    // kml: false,
    // kmlFile: null,
    // selected: 'grey',
    // value: 50,
    // kmlLayers: [],
    ...mapFields(['mapTools.kmlLayers', 'mapTools.boundaries', 'mapTools.ucerf',
      'mapTools.coasts', 'mapTools.kml', 'mapTools.kmlFile', 'mapTools.selected', 'mapTools.currLoc',
      'mapTools.userLocationCirc', 'mapTools.selectedColor',
      // 'maTools.userLocationPin',
      'mapTools.locActive',

      'map.globalMap'])
  },
  mounted() {

    bus.$on('currentLocation', () => {
      this.globalMap.addLayer(this.userLocationCirc);
      this.globalMap.addLayer(this.userLocationPin);
      this.locActive = true;
    });

  },
  methods: {
    // updateOpacity(value){
    //   bus.$emit('stateBoundaryOpacity', (value/100))
    // },
    kmlLayerChange(entry){
      if(entry.active) {
        bus.$emit('addExisting', entry.name);
      }else {
        bus.$emit('RemoveLayer', entry.name);
      }
    },
    getLocation(){
      if(!this.locActive) {
        this.globalMap.on('locationfound', this.onLocationFound);
        this.globalMap.locate({setView: false, watch: false})
        this.locActive = true;
      }else {
        this.userLocationPin.remove();
        this.locActive = false;
      }
    },
    onLocationFound(e){
      this.userLocationPin = L.marker([e.latitude, e.longitude]).bindPopup('You are here').addTo(this.globalMap);
      // this.userLocationCirc = L.circle([e.latitude, e.longitude], e.accuracy / 2, {
      //   weight: 1,
      //   color: 'blue',
      //   fillColor: '#cacaca',
      //   fillOpacity: 0.2
      // }).addTo(this.globalMap);
      // console.log(userLocationPin, userLocationCirc);
      this.globalMap.off('locationfound');

    },
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
      this.kmlFile = event.target.files[0];
    },
    submitFile(){
      var fileName = this.kmlFile['name'];
      function getExtension(filename) {
        var parts = filename.split('.');
        return parts[parts.length - 1];
      }
      var uploadUrl;
      var ext = getExtension(fileName);
      if(ext == 'kmz'){
        uploadUrl = '/geogateway_django_app/kmz_upload/'
      }else {
        uploadUrl = '/geogateway_django_app/kml_upload/'
      }
      let formData = new FormData();
      formData.append('file', this.kmlFile);
      this.kmlLayers.push({name: fileName, active: true})
      axios.post( uploadUrl, formData
      ).then(function(response){
        bus.$emit('addkmlUploadLayer', response.data, fileName);
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
.fileEntry {
  width: auto;
  height: auto;
  box-sizing: border-box;
  font-size: 15px;
  border-radius: 8px;
  background-color: #8494A3;
  margin-bottom: 5px;
}
</style>
