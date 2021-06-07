<template>
  <div id="tab-window">
    <div>

      <h3 style="text-align: center">GNSS Data Analysis</h3>
      <label class="control-label requiredField">
        Select GNSS data models
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

        <b-button variant="dark" id="sp_windowpicker" class="btn btn-light" @click="gnssDrawRect()">
          <b-icon-pencil></b-icon-pencil> Draw an area on map</b-button>
        <b-button variant="warning" id="clearGnss" @click="clearGnss()"><b-icon-trash></b-icon-trash> Clear GNSS Layers</b-button>
        <br/>

        <div v-if="geometryActive" >
          <br/>
          <b-button variant="warning" @click="drawListenerOff">
            <b-icon-x-circle></b-icon-x-circle>Cancel Selection</b-button>
          <br/>
        </div>
        <br>
        <b-input-group>
          <template #prepend><b-input-group-text ><strong>Center Latitude</strong></b-input-group-text></template>
          <b-form-input v-model="gs_latitude"  name="gs_latitude" type="text" required></b-form-input>
        </b-input-group>

        <b-input-group>
          <template #prepend><b-input-group-text ><strong>Center Longitude</strong></b-input-group-text></template>
          <b-form-input v-model="gs_longitude" placeholder="" name="gs_longitude"></b-form-input>
        </b-input-group>

        <b-input-group>
          <template #prepend><b-input-group-text ><strong>Longitude Span</strong></b-input-group-text></template>
          <b-form-input v-model="gs_width"  name="gs_width" placeholder="in degree"></b-form-input>
        </b-input-group>

        <b-input-group>
          <template #prepend><b-input-group-text ><strong>Latitude Span</strong></b-input-group-text></template>
          <b-form-input v-model="gs_height" placeholder="in degree" name="gs_height"></b-form-input>
        </b-input-group>

        <div class="input-group" id="epoch_show" v-if="this.kmltype_sel === 'getcoseismic' || this.kmltype_sel === 'getpostseismic'">
          <b-input-group>
            <template #prepend><b-input-group-text ><strong>Epoch</strong></b-input-group-text></template>
            <b-form-input v-model="gs_epoch" placeholder="YYYY-MM-DD" name="gs_epoch"></b-form-input>
          </b-input-group>
        </div>

        <b-input-group  v-if="this.kmltype_sel === 'getdisplacement' || this.kmltype_sel === 'getmodel'">
            <template #prepend><b-input-group-text ><strong>Epoch 1</strong></b-input-group-text></template>
          <b-form-input v-model="gs_epoch1" placeholder="YYYY-MM-DD" name="gs_epoch1"></b-form-input>
        </b-input-group>

        <b-input-group  v-if="this.kmltype_sel === 'getdisplacement' || this.kmltype_sel === 'getmodel'">
            <template #prepend><b-input-group-text ><strong>Epoch 2</strong></b-input-group-text></template>
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
        <b-col class="miscOptions">
          <b-row class="checkbox" style="text-align: left" v-if="this.kmltype_sel === 'getdisplacement'">
            <label class="checkbox" >
              <input v-model="gs_analysisCenter" name="analysisCenter" type="checkbox" id="gs_analysisCenter"/>
              Use NGL data
            </label>
          </b-row>
          <b-row class="checkbox" style="text-align: left">
            <label class="checkbox" >
              <input v-model="markerSize" name="vabs" type="checkbox" id="markerSize"/>
              Minimize Marker Size
            </label>
          </b-row>
          <b-row class="checkbox" style="text-align: left">
            <label class="checkbox">
              <input v-model="gs_vabs" name="vabs" type="checkbox" id="gs_vabs" value= ""/>
              Display absolute verticals
            </label>
          </b-row>
          <b-row class="checkbox" style="text-align: left">
            <label class="checkbox">
              <input v-model="gs_eon" name="mon" type="checkbox" id="gs_eon" value=""/>
              Include error ellipses
            </label>
          </b-row>
          <b-row>
            <button  class="btn btn-success" id="gs_submit" name="submit" type="submit" v-on:click.prevent="rungpsservice()">        Run
            </button>
          </b-row>
          <br />
          <b-row>
            <div style="float: left; text-align: left"><strong>Data source: <br/><a href="https://sideshow.jpl.nasa.gov/post/series.html" target="_blank">GNSS Time Series</a></strong></div>
          </b-row>
        </b-col>

        <b-col >
          <br>
          <div class="outputLayers" v-if="gnssLayers.length!==0 && !activeGnssQuery">
            <strong>Outputs</strong>
            <div  v-for="layer in gnssLayers" :key="layer.name">
              <div v-if="layer.type !== 'table.txt'" ><input type="checkbox" :value="layer.active" v-model="layer.active" @change="showHideLayers(layer.active, layer)"> <span class="checkbox-label"> <a :href="layer.url">{{layer.pre}} {{layer.type}}</a> </span> </div>
              <div v-else><a target="_blank" :href="layer.url">{{layer.pre}}  {{layer.type}}</a></div>
            </div>
          </div>

        </b-col>



      </form>
      <div v-if="activeGnssQuery" style="overflow: hidden">
        <br/>
        <b-spinner variant="success" label="Spinning"></b-spinner>
      </div>
      <br/>



    </div>

  </div>


