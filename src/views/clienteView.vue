<template>
    <v-card class="ma-3">
        <v-card-title>
            <v-row class="my-4" justify="space-between">
                <v-col cols="auto">
                    <v-row class="align-center" no-gutters>
                        <v-icon size="x-large" icon="mdi mdi-account-group-outline"></v-icon>
                        <h1 class="px-3">Clientes</h1>
                    </v-row>
                </v-col>
                <v-col cols="auto">
                    <v-btn prepend-icon="mdi-plus" color="blue" @click="dialogCliente = true;">Agregar cliente</v-btn>
                </v-col>
            </v-row>
        </v-card-title>
        <v-card-text>
            <v-table fixed-header style="margin-bottom: 100px;">
                <thead style="z-index: 1000" class="bg-table-header">
                    <tr>
                        <th class="text-left">Cédula</th>
                        <th class="text-left">Nombres</th>
                        <th class="text-left">Correo</th>
                        <th class="text-left">Teléfono</th>
                        <th class="text-center"> Acción</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-if="clientes.length == 0">
                        <td colspan="4" class="text-center">Sin clientes</td>
                    </tr>
                    <tr v-for="(cliente, index) in clientes" :key="index">
                        <td class="text-left">{{ cliente.cedula }}</td>
                        <td class="text-left">{{ cliente.nombre }}</td>
                        <td class="text-left">{{ cliente.correo }}</td>
                        <td class="text-left">{{ cliente.telefono }}</td>
                        <td style="text-align: center;"><v-btn density="comfortable"
                                @click="eliminarCliente(cliente.cedula)" color="red">eliminar</v-btn>
                        </td>
                    </tr>
                </tbody>
            </v-table>
        </v-card-text>
        <v-dialog v-model="dialogCliente" persistent width="700">
            <clienteComponent @save="$emit('loadingSweet')" @endSave="$emit('closeSweet')"
                @cerrarDialog="dialogCliente = false;" @cerrarYLlenar="nuevoCliente" />
        </v-dialog>
    </v-card>
</template>
<script>
import axios from 'axios';
import Swal from 'sweetalert2';
import clienteComponent from '../components/cliente.vue';
export default {
    components: {
        clienteComponent
    },
    data: () => ({
        dialogCliente: false,
        clientes: [],
        api: process.env.VUE_APP_API_URL,
    }),
    methods: {
        async obtenerClientes() {
            this.$emit('loadingSweet');
            await axios.get(`${this.api}/cliente`).then(response => {
                this.clientes = response.data;
            });
            this.$emit('closeSweet');
        },
        async eliminarCliente(cedula) {
            Swal.fire({
                icon: "info",
                title: "Seguro quiere eliminar el cliente?",
                showDenyButton: true,
                denyButtonText: "No",
                confirmButtonText: "Eliminar",
            })
                .then(async (result) => {
                    /* Read more about isConfirmed, isDenied below */
                    if (result.isConfirmed) {
                        await axios.delete(`${this.api}/cliente/${cedula}`).then(async () => {
                            Swal.fire({
                                icon: "success",
                                title: "Se elimino correctamente",
                                timer: 1000,
                                showConfirmButton: false,
                            });
                            await this.obtenerClientes();
                        });
                    }
                })
                .catch(() => {
                    return Swal.fire({
                        icon: "error",
                        title: "No se pudo eliminar al cliente",
                        timer: 1000,
                    });
                });
        }
    },
    created() {
        this.obtenerClientes();
    }
}
</script>