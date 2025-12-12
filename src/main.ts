import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import { buildDeviceUses, DEVICES_KEY } from './config/appServices';

const app = createApp(App);

app.use(router);

// Provide bound device use cases to the app's DI container
app.provide(DEVICES_KEY, buildDeviceUses());

app.mount('#app');
