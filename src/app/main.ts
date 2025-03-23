import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import { i18n } from './i18n';
import { createPinia } from 'pinia';
import ApiService from "@/app/services/ApiService";

import './index.css';

const app = createApp(App);
app.use(i18n);
app.use(router);
app.use(createPinia());
app.mount('#app');

ApiService.init(app);