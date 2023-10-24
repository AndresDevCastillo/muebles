<template>
    <div>
        <v-card class="ma-3">
            <v-card-title>
                <div class="d-flex align-center flex-wrap">
                    <v-icon size="x-large">mdi mdi-cart-plus</v-icon>
                    <div class="px-3">
                        <h1>Agregar pedido</h1>
                        <div class="text-subtitle-1">Escoja una mesa para agregarle un pedido</div>
                    </div>
                </div>
            </v-card-title>
            <v-card-text>
                <v-container>
                    <v-row justify="start">
                        <p class="fw-bold text-dark w-100 text-center" v-if="ubicaciones.length == 0">No hay mesas, por
                            favor regístrelas</p>
                        <div v-for="(ubicacion, index) in ubicaciones" :key="index"
                            class="v-col-sm-6 v-col-md-4 v-col-xl-4 v-col-xxl-4">
                            <v-tooltip activator="parent" location="top" contained eager max-width="300">{{
                                this.mesaOcupada(ubicacion.id) ? 'No puedes escoger esta mesa, tiene un pedido en curso' :
                                'Agregar pedido a esta mesa' }}
                            </v-tooltip>
                            <v-card elevation="10" :color="obtenerColor(ubicacion.id)"
                                :class="[obtenerClases(ubicacion.id)]" @click="agregarPedidoMesa(ubicacion.id)">
                                <v-card-text class="fw-bold-important text-center">
                                    {{ ubicacion.nombre }}
                                </v-card-text>
                            </v-card>
                        </div>
                    </v-row>
                </v-container>
            </v-card-text>
        </v-card>

        <!-- Dialog agregar productos -->
        <v-row justify="center">
            <v-dialog v-model="dialog" persistent width="1300">
                <v-card>
                    <v-card-title class="text-h5">
                        Agregar productos
                    </v-card-title>
                    <v-card-text class="pa-md-5">
                        <v-form ref="form">
                            <v-row>
                                <v-col :cols="cols[0]">
                                    <v-autocomplete v-model="add" id="selectProducto" ref="selectProducto"
                                        :items="productos" label="Productos" no-data-text="Sin productos"
                                        item-title="nombreCantidad" return-object placeholder="Escoja producto" required
                                        variant="outlined">
                                    </v-autocomplete>
                                </v-col>
                                <v-col :cols="cols[1]">
                                    <v-text-field v-model="cantidad" label="Cantidad" type="number" min="1"
                                        placeholder="Ingrese cantidad del producto" required
                                        variant="outlined"></v-text-field>

                                </v-col>
                                <v-col :cols="cols[2]">
                                    <v-btn elevation="4" size="x-large" @click="agregarProducto"
                                        color="primary">Añadir</v-btn>
                                </v-col>
                            </v-row>
                        </v-form>
                        <v-table class="pb-5" fixed-header fixed-footer v-if="compras.length != 0">
                            <thead style="z-index: 1000;" class="bg-table-header">
                                <tr>
                                    <th class="text-left">
                                        Producto
                                    </th>
                                    <th class="text-left">
                                        Cantidad
                                    </th>
                                    <th class="text-left">
                                        Precio unitario
                                    </th>
                                    <th class="text-left">
                                        Neto
                                    </th>
                                    <th class="text-left">Comentario</th>
                                    <th>Acción</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="(item, index) in compras" :key="index">
                                    <td class="text-left">{{ item.nombre }}</td>
                                    <td class="text-left">{{ item.cantidad }}</td>
                                    <td class="text-left">{{ item.precioU }}</td>
                                    <td class="text-left">{{ item.cantidad * item.precioU }}</td>
                                    <td>
                                        <v-row>
                                            <v-col cols="12" v-for="(com, indexC) in comentario[index]" :key="indexC">
                                                <v-textarea class="pt-3" v-model="comentario[index][indexC]"
                                                    label="Comentario"
                                                    :placeholder="'Ingrese comentario para el producto ' + item.nombre"
                                                    auto-grow variant="outlined" rows="2" row-height="10" shaped>{{ com }}
                                                </v-textarea>
                                            </v-col>
                                        </v-row>
                                    </td>
                                    <td><v-btn elevation="4" @click="eliminarCompra(index)" color="red">eliminar</v-btn>
                                    </td>
                                </tr>
                            </tbody>
                            <tfoot style="z-index: 1000;">
                                <tr>
                                    <td class="text-left footer-table" colspan="4">
                                        <strong> Pagar : {{ pagarNeto }}</strong>
                                    </td>
                                </tr>
                            </tfoot>
                        </v-table>
                        <v-row no-gutters justify="space-evenly" class="mb-4" v-if="compras.length != 0">
                            <v-btn elevation="4" @click="cancelarPedido" color="blue" size="x-large"
                                class="mb-3">Cancelar</v-btn>
                            <v-btn elevation="4" @click="guardarPedido" :disabled="disableBtn" color="green" size="x-large"
                                class="mr-2 mb-2">Guardar</v-btn>
                        </v-row>
                    </v-card-text>
                    <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn v-if="compras.length == 0" color="error" variant="text" @click="cancelarPedido">
                            Cancelar
                        </v-btn>
                    </v-card-actions>
                </v-card>
            </v-dialog>
        </v-row>
    </div>
