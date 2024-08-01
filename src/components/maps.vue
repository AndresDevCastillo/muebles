<template>
  <div class="maps-google">
    <v-row justify="center">
      <GoogleMap
        :api-key="api_key_maps"
        style="height: 500px; width: 97%"
        :zoom="16"
        :center="centerMap"
        @click="marcarUbicacion"
      >
        <GoogleMarkerCluster>
          <GoogleMarker
            v-for="(marker, index) in markerLocation"
            :key="index"
            :options="{ position: marker }"
          />
        </GoogleMarkerCluster>
      </GoogleMap>
    </v-row>
  </div>
</template>
<script>
import Swal from "sweetalert2";
export default {
  props: {
    multipleUbicacion: {
      type: Boolean,
      default: false,
    },
    centroMap: {
      type: Object,
      default: () => ({ lat: 0, lng: 0 }),
    },
    ubicacionAnterior: {
      type: Object,
      default: () => ({ lat: 0, lng: 0 }),
    },
  },
  name: "MapsViewComponent",
  data: () => ({
    api_key_maps: import.meta.env.VITE_APP_API_KEY_MAPS,
    centerMap: { lat: 0, lng: 0 },
    markerLocation: [
      {
        lat: 0,
        lng: 0,
      },
    ],
  }),
  watch: {
    centroMap: {
      handler(newValue) {
        if (newValue.lat != null && newValue.lng != null) {
          this.centerMap = newValue;
        }
      },
      immediate: true,
    },
    ubicacionAnterior: {
      handler(newValue) {
        if (newValue.lat != null && newValue.lng != null) {
          this.markerLocation = [];
          this.markerLocation.push({
            lat: newValue.lat,
            lng: newValue.lng,
          });
        }
      },
      immediate: true,
    },
  },
  methods: {
    marcarUbicacion(ubicacion) {
      this.markerLocation = [];
      this.markerLocation.push({
        lat: ubicacion.latLng.lat(),
        lng: ubicacion.latLng.lng(),
      });
      this.$emit("ubicacion", this.markerLocation[0]);
    },
  },
  mounted() {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          this.centerMap = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
        },
        (error) => {
          Swal.fire({
            icon: "error",
            title: "Obtener ubicación",
            text: "Debes conceder el permiso de la ubicación para tener un punto más preciso",
            timer: 1650,
          });
          console.error("Error: ", error);
        },
        { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
      );
    }
  },
};
</script>