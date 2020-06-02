<template>
  <div id="map">
    <l-map :zoom="zoom" :center="center">
      <l-tile-layer :url="url" :attribution="attribution"></l-tile-layer>
      <l-marker :lat-lng="marker"></l-marker>
    </l-map>
  </div>
</template>

<script>
  import { Icon } from 'leaflet';

  delete Icon.Default.prototype._getIconUrl;
  Icon.Default.mergeOptions({
    iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
    iconUrl: require('leaflet/dist/images/marker-icon.png'),
    shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
  });

  import L from 'leaflet';
  import { LMap, LTileLayer, LMarker } from 'vue2-leaflet';
  export default {
    name: 'MyMap',
    components: {
      LMap,
      LTileLayer,
      LMarker,

    },
    data() {
      return {
        zoom: 13,
        center: L.latLng(39.172649, -86.523476),
        url: 'http://{s}.tile.osm.org/{z}/{x}/{y}.png',
        attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors',
        marker: L.latLng(39.172649, -86.523476),
      }
    }
  };
</script>
<style scoped>
  #map {
    top: 4.4%;
    height: 96%;
    width: 100%;
    /*make the width relative or keep toolbar same size?*/


    /*position: fixed;*/

  }
</style>
