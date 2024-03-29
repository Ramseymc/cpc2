// Polyfills
// import "core-js/stable";
// import "regenerator-runtime/runtime";

import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
// import vuetify from "./plugins/vuetify";
import VueNumericInput from "vue-numeric-input";
import moment from "vue-moment";

import VueMeta from "vue-meta";

import Tooltip from "vue-directive-tooltip";
import "vue-directive-tooltip/dist/vueDirectiveTooltip.css";
import 'material-design-icons-iconfont/dist/material-design-icons.css'

import VueCurrencyInput from "vue-currency-input";

Vue.use(VueCurrencyInput);
// import Vuetify from "vuetify/lib/framework";

import VueSignature from "vue-signature-pad";
Vue.use(VueSignature);

import VueSocialSharing from "vue-social-sharing";

Vue.use(VueSocialSharing);

import svgJs from "./plugins/vueSvgPlugin";

Vue.use(svgJs);

import VueNotify from "vuejs-notify";
Vue.use(VueNotify);

import VueHotkey from "v-hotkey";

Vue.use(VueHotkey);

// import VueDraggable from 'vue-draggable'

// Vue.use(VueDraggable)

// Vue.forceUpdate();

// Vue.use(vuetify)

Vue.use(Tooltip);

Vue.use(VueMeta, {
  // optional pluginOptions
  refreshOnceOnNavigation: true
});
// const tz = require("vue-moment-tz")

Vue.use(VueNumericInput);
Vue.use(moment);

Vue.config.productionTip = false;

import MyPlugin from "./plugins/myPlugins";
import vuetify from "./plugins/vuetify";
Vue.use(MyPlugin);

new Vue({
  router,
  store,
  vuetify,
  render: h => h(App)
}).$mount("#app");
