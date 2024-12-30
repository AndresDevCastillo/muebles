<template>
    <div class="modal-vendedores">
        <v-dialog v-model="this.$props.dialogVendedores" persistent width="700">
            <v-card>
                <v-card-text>
                    <v-container>
                        <v-form ref="formVendedores">
                            <v-row>
                                <v-col cols="12">
                                    <v-text-field label="Nombre" required variant="outlined"
                                        v-model="formVendedores.nombre" :rules="nombreRules"
                                        :counter="65"></v-text-field>
                                </v-col>
                                <v-card-actions>
                                    <v-spacer></v-spacer>
                                    <v-btn color="green-darken-1" variant="tonal" :disabled="disableBtn"
                                        @click="crearVendedor()">
                                        Crear
                                    </v-btn>
                                    <v-btn color="red-darken-1" variant="tonal" @click="cerrarDialogVendedor">
                                        Cerrar
                                    </v-btn>
                                </v-card-actions>
                                <v-data-table :headers="headersVendedores" :items="vendedores"
                                    :sort-by="[{ key: 'nombre', order: 'asc' }]" class="elevation-1">

                                    <template v-slot:item.actions="{ item }">
                                        <v-icon size="small" @click="eliminarVendedor(item._id)">
                                            mdi-delete
                                        </v-icon>
                                    </template>
                                </v-data-table>
                            </v-row>
                        </v-form>
                    </v-container>
                </v-card-text>
            </v-card>
        </v-dialog>
    </div>

</template>

<script>
import Session from "@/validation/session";
import Swal from "sweetalert2";
import axios from "axios";
export default {
    name: 'modalVendedoresComponent',
    props: { dialogVendedores: { type: Boolean, default: false } },
    data() {
        return {
            api: import.meta.env.VITE_APP_API_URL,
            token: null,
            disableBtn: false,
            vendedores: [],
            formVendedores: {
                nombre: null,
            },
            headersVendedores: [
                { title: "Nombre", key: "nombre" },
                { title: "Actions", key: "actions" },
            ],
            nombreRules: [
            v => !!v || 'El nombre es requerido',
            v => (v && v.length <= 65) || 'EL nombre no puede superar los 65 caracteres',
            ],
        };
    },
    methods: {
        cerrarDialogVendedor() {
            this.$emit("cerrarDialog");
        },
        async getVendedores() {
            await axios
                .get(`${this.api}/vendedor`, {
                    headers: {
                        Authorization: `Bearer ${this.token}`,
                    },
                })
                .then((resp) => {
                    this.vendedores = resp.data;
                })
                .catch((error) => {
                    switch (error.response.status) {
                        case 401:
                            Session.expiredSession();
                            break;
                        default:
                            Swal.fire({
                                icon: "info",
                                text: "No se pudo obtener los clientes",
                                showConfirmButton: false,
                                timer: 1600,
                            });
                            break;
                    }
                });
        },
        async crearVendedor() {
            const { valid } = await this.$refs.formVendedores.validate();
            if (valid) {
                this.disableBtn = true;
                await axios.post(`${this.api}/vendedor/crear`, this.formVendedores, {
                    headers: {
                        Authorization: `Bearer ${this.token}`
                    }
                }).then((resp) => {
                    if (resp.status == 201) {
                        return Swal.fire({
                            icon: 'success',
                            title: 'Exitoso',
                            text: 'vendedor creado correctamente!',
                            showConfirmButton: false,
                            timer: 1500
                        });
                    }
                }).catch(async error => {
                    console.log(error);
                    switch (error.response.status) {
                        case 401:
                            await Swal.fire({ icon: 'warning', title: 'Tu sesión expiro, vuelve a iniciar sesión', showConfirmButton: false, timer: 1500 });
                            this.$store.commit('setusuario', { usuario: null, hora_login: null });
                            this.$router.push('/');
                            break;

                        default:
                            Swal.fire({ icon: 'error', title: 'No se pudo crear el vendedor', showConfirmButton: false, timer: 1500 });
                            break;
                    }
                });
            }
            this.disableBtn = false;
            this.formVendedores = {
                nombre: null,
            };
            await this.getVendedores();
        },
        async eliminarVendedor(id) {
            await axios
                .delete(`${this.api}/vendedor/${id}`, {
                    headers: {
                        Authorization: `Bearer ${this.token}`,
                    },
                })
                .then(() => {
                    Swal.fire({
                        icon: 'success',
                        title: 'Exitoso',
                        text: 'vendedor eliminado correctamente!',
                        showConfirmButton: false,
                        timer: 1500
                    });
                    this.getVendedores();
                })
                .catch((error) => {
                    switch (error.response.status) {
                        case 401:
                            Session.expiredSession();
                            break;
                        default:
                            Swal.fire({
                                icon: "info",
                                text: "No se pudo obtener los clientes",
                                showConfirmButton: false,
                                timer: 1600,
                            });
                            break;
                    }
                });
        },
    },
    async mounted() {
        this.token = this.$store.getters.usuario.usuario.access_token;
        await this.getVendedores();
    }
};
</script>

<style scoped>
.modal-vendedores {
    /* Add your component styles here */
}
</style>