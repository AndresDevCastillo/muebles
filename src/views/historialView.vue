<template>
    <div class="historial">
        <v-card class="ma-3">
            <v-row class="px-6 my-4" justify="space-between">
                <v-col cols="auto" class="pb-0">
                    <div class="d-flex align-center">
                        <v-icon size="x-large" icon="mdi mdi-history"></v-icon>
                        <h1 class="px-3">Historial de facturas</h1>
                    </div>
                </v-col>
            </v-row>
            <v-row class="flex-column" no-gutters>
                <v-card class="w-100">
                    <v-table fixed-header fixed-footer class="w-100">
                        <thead style="z-index: 1000;" class="bg-table-header">
                            <tr>
                                <th class="text-left">
                                    # factura
                                </th>
                                <th class="text-left">
                                    Fecha creación
                                </th>
                                <th class="text-left">
                                    Fecha eliminación
                                </th>
                                <th class="text-left">
                                    Productos
                                </th>
                                <th class="text-left">
                                    Razón
                                </th>
                                <th class="text-left">
                                    Acción
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="(item, index) in historial" :key="index">
                                <td>{{ (item.codigo.length == 1 ? '000' : item.codigo.length == 2 ? '00' : item.codigo.length == 3 ? '0' : null) + item.codigo }}</td>
                                <td>{{ item.fecha_factura }} {{ item.hora_factura }}</td>
                                <td>{{ item.fecha_historial }} {{ item.hora_historial }}</td>
                                <td>{{ item.detalleHistorial.length }}</td>
                                <td>{{ item.razon }}</td>
                                <td>
                                    <v-btn color="blue" @click="verDetalleHistorial(Object.assign({}, item))"
                                        density="comfortable">Ver</v-btn>
                                </td>
                            </tr>
                        </tbody>
                    </v-table>
                </v-card>
            </v-row>
            <v-dialog v-model="dialogProductosHistorial" persistent width="700">
                <v-card>
                    <v-card-title>Productos</v-card-title>
                    <v-card-text>
                        <v-container>
                        </v-container>
                    </v-card-text>
                    <v-card-actions class="justify-end">
                        <v-btn color="red-darken-1" variant="tonal" @click="dialogProductosHistorial = false">
                            Cerrar
                        </v-btn>
                    </v-card-actions>
                </v-card>
            </v-dialog>
        </v-card>
        <detalleHistorialComponent :dialog="dialogTicket" :datos="historialFactura" @cerrarDialogoTicket="dialogTicket = false">
        </detalleHistorialComponent>
    </div>
</template>
<script>
import detalleHistorialComponent from '../components/detalleHistorial.vue';
import axios from 'axios'
export default {
    name: 'historialVista',
    components: {
        detalleHistorialComponent
    },
    data: () => ({
        dialogProductosHistorial: false,
        dialogTicket: false,
        api: process.env.VUE_APP_API_URL,
        historial: [],
        historialFactura: {}
    }),
    methods: {
        async obtenerHistorial() {
            await axios.get(`${this.api}/historial`).then(response => {
                this.historial = response.data;
            });
        },
        verDetalleHistorial(detalleHistorial = {}) {
            console.log(detalleHistorial);
            this.historialFactura = detalleHistorial;
            this.dialogTicket = true;
        }
    },
    async created() {
        this.$emit('loadingSweet', 'Cargando historial, por favor, espere...');
        await this.obtenerHistorial();
        this.$emit('closeSweet');
    }
}
</script>