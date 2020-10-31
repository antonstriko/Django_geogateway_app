import Vue from 'vue';
import App from './App.vue';
import {BootstrapVue, BootstrapVueIcons} from 'bootstrap-vue';
import MapTools from "./components/MapTools";
import GNSS from './components/GNSS'
import MMCalc from "./components/MMCalc";
import Nowcast from "./components/Nowcast";
import Seismicity from "./components/Seismicity";
import Saves  from "./components/Saves";
import UAVSAR from "./components/UAVSAR";
import report from "./components/report";
import help from "./components/help";
import Disloc from "./components/Disloc";
import VueRouter from 'vue-router'
import 'leaflet/dist/leaflet.css';
import "leaflet-kml"
import {store} from "./store/store";

Vue.use(VueRouter);
Vue.use(BootstrapVue);
Vue.use(BootstrapVueIcons);

export const bus = new Vue();

Vue.config.productionTip = false;
Vue.config.devtools = true;

import 'leaflet/dist/leaflet.css';
import VueResource from 'vue-resource';



const routes = [
  {name: 'maptools', path: '/maptools', component: MapTools },
  { path: '/gnss', component: GNSS },
  { path: '/momentmagnitude', component: MMCalc },
  { path: '/nowcast', component: Nowcast },
  { path: '/seismicity', component: Seismicity },
  { path: '/disloc', component: Disloc },
  { path: '/mapsaves', component: Saves },
  { path: '/uavsar', component: UAVSAR },
  { path: '/report', component: report },
  { path: '/help', component: help },

]


const router = new VueRouter({
  routes,
})
Vue.use(VueResource);
// Vue.prototype.$http = axios;
Vue.http.options.emulateJSON = true;




// initialize router

new Vue({
  router,
  store: store,
  render: h => h(App),
}).$mount('#app');
