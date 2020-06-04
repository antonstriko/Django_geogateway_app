import Vue from 'vue';
import Vuex from 'vuex';
// import L from "leaflet";

Vue.use(Vuex);

export const store = new Vuex.Store({
    state: {
        // mymap : L.map('map').setView([51.505, -0.09], 3),
        mapTools: {
            ucerf: false,
            kml: false,
            boundaries: false,
            coasts: false,
        }

    },
    // getters :{
    //     getMap : state => {
    //         return state.mymap;
    //     },
    // }
});
