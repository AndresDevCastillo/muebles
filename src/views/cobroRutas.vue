<template>
  <div class="rutas">
    <v-card class="ma-3 text-break">
      <v-card-title>
        <v-row justify="space-between" justify-sm="start" class="px-6 my-4">
          <v-col cols="auto">
            <v-row class="align-center">
              <v-icon size="x-large" icon="mdi mdi-cash-marker" />
              <h1 class="px-3">Ordena y revisa tus cobros</h1>
            </v-row>
          </v-col>
        </v-row>
      </v-card-title>
      <v-card-text>
        <v-row no-gutters justify="center">
          <v-col cols="12" md="5" sm="8">
            <v-form ref="formRutas">
              <v-autocomplete
                label="Tus rutas"
                v-model="ruta"
                :items="rutas"
                item-title="nombre"
                item-value="_id"
                @update:modelValue="buscarPrestamosRuta"
                clearable
              />
            </v-form>
          </v-col>
        </v-row>
        <v-row
          class="flex-column"
          align="center"
          no-gutters
          v-if="prestamos.length > 0"
        >
          <h1 class="my-2 text-center w-100">Ordena tus cobros</h1>
          <v-btn color="info" @click="marcarPendiente"
            >Marcar todos como Pendiente</v-btn
          >
          <v-col cols="4">
            <v-btn
              block
              class="mt-4"
              @click="guardarOrdenCobros"
              :disabled="btnOrden"
              color="success"
            >
              Actualizar orden cobros
            </v-btn>
          </v-col>
          <VueDraggable
            v-model="prestamos"
            class="w-100"
            animation="200"
            target=".prestamos-target"
          >
            <TransitionGroup
              type="transition"
              tag="ul"
              name="slide-fade"
              class="prestamos-target w-100 v-list v-list--one-line"
            >
              <li
                v-for="(prestamo, index) in prestamos"
                class="d-flex ga-2 justify-space-between align-center mx-2 my-2 v-list-item v-theme--light v-list-item--density-default elevation-12 rounded-0 v-list-item--variant-text"
                :key="index"
              >
                <div class="contenido d-flex ga-4">
                  <div class="icon">
                    <v-icon
                      class="cursor-pointer"
                      icon="mdi mdi-drag handle"
                    ></v-icon>
                  </div>
                  <div class="descripcion v-list-item-title">
                    <p>
                      {{ index + 1 }} - {{ prestamo.nombres }}
                      {{ prestamo.apellidos }}
                      <span class="ml-4"
                        ><strong>Producto: </strong>
                        {{ prestamo.producto }}</span
                      >
                    </p>
                  </div>
                </div>
                <div class="estados">
                  <v-radio-group
                    v-model="prestamo.estado"
                    inline
                    :hide-details="true"
                  >
                    <v-radio label="Pendiente" value="Pendiente" />
                    <v-radio label="Aplazado" value="Aplazado" />
                    <v-radio label="Finalizado" value="Finalizado" />
                  </v-radio-group>
                </div>
              </li>
            </TransitionGroup>
          </VueDraggable>
        </v-row>
        <v-row no-gutters class="flex-column">
          <h1 class="my-2 text-center w-100">Tus rutas de cobro</h1>
          <v-expansion-panels class="my-4 w-100" variant="popout" multiple>
            <v-expansion-panel
              v-for="(ruta, index) in rutasCobro"
              :key="index"
              class="w-100"
            >
              <v-expansion-panel-title>
                <strong>
                  {{ ruta.ruta.nombre }} - {{ ruta.ruta.ciudad }} -
                  {{ ruta.ruta.departamento }}
                </strong>
              </v-expansion-panel-title>
              <v-expansion-panel-text>
                <v-list density="compact" lines="two">
                  <v-list-subheader>CLIENTES</v-list-subheader>
                  <v-list-item
                    v-for="(cobro, index) in ruta.orden_cobro"
                    :key="index"
                    :title="`${index + 1} - ${cobro.prestamo.cliente.nombres} ${
                      cobro.prestamo.cliente.apellidos
                    }`"
                    :subtitle="cobro.prestamo.producto"
                    color="primary"
                  >
                    <template v-slot:append>
                      <v-chip
                        variant="flat"
                        :color="
                          cobro.estado == 'Pendiente'
                            ? 'primary'
                            : cobro.estado == 'Aplazado'
                            ? 'orange'
                            : 'green'
                        "
                        >{{ cobro.estado }}</v-chip
                      >
                    </template>
                  </v-list-item>
                </v-list>
              </v-expansion-panel-text>
            </v-expansion-panel>
          </v-expansion-panels>
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
  data: () => ({
    api: import.meta.env.VITE_APP_API_URL,
    token: {
      headers: {
        Authorization: null,
      },
    },
    ruta: null,
    isDragging: false,
    rutas: [],
    rutasCobro: [],
    prestamos: [],
    btnOrden: false,
  }),
  methods: {
    marcarPendiente() {
      this.prestamos = this.prestamos.map((prestamo) => {
        return { ...prestamo, estado: "Pendiente" };
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
    async getCobroRutas() {
      await axios
        .get(
          `${this.api}/cobro-ruta/cobrador/${this.$store.getters.usuario.usuario.id}`,
          this.token
        )
        .then((resp) => {
          this.rutasCobro = resp.data;
          console.log(resp.data);
        })
        .catch((error) => {
          switch (error.response.status) {
            case 401:
              Session.expiredSession();
              break;
            default:
              Swal.fire({
                icon: "info",
                text: "No se pudieron obtener las rutas",
                showConfirmButton: false,
                timer: 1600,
              });
              break;
          }
        });
    },
    async buscarPrestamosRuta() {
      if (this.ruta) {
        this.$emit("loadingSweet", "Buscando, espera un momento...");
        await axios
          .get(`${this.api}/cobro-ruta/${this.ruta}`, this.token)
          .then((resp) => {
            this.prestamos = resp.data.flatMap((prestamo) => {
              return {
                ...prestamo.cliente,
                producto: prestamo.producto,
                prestamo_id: prestamo._id,
                estado: prestamo.estado ? prestamo.estado : null,
              };
            });
          })
          .catch((error) => {
            switch (error.response.status) {
              case 401:
                Session.expiredSession();
                break;
              default:
                Swal.fire({
                  icon: "info",
                  text: "No se pudieron obtener los préstamos",
                  showConfirmButton: false,
                  timer: 1600,
                });
                break;
            }
          });
        this.$emit("closeSweet");
      } else {
        this.prestamos = [];
      }
    },
    async guardarOrdenCobros() {
      if (this.prestamos.every((prest) => prest.estado != null)) {
        this.$emit("loadingSweet", "Guardando, espera un momento...");
        this.btnOrden = true;
        const paquete = {
          ruta: this.ruta,
          orden_cobro: this.prestamos.map((prest) => {
            return {
              prestamo: prest.prestamo_id,
              estado: prest.estado,
            };
          }),
        };
        await axios
          .post(`${this.api}/cobro-ruta/guardar`, paquete, this.token)
          .then(async () => {
            Swal.fire({
              icon: "success",
              text: "Orden de cobros guardada exitosamente",
              showConfirmButton: false,
              timer: 1600,
            });
            await this.getCobroRutas();
          })
          .catch((error) => {
            switch (error.response.status) {
              case 401:
                Session.expiredSession();
                break;
              default:
                Swal.fire({
                  icon: "error",
                  text: "No se pudo guardar la orden de cobros",
                  showConfirmButton: false,
                  timer: 1600,
                });
                break;
            }
          });
        this.$emit("closeSweet");
        this.btnOrden = false;
      } else {
        Swal.fire({
          icon: "error",
          text: "Debe seleccionar todos los estados",
          showConfirmButton: false,
          timer: 1600,
        });
      }
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
      await this.getCobroRutas();
      this.$emit("closeSweet");
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