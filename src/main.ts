import { createApp } from "vue";
import { createPinia } from "pinia";

import { MotionPlugin } from "@vueuse/motion";
import WrapBalancer from "vue-wrap-balancer";

import {
  RecycleScroller,
  DynamicScroller,
  DynamicScrollerItem,
  // @ts-ignore
} from "vue-virtual-scroller";
import { autoAnimatePlugin } from "@formkit/auto-animate/vue";
import piniaPluginPersistedstate from "pinia-plugin-persistedstate";
import VWave from "v-wave";

import App from "./App.vue";
import { router } from "./router";
import vTooltip from "./directives/vTooltip";

import "./assets/scss/index.scss";
import "vue-virtual-scroller/dist/vue-virtual-scroller.css";

const app = createApp(App);
const pinia = createPinia();
pinia.use(piniaPluginPersistedstate);

app.use(pinia);
app.use(router);
app.use(autoAnimatePlugin);
app.use(VWave);
app.use(MotionPlugin);

app.directive("tooltip", vTooltip);

app.component("RecycleScroller", RecycleScroller);
app.component("DynamicScroller", DynamicScroller);
app.component("DynamicScrollerItem", DynamicScrollerItem);
app.component("WrapBalancer", WrapBalancer);

app.mount("#app");
