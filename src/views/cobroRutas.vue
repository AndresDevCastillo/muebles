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
              <v-select
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
          justify="center"
          no-gutters
          v-if="prestamos.length > 0"
        >
          <h1 class="my-2 text-center w-100">Ordena tus cobros</h1>
          <v-btn color="red" @click="limpiarEstados"
            >Limpiar todos los estados</v-btn
          >
          <v-btn color="info" class="mt-1" @click="marcarPendiente"
            >Marcar todos como Pendiente</v-btn
          >
          <v-btn
            class="mt-5"
            @click="guardarOrdenCobros"
            :disabled="btnOrden"
            color="success"
          >
            Actualizar orden cobros
          </v-btn>
          <VueDraggable
            v-model="prestamos"
            class="w-100 px-4 mt-2"
            style="height: 450px; overflow: auto"
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
                class="d-flex ga-2 cobro justify-space-between align-center mx-2 my-2 v-list-item v-theme--light v-list-item--density-default elevation-12 rounded-0 v-list-item--variant-text"
                :key="index"
              >
                <div class="contenido d-flex flex-wrap" style="max-width: 50%">
                  <div class="icon">
                    <v-icon class="cursor-pointer" icon="mdi mdi-drag handle" />
                  </div>
                  <div
                    class="descripcion v-list-item-title text-truncate"
                    style="white-space: break-spaces"
                  >
                    <p class="text-truncate">
                      {{ index + 1 }} - {{ prestamo.nombres }}
                      {{ prestamo.apellidos }}
                      <span class="ml-4 text-truncate user-select-none">
                        <strong>Producto: </strong>
                        {{ prestamo.producto }}
                      </span>
                    </p>
                  </div>
                </div>
                <v-row
                  align="center"
                  justify="end"
                  class="d-flex estados flex-wrap"
                  no-gutters
                  style="max-width: max-content"
                >
                  <v-btn class="elevation-0" text icon density="compact">
                    <v-icon
                      size="large"
                      @click="abonarFunction(Object.assign({}, prestamo))"
                    >
                      mdi-cash
                    </v-icon>
                    <v-tooltip activator="parent" location="top">
                      Abonar
                    </v-tooltip>
                  </v-btn>
                  <v-col cols="auto" class="col-select">
                    <v-select
                      class="showSelect ml-1"
                      v-model="prestamo.estado"
                      label="Estado"
                      density="compact"
                      :hide-details="true"
                      :items="estados"
                      @update:modelValue="
                        actualizarEstadoCobro(
                          prestamo.estado,
                          prestamo.prestamo_id
                        )
                      "
                    />
                    <v-radio-group
                      class="showRadio"
                      v-model="prestamo.estado"
                      inline
                      :hide-details="true"
                      @change="
                        actualizarEstadoCobro(
                          prestamo.estado,
                          prestamo.prestamo_id
                        )
                      "
                    >
                      <v-radio label="Pendiente" value="Pendiente" />
                      <v-radio label="Aplazado" value="Aplazado" />
                      <v-radio label="Finalizado" value="Finalizado" />
                    </v-radio-group>
                  </v-col>
                </v-row>
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
                      <v-btn
                        v-if="cobro.prestamo.ubicacionMap.lat != null"
                        class="elevation-0 me-2"
                        :href="`https://www.google.com/maps?q=${cobro.prestamo.ubicacionMap.lat},${cobro.prestamo.ubicacionMap.lng}`"
                        target="_blank"
                        icon
                        dark
                        density="compact"
                        text
                      >
                        <v-icon size="large">mdi mdi-home-map-marker</v-icon>
                        <v-tooltip activator="parent" location="top"
                          >Ver ubicación</v-tooltip
                        >
                      </v-btn>
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
    <v-dialog v-model="dialogAbonar" persistent width="700">
      <v-card>
        <v-card-text>
          <v-container>
            <v-form ref="formAbono">
              <v-row>
                <v-col cols="12">
                  <v-text-field
                    label="Documento"
                    type="text"
                    required
                    variant="outlined"
                    v-model="cedulaTemp"
                    disabled
                  />
                </v-col>
                <v-col cols="12">
                  <v-text-field
                    type="number"
                    label="Monto"
                    :placeholder="
                      montoSugerido
                        ? 'El monto sugerido es ' +
                          montoSugerido.toLocaleString()
                        : 'Ingrese un monto'
                    "
                    min="1"
                    variant="outlined"
                    v-model="formAbono.abono"
                    :rules="cantidadRules"
                  />
                </v-col>
              </v-row>
            </v-form>
          </v-container>
        </v-card-text>
        <v-card-actions class="justify-end">
          <v-btn
            color="red-darken-1"
            variant="tonal"
            @click="dialogAbonar = false"
          >
            Cerrar
          </v-btn>

          <v-btn
            color="green-darken-1"
            variant="tonal"
            :disabled="disableBtn"
            @click="abonar"
          >
            Crear
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
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
    dialogAbonar: false,
    disableBtn: false,
    ruta: null,
    isDragging: false,
    rutas: [],
    rutasCobro: [],
    prestamos: [],
    btnOrden: false,
    cedulaTemp: null,
    montoSugerido: null,
    formAbono: {
      id: null,
      abono: null,
    },
    cantidadRules: [
      (v) => !!v || "Campo requerido",
      (v) => parseInt(v) > 0 || "Ingrese una cantidad mayor a 0",
    ],
    estados: ["Pendiente", "Aplazado", "Finalizado"],
  }),
  methods: {
    marcarPendiente() {
      this.prestamos = this.prestamos.map((prestamo) => {
        return { ...prestamo, estado: "Pendiente" };
      });
    },
    abonarFunction(item) {
      this.formAbono.id = item._id;
      this.cedulaTemp = item.documento;
      this.montoSugerido = item.cuota_sugerida;
      this.dialogAbonar = true;
    },
    async abonar() {
      const { valid } = await this.$refs.formAbono.validate();
      if (valid) {
        this.disableBtn = true;
        this.dialogAbonar = false;
        this.formAbono.abono = parseInt(this.formAbono.abono);
        await axios
          .post(`${this.api}/prestamo/cobrar`, this.formAbono, this.token)
          .then(() => {
            return Swal.fire({
              icon: "success",
              title: "Exitoso",
              text: "Abonado correctamente!",
              showConfirmButton: false,
              timer: 1500,
            });
          })
          .catch((error) => {
            console.log(error);
            return Swal.fire({
              icon: "error",
              title: "No se pudo abonar",
              showConfirmButton: false,
              timer: 1500,
            });
          });
        this.formAbono = {
          id: null,
          abono: null,
        };
        this.disableBtn = false;
      }
    },
    async getRutasAndClientes() {
      await axios
        .get(`${this.api}/pueblo`, this.token)
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
        .get(`${this.api}/cobro-ruta`, this.token)
        .then((resp) => {
          this.rutasCobro = resp.data;
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
                cuota_sugerida: prestamo.cuota_sugerida,
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
    },
    async actualizarEstadoCobro(estado = null, prestamo_id = null) {
      if (estado && prestamo_id) {
        await axios
          .put(
            `${this.api}/cobro-ruta/actualizar/especifica`,
            {
              estado: estado,
              prestamo: prestamo_id,
              ruta: this.ruta,
            },
            this.token
          )
          .then((resp) => {
            Swal.fire({
              icon: resp.data.error ? "error" : "success",
              title: "Actualizar estado",
              text: resp.data.message,
              showConfirmButton: false,
              timer: resp.data.error ? 1700 : 1600,
            });
          })
          .catch((error) => {
            switch (error.response.status) {
              case 401:
                Session.expiredSession();
                break;
              case 500:
                Swal.fire({
                  icon: "error",
                  title: "Actualizar estado",
                  text: "Sucedió un problema actualizando",
                  showConfirmButton: false,
                  timer: 1500,
                });
                break;
              default:
                Swal.fire({
                  icon: "error",
                  title: "No se pudo actualizar el estado",
                  showConfirmButton: false,
                  timer: 1500,
                });
                break;
            }
          });
      }
    },
    async limpiarEstados() {
      if (this.ruta) {
        Swal.fire({
          icon: "info",
          title: "¿Seguro de qué quiere limpiar todos los estados de la ruta?",
          showDenyButton: true,
          denyButtonText: "No, cancelar",
          confirmButtonText: "Sí, limpiar",
          confirmButtonColor: "#3085d6",
          denyButtonColor: "#d33",
          cancelButtonColor: "#3085d6",
        })
          .then(async (result) => {
            /* Read more about isConfirmed, isDenied below */
            if (result.isConfirmed) {
              await axios
                .put(
                  `${this.api}/cobro-ruta/limpiar-estados/${this.ruta}`,
                  {},
                  this.token
                )
                .then(() => {
                  Swal.fire({
                    icon: "success",
                    title: "Se limpiaron los estados correctamente",
                    timer: 1500,
                    showConfirmButton: false,
                  });
                  this.buscarPrestamosRuta();
                  this.getCobroRutas();
                });
            }
          })
          .catch((error) => {
            switch (error.response.status) {
              case 401:
                Session.expiredSession();
                break;
              case 500:
                Swal.fire({
                  icon: "error",
                  title: "Limpiar estados",
                  text: "Sucedió un error limpiando los estados",
                  showConfirmButton: false,
                  timer: 1600,
                });
                break;
              default:
                Swal.fire({
                  icon: "info",
                  title: "Limpiar estados",
                  text: "No se pudo limpiar los estados",
                  showConfirmButton: false,
                  timer: 1600,
                });
                break;
            }
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
html,
body {
  resize: none;
  touch-action: pan-x pan-y;
}

.user-select-none {
  user-select: none !important;
}

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

.showSelect {
  display: none !important;
}

.showRadio {
  display: block;
}

@media (max-width: 886px) {
  .cobro {
    flex-direction: column;
    justify-content: start;
    margin-top: 20px !important;
  }

  .cobro > * {
    max-width: 100% !important;
    width: 100%;
    justify-content: start !important;
  }
  .cobro > .estados {
    justify-content: start;
  }
}

@media (max-width: 500px) {
  .col-select {
    width: 90% !important;
  }
  .showSelect {
    display: block !important;
  }

  .showRadio {
    display: none !important;
  }
}
</style>