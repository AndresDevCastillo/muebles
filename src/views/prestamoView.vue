<template>
  <v-card>
    <v-card-title>
      <v-row justify="space-between" class="px-6 my-4">
        <v-col lg="4" md="4" sm="6" cols="auto">
          <v-row class="align-center">
            <v-icon size="x-large" icon="mdi mdi-tag-plus"></v-icon>
            <h1 class="px-3">Préstamos</h1>
          </v-row>
        </v-col>
        <v-col cols="auto">
          <v-btn color="blue" prepend-icon="mdi mdi-plus" @click="dialogPrestamo = true">Crear préstamo</v-btn>
        </v-col>
      </v-row>
    </v-card-title>
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
    <v-dialog v-model="dialogPrestamo" persistent width="700">
      <v-card>
        <v-card-title>
          Nuevo préstamo
        </v-card-title>
        <v-card-text>
          <v-form v-model="valid" ref="formPrestamo">
            <v-row>
              <v-col cols="12">
                <v-autocomplete label="Nombre del cliente" no-data-text="Sin clientes registrados" return-object
                  :items="clientes" :item-title="(item => { return `${item.nombres} ${item.apellidos}` })" variant="outlined" v-model="form.cliente"
                  :rules="campoRules"></v-autocomplete>
              </v-col>
              <v-col md="6" cols="12">
                <v-autocomplete label="Producto" return-object no-data-text="Sin productos registrados" item-value="producto._id"
                  :items="productos" item-title="producto.nombre" variant="outlined" v-model="form.producto"
                  :rules="campoRules"></v-autocomplete>
              </v-col>
              <v-col md="6" cols="12">
                <v-text-field type="number" label="Cantidad" placeholder="Ingrese cantidad del producto" min="1" variant="outlined" v-model="form.cantidad"
                  :rules="cantidadRules"></v-text-field>
              </v-col>
              <v-col :cols="cols2[0]">
                <v-select label="Forma de pago" :items="formasPago" item-value="index" item-title="forma" placeholder="Escoja forma de pago" variant="outlined" v-model="formaPago"
                  :rules="campoRules"></v-select>
              </v-col>
              <v-col :cols="cols2[1]" v-if="formaPago == 2">
                <v-text-field type="number" label="Cuotas" placeholder="Ingrese cantidad de cuotas" min="1" variant="outlined" v-model="form.cuotas"
                  :rules="cantidadRules"></v-text-field>
              </v-col>
            </v-row>
          </v-form>
        </v-card-text>
        <v-card-actions class="justify-end">
          <v-btn color="red-darken-1" variant="tonal" @click="dialogPrestamo = false">
            Cerrar
          </v-btn>
          <v-btn color="green-darken-1" variant="tonal" :disabled="disableBtn" @click="guardar">
            Crear
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-card>
</template>

