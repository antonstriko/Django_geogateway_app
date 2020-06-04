import Vue from 'vue';
import App from './App.vue';
import {BootstrapVue, BootstrapVueIcons} from 'bootstrap-vue';
import {store} from './store/store';

Vue.use(BootstrapVue);
Vue.use(BootstrapVueIcons);

Vue.config.productionTip = false;
Vue.config.devtools = true;

import 'leaflet/dist/leaflet.css';




new Vue({
  store: store,
  render: h => h(App),
}).$mount('#app');
