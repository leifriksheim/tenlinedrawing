import Vue from "vue";
import VueFire from "vuefire";
import firebase from "firebase";
import router from "./router";
import App from "./App";

Vue.use(VueFire);

const app = new Vue({
  el: "#app",
  router,
  render: h => h(App)
});
