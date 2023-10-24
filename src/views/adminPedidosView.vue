<template>
    <div class="adminPedido">
        <v-card class="ma-3">
            <v-card-title>
                <v-row class="px-6 my-4">
                    <v-col cols="12">
                        <v-row class="align-center" no-gutters>
                            <v-icon size="x-large" icon="mdi mdi-order-bool-descending-variant"></v-icon>
                            <h1 class="px-3">Pedidos</h1>
                        </v-row>
                    </v-col>
                </v-row>
            </v-card-title>
            <v-card-text>
                <div class="table-responsive">
                    <v-table fixed-header fixed-footer class="w-100">
                        <thead style="z-index: 1000;" class="bg-table-header">
                            <tr>
                                <th class="text-left">
                                    # pedido
                                </th>
                                <th class="text-left">
                                    Fecha
                                </th>
                                <th class="text-left">
                                    N. productos
                                </th>
                                <th class="text-left">
                                    Mesa
                                </th>
                                <th class="text-left">
                                    Empleado
                                </th>
                                <th colspan="5" class="text-center">
                                    Acción
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-if="pedidos.length == 0">
                                <td colspan="10" class="text-center">Sin pedidos</td>
                            </tr>
                            <tr v-for="(pedido, index) in pedidos" :key="index">
                                <td class="text-left">{{ pedido.ticket }}</td>
                                <td class="text-left">{{ pedido.fecha }} - {{ pedido.hora }}</td>
                                <td class="text-left">{{ pedido.detalleTicket.length }}</td>
                                <td class="text-left">{{ pedido.mesa.nombre }}</td>
                                <td class="text-left">{{ pedido.empleado.nombre }}</td>
                                <td class="text-right pr-0">
                                    <v-btn color="red" density="comfortable" @click="eliminarPedido(pedido.ticket)">
                                        Eliminar </v-btn>
                                </td>
                                <td class="text-right px-0">
                                    <v-btn color="green" v-if="puedeCambiar()" density="comfortable"
                                        @click="dialogMesa(pedido.ticket, pedido.mesa.id)">
                                        Cambiar mesa</v-btn>
                                </td>
                                <td class="text-right px-0">
                                    <v-btn color="orange" density="comfortable" :disabled="disableBtnListo"
                                        @click="marcarPedidoListo(pedido.ticket)">
                                        Listo</v-btn>
                                </td>
                                <td class="text-right px-0">
                                    <v-btn color="blue" density="comfortable"
                                        @click="mostrarTicket(Object.assign({}, pedido))">
                                        Ver
                                    </v-btn>
                                </td>
                                <td v-if="pedido.calificacion < 1">
                                    <v-btn color="yellow" density="comfortable"
                                        @click="abrirCalificar(pedido.ticket)">Calificar</v-btn>
                                </td>
                            </tr>
                        </tbody>
                    </v-table>
                </div>
            </v-card-text>
        </v-card>
        <ticket-cocinero-component :dialog2="dialogTicket" :ticket="ticketImpreso"
            @cerrarDialogoTicketCocinero="dialogTicket = false"></ticket-cocinero-component>
        <v-dialog v-model="dialogCambioMesa" persistent width="700">
            <v-card>
                <v-card-text>
                    <v-container>
                        <v-form ref="formCambioMesa">
                            <v-row>
                                <v-col cols="12">
                                    <v-autocomplete label="Mesas disponibles" v-model="cambioMesa.mesaNew"
                                        :items="mesasDisponibles" item-title="nombre" item-value="id" required
                                        variant="outlined" placeholder="Escoja mesa" no-data-text="Sin mesas disponibles"
                                        :rules="campoRules"></v-autocomplete>
                                </v-col>
                            </v-row>
                        </v-form>
                    </v-container>
                </v-card-text>
                <v-card-actions class="justify-end">
                    <v-btn color="red-darken-1" variant="tonal" @click="dialogCambioMesa = false">
                        Cerrar
                    </v-btn>
                    <v-btn color="green-darken-1" :disabled="disableBtn" @click="cambiarMesa">
                        Cambiar mesa
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
        <v-dialog v-model="dialogCalificar" persistent width="700">
            <v-card>
                <v-card-text>
                    <v-container>
                        <RatingComponent :grade="0" @calificarEmit="calificarPedido" :maxStars="5" :hasCounter="true" />
                    </v-container>
                </v-card-text>
                <v-card-actions class="justify-end">
                    <v-btn color="red-darken-1" variant="tonal" @click="dialogCalificar = false">
                        Cerrar
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </div>
</template>
<script>
import axios from 'axios'
import Swal from 'sweetalert2';
import ticketCocineroComponent from '../components/ticketCocinero.vue'
import RatingComponent from '../components/rating.vue'
export default {
    name: 'adminPedidosVista',
    components: {
        ticketCocineroComponent,
        RatingComponent
    },
    data: () => ({
        calificacion: 1,
        disableBtn: false,
        dialogTicket: false,
        dialogCambioMesa: false,
        dialogCalificar: false,
        disableBtnListo: false,
        idTicket: null,
        pedidos: [],
        mesasDisponibles: [],
        api: process.env.VUE_APP_API_URL,
        campoRules: [
            v => !!v || 'Campo requerido',
        ],
        ticketImpreso: {
            ticket: null,
            fecha: null,
            hora: null,
            detalleTicket: [],
            empleado: {},
            mesa: {},
        },
        cambioMesa: {
            mesaOld: null,
            mesaNew: null,
            ticket: null
        }
    }),
    methods: {
        async abrirCalificar(id) {
            this.idTicket = id;
            this.dialogCalificar = true;
        },
        async calificarPedido(data) {
            this.dialogCalificar = false;
            await axios.put(`${process.env.VUE_APP_API_URL}/pedido/calificar/${this.idTicket}`, data)
                .then(() => {
                    Swal.fire({
                        icon: "success",
                        title: "Se califico correctamente",
                        timer: 1000,
                        showConfirmButton: false,
                    });
                })
                .catch((error) => {
                    console.log(error);
                    Swal.fire({
                        icon: "error",
                        title: "No se califico correctamente",
                        timer: 1000,
                        showConfirmButton: false,
                    });
                })
            await this.obtenerPedidos();
        },
        async obtenerPedidos() {
            await axios.get(`${this.api}/pedido`).then(response => {
                this.pedidos = response.data;
            });
        },
        async eliminarPedido(ticket) {
            Swal.fire({
                icon: "info",
                title: "Seguro quiere eliminar el pedido?",
                showDenyButton: true,
                denyButtonText: "No",
                confirmButtonText: "Eliminar",
            })
                .then(async (result) => {
                    /* Read more about isConfirmed, isDenied below */
                    if (result.isConfirmed) {
                        await axios.delete(`${this.api}/pedido/${ticket}`).then(async () => {
                            Swal.fire({
                                icon: "success",
                                title: "Se elimino correctamente",
                                timer: 1000,
                                showConfirmButton: false,
                            });
                            await this.obtenerPedidos();
                        });
                    }
                })
                .catch(() => {
                    return Swal.fire({
                        icon: "error",
                        title: "No se pudo eliminar el gasto",
                        timer: 1000,
                    });
                });

        },
        mostrarTicket(ticket) {
            this.ticketImpreso = ticket;
            this.dialogTicket = true;
        },
        dialogMesa(ticket, mesaOld) {
            if (ticket && mesaOld) {
                this.dialogCambioMesa = true;
                this.cambioMesa.ticket = parseInt(ticket);
                this.cambioMesa.mesaOld = parseInt(mesaOld);
            }
        },
        async cambiarMesa() {
            const { valid } = await this.$refs.formCambioMesa.validate();
            if (valid) {
                this.cambioMesa.mesaNew = parseInt(this.cambioMesa.mesaNew);
                this.disableBtn = true;
                await axios.post(`${this.api}/pedido/cambiarMesa`, this.cambioMesa).then(() => {
                    this.obtenerPedidos();
                    this.getMesasDisponibles();
                    Swal.fire({ text: 'Mesa cambiada', icon: 'success', showConfirmButton: false, timer: 1500 });
                    this.dialogCambioMesa = false;
                }).catch(error => {
                    console.log('Error', error);
                    Swal.fire({ text: 'No se pudo cambiar la mesa', icon: 'error', showConfirmButton: false, timer: 1600 });
                })
                this.disableBtn = false;
            }
        },
        async getMesasDisponibles() {
            await axios.get(`${this.api}/mesa/disponibles`).then(response => {
                this.mesasDisponibles = response.data;
            }).catch(error => {
                console.log('Error', error);
            });
        },
        puedeCambiar() {
            if (this.$store.getters.usuario) {
                const cargo = this.$store.getters.usuario.empleado.tipoCargo.toLowerCase();
                const cargoPermitido = ['mesero', 'engineersoft'];
                return cargoPermitido.includes(cargo);
            }
            return false;
        },
        async marcarPedidoListo(ticket) {
            this.disableBtnListo = true;
            await axios.put(`${this.api}/pedido/listo/${ticket}`).then(() => {
                Swal.fire({ icon: 'success', text: 'Pedido terminado', showConfirmButton: false, timer: 1600 });
            }).catch(error => {
                console.log(error);
                Swal.fire({ icon: 'error', text: 'No se pudo marcar el pedido', showConfirmButton: false, timer: 1600 });
            });
            this.disableBtnListo = false;
        }
    },
    async created() {
        this.$emit('loadingSweet');
        await this.getMesasDisponibles();
        await this.obtenerPedidos();
        this.$emit('closeSweet');
    }
}
</script>