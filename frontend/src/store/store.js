import Vue from 'vue';
import Vuex from 'vuex';
// import L from "leaflet";
// import L from "leaflet";

import { getField, updateField } from 'vuex-map-fields';
Vue.use(Vuex);

// setters: { ... },
// getters: { ... }


// const moduleB = {
//     state: () => ({ ... }),
//     mutations: { ... },
//     actions: { ... }
// }

export const store = new Vuex.Store({
    state: {
        mapTools: {
            ucerfUrlGrey: "https://raw.githubusercontent.com/GeoGateway/GeoGatewayStaticResources/master/kmz/ucerf3_grey.kml",
            ucerfUrlBlack: "https://raw.githubusercontent.com/GeoGateway/GeoGatewayStaticResources/master/kmz/ucerf3_black.kml",
            ucerfUrlRed: "https://raw.githubusercontent.com/GeoGateway/GeoGatewayStaticResources/master/kmz/ucerf3_red.kml",
            ucerfUrlYellow: "https://raw.githubusercontent.com/GeoGateway/GeoGatewayStaticResources/master/kmz/ucerf3_yellow.kml",
            boundariesUrl: 'https://raw.githubusercontent.com/GeoGateway/GeoGatewayStaticResources/master/kmz/gz_2010_us_040_00_20m.kml',
            coastsUrl: 'https://raw.githubusercontent.com/GeoGateway/GeoGatewayStaticResources/master/kmz/ne_50m_coastline.kml',
            ucerf: false,
            boundaries: false,
            coasts: false,
            kml: false,
            kmlFile: null,
            selected: 'grey',
            value: 50,
            kmlLayers: [],
        },
        uavsar: {
            overview: false,
            flight_path: '',
            lat_lon: '',
            uavsarLayers: [],
            layerFound: false,
            selDesel: false,
            LosPlotAvailable: false,
            extendedColor: '',
            extendedBorder: '',
            extendingActive: false,
            lat1: '',
            lat2: '',
            lon1: '',
            lon2: '',
            losLength: '',
            azimuth: '',
            activePlot: '',
            csv_final: '',
            activeEntry: null,
            opVal: 50,
            uid: '',
            uavsarLayersFiltered: [],
            activeQuery: false,
            geomEntries: [],
            path: '',
            sortBy: 'sortBy',
            uavsarHighResLayer: null,
            uavsarDisplayedLayers: [],
            plottingMarker1: null,
            plottingMarker2: null,
            plotLine: null,
            plotLat1: null,
            plotLon1: null,
            plotLat2: null,
            plotLon2: null,
            uavsarLatlon: null,
        },
        map: {
            uavsarEntry: null,
            globalMap: null,
            drawControl: null,
            uavsarLegend: null,
            plotActive: false,
            layers: {
                'ucerfL': null,
                'woForecastL': null,
                'caForecastL': null,
                'boundariesL': null,
                'coastsL': null,
                'gdacsL': null,
                'gnssPlotPt': null,
                'nowcastL': null,
                'usgs_layer': null,
                'markerLayer': null,
                'kmlUpload': null,
                'nowcastLayer': null,
                'uavsarWMS': null,
                'uavsarOverlay': null,
                'highResUavsar': null,
                'disloc': null,
            },
        },
        gnss: {
            selected: [],
            kmltype_sel: 'getvelocities',
            gs_latitude: '',
            gs_longitude: '',
            gs_width: '',
            gs_height: '',
            gs_epoch: '',
            gs_epoch1: '',
            gs_epoch2: '',
            gs_refsite: '',
            gs_scale: '',
            gs_ctwin: '',
            gs_ptwin: '',
            gs_dwin1: '',
            gs_dwin2: '',
            gs_outputprefix: '',
            kmlData: '',
            gs_eon: '',
            gs_vabs: '',
            ranLayers: [],
            activeLayers: [],
            markerSize: false,
            layersActive: false,
            horizUrl: '',
            vertUrl: '',
        },
        seismicity: {
            day: false,
            week: false,
            month: false,
            mFilter: '',
            dFilter: '',
            minLat: '32.0',
            minLon: '-130.0',
            maxLat: '35.0',
            maxLon: '-110.0',
            startDate: '2020-05-24',
            startTime: '00:00:00',
            endDate: '2020-06-23',
            endTime: '00:00:00',
            minMag: '3.0',
            maxMag: '10.0',
            iconScale: '1',
            selected: null,
        },
        nowcast: {
            ucerfL: false,
            woLayer: false,
            caLayer: false,
            gdacsL: false,
            ucerfUrl: "https://raw.githubusercontent.com/GeoGateway/GeoGatewayStaticResources/master/kmz/ucerf3_black.kml",
            p_name: '',
            lat: '',
            lon: '',
        },
        mmcalc: {
            mm_length: 249,
            mm_width: 120.0,
            mm_slip: 23,
            mm_shear: 3,
            SM: null,
            MM: null,
        },
        mapSaves: {
            saves: [],
        }
    },
    mutations: {
        addKmlLayer(state, layer) {
            state.mapTools.kmlLayers.push(layer);
        },
        updateField
    },
    getters: {
        getField
    }
});



