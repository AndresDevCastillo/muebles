<template>
    <div class="empleados">
        <v-card class="ma-3">
            <v-row class="px-6 my-4" justify="space-between">
                <v-col cols="auto" class="pb-0">
                    <div class="d-flex align-center"><v-icon size="x-large" icon="mdi mdi-account-cog"></v-icon>
                        <h1 class="px-3">Administración de empleados</h1>
                    </div>
                </v-col>
                <v-col cols="auto">
                    <v-btn prepend-icon="mdi-plus" class="me-2 my-2" color="green" @click="dialogE = true;">Empleado</v-btn>
                    <v-btn prepend-icon="mdi-plus" color="yellow" @click="dialogU = true;">Usuario</v-btn>
                </v-col>
            </v-row>
            <v-row class="flex-column">
                <v-card class="ma-3 w-100">
                    <v-card-title>
                        <v-col cols="4">
                            <v-text-field v-model="searchEmpleado" append-inner-icon="mdi-magnify" label="Buscar"
                                variant="outlined" hide-details>
                            </v-text-field>
                        </v-col>
                    </v-card-title>
                    <v-data-table :headers="headers" :items="empleados" :sort-by="[{ key: 'nombre', order: 'asc' }]"
                        class="elevation-1" :search="searchEmpleado" no-data-text="Sin empleados">
                        <!-- eslint-disable-next-line vue/valid-v-slot -->
                        <template v-slot:item.actions="{ item }">
                            <v-icon size="small" class="me-2" @click="editarEmpleado(item)">
                                mdi-pencil
                            </v-icon>
                            <v-icon size="small" @click="eliminarEmpleado(item._id)">
                                mdi-delete
                            </v-icon>
                        </template>
                    </v-data-table>

                </v-card>
            </v-row>
            <v-dialog v-model="dialogE" persistent width="700">
                <v-card>
                    <v-card-text>
                        <v-container>
                            <v-form ref="formEmpleado">
                                <v-row>
                                    <v-col cols="12" sm="6" md="6">
                                        <v-text-field class="inline-form-input-name" label="Nombre" type="text" required
                                            variant="outlined" v-model="formEmpleado.nombre" :rules="nombreRules"
                                            :counter="65"></v-text-field>
                                    </v-col>
                                    <v-col cols="12" sm="6" md="6">
                                        <v-text-field label="Cedula" type="number" variant="outlined"
                                            hint="Sin comas o puntos (, .)" persistent-hint required :counter="14"
                                            v-model="(formEmpleado.cedula)" :rules="cedulaRules"></v-text-field>
                                    </v-col>
                                    <v-col cols="12">
                                        <v-text-field class="inline-form-input-name" label="Dirección" type="text" required
                                            variant="outlined" v-model="formEmpleado.direccion"
                                            :rules="[v => !!v || 'La descripción es requerida']"></v-text-field>
                                    </v-col>
                                    <v-col cols="12" sm="6" v-if="tipoCargo.length > 0">
                                        <v-select :items="tipoCargo" variant="outlined" label="Cargo" required
                                            v-model="formEmpleado.tipoCargo"
                                            :rules="[v => !!v || 'Seleccione una Cargo']"></v-select>
                                    </v-col>
                                    <v-col cols="12" sm="6">
                                        <v-text-field class="inline-form-input-name" label="Teléfono" type="text" required
                                            variant="outlined" v-model="formEmpleado.telefono"
                                            :rules="[v => !!v || 'La telefono es requerido']">

                                        </v-text-field>
                                    </v-col>

                                </v-row>
                            </v-form>
                        </v-container>
                    </v-card-text>
                    <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn color="red-darken-1" variant="tonal" @click="dialogE = false">
                            Cerrar
                        </v-btn>
                        <v-btn color="green-darken-1" variant="tonal" :disabled="disableBtn" @click="crearEmpleado()">
                            Crear
                        </v-btn>
                    </v-card-actions>
                </v-card>
            </v-dialog>
            <v-dialog v-model="dialogU" persistent width="700">
                <v-card>
                    <v-card-text>
                        <v-container>
                            <v-form ref="formUsuario">
                                <v-row>
                                    <v-col cols="12">
                                        <v-autocomplete v-model="formUsuario.empleado" :items="empleados" label="Empleado"
                                            no-data-text="Sin empleados" item-title="nombre" item-value="id"
                                            item-text="nombre" placeholder="Escoja empleado" required variant="outlined">
                                        </v-autocomplete>
                                    </v-col>
                                    <v-col cols="12" sm="6" md="6">
                                        <v-text-field label="Usuario" variant="outlined" required
                                            v-model="formUsuario.usuario" :rules="usuarioRules"></v-text-field>
                                    </v-col>
                                    <v-col sm="6" md="6">
                                        <v-text-field v-model="formUsuario.contrasena"
                                            :type="visibleContra ? 'text' : 'password'" variant="outlined"
                                            label="Contraseña" placeholder="Ingrese su contraseña"
                                            :append-inner-icon="visibleContra ? 'mdi-eye-off' : 'mdi-eye'"
                                            @click:append-inner="visibleContra = !visibleContra"></v-text-field>
                                    </v-col>
                                </v-row>
                            </v-form>
                        </v-container>
                    </v-card-text>
                    <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn color="red-darken-1" variant="tonal" @click="dialogU = false">
                            Cerrar
                        </v-btn>
                        <v-btn color="green-darken-1" variant="tonal" :disabled="disableBtn" @click="crearUsuario">
                            Crear
                        </v-btn>
                    </v-card-actions>
                </v-card>
            </v-dialog>
        </v-card>
    </div>
</template>

