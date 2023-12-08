import { createApp } from 'vue'
import App from './App.vue'
// Vuetify
import 'vuetify/styles'
import createVuetify from './plugins/vuetify'
import router from './router/index'
import store from './store';

//Montar la app
createApp(App).use(createVuetify).use(router).use(store).mount('#app')