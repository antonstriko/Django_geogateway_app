import Vue from 'vue';
import Vuex from 'vuex';
// import L from "leaflet";

Vue.use(Vuex);

export const store = new Vuex.Store({
    state: {
        globalLayers: {
          ucerf: null,
          kml: null,
          boundaries: null,
          coasts: null,
          gnss1: null,
          gnss2: null,
        },
        //layers all in one dict?
        mapToolsState: {
            ucerf: [false, "https://raw.githubusercontent.com/GeoGateway/GeoGatewayStaticResources/master/kmz/ucerf3_black.kml"],
            kml: [false, ''],
            boundaries: [false, 'https://raw.githubusercontent.com/GeoGateway/GeoGatewayStaticResources/master/kmz/gz_2010_us_040_00_20m.kml'],
            coasts: [false, 'https://raw.githubusercontent.com/GeoGateway/GeoGatewayStaticResources/master/kmz/ne_50m_coastline.kml'],
        },
        gnssState: {
            gnss1: [false, ''],
            gnss2: [false, ''],

        },
        drawToolBar: false,

    },
    mutations: {
        setkml (state, n){
            state.GNSS.formData.kmltype_sel = n;
        },
        setLat (state, n){
            state.GNSS.formData.gs_latitude = n;
        },
        setLng (state, n){
            state.GNSS.formData.gs_longitude = n;
        },
        setWidth (state, n){
            state.GNSS.formData.gs_width = n;
        },
        setHeight (state, n){
            state.GNSS.formData.gs_height = n;
        },
        setEp (state, n){
            state.GNSS.formData.gs_epoch = n;
        },
        setEp1 (state, n){
            state.GNSS.formData.gs_epoch1 = n;
        },
        setEp2 (state, n){
            state.GNSS.formData.gs_epoch2 = n;
        },
        setRef (state, n){
            state.GNSS.formData.gs_refsite = n;
        },
        setScale (state, n){
            state.GNSS.formData.gs_scale = n;
        },
        setCtwin (state, n){
            state.GNSS.formData.gs_ctwin = n;
        },
        setPtwin (state, n){
            state.GNSS.formData.gs_ptwin = n;
        },
        setDwin1 (state, n){
            state.GNSS.formData.gs_dwin1 = n;
        },
        setDwin2 (state, n){
            state.GNSS.formData.gs_dwin2 = n;
        },
        setPrefix (state, n){
            state.GNSS.formData.gs_outputprefix = n;
        },
         // gs_epoch: '',
         //        gs_epoch1: '',
         //        gs_epoch2: '',
         //        gs_refsite: '',
         //        gs_scale: '',
         //        gs_ctwin: '',
         //        gs_ptwin: '',
         //        gs_dwin1: '',
         //        gs_dwin2: '',
         //        gs_outputprefix: '',
         //        kmlData: '',}
    }
    // }
});