</template>

<script>

import {bus} from '@/main'
import axios from 'axios'
import { mapFields } from 'vuex-map-fields';
import L from "leaflet";

export default {

  name: "GNSS-tools",
  data() {
    return {

    }
  },
  computed: {
    ...mapFields([
      'gnss.selected',
      'gnss.kmltype_sel',
      'gnss.gs_latitude',
      'gnss.gs_longitude',
      'gnss.gs_width',
      'gnss.gs_height',
      'gnss.gs_epoch',
      'gnss.gs_epoch1',
      'gnss.gs_epoch2',
      'gnss.gs_refsite',
      'gnss.gs_scale',
      'gnss.gs_ctwin',
      'gnss.gs_ptwin',
      'gnss.gs_dwin1',
      'gnss.gs_dwin2',
      'gnss.gs_outputprefix',
      'gnss.kmlData',
      'gnss.gs_eon',
      'gnss.gs_vabs',
      'gnss.gs_analysisCenter',
      'gnss.ranLayers',
      'gnss.activeLayers',
      'gnss.markerSize',
      'gnss.layersActive',
      'gnss.activeGnssQuery',
      'gnss.geometryActive',
        'gnss.gnssLayers',

        'map.drawControl',
        'map.globalMap',
        'map.layers',
    ])

  },
  mounted() {
    bus.$on('gnssDrawQuery', (maxLat, minLon, minLat, maxLon, centerLat, centerLng) =>
        this.setRect(maxLat, minLon, minLat, maxLon, centerLat, centerLng));
  },

  methods: {
    showHideLayers(active, layer){
      let name = layer.pre + layer.type;
        if(active){
          this.globalMap.addLayer(this.layers[name])
        }else {
          this.globalMap.removeLayer(this.layers[name]);
        }

      },

    validate_model_parameters() {
      // check parameters
      let valid = true;
      if (this.gs_latitude == "" || this.gs_longitude == "") {
        valid = false;
      }
      if (this.gs_width == "" || this.gs_height == "") {
        valid = false;
      }
      
      return valid;
    },

    rungpsservice(){
      var vm = this;
      if (!vm.validate_model_parameters()) {
        alert("Missing required parameters!");
        return;
      }
      this.activeGnssQuery = true;
      var fileNameH, fileNameV, fileNameT, folder, props;
      //var markerSize = this.markerSize;
      var verticalUrl, horizontalUrl, tableUrl;
      var prefix = this.gs_outputprefix;
      if(this.kmltype_sel === ''){
        alert("Please select as least one plot!");
      }
      else {

        for(var i = 0;i<this.gnssLayers.length;i++){
          var splitPrefix = this.gnssLayers[i].name.split('_')[0];
          if(splitPrefix === this.gs_outputprefix){
            alert('There is already an existing query with that name, please rename and resubmit')
            return;
          }
        }
        // this.layerCheckbox = true;
        if (this.gs_analysisCenter == true) {this.gs_analysisCenter = "NGL";} else { this.gs_analysisCenter = "";}
        const baseURI = '/geogateway_django_app/gps_service'
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
            "vabs": this.gs_vabs,
            "analysisCenter": this.gs_analysisCenter,
            //
          }
        })
            //use JSON results (filename and folder) to request raw kml text
            .then(function (response) {
              //console.log(response.data);
              props = response.data;
              // not a valid object
              if (!(typeof props === 'object')) {
                vm.activeGnssQuery = false;
                alert("Somthing wrong, please check input paramters!");
                return;
              }
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
                }else if(ext == 'table.txt'){
                  tableUrl = props.urls[i];
                  fileNameT = props.results[i];
                }
              }

              folder = props.folder;
              prefix = (1 + Math.floor(vm.gnssLayers.length/3)).toString() + prefix;
              vm.gnssLayers.push({
                pre: prefix,
                name: fileNameT,
                folder: folder,
                active: true,
                url: tableUrl,
                type: 'table.txt',
              })
              vm.gnssLayers.push({
                pre: prefix,
                name: fileNameH,
                folder: folder,
                active: true,
                url: horizontalUrl,
                type: 'horizontal.kml',
              })
              vm.gnssLayers.push({
                pre: prefix,
                name: fileNameV,
                folder: folder,
                active: true,
                url: verticalUrl,
                type: 'vertical.kml',
              })
              const kmlURI = '/geogateway_django_app/get_kml'
              axios.get(kmlURI, {
                params: {
                  "file": fileNameH,
                  "folder": folder
                },
                responseType: 'text',
                //emit raw kml text to parent map component
              }).then(function (response) {
                // console.log(toGeoJSON.kml(response.data));
                let hName = prefix + 'horizontal.kml';
                vm.addGnssLayer(response.data, hName);

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
                let vName = prefix + 'vertical.kml';
                vm.addGnssLayer(response.data, vName);
                //console.log(markerSize)
                vm.activeGnssQuery = false;
              })
            }).catch(function(error) {
              console.log("somthing wrong");
              return Promise.reject(error);
            })
        this.layersActive = true;
      }

    },
    addGnssLayer(file, type) {
      this.kmlText(file, type);
    },
    kmlText(text, layerName) {
      const parser = new DOMParser();
      const kml = parser.parseFromString(text, 'text/xml');
      this.layers[layerName] = new L.KML(kml);
      this.globalMap.addLayer(this.layers[layerName]);

    },
    drawToolbar() {
      this.geometryActive = true;

      new L.Draw.Rectangle(this.globalMap, this.drawControl.options.rectangle).enable();

      this.drawListener('gnss');
    },
    gnssDrawRect(){
      this.geometryActive = true;
      let vm = this;
      vm.rectDraw = new L.Draw.Rectangle(vm.globalMap, vm.drawControl.options.rectangle);
      vm.rectDraw.enable();
      vm.globalMap.on('draw:created', function (e) {
        var type = e.layerType;
        if (type === 'rectangle') {
          var layer = e.layer;
          vm.globalMap.addLayer(layer);
          vm.centerLat = layer.getCenter().lat;
          vm.centerLng = layer.getCenter().lng;
          vm.maxLat = layer.getLatLngs()[0][1].lat;
          vm.maxLon = layer.getLatLngs()[0][2].lng;
          vm.minLat = layer.getLatLngs()[0][3].lat;
          vm.minLon = layer.getLatLngs()[0][0].lng;
          vm.globalMap.removeLayer(layer)
          vm.rectDraw = null;
          bus.$emit('gnssDrawQuery', vm.maxLat, vm.minLon, vm.minLat, vm.maxLon, vm.centerLat, vm.centerLng)
          vm.geometryActive = false;
        }});

    },
    drawListenerOff(){
      this.geometryActive = false;

      this.rectDraw.disable();
    },
    clearGnss(){
      this.layersActive = false;
      for(var i = 0; i < this.gnssLayers.length; i++){
        let curr = this.gnssLayers[i];
        if(curr.type !== 'table.txt') {
          let name = curr.pre + curr.type;
          this.globalMap.removeLayer(this.layers[name]);
        }
      }
      this.gnssLayers = [];
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

.input-group {
  width: 100%;
}
strong {
  color: #343a40;
}

.miscOptions {
  float: left;
  width: 50%;
}

.outputLayers {
  margin-left: 55%;
  font-size: 14px;
  width: 40%;
  border: 2px solid #416c41;
  box-sizing: border-box;
  border-radius: 0px;
  background-color: #bad7ff;
  text-align: left;
  margin-right: auto;
  padding: 10px;
  position: absolute;

}
a:link ,a:visited {
  color: black;
  background-color: transparent;
  text-decoration: underline;
}
</style>