</template>
  
<script>
import Swal from 'sweetalert2';
import axios from 'axios';
export default {
    name: 'agregarPedidoVista',
    components: {
    },
    data: () => ({
        dialog: false,
        valid: null,
        disableBtn: false,
        add: null,
        cantidad: null,
        comentario: [],
        form: {
            mesa: null,
            empleado: 1,//Se asigna al crear el componente
            detallePedido: [],
        },
        compras: [],
        ubicaciones: [],
        ubicacionesOcupadas: [],
        productos: [],
    }),

    methods: {
        agregarProducto() {
            if (this.cantidad != null && this.cantidad > 0 && this.add != null) {
                let existeP = false;
                this.form.detallePedido.map(pedido => {
                    if (pedido.producto == this.add.id) {
                        existeP = true
                    }
                });
                if (existeP) {
                    Swal.fire({
                        icon: 'error',
                        title: 'Oops...',
                        text: 'El producto ya fue seleccionado',
                        timer: 1700,
                        showConfirmButton: false,
                    });
                }
                else {
                    this.cantidad = parseInt(this.cantidad);
                    this.comentario.push(new Array(this.cantidad).fill(''));
                    this.compras.push({ nombre: this.add.nombre, cantidad: parseInt(this.cantidad), precioU: this.add.precio });
                    this.form.detallePedido.push({ pedido: 1, producto: this.add.id, cantidad: parseInt(this.cantidad), comentario: new Array(this.cantidad).fill(''), idInventario: this.add.idInventario });
                    this.cantidad = null;
                    this.add = null;
                }

            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: 'Escoja un producto e ingrese una cantidad mayor a 0',
                    timer: 1700,
                    showConfirmButton: false,
                });
            }
        },
        agregarPedidoMesa(id) {
            if (!this.mesaOcupada(id)) {
                this.form.mesa = id;
                this.dialog = true;
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'No se puede agregar pedido',
                    text: 'Todavía está mesa tiene un pedido en curso',
                    showConfirmButton: false,
                    timer: 1400
                });
            }
        },
        eliminarCompra(posicion = null) {
            this.compras.splice(posicion, 1);
            this.form.detallePedido.splice(posicion, 1);
            this.comentario.splice(posicion, 1);
        },
        async guardarPedido() {
            if (this.form.mesa == null || this.form.mesa.length == 0 || this.form.detallePedido.length == 0) {
                return Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: 'Debe seleccionar una mesa y productos',
                    timer: 1500,
                    showConfirmButton: false,
                });
            }
            this.disableBtn = true;
            this.comentario.map((comentario, index) => {
                this.form.detallePedido[index].comentario = comentario;
            });
            const resp = await axios.post(`${process.env.VUE_APP_API_URL}/pedido/crear`, this.form).then(resp => {
                return resp;
            }).catch(() => {
                Swal.fire({
                    icon: 'error',
                    title: 'Error!',
                    text: 'Pedido no registrado',
                    timer: 1780,
                    showConfirmButton: false,
                });
            });
            if (resp) {
                if (resp.data.noHayStock) {
                    this.comentario.splice(resp.data.indice, 1);
                    this.form.detallePedido.splice(resp.data.indice, 1);
                    this.compras.splice(resp.data.indice, 1);
                    Swal.fire({
                        icon: 'error',
                        title: 'No hay existencia',
                        text: resp.data.noHayStock,
                    });

                }
                else {
                    switch (resp.status) {
                        case 201:
                            this.reiniciarForm();
                            this.compras = [];
                            this.cantidad = null;
                            this.add = null;
                            this.comentario = [];
                            Swal.fire({
                                icon: 'success',
                                title: 'Creado',
                                text: 'Pedido creado correctamente',
                                timer: 1780,
                                showConfirmButton: false,
                            });
                            this.dialog = false;
                            await this.getMesasOcupadas();
                            await this.getMesas();
                            await this.getProductos();
                            break;
                        default:
                            break;
                    }
                }

            }
            this.disableBtn = false;
        },
        cancelarPedido() {
            this.$refs.selectProducto.isFocused = false;
            this.$refs.selectProducto.blur();
            Swal.fire({ title: 'Cancelar pedido', text: '¿Seguro de qué quiere cancelar el pedido?', icon: 'warning', showCancelButton: true, cancelButtonText: 'No, cerrar', confirmButtonText: 'Sí, cancelar', allowOutsideClick: false, stopKeydownPropagation: false }).then(resp => {
                if (resp.value) {
                    this.compras = [];
                    this.reiniciarForm();
                    this.dialog = false;
                }
            });
            this.$refs.selectProducto.blur();
        },
        obtenerClases(id) {
            return this.ubicacionesOcupadas.includes(id) ? 'cursor-not-allowed no-pointer-events' : 'cursor-pointer';
        },
        obtenerColor(id) {
            return this.ubicacionesOcupadas.includes(id) ? 'red' : 'green';
        },
        mesaOcupada(id) {
            return this.ubicacionesOcupadas.includes(id);
        },
        async getMesasOcupadas() {
            await axios.get(`${process.env.VUE_APP_API_URL}/pedido/mesas`).then(resp => {
                this.ubicacionesOcupadas = Array.isArray(resp.data) ? resp.data : [];
            });
        },
        async getMesas() {
            await axios.get(`${process.env.VUE_APP_API_URL}/mesa`).then(resp => {
                this.ubicaciones = Array.isArray(resp.data) ? resp.data : [];
            });

        },
        async getProductos() {
            await axios.get(`${process.env.VUE_APP_API_URL}/inventario`).then((resp) => {
                if (resp.data.response) {
                    return;
                }
                this.productos = [];
                resp.data.map(item => {
                    if (item.existencia > 0) {
                        item.producto.nombreCantidad = `${item.producto.nombre} - ${item.existencia}`;
                        item.producto.idInventario = item.id;
                        this.productos.push(item.producto);
                    }
                })
            });
        },
        reiniciarForm() {
            this.form = {
                mesa: null,
                empleado: this.$store.getters.usuario.empleado.id,
                detallePedido: [],
            };
        }
    },
    watch: {
        /*  buscandoCliente() {
             this.form.nombre = this.buscandoCliente;
         }, */
        /* nombreCliente() {
            
        } */
    },
    async created() {
        this.$emit('loadingSweet');
        await this.getMesasOcupadas();
        await this.getMesas();
        this.$emit('closeSweet');
        await this.getProductos();
        this.reiniciarForm();


    },
    computed: {
        pagarNeto() {
            let pagoN = 0;
            for (let item of this.compras) {
                pagoN += parseInt(item.cantidad * item.precioU);
            }
            return pagoN;
        },
        cols() {
            //Para que los input del modal sean responsive
            const { xxl, xl, lg, md } = this.$vuetify.display;
            let resp = [12, 12, 4];
            if (xxl || xl || lg) {
                resp = [4, 4, 4];
            }
            else if (md) {
                resp = [5, 5, 2];
            }
            return resp;
        }
    },

}
</script>

<style></style>