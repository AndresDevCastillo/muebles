<template>
    <div class="adminFactura">
        <v-card class="ma-3">
            <v-card-title>
                <v-row class="px-6 my-4">
                    <v-col cols="12">
                        <v-row class="align-center" no-gutters>
                            <v-icon size="x-large" icon="mdi mdi-file-settings"></v-icon>
                            <h1 class="px-3">Facturas</h1>
                        </v-row>
                    </v-col>
                    <v-col cols="12">
                        <v-row>
                            <v-col cols="5">
                                <v-text-field v-model="facturaId" label="Factura" type="number"
                                    placeholder="Ingrese el numero de la factura" required
                                    variant="outlined"></v-text-field>
                            </v-col>
                        </v-row>
                    </v-col>
                    <v-col lg="3" md="3" sm="4" v-if="facturaId">
                        <v-btn prepend-icon="mdi-plus" color="blue" style="min-width: 170px;"
                            @click="verFacturaGeneral()">Ver</v-btn>
                    </v-col>
                    <v-col lg="3" md="3" sm="3" v-if="facturaId">
                        <v-btn prepend-icon="mdi-plus" @click="eliminarFactura(facturaId)" color="red">Eliminar</v-btn>
                    </v-col>
                </v-row>
            </v-card-title>
            <v-card-text>
                <div class="table-responsive">
                    <v-table fixed-header fixed-footer class="w-100">
                        <thead style="z-index: 1000;" class="bg-table-header">
                            <tr>
                                <th class="text-left">
                                    # factura
                                </th>
                                <th class="text-left">
                                    Fecha
                                </th>
                                <th class="text-left">
                                    Cliente
                                </th>
                                <th class="text-left">
                                    Total
                                </th>
                                <th class="text-left">
                                    Descuento
                                </th>
                                <th class="text-left">
                                    Propina
                                </th>
                                <th colspan="2" class="text-center">
                                    Acción
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-if="facturas.length == 0">
                                <td colspan="7" class="text-center">Sin facturas</td>
                            </tr>
                            <tr v-for="(factura, index) in facturas" :key="index">
                                <td class="text-left">{{ factura.codigo.toString().length == 1 ? '000' :
                                    factura.codigo.toString().length == 2 ? '00' : factura.codigo.toString().length == 3 ?
                                        '0' :
                                        null }}{{ factura.codigo }}</td>
                                <td class="text-left">{{ factura.fecha }} {{ factura.hora }}</td>
                                <td class="text-left">{{ factura.cliente.nombre }}</td>
                                <td class="text-left">{{ factura.total.toLocaleString() }}</td>
                                <td class="text-left">{{ factura.descuento }}%</td>
                                <td class="text-left">{{ factura.propina }}</td>
                                <td>
                                    <v-btn color="red" density="comfortable"
                                        @click="eliminarFacturaDialog(factura.codigo)">Eliminar
                                        factura</v-btn>
                                </td>
                                <td>
                                    <v-btn color="blue" @click="verFactura(Object.assign({}, factura))"
                                        density="comfortable">Ver</v-btn>
                                </td>
                            </tr>
                        </tbody>
                    </v-table>
                </div>
            </v-card-text>
        </v-card>
        <ticketComponent :dialog="dialogTicket" :datos="facturaImpresa" @cerrarDialogoTicket="dialogTicket = false">
        </ticketComponent>
        <v-dialog v-model="dialogEliminarFactura" persistent width="700">
            <v-card>
                <v-card-text>
                    <v-container>
                        <v-form ref="formEliminarFactura">
                            <v-row>
                                <v-col cols="12">
                                    <v-textarea
                                        v-model="formEliminarFactura.razon"
                                        label="Razón eliminación"
                                        placeholder="Ingrese razón por la cual elimina la factura"
                                        auto-grow
                                        variant="outlined"
                                        rows="6"
                                        row-height="10"
                                        shaped :rules="camposRules"></v-textarea>
                                </v-col>
                            </v-row>
                        </v-form>
                    </v-container>
                </v-card-text>
                <v-card-actions class="justify-end">
                    <v-btn color="red-darken-1" variant="tonal" @click="dialogEliminarFactura = false">
                        Cancelar
                    </v-btn>
                    <v-btn color="green-darken-1" variant="tonal" :disabled="disableBtn" @click="eliminarFactura">
                        Eliminar
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </div>
</template>
<script>
import axios from 'axios'
import Swal from 'sweetalert2';
import ticketComponent from "../components/ticket.vue";


