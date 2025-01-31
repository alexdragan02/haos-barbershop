import { createApp } from 'vue';
import App from './App.vue';
import router from './router';  // Dacă ai router instalat
import vuetify from './plugins/vuetify'; // Import Vuetify
import 'vuetify/styles'; // Stiluri Vuetify

const app = createApp(App);
app.use(router); 
app.use(vuetify);
app.mount('#app');
