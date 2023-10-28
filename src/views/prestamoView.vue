<template>
  <div>
    <v-card class="ma-3">
      <v-row justify="end" no-gutters>
        <v-btn prepend-icon="mdi-plus" color="blue" @click="dialogCliente = true;">Agregar cliente</v-btn>
      </v-row>
      <v-form v-model="valid" ref="fac">
        <v-container>
          <v-row>
            <v-col cols="12" md="3">
              <v-autocomplete label="Nombre del cliente" no-data-text="Sin clientes registrados" item-value="id"
                :items="clientes" item-title="nombre" variant="outlined" v-model="form.cliente"
                :rules="campoRules"></v-autocomplete>
              <!-- <v-text-field v-model="form.nombre" label="Nombre del cliente" placeholder="Pepito pérez" required
                                variant="outlined"></v-text-field> -->
            </v-col>
            <v-col cols="12" md="3">
              <v-text-field class="inline-form-input-name" v-model="form.cedula" label="Cédula" type="number"
                placeholder="1062123536" required variant="outlined" :rules="campoRules"></v-text-field>
            </v-col>
            <v-col cols="12" md="3">
              <v-text-field v-model="form.telefono" label="Teléfono" placeholder="3104205923" required
                variant="outlined"></v-text-field>
            </v-col>

            <v-col cols="12" md="3">
              <v-text-field v-model="form.correo" :rules="emailRules" label="Correo Electrónico"
                placeholder="pepito@gmail.com" required variant="outlined"></v-text-field>
            </v-col>

            <v-col cols="12" md="3">
              <v-select label="Pedidos" v-model="pedidoTablero" required variant="outlined" no-data-text="No hay pedidos"
                :items="pedidos" item-title="mesa.nombre" return-object :rules="campoRules">
              </v-select>
            </v-col>

            <v-col cols="12" md="3">
              <v-select v-model="formFactura.medio_pago" :items="pagos" label="Medio de pago"
                placeholder="Escoja medio de pago" required variant="outlined" :rules="campoRules">
              </v-select>
            </v-col>

            <v-col cols="12" md="3">
              <v-select v-model="formFactura.lugar" :items="ubicaciones" label="Lugar"
                placeholder="Escoja lugar de atención" required variant="outlined" :rules="campoRules">
              </v-select>
            </v-col>
            <v-col cols="12" md="3">
              <v-text-field label="Descuento" placeholder="0-100" type="number" variant="outlined"
                v-model="form.descuento" v-if="form.compras.length != 0" :rules="porcentajeRule"></v-text-field>
            </v-col>
            <v-col cols="12" md="3">
              <v-text-field label="Propina" placeholder="0" variant="outlined" type="number" v-model="formFactura.propina"
                v-if="form.compras.length != 0" :rules="propinaRule"></v-text-field>
            </v-col>
            <v-col cols="12" md="3" v-if="form.ubicacion === 'Domicilio'">
              <v-select v-model="form.domiciliario" :items="domiciliarios" label="Domiciliario"
                placeholder="Escoja domicialiario" :rules="campoRules" required variant="outlined">
              </v-select>
            </v-col>
            <v-col cols="12" md="3" v-if="form.ubicacion === 'Domicilio'">
              <v-text-field v-model="form.direccion" label="Dirección domicilio"
                placeholder="Ingrese dirección del domicilio" required variant="outlined" :rules="campoRules">
              </v-text-field>
            </v-col>
            <v-col cols="12" md="2">
              <v-btn elevation="4" size="x-large" @click="limpiarForm()" color="red">Limpiar</v-btn>
            </v-col>
            <v-col cols="12" md="2">
              <v-btn elevation="4" size="x-large" @click="vender()" :disabled="disableBtn" color="red">Vender</v-btn>
            </v-col>
          </v-row>
        </v-container>
      </v-form>
    </v-card>
    <v-data-table :headers="headers" :items="prestamos" :sort-by="[{ key: 'nombre', order: 'asc' }]"
      class="elevation-1" :search="searchPrestamo" no-data-text="Sin préstamos">
      <!-- eslint-disable-next-line vue/valid-v-slot -->
      <template v-slot:item.actions="{ item }">
        <v-icon size="small" class="me-2" :id="item">
          mdi-pencil
        </v-icon>
        <v-icon size="small">
          mdi-delete
        </v-icon>
      </template>
    </v-data-table>
  </div>
</template>

<script>
import Swal from "sweetalert2";
import axios from "axios";
export default {
  name: "prestamoVista",
  data: () => ({
    token: null,
    api: process.env.VUE_APP_API_URL,
    headers: [
      { title: 'Nombre', key: 'nombre' },
      { title: 'Usuario', key: 'usuario' },
      { title: 'Rol', key: 'rol' },
      { title: 'Accion', key: 'actions', sortable: false },
    ],
    prestamos: [],
    searchPrestamo: null
  }),
  methods: {

  },
  async mounted() {

  },
};
</script>
