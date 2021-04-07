<template>
    <div>
        <!-- save some space
        <h3>3D Imaging</h3>
        <hr>
        -->
        <div align="left">
            <input
            type="checkbox"
            v-model="ridgecrest"
            id="ridgecrest"
            ><label for="ridgecrest"><small><strong>Postseismic Products of Ridgecrest Earthquake</strong></small></label>
            <br/>
            <div id="ridgecrest_div" v-show="this.ridgecrest">
                <p>High-Resolution Targeted 3D imaging Postseismic Products of the Ridgecrest M6.4 (July 4, 2019) and M7.1 (July 5, 2019) Earthquake Sequence. 
                    Collected by Andrea Donnellan and Gregory Lyzenga<a href="https://appliedsciences.nasa.gov/our-impact/news/nasa-geogateway-team-uses-drones-map-3d-2019-california-earthquakes-ruptures" target=_>&nbsp;more</a>
                <br/>The point clouds (in LAZ format) are released with <a target=_  href="https://doi.org/10.1785/0220190274">research article</a>.
                </p>
                     <center><strong>M 6.4 products</strong></center>
             <table class="uavsar-table">
                 <tr class="uavar-tr"><td>2019/07/09</td>
                     <td><a target=_ href="http://gf2.ucs.indiana.edu/stage/Ridgecrest_2019/data/RC20190709C_group1_densified_point_cloud.laz">Point Cloud</a></td>
            <!--
            <td><a target=_ href="http://gf2.ucs.indiana.edu/stage/Ridgecrest_2019/M64_20190709/RC20190709_transparent_mosaic_group1.tif">GeoTiff</a></td> -->
            <td><a target=_ href="http://gf2.ucs.indiana.edu/stage/Ridgecrest_2019/data/RC20190709C_dsm_2cm.laz">2cm DSM</a></td>
            <!--
            <td><a target=_ href="http://gf2.ucs.indiana.edu/stage/Ridgecrest_2019/M64_20190709/RC20190709_dsm.tif">GeoTiff</a></td> -->
                     <td><a href="http://gf2.ucs.indiana.edu/stage/Ridgecrest_2019/data/RC20190709C_report.pdf" target=_>Report</a></td></tr>

                 <tr class="uavar-tr"><td>2019/07/11</td>
                     <td><a target=_ href="http://gf2.ucs.indiana.edu/stage/Ridgecrest_2019/data/RC20190711C_group1_densified_point_cloud.laz">Point Cloud</a></td>
            <!--
            <td><a target=_ href="http://gf2.ucs.indiana.edu/stage/Ridgecrest_2019/M64_20190711/RC20190711_transparent_mosaic_group1.tif">GeoTiff</a></td> -->
            <td><a target=_ href="http://gf2.ucs.indiana.edu/stage/Ridgecrest_2019/data/RC20190711C_dsm_2cm.laz">2cm DSM</a></td>
            <!--
              <td><a target=_ href="http://gf2.ucs.indiana.edu/stage/Ridgecrest_2019/data/RC20190711_dsm.tif">GeoTiff</a></td> -->

                     <td><a href="http://gf2.ucs.indiana.edu/stage/Ridgecrest_2019/data/RC20190711C_report.pdf" target=_>Report</a></td></tr>
                  <tr class="uavar-tr"><td>2019/07/15</td>
                    <td><a target=_ href="http://gf2.ucs.indiana.edu/stage/Ridgecrest_2019/data/RC20190715C_group1_densified_point_cloud.laz">Point Cloud</a></td>
          <!--
          <td><a target=_ href="http://gf2.ucs.indiana.edu/stage/Ridgecrest_2019/M64_20190715/RC20190715_transparent_mosaic_group1.tif">GeoTiff</a></td> -->
          <td><a target=_ href="http://gf2.ucs.indiana.edu/stage/Ridgecrest_2019/data/RC20190715C_dsm_2cm.laz">2cm DSM</a></td>
          <!-- <td><a target=_ href="http://gf2.ucs.indiana.edu/stage/Ridgecrest_2019/M64_20190715/RC20190715_dsm.tif">GeoTiff</a></td> -->

                      <td><a href="http://gf2.ucs.indiana.edu/stage/Ridgecrest_2019/data/RC20190715C_report.pdf" target=_>Report</a></td></tr>
          
          <tr class="uavar-tr"><td>2019/07/22</td>
          <td><a target=_ href="http://gf2.ucs.indiana.edu/stage/Ridgecrest_2019/data/RC20190722C_group1_densified_point_cloud.laz">Point Cloud</a></td>
          <!-- <td><a target=_ href="http://gf2.ucs.indiana.edu/stage/Ridgecrest_2019/M64_20190722/RC20190722_transparent_mosaic_group1.tif">GeoTiff</a></td> -->
          <td><a target=_ href="http://gf2.ucs.indiana.edu/stage/Ridgecrest_2019/data/RC20190722C_dsm_2cm.laz">2cm DSM</a></td>
          <!-- <td><a target=_ href="http://gf2.ucs.indiana.edu/stage/Ridgecrest_2019/M64_20190722/RC20190722_dsm.tif">GeoTiff</a></td> -->
      <td><a href="http://gf2.ucs.indiana.edu/stage/Ridgecrest_2019/data/RC20190722C_report.pdf" target=_>Report</a></td></tr>

       <tr class="uavar-tr"><td>2019/08/08</td>
          <td><a target=_ href="http://gf2.ucs.indiana.edu/stage/Ridgecrest_2019/data/RC20190808C_group1_densified_point_cloud.laz">Point Cloud</a></td>
          <!-- <td><a target=_ href="http://gf2.ucs.indiana.edu/stage/Ridgecrest_2019/M64_20190722/RC20190722_transparent_mosaic_group1.tif">GeoTiff</a></td> -->
          <td><a target=_ href="http://gf2.ucs.indiana.edu/stage/Ridgecrest_2019/data/RC20190808C_dsm_2cm.laz">2cm DSM</a></td>
          <!-- <td><a target=_ href="http://gf2.ucs.indiana.edu/stage/Ridgecrest_2019/M64_20190722/RC20190722_dsm.tif">GeoTiff</a></td> -->
      <td><a href="http://gf2.ucs.indiana.edu/stage/Ridgecrest_2019/data/RC20190808C_report.pdf" target=_>Report</a></td></tr>

       <tr class="uavar-tr"><td>2019/09/27</td>
          <td><a target=_ href="http://gf2.ucs.indiana.edu/stage/Ridgecrest_2019/data/RC20190927C_group1_densified_point_cloud.laz">Point Cloud</a></td>
          <!-- <td><a target=_ href="http://gf2.ucs.indiana.edu/stage/Ridgecrest_2019/M64_20190722/RC20190722_transparent_mosaic_group1.tif">GeoTiff</a></td> -->
          <td><a target=_ href="http://gf2.ucs.indiana.edu/stage/Ridgecrest_2019/data/RC20190927C_dsm_2cm.laz">2cm DSM</a></td>
          <!-- <td><a target=_ href="http://gf2.ucs.indiana.edu/stage/Ridgecrest_2019/M64_20190722/RC20190722_dsm.tif">GeoTiff</a></td> -->
      <td><a href="http://gf2.ucs.indiana.edu/stage/Ridgecrest_2019/data/RC20190927C_report.pdf" target=_>Report</a></td></tr>

                      <tr class="uavar-tr"><td colspan=2><a target=_ href="http://gf2.ucs.indiana.edu/stage/Ridgecrest_2019/KMLOverview/M64_products_overview.kmz">Products overview (kmz)</a></td>
                      <td colspan=2><a target=_ href="http://156.56.174.162/earthquake/RC20190709.html"><strong>View Point Clouds</strong></a></td>
                    </tr>
            </table>
   
                            <br><center><strong>M 7.1 products</strong></center>
             <table class="uavsar-table">
                 <tr class="uavar-tr"><td>2019/07/09</td>
                     <td><a target=_ href="http://gf2.ucs.indiana.edu/stage/Ridgecrest_2019/data/SVRL20190709C_group1_densified_point_cloud.laz">Point Cloud</a></td>
            <!--<td><a target=_ href="http://gf2.ucs.indiana.edu/stage/Ridgecrest_2019/M71_20190709/SVRL20190709_transparent_mosaic_group1.tif">GeoTiff</a></td>-->
            <td><a target=_ href="http://gf2.ucs.indiana.edu/stage/Ridgecrest_2019/data/SVRL20190709C_dsm_2cm.laz">2cm DSM</a></td>
            <!-- <td><a target=_ href="http://gf2.ucs.indiana.edu/stage/Ridgecrest_2019/M71_20190709/SVRL20190709_dsm.tif">GeoTiff</a></td> -->
                     <td><a href="http://gf2.ucs.indiana.edu/stage/Ridgecrest_2019/data/SVRL20190709C_report.pdf" target=_>Report</a></td></tr>

                 <tr class="uavar-tr"><td>2019/07/11</td>
                     <td><a target=_ href="http://gf2.ucs.indiana.edu/stage/Ridgecrest_2019/data/SV20190711C_group1_densified_point_cloud.laz">Point Cloud</a></td>
            <!--<td><a target=_ href="http://gf2.ucs.indiana.edu/stage/Ridgecrest_2019/M71_20190711/SV20190711_transparent_mosaic_group1.tif">GeoTiff</a></td>-->
            <td><a target=_ href="http://gf2.ucs.indiana.edu/stage/Ridgecrest_2019/data/SV20190711C_dsm_2cm.laz">2cm DSM</a></td>
            <!-- <td><a target=_ href="http://gf2.ucs.indiana.edu/stage/Ridgecrest_2019/M71_20190711/SV20190711_dsm.tif">GeoTiff</a></td>-->

                     <td><a href="http://gf2.ucs.indiana.edu/stage/Ridgecrest_2019/data/SV20190711C_report.pdf" target=_>Report</a></td></tr>

                  <tr class="uavar-tr"><td>2019/07/15</td>
                    <td><a target=_ href="http://gf2.ucs.indiana.edu/stage/Ridgecrest_2019/data/SV20190715C_group1_densified_point_cloud.laz">Point Cloud</a></td>
          <!--<td><a target=_ href="http://gf2.ucs.indiana.edu/stage/Ridgecrest_2019/M71_20190715/SV20190715_transparent_mosaic_group1.tif">GeoTiff</a></td> -->
          <td><a target=_ href="http://gf2.ucs.indiana.edu/stage/Ridgecrest_2019/data/SV20190715C_dsm_2cm.laz">2cm DSM</a></td>
          <!--<td><a target=_ href="http://gf2.ucs.indiana.edu/stage/Ridgecrest_2019/M71_20190715/SV20190715_dsm.tif">GeoTiff</a></td> -->
                      <td><a href="http://gf2.ucs.indiana.edu/stage/Ridgecrest_2019/data/SV20190715C_report.pdf" target=_>Report</a></td></tr>

            <tr class="uavar-tr"><td>2019/07/22</td>
          <td><a target=_ href="http://gf2.ucs.indiana.edu/stage/Ridgecrest_2019/data/SV20190722C_group1_densified_point_cloud.laz">Point Cloud</a></td>
          <!--<td><a target=_ href="http://gf2.ucs.indiana.edu/stage/Ridgecrest_2019/M71_20190715/SV20190715_transparent_mosaic_group1.tif">GeoTiff</a></td> -->
          <td><a target=_ href="http://gf2.ucs.indiana.edu/stage/Ridgecrest_2019/data/SV20190722C_dsm_2cm.laz">2cm DSM</a></td>
          <!--<td><a target=_ href="http://gf2.ucs.indiana.edu/stage/Ridgecrest_2019/M71_20190715/SV20190715_dsm.tif">GeoTiff</a></td> -->
              <td><a href="http://gf2.ucs.indiana.edu/stage/Ridgecrest_2019/data/SV20190722C_report.pdf" target=_>Report</a></td></tr>

            <tr class="uavar-tr"><td>2019/08/08</td>
          <td><a target=_ href="http://gf2.ucs.indiana.edu/stage/Ridgecrest_2019/data/SV20190808C_group1_densified_point_cloud.laz">Point Cloud</a></td>
          <!--<td><a target=_ href="http://gf2.ucs.indiana.edu/stage/Ridgecrest_2019/M71_20190715/SV20190715_transparent_mosaic_group1.tif">GeoTiff</a></td> -->
          <td><a target=_ href="http://gf2.ucs.indiana.edu/stage/Ridgecrest_2019/data/SV20190808C_dsm_2cm.laz">2cm DSM</a></td>
          <!--<td><a target=_ href="http://gf2.ucs.indiana.edu/stage/Ridgecrest_2019/M71_20190715/SV20190715_dsm.tif">GeoTiff</a></td> -->
              <td><a href="http://gf2.ucs.indiana.edu/stage/Ridgecrest_2019/data/SV20190808C_report.pdf" target=_>Report</a></td></tr>

            <tr class="uavar-tr"><td>2019/09/27</td>
          <td><a target=_ href="http://gf2.ucs.indiana.edu/stage/Ridgecrest_2019/data/SV20190927C_group1_densified_point_cloud.laz">Point Cloud</a></td>
          <!--<td><a target=_ href="http://gf2.ucs.indiana.edu/stage/Ridgecrest_2019/M71_20190715/SV20190715_transparent_mosaic_group1.tif">GeoTiff</a></td> -->
          <td><a target=_ href="http://gf2.ucs.indiana.edu/stage/Ridgecrest_2019/data/SV20190927C_dsm_2cm.laz">2cm DSM</a></td>
          <!--<td><a target=_ href="http://gf2.ucs.indiana.edu/stage/Ridgecrest_2019/M71_20190715/SV20190715_dsm.tif">GeoTiff</a></td> -->
              <td><a href="http://gf2.ucs.indiana.edu/stage/Ridgecrest_2019/data/SV20190927C_report.pdf" target=_>Report</a></td></tr>

                      <tr class="uavar-tr"><td colspan=2><a target=_ href="http://gf2.ucs.indiana.edu/stage/Ridgecrest_2019/KMLOverview/M71_products_overview.kmz">Products overview (kmz)</a></td>
                      <td colspan=2><a target=_ href="http://156.56.174.162/earthquake/SV20190711.html"><strong>View Point Clouds</strong></a></td>
                      </tr>
            </table>
              <a target=_ href="http://gf2.ucs.indiana.edu/stage/Ridgecrest_2019/animation/M7.1RAB4v2.gif"><strong>View Animated Gif</strong></a> <br>

            </div>

        </div>
    </div>
</template>

<script>
    export default {
        name: "ThreeDImaging",
        data: function() {
            return {
                ridgecrest:false
            }
        }
    }
</script>

<style scoped>
label {
  padding: 5px;
}
p {
  font-size: 15px;
}
table {
  border-collapse: collapse;
  border: 1px solid black;
  width: 100%;
}

</style>
