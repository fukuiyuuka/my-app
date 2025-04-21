import { createApp } from "vue";
import App from "./App.vue";
import router from "./plugins/router";
import vuetify from "./plugins/vuetify";
import { createPinia } from "pinia";
import piniaPersistedstate from "pinia-plugin-persistedstate";
import "@mdi/font/css/materialdesignicons.css";

const app = createApp(App);

const pinia = createPinia();
pinia.use(piniaPersistedstate);
app.use(pinia);
app.use(router);
app.use(vuetify);

app.mount("#app");
console.log("VITE_API_URL:", import.meta.env.VITE_API_URL);
