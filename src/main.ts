import { createApp } from 'vue';
import { createAuth0 } from '@auth0/auth0-vue';
import { appConfig, buildAuth0Options } from './config/appConfig';
import App from './App.vue';
import router from './router';
import { buildDeviceUses, DEVICES_KEY } from './config/appServices';

const app = createApp(App);

// Register Auth0 plugin so useAuth0() works
app.use(createAuth0(buildAuth0Options(appConfig)));

// Provide bound device use cases to the app's DI container
app.provide(DEVICES_KEY, buildDeviceUses());

// Optionally provide the config to the app for injection where needed
app.provide('appConfig', appConfig);

app.use(router);

app.mount('#app');
