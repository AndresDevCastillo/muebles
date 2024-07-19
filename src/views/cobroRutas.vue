<template>
  <div class="rutas">
    <v-card class="ma-3">
      <v-card-text>
        <v-expansion-panels class="my-4" variant="popout">
          <v-expansion-panel
            v-for="i in 3"
            :key="i"
            text="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat."
            title="Item"
          ></v-expansion-panel>
        </v-expansion-panels>
        <!-- <VueDraggable
          class="list-group"
          handle=".handle"
          :component-data="{
            tag: 'li',
            type: 'transition-group',
            name: !drag ? 'flip-list' : null,
          }"
          v-model="list"
          v-bind="dragOptions"
          @start="drag = true"
          @end="drag = false"
          item-key="order"
        >
          <template #item="{ element }">
            <div>
              <v-list lines="one" class="ruta">
                <v-list-item
                  max-height="100%"
                  elevation="12"
                  :title="element.name"
                >
                  <template v-slot:prepend>
                    <v-icon
                      class="cursor-pointer"
                      icon="mdi mdi-drag handle"
                    ></v-icon>
                  </template>
                </v-list-item>
              </v-list>
            </div>
          </template>
        </VueDraggable> -->

        <v-row justify="center">
          <GoogleMap
            :api-key="api_key_maps"
            style="height: 500px; width: 90%"
            :zoom="10"
            :center="centerMap"
            @click="marcarUbicacion"
          >
            <GoogleMarkerCluster>
              <GoogleMarker
                v-for="(marker, index) in markerLocation"
                :key="index"
                :options="{ position: marker }"
              >
                <GoogleInfoWindow v-if="marker.label">
                  <div id="content">
                    <div id="siteNotice"></div>
                    <h4 id="firstHeading" class="firstHeading">
                      {{ marker.label }}
                    </h4>
                    <div id="bodyContent">
                      <p>
                        {{
                          marker.label == "Yo"
                            ? marker.title
                            : `${marker.title} agregada ${index + 1}`
                        }}
                      </p>
                    </div>
                  </div>
                </GoogleInfoWindow>
              </GoogleMarker>
            </GoogleMarkerCluster>
            <GoogleCustomControl position="INLINE_END_BLOCK_CENTER">
              <button class="custom-btn">Limpiar ubicaciones</button>
            </GoogleCustomControl>
          </GoogleMap>
        </v-row>
      </v-card-text>
    </v-card>
  </div>
</template>
<script>
import Session from "@/validation/session";
import axios from "axios";
import Swal from "sweetalert2";
export default {
  name: "rutasCobrador",
  display: "Transitions",
  order: 7,
  data: () => ({
    api: import.meta.env.VITE_APP_API_URL,
    api_key_maps: import.meta.env.VITE_APP_API_KEY_MAPS,
    centerMap: {
      lat: -34.6037,
      lng: -58.3816,
    },
    markerLocation: [],
    watchIdLocation: null,
    token: {
      headers: {
        Authorization: null,
      },
    },
    drag: false,
    rutas: [],
  }),
  methods: {
    sort() {
      this.list = this.list.sort((a, b) => a.order - b.order);
    },
    marcarUbicacion(ubicacion) {
      this.markerLocation.push({
        lat: ubicacion.latLng.lat(),
        lng: ubicacion.latLng.lng(),
        label: "Ubicación agregada",
        title: "Ubicación",
      });
    },
    async getRutasAndClientes() {
      await axios
        .get(
          `${this.api}/pueblo/cobrador/${this.$store.getters.usuario.usuario.id}`,
          this.token
        )
        .then((resp) => {
          this.rutas = resp.data;
        })
        .catch((error) => {
          switch (error.response.status) {
            case 401:
              Session.expiredSession();
              break;
            default:
              Swal.fire({
                icon: "info",
                text: "No se pudo obtener las rutas",
                showConfirmButton: false,
                timer: 1600,
              });
              break;
          }
        });
    },
  },
  async created() {
    const invalid = await Session.expiredSession();
    if (!invalid) {
      this.token = {
        headers: {
          Authorization: `Bearer ${this.$store.getters.usuario.usuario.access_token}`,
        },
      };
      this.$emit("loadingSweet", "Cargando rutas, espere un momento...");
      await this.getRutasAndClientes();
      this.$emit("closeSweet");
      //Obtener ubicación actual
      if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            this.centerMap = {
              lat: position.coords.latitude,
              lng: position.coords.longitude,
            };
            this.markerLocation.push({
              lat: position.coords.latitude,
              lng: position.coords.longitude,
              label: "Yo",
              title: "Mi ubicación actual",
            });
          },
          (error) => {
            console.error("Error: ", error);
          }
        );
        this.watchIdLocation = navigator.geolocation.watchPosition(
          (position) => {
            this.centerMap = {
              lat: position.coords.latitude,
              lng: position.coords.longitude,
            };
            const miUbiActual = this.markerLocation.findIndex(
              (ubi) => ubi.label == "Yo"
            );
            if (miUbiActual > -1) {
              this.markerLocation[miUbiActual] = {
                lat: position.coords.latitude,
                lng: position.coords.longitude,
                label: "Yo",
                title: "Mi ubicación actual",
              };
            } else {
              this.markerLocation.push({
                lat: position.coords.latitude,
                lng: position.coords.longitude,
                label: "Yo",
                title: "Mi ubicación actual",
              });
            }
          },
          (error) => {
            Swal.fire({
              icon: "info",
              title: "Ubicación",
              text: `Ocurrió un problema actualizando la ubicación ${error.message}`,
              showConfirmButton: false,
              timer: 1600,
            });
          },
          {
            enableHighAccuracy: true,
            timeout: 5000,
            maximumAge: 0,
          }
        );
      }
    }
  },
  computed: {
    dragOptions() {
      return {
        animation: 200,
        group: "description",
        disabled: false,
        ghostClass: "ghost",
      };
    },
  },
  unmounted() {
    if (this.watchIdLocation != null) {
      navigator.geolocation.clearWatch(this.watchIdLocation);
      this.watchIdLocation = null;
    }
  },
};
</script>
<style>
.custom-btn {
  box-sizing: border-box;
  background: white;
  height: 40px;
  width: max-content;
  border-radius: 6px;
  font-style: italic;
  border: 0px;
  margin: 10px;
  padding: 2px;
  font-size: 1.25rem;
  text-transform: none;
  appearance: none;
  cursor: pointer;
  user-select: none;
  box-shadow: rgba(0, 0, 0, 0.3) 0px 1px 4px -1px;
  overflow: hidden;
}
.v-list.ruta {
  padding: 0;
}
.button {
  margin-top: 35px;
}

.flip-list-move {
  transition: transform 0.5s;
}

.no-move {
  transition: transform 0s;
}

.ghost {
  opacity: 0.5;
  background: #c8ebfb;
}

.list-group {
  min-height: 20px;
}

.list-group-item {
  cursor: move;
}

.list-group-item i {
  cursor: pointer;
}
.list-group-item::marker {
  content: "";
}
</style>