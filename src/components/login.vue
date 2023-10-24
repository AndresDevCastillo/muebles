<template>
    <div class="login d-flex">
        <v-card width="450" class="pt-6 mx-auto my-auto" elevation="5">
            <v-card-title primary-title>
                <h3 class="headline text-center text-wrap">Iniciar sesión</h3>
            </v-card-title>
            <v-card-text class="px-4">
                <form ref="form">
                    <v-row class="flex-column">
                        <v-col cols="12" class="pa-3">
                            <v-text-field v-model="paquete.usuario" variant="outlined" label="Usuario" :rules="usuarioRule"
                                placeholder="Ingrese su usuario" prepend-inner-icon="mdi-account-lock"></v-text-field>
                        </v-col>
                        <v-col cols="12" class="pa-3">
                            <v-text-field v-model="paquete.contrasena" :type="visible ? 'text' : 'password'"
                                variant="outlined" label="Contraseña" placeholder="Ingrese su contraseña"
                                :append-inner-icon="visible ? 'mdi-eye-off' : 'mdi-eye'"
                                prepend-inner-icon="mdi-lock-outline"
                                @click:append-inner="visible = !visible"></v-text-field>
                        </v-col>
                    </v-row>
                </form>
            </v-card-text>
            <v-card-actions justify="center" class="px-4 align-content-end">
                <v-btn color="success" variant="elevated" @click="ingresar" class="ml-auto">INGRESAR</v-btn>
            </v-card-actions>
        </v-card>
    </div>
</template>
<script>
import Swal from 'sweetalert2';
import axios from 'axios';
export default {
    name: 'loginComponent',
    data: () => ({
        visible: false,
        usuarioRule: [
            v => !!v || 'Usuario es requerido',
        ],
        paquete: {
            usuario: null,
            contrasena: null
        }
    }),
    methods: {
        async ingresar() {
            if (this.paquete.usuario != null && this.paquete.usuario.trim().length > 0) {
                this.loadingSweet();
                await axios.post(`${process.env.VUE_APP_API_URL}/auth/login`, this.paquete).then(response => {
                    this.closeSweet();
                    switch (response.status) {
                        case 401:
                            Swal.fire({ icon: 'warning', text: 'Algo paso, intenta otra vez o contacta con soporte', showConfirmButton: false, timer: 1740 });
                            break;
                        case 200:
                            this.$store.commit('setusuario', response.data);
                            switch (response.data.empleado.tipoCargo) {
                                case 'Engineersoft':
                                    this.$router.push('/inicio/empleados');
                                    break;
                                case 'Mesero':
                                    this.$router.push('/inicio/agregarPedido');
                                    break;
                                case 'Admin':
                                    this.$router.push('/inicio/empleado');
                                    break;
                                case 'Cajero':
                                    this.$router.push('/inicio/factura');
                                    break;
                                case 'Cocinero':
                                    this.$router.push('/inicio/cocinero');
                                    break;
                            }
                            break;
                    }
                }).catch(error => {
                    this.closeSweet();
                    Swal.fire({ icon: 'error', text: error.response.data.message, showConfirmButton: false, timer: 1600 });
                });
            } else {
                Swal.fire({ icon: 'error', text: 'Debes ingresar usuario y contraseña', showConfirmButton: false, timer: 1600 });
            }
        },
        loadingSweet() {
            Swal.fire({
                text: 'Autenticando, por favor, espere...',
                timerProgressBar: true,
                showConfirmButton: false,
                allowEscapeKey: false,
                allowOutsideClick: false,
                didOpen: () => {
                    Swal.showLoading();
                },
                customClass: {
                    popup: 'loader'
                }
            });
        },
        closeSweet() {
            Swal.close();
        }
    },
    created() {
    }

}
</script>
<style>
body,
html {
    overflow: auto;
}

.login {
    width: 100%;
    height: 100%;
    min-width: 100%;
    min-height: 100%;
    background: url('../assets/login/fondo.jpg');
    background-size: cover;
    background-attachment: fixed;
    background-position: 50% 50%;
}
</style>