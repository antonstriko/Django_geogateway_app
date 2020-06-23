import Vue from 'vue';
import App from './App.vue';
import {BootstrapVue, BootstrapVueIcons} from 'bootstrap-vue';
import {store} from './store/store';
// import axios from 'axios';
import router from './router';
import 'leaflet/dist/leaflet.css';
import "leaflet-kml"

Vue.use(BootstrapVue);
Vue.use(BootstrapVueIcons);

Vue.config.productionTip = false;
Vue.config.devtools = true;

import 'leaflet/dist/leaflet.css';
import VueResource from 'vue-resource';

Vue.use(VueResource);
// Vue.prototype.$http = axios;
Vue.http.options.emulateJSON = true;


export const bus = new Vue();

new Vue({
  store: store,
  router,
  render: h => h(App),
}).$mount('#app');