<script>
import axios from 'axios';
import Swal from 'sweetalert2';
import Session from '@/validation/session';
export default {
    name: "empleadosVista",
    data: () => ({
        token: null,
        searchEmpleado: null,
        disableBtn: false,
        visibleContra: true,
        empleados: [],
        dialogC: false,
        dialogE: false,
        dialogU: false,
        ShowEditarEmpleado: false,
        formCargo: {
            cargo: null
        },
        formEmpleado: {
            cedula: null,
            tipoCargo: null,
            nombre: null,
            telefono: null,
            direccion: null,
        },
        formUsuario: {
            empleado: null,
            usuario: null,
            contrasena: null
        },
        paqueteEditar: null,
        nombreRules: [
            v => !!v || 'El nombre es requerido',
            v => (v && v.length <= 65) || 'EL nombre no puede superar los 65 caracteres',
        ],
        usuarioRules: [
            v => !!v || 'El usuario es requerido',
            v => (v && v.length > 3) || 'EL nombre debe tener mínimo 4 caracteres',
        ],
        api: process.env.VUE_APP_API_URL,
        headers: [
            { title: 'Nombre', key: 'nombre' },
            { title: 'Usuario', key: 'usuario' },
            { title: 'Rol', key: 'rol' },
            { title: 'Accion', key: 'actions', sortable: false },
        ],
    }),
    methods: {
        async listarEmpleados() {
            await axios.get(`${this.api}/usuario`, {
                headers: {
                    Authorization: `Bearer ${this.token}`
                }
            }).then(resp => {
                this.empleados = resp.data;
            }).catch(error => {
                switch (error.response.status) {
                    case 401:
                        Session.expiredSession();
                        break;
                    default:
                        Swal.fire({
                            icon: 'info',
                            title: 'No se pudo recuperar la información, intente nuevamente',
                            showConfirmButton: false,
                            timer: 1600
                        });
                        break;
                }
            });
        },
        async eliminarEmpleado(cedula) {
            Swal.fire({
                icon: 'info',
                title: 'Seguro quiere eliminar un empleado?',
                showDenyButton: true,
                denyButtonText: 'No',
                confirmButtonText: 'Eliminar',
            }).then(async (result) => {
                /* Read more about isConfirmed, isDenied below */
                if (result.isConfirmed) {
                    await axios.delete(`${process.env.VUE_APP_API_URL}/empleado/${cedula}`).then(() => {
                        Swal.fire({ icon: 'success', text: 'Se elimino correctamente el empleado', timer: 1500, showConfirmButton: false });
                        this.listarEmpleados();
                    });
                }
            }).catch(() => {
                return Swal.fire({ icon: 'error', title: 'No se pudo eliminar el producto', timer: 1000 });
            });

        },
        async listarCargos() {
            await axios.get(`${process.env.VUE_APP_API_URL}/empleado/cargos`).then((resp) => {
                this.tipoCargo = resp.data;
            })
        },
        async crearEmpleado() {
            const { valid } = await this.$refs.formEmpleado.validate();
            if (valid) {
                this.disableBtn = true;
                this.formEmpleado.cedula = parseInt(this.formEmpleado.cedula);
                try {
                    await axios.post(`${process.env.VUE_APP_API_URL}/empleado/crear`, this.formEmpleado).then(() => {
                        this.formEmpleado = {
                            cedula: null,
                            tipoCargo: null,
                            nombre: null,
                            telefono: null,
                            direccion: null,
                        };
                        this.dialogE = false;
                        Swal.fire({ icon: 'success', title: 'Se creo Correctamente el empleado', showConfirmButton: false, timer: 1500 });
                        this.listarEmpleados();
                    });
                }
                catch (error) {
                    console.log(error);
                    this.dialogE = false;
                    Swal.fire({ icon: 'error', text: 'No se pudo crear el empleado', showConfirmButton: false, timer: 1500 });
                }
                this.disableBtn = false;
            }
        },
        async crearUsuario() {
            const { valid } = await this.$refs.formUsuario.validate();
            if (valid) {
                this.disableBtn = true;
                await axios.post(`${this.api}/usuario/crear`, this.formUsuario).then(response => {
                    switch (response.status) {
                        case 201:
                            Swal.fire({ icon: 'success', text: 'Usuario creado', showConfirmButton: false, timer: 1500 });
                            this.dialogU = false;
                            this.$refs.formUsuario.reset();
                            break;
                        case 409:
                            Swal.fire({ icon: 'warning', text: response.data.message, showConfirmButton: false, timer: 1500 });
                            this.$refs.formUsuario.reset();
                            break;
                    }
                }).catch(error => {
                    switch (error.response.status) {
                        case 409:
                            Swal.fire({ icon: 'warning', text: error.response.data.message, showConfirmButton: false, timer: 1500 });
                            this.$refs.formUsuario.reset();
                            break;

                        default:
                            Swal.fire({ icon: 'error', text: 'No se pudo crear el usuario', showConfirmButton: false, timer: 1600 });
                            break;
                    }
                });
                this.disableBtn = false;
            }
        },
        editarEmpleado(empleado) {
            this.paqueteEditar = empleado;
            this.ShowEditarEmpleado = true;
        },
        editarEmpleadoCorrecto() {
            this.ShowEditarEmpleado = false;
            this.listarEmpleados();
            Swal.fire({ icon: 'success', text: 'Se edito correctamente', showConfirmButton: false, timer: 1500 });
        },
        noEditoEmpleado() {
            this.ShowEditarEmpleado = false;
            Swal.fire({ icon: 'error', text: 'No se edito el empleado', showConfirmButton: false, timer: 1500 });
        }
    },
    async created() {
        this.token = this.$store.getters.usuario.usuario.access_token;
        this.$emit('loadingSweet');
        await this.listarEmpleados();
        this.$emit('closeSweet');
    }
}
</script>

<style></style>