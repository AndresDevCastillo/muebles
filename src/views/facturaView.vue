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
    <v-table fixed-header style="margin-bottom: 100px;" v-if="form.compras.length != 0">
      <thead style="z-index: 1000;" class="bg-table-header">
        <tr>
          <th class="text-left" colspan="2">Nombres</th>
          <th class="text-left">Cantidad</th>
          <th class="text-left">Precio Unitario</th>
          <th class="text-left">Precio Neto</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in form.compras[0].detalleTicket" :key="item.name">
          <td class="text-left" colspan="2">{{ item.producto.nombre }}</td>
          <td class="text-left">{{ item.cantidad }}</td>
          <td class="text-left">{{ item.producto.precio }}</td>
          <td class="text-left">{{ item.cantidad * item.producto.precio }}</td>
        </tr>
      </tbody>
      <tfoot>
        <tr>
          <td class="text-left footer-table" colspan="2">
            <b>Descuento {{ total.descuento }}%</b>
          </td>
          <td class="text-left footer-table" colspan="1">
            <b>{{ total.cantidad }}</b>
          </td>
          <td class="text-left footer-table" colspan="1">
            <b>{{ total.neto }}</b>
          </td>
          <td class="text-left footer-table" colspan="1">
            <b style="font-size: 1.3rem;">{{ total.total }}</b>
          </td>
        </tr>
      </tfoot>
    </v-table>
    <facturaComponent :dialog="dialog" :datos="facturaImpresa" @cerrarDialogo="dialog = false" />
    <ticketComponent :dialog="dialogTicket" :datos="facturaImpresa" @cerrarDialogoTicket="dialogTicket = false">
    </ticketComponent>
    <ticketCocineroComponent :dialog2="dialogTicketCocinero" @cerrarDialogoTicketCocinero="dialogTicketCocinero = false">
    </ticketCocineroComponent>
    <v-dialog v-model="dialogCliente" persistent width="700">
      <clienteComponent @cerrarDialog="dialogCliente = false;" @cerrarYLlenar="llenarCliente" />
    </v-dialog>
  </div>
</template>

