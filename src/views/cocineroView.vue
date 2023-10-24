<template>
    <div class="cocinero">
        <v-card class="ma-3">
            <v-card-title>
                <v-row class="px-6 my-4">
                    <v-col cols="12">
                        <v-row class="align-center" no-gutters>
                            <v-icon size="x-large" icon="mdi mdi-chef-hat"></v-icon>
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
                                    Plato
                                </th>
                                <th class="text-left">
                                    Nota
                                </th>
                                <th class="text-left">Mesa</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-if="pedidosTabla.length == 0">
                                <td colspan="7" class="text-center">Sin pedidos</td>
                            </tr>
                            <tr v-for="(pedido, index) in pedidosTabla" :key="index">
                                <td class="text-left">{{ pedido.ticket }}</td>
                                <td>
                                    {{ pedido.plato }}
                                </td>
                                <td>
                                    {{ pedido.nota }}
                                </td>
                                <td>{{ pedido.mesa }}</td>
                            </tr>
                        </tbody>
                    </v-table>
                </div>
            </v-card-text>
        </v-card>
    </div>
</template>
<script>
import axios from 'axios';
export default {
    name: 'cocineroVista',
    data: () => ({
        pedidos: [],
        pedidosTabla: [],
        api: process.env.VUE_APP_API_URL,
        interval: null
    }),
    methods: {
        async obtenerPedidos() {
            await axios.get(`${this.api}/pedido/cocinero`).then(response => {
                this.pedidosTabla = [];
                this.pedidos = response.data;
                this.pedidos.forEach(pedido => {
                    const t = pedido.ticket.toString().length;
                    pedido.detalleTicket.forEach(detalle => {
                        detalle.comentario.forEach(com => {
                            this.pedidosTabla.push({ ticket: (t == 1 ? '000' : t == 2 ? '00' : t == 3 ? '0' : '') + pedido.ticket, plato: `${detalle.producto.nombre} - ${detalle.producto.descripcion}`, nota: com, mesa: pedido.mesa.nombre });
                        });
                    });
                });
            });
            this.interval = setInterval(() => {
                this.obtenerPedidos();
            }, 30000);
        }
    },
    async created() {
        this.$emit('loadingSweet');
        await this.obtenerPedidos();
        this.$emit('closeSweet');
    },
    unmounted() {
        clearInterval(this.interval);
    }
}
</script>
