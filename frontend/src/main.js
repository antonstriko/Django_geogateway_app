import Vue from 'vue';
import App from './App.vue';
import {BootstrapVue, BootstrapVueIcons} from 'bootstrap-vue';
import {store} from './store/store';

Vue.use(BootstrapVue);
Vue.use(BootstrapVueIcons);

Vue.config.productionTip = false;
Vue.config.devtools = true;

import { LMap, LTileLayer, LMarker } from 'vue2-leaflet';
import 'leaflet/dist/leaflet.css';

Vue.component('l-map', LMap);
Vue.component('l-tile-layer', LTileLayer);
Vue.component('l-marker', LMarker);



new Vue({
  store: store,
  render: h => h(App),
}).$mount('#app');
