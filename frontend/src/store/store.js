import Vue from 'vue';
import Vuex from 'vuex';
// import L from "leaflet";

Vue.use(Vuex);

export const store = new Vuex.Store({
    state: {
        // mymap : L.map('map').setView([51.505, -0.09], 3),
        mapTools: {
            ucerf: [false, 'https://raw.githubusercontent.com/GeoGateway/GeoGatewayStaticResources/master/kmz/ucerf3_black.kml', null],
            kml: [false, ''],
            boundaries: [false, 'https://raw.githubusercontent.com/GeoGateway/GeoGatewayStaticResources/master/kmz/gz_2010_us_040_00_20m.kml', null],
            coasts: [false, 'https://raw.githubusercontent.com/GeoGateway/GeoGatewayStaticResources/master/kmz/ne_50m_coastline.kml', null],
        },
        layers: {

            boundariesLayer : null,
            coastsLayer : null,
        },
        GNSS: {
            velocities: false,
            coseismic: false,
            postseismic: false,
            displacement: false,
            model: false,

        }

    },
    // getters :{
    //     getMap : state => {
    //         return state.mymap;
    //     },
    // }
});