//
// export const store = new Vuex.Store({
//     modules: moduleA,
//     state: {
//         maptools: {
//             ucerfUrlGrey: "https://raw.githubusercontent.com/GeoGateway/GeoGatewayStaticResources/master/kmz/ucerf3_grey.kml",
//             ucerfUrlBlack: "https://raw.githubusercontent.com/GeoGateway/GeoGatewayStaticResources/master/kmz/ucerf3_black.kml",
//             ucerfUrlRed: "https://raw.githubusercontent.com/GeoGateway/GeoGatewayStaticResources/master/kmz/ucerf3_red.kml",
//             ucerfUrlYellow: "https://raw.githubusercontent.com/GeoGateway/GeoGatewayStaticResources/master/kmz/ucerf3_yellow.kml",
//             boundariesUrl: 'https://raw.githubusercontent.com/GeoGateway/GeoGatewayStaticResources/master/kmz/gz_2010_us_040_00_20m.kml',
//             coastsUrl: 'https://raw.githubusercontent.com/GeoGateway/GeoGatewayStaticResources/master/kmz/ne_50m_coastline.kml',
//             ucerf: false,
//             boundaries: false,
//             coasts: false,
//             kml: false,
//             kmlFile: null,
//             selected: 'grey',
//             value: 50,
//             kmlLayers: [],
//         },
//         uavsar: {
//             overview: false,
//             flight_path: '',
//             lat_lon: '',
//             layers: [],
//             extendedColor: '',
//             extendedBorder: '',
//             layerFound: false,
//             selDesel: false,
//             LosPlot: false,
//             lat1: '',
//             lat2: '',
//             lon1: '',
//             lon2: '',
//             losLength: '',
//             azimuth: '',
//             activePlot: '',
//             csv_final: '',
//             activeEntry: null,
//             opVal: 50,
//             uid: '',
//             filteredLayers: [],
//             path: '',
//             activeRating: '',
//             sortBy: 'null',
//             activeQuery: false,
//             geomEntries: [],
//         },
//         map: {
//             map: null,
//             drawToolShow: false,
//             layers: {
//                 'ucerfL': null,
//                 'woForecastL': null,
//                 'caForecastL': null,
//                 'boundariesL': null,
//                 'coastsL': null,
//                 'gdacsL': null,
//                 'gnssPlotPt': null,
//                 'nowcastL': null,
//                 'usgs_layer': null,
//                 'markerLayer': null,
//                 'kmlUpload': null,
//                 'nowcastLayer': null,
//                 'uavsarWMS': null,
//                 'uavsarOverlay': null,
//                 'highResUavsar': null,
//                 'disloc': null,
//             },
//             kmlLayers: [],
//             gnssV: [],
//             gnssH: [],
//             uavsarLayers: new Map(),
//             plottingMarker1: null,
//             plottingMarker2: null,
//             plotLine: null,
//             plotActive: false,
//             startIcon: new L.Icon({
//                 iconUrl: 'https://raw.githubusercontent.com/Concept211/Google-Maps-Markers/master/images/marker_blueA.png',
//                 iconSize: [25, 41],
//                 iconAnchor: [12, 41],
//                 popupAnchor: [1, -34],
//                 shadowSize: [41, 41]
//             }),
//             endIcon: new L.Icon({
//                 iconUrl: 'https://raw.githubusercontent.com/Concept211/Google-Maps-Markers/master/images/marker_redB.png',
//                 iconSize: [25, 41],
//                 iconAnchor: [12, 41],
//                 popupAnchor: [1, -34],
//                 shadowSize: [41, 41]
//             }),
//             uavsarLegend: null,
//             plotLat1: null,
//             plotLon1: null,
//             plotLat2: null,
//             plotLon2: null,
//             uavsarLatlon: null,
//             uavsarEntry: null,
//             usgsLegend: null,
//             drawControl: null,
//             centerLat: null,
//             centerLng: null,
//             maxLat: null,
//             maxLon: null,
//             minLat: null,
//             minLon: null,
//
//         }
//
//     },
//     mutations: {
//         addUavsarLayer(layer){
//             store.state.uavsar.layers.push(layer);
//             store.state.uavsar.filteredLayers.push(layer);
//         },
//         updateGeomEntries(entries){
//           store.state.uavsar.geomEntries = entries;
//         },
//         updateActiveUavsarQuery(active){
//           store.state.uavsar.activeQuery = active;
//         },
//         showUavsarOverview(show){
//           store.state.uavsar.overview = show;
//         },
//     }
//     // }
// });
