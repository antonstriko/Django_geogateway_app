<template>
    <div class="tab-window">
        <h3>Special Studies</h3>
        <hr>
        <div align="left">     
            <input
            type="checkbox"
            v-model="woolseyfire"
            id="woolseyfire"
            @change="loadwoolfire"
            ><label for="woolseyfire"><strong>Southern California Woolsey Fire</strong></label>
            <br/>
            <div id="woof_table" v-show="this.woolseyfire">
                <p>Southern California's Woolsey Fire on Nov. 15 observed with UAVSAR</p>
                <table >     		
                    <tr><td><input type="checkbox" id="woof_0" value=0 v-model="woof_checkbox" @change="updatewoof('0')"><label for="woof_0"><a target="_blank" href="https://raw.githubusercontent.com/GeoGateway/GeoGatewayStaticResources/master/kmz/CAVNC-091023_WOOLSEY_11-18-2018_55900_AM.kmz">Woolsey fire perimeter (11-18-2018)</a></label></td></tr>
                    <tr><td><input type="checkbox" id="woof_1" value=1 v-model="woof_checkbox" @change="updatewoof('1')"><label for="woof_1"><a target="_blank" href="https://raw.githubusercontent.com/GeoGateway/GeoGatewayStaticResources/master/kmz/CAVNC-090993_Hill_11-12-2018_91400_PM.kmz">Hill fire perimeter (11-12-2018)</a></label></td></tr>
                    <tr><td><input type="checkbox" id="woof_2" value=2 v-model="woof_checkbox" @change="updatewoof('2')"><label for="woof_2"><a target="_blank" href="http://gf2.ucs.indiana.edu/stage/CA_Fires/SanAnd_08525_18076-003_18083-003_0036d_s01_L090HH_01.cor.tiff">UAVSAR Correlation Image 1 (geotiff)</a></label></td></tr>
                    <tr><td><input type="checkbox" id="woof_3" value=3 v-model="woof_checkbox" @change="updatewoof('3')"><label for="woof_3"><a target="_blank" href="http://gf2.ucs.indiana.edu/stage/CA_Fires/SanAnd_26526_18080-006_18083-000_0011d_s01_L090HH_01.cor.tiff">UAVSAR Correlation Image 2 (geotiff)</a></label></td></tr>
                </table>
                <small>Experimental products: JPL/Caltech/GeoGateway</small>
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
                    <tr><td><input type="checkbox" id="wilf_0" value=0 v-model="wilf_checkbox" @change="updatewilf('0')"><label for="wilf_0" ><a target="_blank" href="https://raw.githubusercontent.com/GeoGateway/GeoGatewayStaticResources/master/kmz/wildfire_ModifiedUAVSAR.kmz">UAVSAR enchanced image pair (Nov-2-2017, Feb-5-2018) Orange</a></label></td></tr>
                    <tr><td><input type="checkbox" id="wilf_1" value=1 v-model="wilf_checkbox" @change="updatewilf('1')"><label for="wilf_1"><a target="_blank" href="https://raw.githubusercontent.com/GeoGateway/GeoGatewayStaticResources/master/kmz/wildfire_ModifiedCorrelation.kmz">UAVSAR enchanced image coherence (Feb-5-2018) Purple</a></label></td></tr>
                    <tr><td><input type="checkbox" id="wilf_2" value=2 v-model="wilf_checkbox" @change="updatewilf('2')"><label for="wilf_2"><a target="_blank" href="https://raw.githubusercontent.com/GeoGateway/GeoGatewayStaticResources/master/kmz/wildfire_NIT_result.kmz">Rapid change detection with optical images (Dec-28-2017/Jan-13-2018)</a></label></td></tr>
                </table>
                <small>Experimental products: JPL/Caltech/GeoGateway</small>
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
                woofurls: ["https://raw.githubusercontent.com/GeoGateway/GeoGatewayStaticResources/master/kmz/CAVNC-091023_WOOLSEY_11-18-2018_55900_AM.kml",
                           "https://raw.githubusercontent.com/GeoGateway/GeoGatewayStaticResources/master/kmz/CAVNC-090993_Hill_11-12-2018_91400_PM.kml",
                           "https://raw.githubusercontent.com/GeoGateway/GeoGatewayStaticResources/master/kmz/SanAnd_08525_18076-003_18083-003_0036d_s01_L090HH_01.cor.kml",
                           "https://raw.githubusercontent.com/GeoGateway/GeoGatewayStaticResources/master/kmz/SanAnd_26526_18080-006_18083-000_0011d_s01_L090HH_01.cor.kml"
                    ],
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
            
            loadwoolfire() {
                if (this.woolseyfire) {
                    this.globalMap.setView([34.14773,-118.84833],10);
                    this.woof_checkbox.push("0");
                    this.updatewoof("0");
                    this.woof_checkbox.push("1");
                    this.updatewoof("1");
                }
                else {
                    var i = this.woof_checkbox.length;
                    while (i--) {
                        var code = this.woof_checkbox[i];
                        this.woof_checkbox.splice(i,1);
                        this.updatewoof(code);
                    }
                }
            },
        
            
            // update woolseyfire
            updatewoof(val) {
                var vp = parseInt(val);
                var wlayerName = 'wool'+val+"L";
                if(this.woof_checkbox.includes(val)) {
                    bus.$emit('UrlAddLayer', this.woofurls[vp], wlayerName);
                }else bus.$emit('RemoveLayer', wlayerName);
            },

            
            loadwildfire() {
                if (this.wildfire) {
                    this.globalMap.setView([34.440,-119.61328],13);
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

a:link, a:visited {
  color: black;
  text-decoration: underline;
  display: inline-block;
}
</style>
