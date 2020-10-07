<template>
    <div id="map-window">
        <link rel="stylesheet" href="https://unpkg.com/leaflet@1.6.0/dist/leaflet.css"
              integrity="sha512-xwE/Az9zrjBIphAcBb3F6JVqxf46+CDLwfLMHloNu6KEQCAWi6HcDUbeOfBIptF7tcCzusKFjFw2yuvEpDL9wQ=="
              crossorigin=""/>
        <TopNav/>
        <ToolBar/>
        <DraggableDiv class="col-11" v-if="plotActive" id="plot-window">
            <template slot="header">
                <p style="color: #e6e6ff">LOS Plot</p>
            </template>
            <template slot="main" >
                <div id="dygraph-LOS"></div>
            </template>

        </DraggableDiv>
        <!--        <div v-if="plotActive" class="plot-window">-->
        <!--            <div id="los-header"><h4>LOS Plot</h4></div>-->
        <!--            <div id="dygraph-LOS"></div>-->
        <!--        </div>-->

        <div id="map">
        </div>
        <b-button id="clearMap" @onclick="resetMap">
            Clear Map
        </b-button>

    </div>
</template>

<script>

    import 'leaflet/dist/leaflet.css';
    import L from 'leaflet';
    import 'leaflet-kml'
    import ToolBar from "./ToolBar";
    import TopNav from "./TopNav";
    import {bus} from '../main'
    import 'leaflet-draw'
    import "leaflet-draw/dist/leaflet.draw.css";

    import {circleMaker, gdacsPopup, popupMaker} from '../assets/mapMethods'
    import Dygraph from "dygraphs";
    import DraggableDiv from "./DraggableDiv";
    import 'leaflet-kmz';
    // import axios from "axios";
    // import GeometryUtil from 'leaflet-geometryutil'

    export default {
        name: 'MyMap',
        components: {
            ToolBar,
            TopNav,
            DraggableDiv,
        },
        data() {
            return {
                map: null,
                drawToolShow: false,
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
                kmlLayers: [],
                gnssV: [],
                gnssH: [],
                uavsarLayers: [],
                plottingMarker1: null,
                plottingMarker2: null,
                plotLine: null,
                plotActive: false,
                startIcon: new L.Icon({
                    iconUrl: 'https://raw.githubusercontent.com/Concept211/Google-Maps-Markers/master/images/marker_blueA.png',
                    iconSize: [25, 41],
                    iconAnchor: [12, 41],
                    popupAnchor: [1, -34],
                    shadowSize: [41, 41]
                }),
                endIcon: new L.Icon({
                    iconUrl: 'https://raw.githubusercontent.com/Concept211/Google-Maps-Markers/master/images/marker_redB.png',
                    iconSize: [25, 41],
                    iconAnchor: [12, 41],
                    popupAnchor: [1, -34],
                    shadowSize: [41, 41]
                }),
                uavsarLegend: null,
                plotLat1: null,
                plotLon1: null,
                plotLat2: null,
                plotLon2: null,
                uavsarLatlon: null,
                uavsarEntry: null,
                usgsLegend: null,
                drawControl: null,
                centerLat: null,
                centerLng: null,
                maxLat: null,
                maxLon: null,
                minLat: null,
                minLon: null,


            };
        },
        props: {},
        mounted() {

            //create layers
            this.map = L.map('map').setView([51.505, -0.09], 3);
            this.tileLayer();

            var legend2 = L.control({position: 'bottomleft'});
            legend2.onAdd = function () {
                var div = L.DomUtil.create('div', 'info legend2');
                div.innerHTML = '<img src="https://raw.githubusercontent.com/GeoGateway/geogateway-portal/master/html/images/logos/logo_black.png" style="height: 30px; width: 82px">';
                return div;
            };
            legend2.addTo(this.map);

            var drawnItems = new L.FeatureGroup();
            this.map.addLayer(drawnItems);
            this.drawControl = new L.Control.Draw({
                draw: {
                    polygon: false,
                    marker: false,
                    polyline: false,
                    circle: false,
                    rectangle: false,
                    circlemarker: false,
                },
                edit: {
                    featureGroup: drawnItems
                }
            });
            this.map.addControl(this.drawControl);
            this.map.addLayer(drawnItems);

            bus.$on('UrlAddLayer', (url, layerName) =>
                this.kmlUrl(url, layerName));

            bus.$on('TextAddLayer', (text, layerName) =>
                this.kmlText(text, layerName));

            bus.$on('drawToolbar', () =>
                this.drawToolbar());

            bus.$on('addExisting', (layerName) =>
                this.map.addLayer(this.layers[layerName]));

            //convert to above abstracted event listener

            bus.$on('gnssLayer', (text, type, markerSize) =>
                this.gnssGeoJson(text, type, markerSize));

            bus.$on('RemoveLayer', (name) =>
                this.map.removeLayer(this.layers[name]));

            bus.$on('nowcast', (data, lat, lon) =>
                this.seismicityPlots(data, lat, lon));

            bus.$on('filterCat', (text, dFilter, mFilter, iconScale, startDate, endDate) =>
                this.catalogFilter(text, dFilter, mFilter, iconScale, startDate, endDate));

            bus.$on('addGeoJson', (text, layer) =>
                this.addGeoJson(text, layer));

            bus.$on('gdacsGeoJSON', (text) =>
                this.addGdacsLayers(text));

            bus.$on('saveMapState', () =>
                this.saveState());

            bus.$on('displaySave', (layers) =>
                this.displaySave(layers));

            bus.$on('clearSaveLayer', (layers) =>
                this.clearSave(layers));

            bus.$on('UAVSAR_overview', () => {
                this.uavsarOverview();
            });

            bus.$on('deactivateUavsar', () =>
                this.deactivateUavsar());


            bus.$on('uavsarKMLs', (results) =>
                this.uavsarOverlay(results));

            bus.$on('reactivateUavsarLayer', (name) =>
                this.reactivateUavsarLayer(name));

            bus.$on('removeUavsarLayer', (name) =>
                this.removeUavsarLayer(name))

            bus.$on('uavsarWMS', (layer, latlon) =>
                this.uavsarWMS(layer, latlon));

            // this.map.on('click', (e) =>
            //     this.mapListener(e));

            bus.$on('updatePlotLine', (entry) =>
                this.updatePlotLine(entry));
            bus.$on('activatePlot', (csv_final) =>
                this.showPlot(csv_final));
            bus.$on('hidePlot', () =>
                this.hidePlot());
            bus.$on('showPlotDiv', () =>
                this.showPlotDiv());
            bus.$on('resetUavsar', () => {
                this.resetUavsar();
            });
            bus.$on('changeLayerOpacity', (value) =>
                this.changeUavsarOpacity(value));
            bus.$on('FormUpdatePlotLine', (activeEntry, lat1, lon1, lat2, lon2, azimuth, losLength) =>
                this.updatePlotLineForm(activeEntry, lat1, lon1, lat2, lon2, azimuth, losLength));
            bus.$on('placePlotMarkers', (southwest, northeast, clickloc, latlon, entry) =>
                this.placePlotMarkers(southwest, northeast, clickloc, latlon, entry));
            bus.$on('RemovePlotPtGnss', () =>
                this.removePlotGnss());
            bus.$on('ClearUsgs', () =>
                this.clearUsgsLayers());
            bus.$on('addkmlUploadLayer', (file, filename) =>
                this.addkmlUploadLayer(file, filename));
            bus.$on('addGnssLayer', (file, type, prefix) =>
                this.addGnssLayer(file, type, prefix));
            bus.$on('uavsarRect', () =>
                this.uavsarDraw('rect'));
            bus.$on('dropPin', () =>
                this.uavsarDraw('point'));
            bus.$on('uavsarDraw', (shape) =>
                this.uavsarDraw(shape));
            bus.$on('seisDraw', () =>
                this.seismicityDraw());
            bus.$on('drawListenerOff', () =>
                this.map.off('draw:created'));
            bus.$on('gnssDraw', () =>
                this.gnssDraw());

        },


        methods: {
            resetMap(){
                this.map = null;
                this.map = new L.map('map').setView([51.505, -0.09], 3);
                this.tileLayer();
            },
            uavsarDraw(shape){
                if(shape == 'rect'){
                    new L.Draw.Rectangle(this.map, this.drawControl.options.rectangle).enable();
                }else if(shape == 'point'){
                    new L.Draw.Marker(this.map, this.drawControl.options.marker).enable();
                }

                this.drawListener('uavsar');
            },
            seismicityDraw(){
                new L.Draw.Rectangle(this.map, this.drawControl.options.rectangle).enable();

                this.drawListener('seismicity');
            },
            gnssDraw(){
                new L.Draw.Rectangle(this.map, this.drawControl.options.rectangle).enable();

                this.drawListener('gnss');
            },
            drawListener(tool){
                this.map.on('draw:created', function (e) {
                    var type = e.layerType;
                    if (type === 'rectangle') {
                        var layer = e.layer;
                        this.addLayer(layer);
                        this.centerLat = layer.getCenter().lat;
                        this.centerLng = layer.getCenter().lng;
                        this.maxLat = layer.getLatLngs()[0][1].lat;
                        this.maxLon = layer.getLatLngs()[0][2].lng;
                        this.minLat = layer.getLatLngs()[0][3].lat;
                        this.minLon = layer.getLatLngs()[0][0].lng;
                        this.removeLayer(layer)


                        if(tool === 'uavsar'){
                            bus.$emit('uavsarDrawQuery', this.maxLat, this.minLon, this.minLat, this.maxLon, this.centerLat, this.centerLng);
                        }else if(tool === 'seismicity'){
                            bus.$emit('seisDrawQuery', this.maxLat, this.minLon, this.minLat, this.maxLon, this.centerLat, this.centerLng);
                        }else if(tool === 'gnss'){
                            bus.$emit('gnssDrawQuery', this.maxLat, this.minLon, this.minLat, this.maxLon, this.centerLat, this.centerLng);
                        }

                        //control which tool hears bus event for drawing rect
                    } else if (type === 'marker') {
                        this.markerLayer = e.layer;
                        var lat = this.markerLayer.getLatLng().lat;
                        var lng = this.markerLayer.getLatLng().lng;
                        bus.$emit('markPlace', lat, lng, tool);
                    } else if (type === 'polygon') {
                        var placedPolygon = e.layer;
                        var arrLatLon = placedPolygon.getLatLngs();
                        bus.$emit('polyDrawn', arrLatLon);
                    }
                });

            },
            clearUsgsLayers() {
                this.layers['usgs_layer'].remove();
                this.layers['usgs_layer'] = null;
                this.usgsLegend.remove();
                this.usgsLegend = null;
            },
            showPlot(csv_final) {
                new Dygraph(
                    document.getElementById("dygraph-LOS"),
                    csv_final, {
                        drawPoints: true,
                        pointSize: 2,
                        strokeWidth: 0.0,
                        titleHeight: 20,
                        xLabelHeight: 16,
                        yLabelWidth: 16,
                        xlabel: 'Distance (km)',
                        ylabel: 'GRC (cm)'
                    }
                )

            },
            addkmlUploadLayer(file, filename) {
                function getExtension(f) {
                    var parts = f.split('.');
                    return parts[parts.length - 1];
                }

                var extension = getExtension(filename);
                if (extension == 'kmz') {
                    this.layers[filename] = L.kmzLayer(file);
                    this.map.addLayer(this.layers[filename]);
                } else {
                    this.kmlUrl(file, filename);
                }
            },
            changeUavsarOpacity(value) {
                this.layers['highResUavsar'].setOpacity(value);
            },
            //sets uavsar to overview mode
            resetUavsar() {
                this.plotActive = false;
                if (this.layers['highResUavsar'] !== null) {
                    this.removeLayer('highResUavsar');
                }
                for (var key in this.uavsarLayers) {
                    this.uavsarLayers[key].remove();
                }
                if (this.plottingMarker1 !== null) {
                    this.resetPlot();
                }
                if (this.uavsarLegend !== null) {
                    this.uavsarLegend.remove();
                }
            },
            deactivateUavsar() {
                if (this.uavsarLegend !== null) {
                    this.uavsarLegend.remove();
                }

                if (this.layers['uavsarWMS'] !== null) {
                    this.layers['uavsarWMS'].remove();
                }
                if (this.layers['uavsarOverlay'] !== null) {
                    this.layers['uavsarOverlay'].remove();
                }
                if (this.layers['highResUavsar'] !== null) {
                    this.layers['highResUavsar'].remove();
                }
            },
            showPlotDiv() {
                this.plotActive = true;
                this.$forceUpdate();
            },
            hidePlot() {
                this.plotActive = false
                if (this.plottingMarker1 !== null) {
                    this.resetPlot();
                }

            },
            resetPlot() {
                this.plottingMarker1.remove();
                this.plottingMarker2.remove();
                this.plotLine.remove();
                this.plottingMarker1 = null;
                this.plottingMarker2 = null;
                this.plotLine = null;
            },

            updatePlotLineForm(entry, lat1, lon1, lat2, lon2, az, len) {
                this.plottingMarker2.setLatLng([lat2, lon2]);
                this.plottingMarker1.setLatLng([lat1, lon1]);
                console.log(az, len);
                var latlon = [this.plottingMarker1.getLatLng().lat, this.plottingMarker1.getLatLng().lng, this.plottingMarker2.getLatLng().lat, this.plottingMarker2.getLatLng().lng]
                this.plotLine.setLatLngs([[lat1, lon1],
                    [lat2, lon2]]);
                bus.$emit('updatedPlot', latlon, entry)
            },

            //update LOS plotline when markers move or field entries are changed

            //plot sometimes doesn't show data when just updatePlotLine is used

            updatePlotLine(entry) {
                this.updatePlotLineForm(entry, this.plottingMarker1.getLatLng().lat, this.plottingMarker1.getLatLng().lng, this.plottingMarker2.getLatLng().lat, this.plottingMarker2.getLatLng().lng)
                // this.plotLine = L.polyline([this.plottingMarker1.getLatLng(), this.plottingMarker2.getLatLng()], {color: 'red'}).addTo(this.map)
                // var latlon = [this.plottingMarker1.getLatLng().lat, this.plottingMarker1.getLatLng().lng, this.plottingMarker2.getLatLng().lat, this.plottingMarker2.getLatLng().lng]
                // bus.$emit('updatedPlot', latlon, entry)
            },
            saveState() {
                bus.$emit('saved', this.layers);
            },
            displaySave(layers) {
                for (var key in layers) {
                    if (layers[key] !== null) {
                        this.map.addLayer(layers[key])
                    }
                }
            },
            markerClick(e) {
                var clickloc = e.latlng;

                var latlon = this.uavsarLatlon;
                var entry = this.uavsarEntry;

                var southwest = L.latLng(latlon[0][1], latlon[0][0]);
                var northeast = L.latLng(latlon[3][1], latlon[3][0]);

                var rect = L.latLngBounds(southwest, northeast);

                console.log(southwest, northeast, rect.contains(clickloc));

                bus.$emit('placePlotMarkers', southwest, northeast, clickloc, latlon, entry);
            },
            //UAVSAR plot tile layer (for use with dygraphs)
            uavsarWMS(entry, latlon) {
                if (this.uavsarLegend !== null) {
                    this.uavsarLegend.remove();
                }

                if (this.layers['highResUavsar'] !== null) {
                    this.map.removeLayer(this.layers['highResUavsar']);
                    this.layers['highResUavsar'] = null;
                }
                var baseURI = "http://js-168-89.jetstream-cloud.org/geoserver/InSAR/wms?"

                var layername = 'InSAR:' + 'uid' + entry.info['uid'] + '_unw'

                this.uavsarLatlon = latlon;
                this.uavsarEntry = entry;

                this.layers['highResUavsar'] = L.tileLayer.wms(baseURI, {
                    layers: layername,
                    transparent: true,
                    format: 'image/png',
                    zIndex: 2
                })


                // https://lh5.googleusercontent.com/proxy/f1YEx_QBYQtFSXw7QKtmGBQQWUYHZa6U1Zu0ktt3bgAwynGJ99sYdVksg1ItCmfeEsWCBy3EVSZYRvqVTgHEY9Kzji8=s0-d

                this.map.addLayer(this.layers['highResUavsar']);

                var baseUri = 'http://js-168-89.jetstream-cloud.org/uavsarlegend1/uid';

                var uidUri = entry.info['uid'] + '_unw_default.png';

                var finalUri = baseUri + uidUri;

                this.layers['highResUavsar'].setOpacity(.5)

                this.uavsarLegend = L.control({position: 'bottomleft'});
                this.uavsarLegend.onAdd = function () {
                    var div = L.DomUtil.create('div', 'uavsarLegend');
                    div.innerHTML = '<img src=' + finalUri + '>';
                    return div;
                };

                this.uavsarLegend.addTo(this.map)

                this.map.on('click', this.markerClick);


            },
            placePlotMarkers(southwest, northeast, clickloc, latlon, entry) {

                if (this.plottingMarker1 == null) {

                    // if(rect.contains(clickloc)) {

                    this.plotLat1 = clickloc.lat;
                    this.plotLon1 = clickloc.lng;

                    this.plotLat2 = latlon[2][1];
                    this.plotLon2 = latlon[2][0];

                    var factor = (this.plotLon2 - this.plotLon1) / 7;
                    this.plotLon2 = this.plotLon1 + factor;
                    this.plotLat2 = ((this.plotLat2 - this.plotLat1) / 5) + this.plotLat1


                    this.plottingMarker1 = L.marker([this.plotLat1, this.plotLon1],
                        {draggable: true, icon: this.startIcon});
                    // console.log(this.plottingMarker1)
                    this.plottingMarker2 = L.marker([this.plotLat2, this.plotLon2],
                        {draggable: true, icon: this.endIcon});

                    this.plotLine = L.polyline([this.plottingMarker1.getLatLng(), this.plottingMarker2.getLatLng()],
                        {color: 'red'});

                    this.plottingMarker1.addTo(this.map)
                    this.plottingMarker2.addTo(this.map)
                    this.plotLine.addTo(this.map)


                    this.plottingMarker1.on('dragend', function () {
                        bus.$emit('updatePlotLine', entry);
                    })

                    this.plottingMarker2.on('dragend', function () {
                        bus.$emit('updatePlotLine', entry);
                    })

                    this.plotActive = true;

                    this.map.off('click', this.markerClick);

                    // this.map.fitBounds([this.plotLat1, this.plotLon1], [this.plotLat2, this.plotLon2])

                    bus.$emit('getCSV', entry, [this.plotLat1, this.plotLon1, this.plotLat2, this.plotLon2]);
                }

            },
            clearSave(layers) {
                for (var key in layers) {
                    if (layers[key] !== null) {
                        this.map.removeLayer(layers[key]);
                    }
                }
            },
            removeUavsarLayer(name) {
                this.map.removeLayer(this.uavsarLayers[name]);
            },
            reactivateUavsarLayer(name) {
                this.map.addLayer(this.uavsarLayers[name]);
            },
            uavsarOverview() {

                this.layers['uavsarWMS'] = L.tileLayer.wms('http://gf8.ucs.indiana.edu/geoserver/InSAR/wms?', {
                        layers: 'InSAR:thumbnailmosaic',
                        transparent: true,
                        format: 'image/png',
                        zIndex: 2
                    }
                ).addTo(this.map);
                this.layers['uavsarWMS'].setOpacity(.7)

            },
            // high res plotting images + add map legend
            uavsarOverlay(entry) {
                if (this.layers['uavsarWMS']) {
                    this.removeLayer('uavsarWMS');
                }
                var id = entry.info['uid']
                let text = entry.kml;
                const parser = new DOMParser();
                const kml = parser.parseFromString(text, 'text/xml');
                this.uavsarLayers[id] = new L.KML(kml);
                this.map.addLayer(this.uavsarLayers[id]);


            },
            drawToolbar() {
                if (!this.drawToolShow) {
                    this.drawToolShow = true


                    //gets lat long width height of drawn rectangle and prints in console.
                    // TODO dynamically fill form input with results from drawn rectangle

                }
            },
            tileLayer() {
                L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}', {
                }).addTo(this.map);
            },
            kmlText(text, layerName) {
                const parser = new DOMParser();
                const kml = parser.parseFromString(text, 'text/xml');
                this.layers[layerName] = new L.KML(kml);
                this.map.addLayer(this.layers[layerName]);
                const bounds = this.layers[layerName].getBounds();
                this.map.fitBounds(bounds);

            },
            addGeoJson(text, layer) {
                this.layers[layer] = L.geoJSON(text, {}).addTo(this.map);
            },
            addGnssLayer(file, type, prefix) {
                this.kmlText(file, type.concat(prefix));

            },
            removePlotGnss() {
                console.log(this.layers['gnssPlotPt'].remove());
            },
            kmlUrl(url, layerName) {
                fetch(url).then(res => res.text())
                    .then(kmltext => {
                        const parser = new DOMParser();
                        var kml = parser.parseFromString(kmltext, "text/xml");
                        this.layers[layerName] = new L.KML(kml);
                        this.map.addLayer(this.layers[layerName]);
                        this.map.fitBounds(this.layers[layerName].getBounds());

                    });

            },

            removeLayer(layerName) {
                this.map.removeLayer(this.layers[layerName])
            },

            seismicityPlots(data, lat, lon) {
                var style = " style=width:200px;height:150px;"
                //fa-line-chart
                var latlng = L.latLng(lat, lon);
                this.layers['nowcastLayer'] = L.circleMarker(latlng, {
                    color: 'green',
                    fillColor: 'lightgreen',
                    radius: 10,
                }).addTo(this.map);

                var eps = data.urls[0]
                var numMag = data.urls[1]
                var seis = data.urls[2]

                //TODO make images clickable

                this.layers['nowcastLayer'].bindPopup("<img src=" + eps + style + " >" + "<br/>"
                    + "<img src=" + numMag + style + " >"
                    + "<img src=" + seis + style + " >");

                this.map.panTo(new L.latLng(lat, lon));
            },
            catalogFilter(text, dFilter, mFilter, iconScale, startDate, endDate) {
                var toFilterM;
                if (this.layers['usgs_layer'] != null) {
                    this.map.removeLayer(this.layers['usgs_layer'])
                }
                //Better way to do this?
                //To add depth filter (what feature property represents depth?)
                if (mFilter === '') {
                    toFilterM = () => true
                } else {
                    toFilterM = function (feature) {
                        return feature.properties.mag > parseInt(mFilter);
                    }
                }
                this.layers['usgs_layer'] = L.geoJSON(text, {
                    onEachFeature: function (feature, layer) {
                        //what properties of each feature are most important to display?
                        popupMaker(feature, layer);
                    },
                    filter: toFilterM,
                    pointToLayer: function (feature, layer) {
                        return circleMaker(feature, layer, iconScale, startDate, endDate);
                    }
                }).addTo(this.map)

                if (this.usgsLegend === null) {

                    this.usgsLegend = L.control({position: 'bottomleft'});
                    this.usgsLegend.onAdd = function () {
                        var div = L.DomUtil.create('div', 'usgsLegend');
                        div.innerHTML = '<img src="https://raw.githubusercontent.com/cosmic-tichy/GeoGatewayStaticResources/master/icons/color_gradient.jpg">';
                        return div;
                    };

                    this.usgsLegend.addTo(this.map);
                }
            },

            addGdacsLayers(text) {
                this.layers['gdacsL'] = L.geoJSON(text, {
                    onEachFeature: function (feature, layer) {
                        //what properties of each feature are most important to display?
                        gdacsPopup(feature, layer);
                    },
                    pointToLayer: function (feature) {
                        var gdacsIcon = L.icon({
                            iconUrl: feature.properties.iconitemlink,
                            iconSize: [30, 35],
                            iconAnchor: [15, 35],
                        });
                        var lat = feature.properties.latitude;
                        var lon = feature.properties.longitude;
                        return L.marker([lat, lon], {icon: gdacsIcon})
                    }
                }).addTo(this.map)
            },
        }
    }
</script>
<style scoped>
    #map {

        position: relative;
        height: 100%;
        /*z-index: 30000;*/
        width: auto;
        margin-left: auto;
        margin-bottom: auto;
        /*float: right;*/

    }

    #map-window {
        position: inherit;
        height: calc(100% - 125px);
        /*z-index: 30000;*/
        width: auto;
        padding: 0;
        /*float: right;*/
    }

    #clearMap {
        position: absolute;
        top: 140px;
        right: 20px;
        padding: 10px;
        z-index: 400;
    }

    .leaflet-draw-toolbar a {
        background-image: url('../assets/spritesheet.png');
        background-repeat: no-repeat;
        color: transparent !important;
    }

    /*.plot{*/
    /*    position: absolute;*/
    /*    height: 200px;*/
    /*    width: 500px;*/
    /*    z-index: 400;*/
    /*}*/
    #dygraph-LOS {
        height: 190px;
        width: 600px;
        margin-left: 90px;
        margin-bottom: 50px;
        border-color: #5cb85c;


    }


    #plot-window {
        position: absolute;
        z-index: 1500;
        background-color: #ccffcc;
        height: 250px;
        width: 725px;
        border-radius: 20px;
        border: solid #343a40;
        border-width: thick;
    }


</style>

