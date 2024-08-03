/**
 * main.js
 *
 * Bootstraps Vuetify and other plugins then mounts the App`
 */

// Components
import App from './App.vue'

//Componente de fechas
import VueDatePicker from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css'

//Componente drag and drop
import { VueDraggable } from 'vue-draggable-plus'

//Componente maps
import { GoogleMap, Marker, MarkerCluster, InfoWindow, CustomControl } from 'vue3-google-map';

//Componente maps
import Maps from '@/components/maps.vue';

// Composables
import { createApp } from 'vue'

// Plugins
import { registerPlugins } from '@/plugins'

const app = createApp(App)
registerPlugins(app)

app.component('VueDatePicker', VueDatePicker);
app.component('VueDraggable', VueDraggable);
app.component('GoogleMap', GoogleMap);
app.component('GoogleMarker', Marker);
app.component('GoogleMarkerCluster', MarkerCluster);
app.component('GoogleInfoWindow', InfoWindow);
app.component('GoogleCustomControl', CustomControl);
app.component('MapsComponent', Maps);

app.mount('#app')