export default {
    name: 'adminFacturasVista',
    components: {
        ticketComponent,
    },
    data: () => ({
        dialogEliminarFactura: false,
        disableBtn: false,
        facturas: [],
        api: process.env.VUE_APP_API_URL,
        dialogTicket: false,
        facturaImpresa: null,
        facturaId: null,
        miFactura: null,
        formEliminarFactura: {
            id: null,
            razon: null,
        },
        camposRules: [
            v => !!v || 'Campo requerido',
            v => /^(?!\s*$).+/ig.test(v) || 'La razón no puede estar vacía'
        ]
    }),
    methods: {
        async obtenerFacturas() {
            await axios.get(`${this.api}/factura`).then(response => {
                this.facturas = response.data;
            });
        },
        eliminarFacturaDialog(id = null) {
            if (id) {
                this.formEliminarFactura.id = parseInt(id);
                this.dialogEliminarFactura = true;
            }
        },
        async eliminarFactura() {
            const { valid } = await this.$refs.formEliminarFactura.validate();
            if (valid) {
                this.disableBtn = true;
                this.formEliminarFactura.razon = this.formEliminarFactura.razon.trim();
                await axios.put(`${this.api}/factura/eliminar`, this.formEliminarFactura).then(response => {
                    const m = response.data ? 'Factura eliminada' : 'No se pudo eliminar';
                    const i = response.data ? 'success' : 'error';
                    Swal.fire({ text: m, icon: i, showConfirmButton: false, timer: 1500 });
                    this.dialogEliminarFactura = false;
                }).catch(error => {
                    console.log(error);
                    Swal.fire({ text: 'Sucedio algo eliminando, inténtelo nuevamente', icon: 'error', showConfirmButton: false, timer: 1600 });
                });
                this.obtenerFacturas();
                this.disableBtn = false;
            }

            /*     Swal.fire({
                    icon: "info",
                    title: "Seguro quiere eliminar el la factura?",
                    showDenyButton: true,
                    denyButtonText: "No",
                    confirmButtonText: "Eliminar",
                })
                    .then(async (result) => {
                        /* Read more about isConfirmed, isDenied below 
                        if (result.isConfirmed) {
                            await axios.delete(`${this.api}/factura/${codigo}`).then(async () => {
                                Swal.fire({
                                    icon: "success",
                                    title: "Se elimino correctamente",
                                    timer: 1000,
                                    showConfirmButton: false,
                                });
                                this.facturaId = null;
                                await this.obtenerFacturas();
                            });
                        }
                    })
                    .catch(() => {
                        return Swal.fire({
                            icon: "error",
                            title: "No se pudo eliminar la factura",
                            timer: 1000,
                        });
                    });
     */
        },
        verFactura(factura) {
            this.facturaImpresa = factura;
            this.dialogTicket = true;
        },
        async verFacturaGeneral() {
            this.$emit('loadingSweet');
            await axios.get(`${process.env.VUE_APP_API_URL}/factura/${this.facturaId}`).then(resp => {
                if (resp.data.response) {
                    return Swal.fire({
                        icon: "error",
                        title: "No se pudo encontrar la factura",
                        timer: 1000,
                    });
                }
                else {
                    this.$emit('closeSweet');
                    this.verFactura(resp.data);
                }
            });
            this.$emit('closeSweet');
        }

    },
    async created() {
        this.$emit('loadingSweet');
        await this.obtenerFacturas();
        this.$emit('closeSweet');
    }
}
</script>
