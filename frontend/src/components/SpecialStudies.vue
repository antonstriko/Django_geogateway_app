<template>
    <div class="tab-window">
        <h3>Special Studies</h3>
        <hr>
        <div align="left">     
            <input
            type="checkbox"
            v-model="woolseyfire"
            id="woolseyfire"
            ><label for="woolseyfire"><strong>Southern California Woolsey Fire</strong></label>
            <br/>
            <div id="woof_table" v-show="this.woolseyfire">
                <p>Southern California's Woolsey Fire on Nov. 15 observed with UAVSAR</p>
                <table >     		
                    <tr><td><input type="checkbox" id="woof_0" value=0 v-model="woof_checkbox"><label for="woof_0">Woolsey fire perimeter (11-18-2018)</label></td></tr>
                    <tr><td><input type="checkbox" id="woof_1" value=1 v-model="woof_checkbox"><label for="woof_1">Hill fire perimeter (11-12-2018)</label></td></tr>
                    <tr><td><input type="checkbox" id="woof_2" value=2 v-model="woof_checkbox"><label for="woof_2">UAVSAR Correlation Image 1</label></td></tr>
                    <tr><td><input type="checkbox" id="woof_3" value=3 v-model="woof_checkbox"><label for="woof_3">UAVSAR Correlation Image 2</label></td></tr>
                </table>
                Experimental products: JPL/Caltech/GeoGateway
            </div>
            
            <input
            type="checkbox"
            v-model="wildfire"
            id="wildfire"
            @change="loadwildfire"
            ><label for="wildfire"><strong>Wildfire and debris flows</strong></label>
            <br/>
            <div id="wilf_table" v-show="this.wildfire">
                <p>Montecito debris flows observed with UAVSAR</p>
                <table >     		
                    <tr><td><input type="checkbox" id="wilf_0" value=0 v-model="wilf_checkbox" @change="updatewilf('0')"><label for="wilf_0" >UAVSAR enchanced image pair (Nov-2-2017, Feb-5-2018) Orange</label></td></tr>
                    <tr><td><input type="checkbox" id="wilf_1" value=1 v-model="wilf_checkbox" @change="updatewilf('1')"><label for="wilf_1">UAVSAR enchanced image coherence (Feb-5-2018) Purple</label></td></tr>
                    <tr><td><input type="checkbox" id="wilf_2" value=2 v-model="wilf_checkbox" @change="updatewilf('2')"><label for="wilf_2">Rapid estimation/change detection with optical images (Dec-28-2017, Jan-13-2018)</label></td></tr>
                </table>
                Experimental products: JPL/Caltech/GeoGateway
            </div>
        </div>
    </div>
</template>

<script>
import {bus} from '../main'
import { mapFields } from 'vuex-map-fields';
import axios from "axios";
axios.defaults.xsrfHeaderName = 'X-CSRFToken';

    export default {
        name: "SpecialStudies",
        data: function() {
            return {
                woolseyfire:false,
                woof_checkbox:[],
                wildfire:false,
                wilfurls:["https://raw.githubusercontent.com/GeoGateway/GeoGatewayStaticResources/master/kmz/wildfire_ModifiedUAVSAR.kml",
                    "https://raw.githubusercontent.com/GeoGateway/GeoGatewayStaticResources/master/kmz/wildfire_ModifiedCorrelation.kml",
                    "https://raw.githubusercontent.com/GeoGateway/GeoGatewayStaticResources/master/kmz/wildfire_NIT_result.kml"
                    ],
                wilf_checkbox:[],
            };
        },
          computed: {
            ...mapFields([
                'map.globalMap',
            ])
        },
        methods: {
            loadwildfire() {
                if (this.wildfire) {
                    this.globalMap.setView([34.457,-119.61328],13);
                    this.wilf_checkbox.push("0");
                    this.updatewilf("0");
                }
                else {
                    var i = this.wilf_checkbox.length;
                    while (i--) {
                        var code = this.wilf_checkbox[i];
                        this.wilf_checkbox.splice(i,1);
                        this.updatewilf(code);
                    }
                }
            },
            updatewilf(val) {
                var vp = parseInt(val);
                var wlayerName = 'wilf'+val+"L";
                if(this.wilf_checkbox.includes(val)) {
                    bus.$emit('UrlAddLayer', this.wilfurls[vp], wlayerName);
                }else bus.$emit('RemoveLayer', wlayerName);
            },
        },

    }
</script>

<style scoped>

table {
  border-collapse: collapse;
  border: 1px solid black;
  width: 100%;
}

td {
  text-align: left;
  padding: 2px;
}

label {
  padding: 5px;
}

</style>