<script>
import Session from "@/validation/session";
import Swal from "sweetalert2";
import axios from "axios";
export default {
  name: "prestamoVista",
  data: () => ({
    token: null,
    api: process.env.VUE_APP_API_URL,
    valid: true,
    disableBtn: false,
    dialogPrestamo: false,
    formaPago: null,
    form: {
      cliente: null,
      ruta: null,
      producto: null,
      fecha_inicio: '',
      cantidad: 1,
      cuotas: 1,
      pago_fechas: [],
      total: 0
    },
    campoRules: [v => !!v || 'Campo requerido',],
    cantidadRules: [
      v => !!v || 'Campo requerido',
      v => parseInt(v) > 0 || 'Ingrese una cantidad mayor a 0'
    ],
    headers: [
      { title: 'Nombre', key: 'nombre' },
      { title: 'Usuario', key: 'usuario' },
      { title: 'Rol', key: 'rol' },
      { title: 'Accion', key: 'actions', sortable: false },
    ],
    clientes: [],
    productos: [],
    prestamos: [],
    searchPrestamo: null,
    diasSemana: ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'],
    formasPago: [{ index: 1, forma: 'De contado' }, { index: 2, forma: 'A crédito' }]
  }),
  methods: {
    async getClientes() {
      await axios.get(`${this.api}/cliente`, {
        headers: {
          Authorization: `Bearer ${this.token}`
        }
      }).then(resp => {
        this.clientes = resp.data;
      }).catch(error => {
        switch (error.response.status) {
          case 401:
            Session.expiredSession();
            break;
          default:
            Swal.fire({
              icon: 'info',
              text: 'No se pudo obtener los clientes',
              showConfirmButton: false,
              timer: 1600
            });
            break;
        }
      });
    },
    async getProductosInventario() {
      await axios.get(`${this.api}/inventario`, {
        headers: {
          Authorization: `Bearer ${this.token}`
        }
      }).then(resp => {
        this.productos = resp.data;
      }).catch(error => {
        switch (error.response.status) {
          case 401:
            Session.expiredSession();
            break;
          default:
            Swal.fire({
              icon: 'info',
              text: 'No se pudo obtener los productos',
              showConfirmButton: false,
              timer: 1600
            });
            break;
        }
      });
    },
    llenarMes(anio, mes, dia) {
      const infoMes = [];
      let fechaActual = new Date(anio, mes, dia);
      fechaActual.setTime(fechaActual.getTime() + (24 * 60 * 60 * 1000));
      const mesSig = new Date(anio, mes + 1, 1);
      mesSig.setDate(mesSig.getDate() - 1);
      const ultimoDiaMes = mesSig.getDate();
      const primerDiaMes = new Date(fechaActual.getFullYear(), fechaActual.getMonth(), 1);
      let numSemana;
      const fechaAux = fechaActual;
      for (let i = fechaActual.getDate(); i <= ultimoDiaMes; i++) {
        fechaAux.setDate(i);
        numSemana = Math.ceil((fechaAux.getDate() + primerDiaMes.getDay()) / 7);
        infoMes.push({ semana: numSemana, dia: i, diaTexto: this.diasSemana[fechaAux.getDay()] });
      }
      return infoMes;
    },
    calcularPagos(frecuenciaCobro = 'diario', cuotas = 1, semana = '', quincena = {}, mensual = {}) {
      const fechaPagos = [];
      const fechaActual = new Date();
      const diaActual = fechaActual.getDay();
      let diaFrecuencia = 0;
      const milisDia = 24 * 60 * 60 * 1000;
      let aumentoDias = 1;
      let sinComplex = true, mesV;

      switch (frecuenciaCobro.toLowerCase()) {
        case 'diario':
          sinComplex = true;
          aumentoDias = 1;
          break;
        case 'semanal':
          sinComplex = true;
          diaFrecuencia = this.diasSemana.findIndex(dia => dia.toLowerCase() == semana.toLowerCase());
          if (diaActual > diaFrecuencia) {
            console.log('mayor');
            aumentoDias = 7 - (diaActual - diaFrecuencia);
          } else if (diaActual < diaFrecuencia) {
            console.log('menor');
            aumentoDias = diaFrecuencia - diaActual;
          } else {
            aumentoDias = 7;
          }
          break;
        case 'quincenal':
          sinComplex = false;
          while (fechaPagos.length < cuotas) {
            mesV = this.llenarMes(fechaActual.getFullYear(), fechaActual.getMonth(), fechaActual.getDate());
            mesV.filter(mes => {
              if (quincena.semanas.includes(mes.semana) && mes.diaTexto.toLowerCase() == quincena.dia.toLowerCase()) {
                fechaPagos.push({ fecha: `${fechaActual.getFullYear()}-${((fechaActual.getMonth() + 1) < 10 ? '0' : null) + parseInt(fechaActual.getMonth() + 1)}-${(mes.dia < 10 ? '0' : null) + mes.dia}` });
              }
              return false;
            });
            fechaActual.setMonth(fechaActual.getMonth() + 1);
            fechaActual.setDate(1);
          }
          break;
        case 'mensual':
          sinComplex = false;
          while (fechaPagos.length < cuotas) {
            mesV = this.llenarMes(fechaActual.getFullYear(), fechaActual.getMonth(), fechaActual.getDate());
            mesV.filter(mes => {
              if (mensual.semanas == mes.semana && mes.diaTexto.toLowerCase() == mensual.dia.toLowerCase()) {
                fechaPagos.push({ fecha: `${fechaActual.getFullYear()}-${((fechaActual.getMonth() + 1) < 10 ? '0' : null) + parseInt(fechaActual.getMonth() + 1)}-${(mes.dia < 10 ? '0' : null) + mes.dia}` });
              }
              return false;
            });
            fechaActual.setMonth(fechaActual.getMonth() + 1);
            fechaActual.setDate(1);
          }
          break;
      }
      if (sinComplex) {
        console.log('aumento diad', aumentoDias);
        while (fechaPagos.length < cuotas) {
          fechaActual.setTime(fechaActual.getTime() + (aumentoDias * milisDia));
          //No es domingo
          if (fechaActual.getDay() != 0) {
            fechaPagos.push({ fecha: `${fechaActual.getFullYear()}-${((fechaActual.getMonth() + 1) < 10 ? '0' : null) + parseInt(fechaActual.getMonth() + 1)}-${(fechaActual.getDate() < 10 ? '0' : '') + fechaActual.getDate()}` });
            switch (frecuenciaCobro.toLowerCase()) {
              case 'diario':
                aumentoDias = 1;
                break;

              case 'semanal':
                aumentoDias = 7;
                break;
            }
          }
        }
      }
      return fechaPagos;
    },
    async guardar() {
      const { valid } = await this.$refs.formPrestamo.validate();
      if (valid) {
        this.form.cantidad = parseInt(this.form.cantidad);
        this.form.cuotas = parseInt(this.form.cuotas);
        let total, pagos = [];

        if (this.form.cantidad <= this.form.producto.existencias) {
          if (parseInt(this.formaPago) == 1) {
            total = this.form.cantidad * this.form.producto.producto.valor_contado;
            this.form.cuotas = 0;
          } else {
            total = this.form.cantidad * this.form.producto.producto.valor_credito;
            const valorCuota = Math.floor(total / this.form.cuotas);
            const restVal = parseFloat(total - (valorCuota * this.form.cuotas));
            pagos = this.calcularPagos(this.form.cliente.direccion.opcRuta, this.form.cuotas, this.form.cliente.direccion.semanal, this.form.cliente.direccion.quincenal, this.form.cliente.direccion.mensual);
            pagos = pagos.map((pago, index) => {
              return index == 0 ? { fecha: pago.fecha, monto: valorCuota + restVal } : { fecha: pago.fecha, monto: valorCuota };
            });
          }
          const paquete = {
            cliente: this.form.cliente._id, //`${this.form.cliente.nombres} ${this.form.cliente.apellidos}`,
            ruta: this.form.cliente.direccion.nombre,
            producto: this.form.producto._id, //ObjectId del inventario
            fecha_inicio: new Date(),
            cantidad: this.form.cantidad,
            cuotas: this.form.cuotas,
            pago_fechas: pagos,
            total: total
          }
          await axios.post(`${this.api}/prestamo/crear`, paquete, {
            headers: {
              Authorization: `Bearer ${this.token}`
            }
          }).then(resp => {
            console.log(resp);
          }).catch(error => {
            switch (error.response.status) {
              case 401:
                Session.expiredSession();
                break;
              default:
                Swal.fire({
                  icon: 'info',
                  text: 'No se pudo crear el préstamo',
                  showConfirmButton: false,
                  timer: 1600
                });
                break;
            }
          });
        } else {
          return Swal.fire({ icon: 'warning', text: `La cantidad sobrepasa las existencias, sólo hay ${this.form.producto.existencias} ${this.form.producto.producto.nombre}`, showConfirmButton: false, timer: 1600 })
        }
      }
      // Ejemplo de uso para octubre de 2023


      // const numeroDeSemanas = this.calcularSemanasEnMes(mes, anio);

      //console.log(`Número de semanas en ${mes}/${año}: ${numeroDeSemanas}`);
      //console.log();
    }
  },
  computed: {
    cols2() {
      //Para que los input del modal sean responsive
      const { xxl, xl, lg, md } = this.$vuetify.display;
      let resp = [12, 12];
      if (xxl || xl || lg || md) {
        resp = [6, 6];
      }
      return resp;
    }
  },
  async mounted() {
    Session.expiredSession();
    this.token = this.$store.getters.usuario.usuario.access_token;
    this.$emit('loadingSweet');
    await this.getClientes();
    await this.getProductosInventario();
    this.$emit('closeSweet');
  },
};
</script>