<script>
import Swal from "sweetalert2";
import facturaComponent from "../components/factura.vue";
import ticketComponent from "../components/ticket.vue";
import ticketCocineroComponent from "../components/ticketCocinero.vue";
import clienteComponent from '../components/cliente.vue';
import axios from "axios";
export default {
  name: "facturaVista",
  components: {
    facturaComponent,
    ticketComponent,
    ticketCocineroComponent,
    clienteComponent
  },
  data: () => ({
    disableBtn: false,
    dialogCliente: false,
    clientes: [],
    pedidos: [],
    bCliente: null,
    valid: null,
    dialog: false,
    dialogTicket: false,
    dialogTicketCocinero: true,
    add: null,
    cantidad: null,
    drawer2: true,
    group: null,
    pedidoTablero: null,
    emailRules: [
      v => {
        if (v && v.length > 0) {
          return /^\w+([.-_+]?\w+)*@\w+([.-]?\w+)*(\.\w{2,10})+$/.test(v) || "Ingrese un correo válido";
        }
        return true;
      }
    ]
    ,
    propinaRule: [
      (v) => (v === 0 || !!v) || "La propina es requerida en 0 almenos",
      (v) =>
        (/^[0-9]+$/.test(v)) || "El numero no debe contener caracteres",
      (v) => (parseInt(v) > -1) || "El numero debe ser mayor o igual a 0",
    ],
    porcentajeRule: [
      (v) => (v === 0 || !!v) || "El porcentaje es requerido",
      (v) =>
        (/^[0-9]+$/.test(v)) || "El numero no debe contener caracteres",
      (v) =>
        (parseInt(v) > -1 && parseInt(v) < 101) ||
        "El numero debe ser un porcentaje",
    ],
    campoRules: [
      v => !!v || 'Campo requerido',
    ],
    pagos: ["Efectivo", "Tarjeta Credito", "Tarjeta Debito", "Transferencia"],
    form: {
      cliente: null,
      nombre: null,
      cedula: null,
      telefono: null,
      compras: [],
      ubicacion: null,
      mesero: null,
      domiciliario: null,
      direccion: null,
      correo: null,
      descuento: 0,
    },
    formFactura: {
      cliente: null,
      empleado: null,
      mesa: null,
      medio_pago: 'Efectivo',
      descuento: 0,
      total: null,
      propina: 0,
      neto: 0,
      lugar: 'Restaurante',
      comentario: '',
      calificacion: 0,
      detalleFactura: [],
    },
    trabajadores: [],
    ubicaciones: ["Restaurante", "Domicilio", "Recogido en persona"],
    defect: "No hay medios disponibles",
    productos: [],
    total: {
      total: null,
      descuento: null,
      cantidad: null,
      neto: null,
    },
    facturaImpresa: {},
    idEliminarPedidos: null,
  }),
  methods: {
    addCompra() {
      this.cantidad = parseFloat(this.cantidad);
      if (
        this.cantidad <= 0 ||
        !Number.isInteger(this.cantidad) ||
        this.add == null
      ) {
        return Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Ingrese la cantidad correctamente",
        });
      }
      this.add.precio = this.add.precio * this.cantidad;
      this.add.cantidad = parseInt(this.cantidad);
      this.form.compras.push(Object.assign({}, this.add));
      this.add = null;
      this.cantidad = null;
      this.calcularMonto();
    },
    eliminarCompra(posicion = null) {
      this.form.compras.splice(posicion, 1);
      this.calcularMonto();
    },
    calcularMonto() {
      if (this.form.compras.length != 0) {
        let descuentoTemp = this.form.descuento;
        let cantidadTemp = 0;
        let netoTemp = 0;
        let totalTemp = 0;
        for (let item of this.form.compras[0].detalleTicket) {
          cantidadTemp += item.cantidad;
          netoTemp += item.producto.precio;
          totalTemp += item.cantidad * item.producto.precio;
        }
        this.formFactura.neto = totalTemp;
        if (descuentoTemp == 0) {
          this.total.total = totalTemp + parseInt(this.formFactura.propina);
        } else {
          this.total.total =
            totalTemp -
            (descuentoTemp / 100) * totalTemp +
            parseInt(this.formFactura.propina);
        }
        this.total.descuento = descuentoTemp;
        this.total.neto = netoTemp;
        this.total.cantidad = cantidadTemp;
        this.formFactura.total = this.total.total;
      }
    },
    generarFactura() {
      this.dialog = true;
    },
    buscarCliente() {
      console.log('busca cliente');
    },
    async buscarEmpleados() {
      try {
        await axios
          .get(`${process.env.VUE_APP_API_URL}/empleado`)
          .then((data) => {
            this.trabajadores = data.data;
          });
      } catch (error) {
        console.log(error);
      }
    },
    async buscarProductos() {
      try {
        await axios
          .get(`${process.env.VUE_APP_API_URL}/producto`)
          .then((data) => {
            this.productos = data.data;
          });
      } catch (error) {
        console.log(error);
      }
    },
    async buscarClientes() {
      try {
        await axios
          .get(`${process.env.VUE_APP_API_URL}/cliente`)
          .then((data) => {
            this.clientes = Array.isArray(data.data) ? data.data : [];
          });
      } catch (error) {
        console.log(error);
      }
    },
    llenarCliente(cliente) {
      if (typeof cliente === 'object') {
        this.clientes.push(cliente);
        this.form.cliente = cliente.id;
      }
      this.dialogCliente = false;
    },
    async cargarPedidos() {
      try {
        axios.get(`${process.env.VUE_APP_API_URL}/pedido`).then((data) => {
          this.pedidos = data.data;
        });
      } catch (error) {
        console.log(error);
      }
    },
    async vender() {
      const { valid } = await this.$refs.fac.validate();
      if (valid) {
        this.disableBtn = true;
        this.formFactura.cliente = this.form.cliente;
        this.formFactura.descuento = parseInt(this.form.descuento);
        this.formFactura.propina = parseInt(this.formFactura.propina);
        await axios
          .post(`${process.env.VUE_APP_API_URL}/factura/crear/${this.idEliminarPedidos}`, this.formFactura)
          .then((data) => {
            this.facturaImpresa = data.data;
            Swal.fire({
              icon: "success",
              title: "Se genero la factura",
              showConfirmButton: false,
              showCancelButton: false,
              timer: 2000,
            }).finally(async () => {
              this.dialogTicket = true;
              await this.cargarPedidos();
              this.limpiarForm();
            });
          })
          .catch((error) => {
            Swal.fire({ icon: "error", title: "Oops...", titleText: error });
          });
        this.disableBtn = false;
      }
    },
    async limpiarForm() {
      this.formFactura =
      {
        cliente: null,
        empleado: null,
        mesa: null,
        medio_pago: null,
        descuento: 0,
        total: null,
        propina: 0,
        neto: 0,
        lugar: null,
        detalleFactura: [],
      };
      this.form.cliente = null;
      this.form.nombre = null;
      this.form.cedula = null;
      this.form.telefono = null;
      this.form.correo = null;
      this.form.compras.splice(0, 1);
      this.pedidos = [];
      await this.cargarPedidos();

    }
  },
  watch: {
    "form.cliente": {
      handler() {
        // Esta función se ejecutará cuando 'form.nombre' cambie
        this.clientes.map((cliente) => {
          if (this.form.cliente == cliente.id) {
            this.form.cedula = cliente.cedula;
            this.form.correo = cliente.correo;
            this.form.telefono = cliente.telefono;
          }
        });
      },
    },
    pedidoTablero: {
      handler(newPedido) {
        this.form.compras.splice(0, 1);
        this.form.compras.push(newPedido);
        this.idEliminarPedidos = newPedido.ticket;
        this.formFactura.calificacion = newPedido.calificacion;
        this.formFactura.comentario = newPedido.sugerencia;
        this.formFactura.empleado = newPedido.empleado.id;
        this.formFactura.mesa = newPedido.mesa.id;
        this.formFactura.descuento = parseInt(this.form.descuento);
        this.calcularMonto();
        this.formFactura.total = this.total.total;
        console.log(this.total.total)
        this.formFactura.detalleFactura = newPedido.detalleTicket.map(
          (producto) => {
            return {
              producto: producto.producto.id,
              cantidad: producto.cantidad,
            };
          }
        );
      },
    },
    "form.descuento": {
      handler() {
        this.calcularMonto();
      },
    },
    "formFactura.propina": {
      handler() {
        this.calcularMonto();
      },
    },
  },
  async mounted() {
    this.$emit('loadingSweet');
    await this.cargarPedidos();
    await this.buscarEmpleados();
    await this.buscarProductos();
    await this.buscarClientes();
    this.$emit('closeSweet');


  },
};
</script>
