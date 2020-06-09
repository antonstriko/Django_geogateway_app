<template>

 <div id="GNSS-panel">

  <div class="container-fluid" >
   <div class="col-11" style="align-content: center" >
    <h2 style="text-align: center">GPS Data Analysis</h2>
    <form id="gpsservice" method="post">
     <div class="form-group ">
      <label class="control-label requiredField">
       Select GPS data
      </label>
      <div class="form-group">
       <!-- <label for="sel1">Select list:</label> -->
       <select class="form-control" v-model="selected" id="kmltype_sel">
        <option value='getvelocities'>Velocities</option>
        <option value='getcoseismic'>Coseismic</option>
        <option value='getpostseismic'>Postseismic</option>
        <option value='getdisplacement'>Displacement</option>
        <option value='getmodel'>Model</option>
       </select>
      </div>
     </div>
     <div class="form-group ">
      <b-button variant="outline-primary" id="sp_windowpicker" class="btn btn-light">
       <b-icon-pencil></b-icon-pencil>Draw an area on map</b-button>
      <br/>
      <br/>

      <div class="input-group">
       <b-input-group prepend="Latitude">
        <b-form-input v-model="text" placeholder="1 degree" id="gs_latitude"></b-form-input>
       </b-input-group>
      </div>
      <div class="input-group">
       <b-input-group prepend="Longitude">
        <b-form-input v-model="text" placeholder="1 degree" id="gs_longitude"></b-form-input>
       </b-input-group>
      </div>
      <div class="input-group">
       <b-input-group prepend="Width">
        <b-form-input v-model="text" placeholder="1 degree" id="gs_width"></b-form-input>
       </b-input-group>
      </div>
      <div class="input-group">
       <b-input-group prepend="Height">
        <b-form-input v-model="text" placeholder="1 degree" id="gs_height"></b-form-input>
       </b-input-group>
      </div>
      <div class="input-group" id="epoch_show" v-if="this.selected === 'getcoseismic' || this.selected === 'getpostseismic'">
       <b-input-group prepend="Epoch">
        <b-form-input v-model="text" placeholder="YYYY-MM-DD" id="gs_epoch"></b-form-input>
       </b-input-group>
      </div>
      <div class="input-group" id="epoch1_show" v-if="this.selected === 'getdisplacement' || this.selected === 'getmodel'">
       <b-input-group prepend="Epoch 1">
        <b-form-input v-model="text" placeholder="YYYY-MM-DD" id="gs_epoch1"></b-form-input>
       </b-input-group>
      </div>
      <div class="input-group" id="epoch2_show" v-if="this.selected === 'getdisplacement' || this.selected === 'getmodel'">
       <b-input-group prepend="Epoch 2">
        <b-form-input v-model="text" placeholder="YYYY-MM-DD" id="gs_epoch2"></b-form-input>
       </b-input-group>
      </div>
      <div class="input-group">
       <b-input-group prepend="Ref. Site">
        <b-form-input v-model="text" placeholder="4-letter code" id="gs_refsite"></b-form-input>
        <b-input-group-append>
         <b-button variant="outline-primary" href="https://sideshow.jpl.nasa.gov/post/tables/table2.html" target="_blank">Stations</b-button>
        </b-input-group-append>
       </b-input-group>
      </div>
      <div class="input-group">
        <b-input-group prepend="Scale">
        <b-form-input v-model="text" placeholder="320 mm/yr/deg" id="gs_scale"></b-form-input>
       </b-input-group>
      </div>
      <div class="input-group" id="ctwin_show" v-if="this.selected === 'getcoseismic' || this.selected === 'getpostseismic'">
       <b-input-group prepend="Coseismic Win.">
        <b-form-input v-model="text" id="gs_ctwin" name="ctwin" placeholder="0.1 years"></b-form-input>
       </b-input-group>
      </div>
      <div class="input-group" id="ptwin_show" v-if="this.selected === 'getpostseismic' ">
       <b-input-group prepend="Postseismic Win.">
        <b-form-input v-model="text" id="gs_ptwin" name="ptwin" placeholder="2 years"></b-form-input>
       </b-input-group>
      </div>
      <div class="input-group" id="dwin1_show" v-if="this.selected === 'getdisplacement'">
       <b-input-group prepend="Av. Win. 1">
        <b-form-input v-model="text" id="gs_dwin1" name="dwin1" placeholder="10 days"></b-form-input>
       </b-input-group>
      </div>
      <div class="input-group" id="dwin2_show" v-if="this.selected === 'getdisplacement'">
       <b-input-group prepend="Av. Win. 2">
        <b-form-input v-model="text" id="gs_dwin2" name="dwin2" placeholder="10 days"></b-form-input>
       </b-input-group>
      </div>
      <div class="input-group">
        <b-input-group prepend="Output Prefix">
        <b-form-input v-model="text" id="gs_outputprefix" name="outputprefix"></b-form-input>
       </b-input-group>
      </div>
      <div class="checkbox">
       <label class="checkbox">
        <input name="vabs" type="checkbox" id="gs_vabs" value=""/>
        Display absolute verticals
       </label>
      </div>
      <div class="checkbox">
       <label class="checkbox">
        <input name="mon" type="checkbox" id="gs_mon" value=""/>
        Minimize marker size
       </label>
      </div>
      <div class="checkbox">
       <label class="checkbox">
        <input name="mon" type="checkbox" id="gs_eon" value=""/>
        Include error ellipses
       </label>
      </div>
     </div>
     <div class="form-group">
      <div>
       <button class="btn btn-primary " id="gs_submit" name="submit" type="submit" onclick="rungpsservice()">        Run
       </button>
      </div>
     </div>
    </form>
    <div id="gpsservice_results"></div>
    <div><strong>Data source: <a href="https://sideshow.jpl.nasa.gov/post/series.html" target="_blank">GNSS Time Series</a></strong></div>
   </div>

  </div>
 </div>


</template>

<script>
 export default {
  name: "GNSS-tools",
  data() {
   return {
    selected: []
   }
  },
  methods: {
   rungpsservice(){
    console.log()
   },
  },
  computed: {
   GNSS() {
    return this.$store.state.GNSS;
   },
  },
 }
</script>

<style scoped>
 #GNSS-panel {
  overflow: auto;
  height: auto;
 }
</style>