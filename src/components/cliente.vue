<template>
    <v-card>
        <v-card-text>
            <v-container>
                <v-form ref="formCliente">
                    <v-row>
                        <v-col cols="12">
                            <v-text-field label="Cédula" type="number" variant="outlined"
                                hint="Sin comas o puntos (, .)" persistent-hint required :counter="14"
                                v-model="formCliente.cedula" :rules="cedulaRules"></v-text-field>
                        </v-col>
                        <v-col cols="12">
                            <v-text-field label="Nombre" type="text" required
                                variant="outlined" v-model="formCliente.nombre" :rules="nombreRules"
                                :counter="65"></v-text-field>
                        </v-col>
                        <v-col cols="12" sm="6">
                            <v-text-field label="Correo" type="email"
                                variant="outlined" v-model="formCliente.correo">
                            </v-text-field>
                        </v-col>
                        <v-col cols="12" sm="6">
                            <v-text-field label="Teléfono" type="tel" required
                                variant="outlined" v-model="formCliente.telefono" :rules="[v => !!v || 'El teléfono es requerido', v => (v && /^[0-9]+$/.test(v)) || 'El número no debe contener caracteres sólo números']"></v-text-field>
                        </v-col>
                    </v-row>
                </v-form>
            </v-container>
        </v-card-text>
        <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="red-darken-1" variant="tonal" @click="cerrarDialogCliente">
                Cerrar
            </v-btn>
            <v-btn color="green-darken-1" ref="btnCrear" :disabled="disableBtn" variant="tonal" @click="crearCliente">
                Crear
            </v-btn>
        </v-card-actions>
    </v-card>
</template>
<script>
import axios from 'axios';
import Swal from 'sweetalert2';
export default {
    name: 'clienteComponent',
    data: () => ({
        disableBtn: false,
        nombreRules: [
            v => !!v || 'El nombre es requerido',
            v => (v && v.length <= 65) || 'EL nombre no puede superar los 65 caracteres',
        ],
        usuarioRules: [
            v => !!v || 'El usuario es requerido',
            v => (v && v.length > 3) || 'EL nombre debe tener mínimo 4 caracteres',
        ],
        cedulaRules: [v => !!v || 'La cédula es requerida', v => (v && /^[0-9]+$/.test(v)) || 'El número no debe contener caracteres sólo números'],
        formCliente: {
            cedula: null,
            nombre: null,
            telefono: null,
            correo: null
        },
        api: process.env.VUE_APP_API_URL,
    }),
    methods: {
        async crearCliente() {
            const { valid } = await this.$refs.formCliente.validate();
            if (valid) {
                this.disableBtn = true;
                this.formCliente.cedula = parseInt(this.formCliente.cedula);
                await axios.post(`${this.api}/cliente/crear`, this.formCliente).then(response => {
                    switch (response.status) {
                        case 201:
                            Swal.fire({ icon: 'success', text: 'Cliente creado', showConfirmButton: false, timer: 1500 });
                            this.$emit('cerrarYLlenar', response.data[0]);
                            this.$refs.formCliente.reset();
                            break;
                        case 409:
                            Swal.fire({ icon: 'warning', text: response.data.message, showConfirmButton: false, timer: 1500 });
                            this.$refs.formCliente.reset();
                            break;
                    }
                }).catch(error => {
                    switch (error.response.status) {
                        case 409:
                            Swal.fire({ icon: 'warning', text: error.response.data.message, showConfirmButton: false, timer: 1500 });
                            break;
                        default:
                            Swal.fire({ icon: 'error', text: 'No se pudo crear el cliente', showConfirmButton: false, timer: 1600 });
                            break;
                    }
                });
                this.disableBtn = false;
            }
        },
        cerrarDialogCliente() {
            this.$emit('cerrarDialog');
        }
    }
}
</script>