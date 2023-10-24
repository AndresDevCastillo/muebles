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
                    <v-table fixed-header fixed-footer class="w-100" v-if="empleados.length > 0">
                        <thead style="z-index: 1000;" class="bg-table-header">
                            <tr>
                                <th class="text-left">
                                    Cedula
                                </th>
                                <th class="text-left">
                                    Nombre
                                </th>
                                <th class="text-left">
                                    Teléfono
                                </th>
                                <th class="text-left">
                                    Dirección
                                </th>
                                <th class="text-left">
                                    Cargo
                                </th>
                                <th colspan="2" class="text-center">Acción</th>

                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="(persona) in empleados" :key="persona.cedula">
                                <td class="text-left">{{ persona.cedula }}</td>
                                <td class="text-left">{{ persona.nombre }}</td>
                                <td class="text-left">{{ persona.telefono }}</td>
                                <td class="text-left">{{ persona.direccion }}</td>
                                <td class="text-left">{{ persona.tipoCargo }}</td>
                                <td><v-btn color="blue" density="comfortable"
                                        @click="editarEmpleado(Object.assign({}, persona))">Editar</v-btn></td>
                                <td><v-btn color="red" density="comfortable"
                                        @click="eliminarEmpleado(persona.cedula)">Eliminar</v-btn></td>
                            </tr>
                        </tbody>
                    </v-table>
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
        <editarEmpleadoComponent v-model="ShowEditarEmpleado" :editarEmpleado="paqueteEditar"
            @cerrar="ShowEditarEmpleado = false" @noactualizo="noEditoEmpleado()" @actualizo="editarEmpleadoCorrecto()">
        </editarEmpleadoComponent>
    </div>
</template>

<script>
import axios from 'axios';
import Swal from 'sweetalert2';
import editarEmpleadoComponent from '../components/editarEmpleado.vue';
export default {
    name: "empleadosVista",
    components: {
        editarEmpleadoComponent
    },
    data: () => ({
        disableBtn: false,
        visibleContra: true,
        empleados: [],
        tipoCargo: [],
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
        cedulaRules: [v => !!v || 'La cédula es requerida', v => (v && /^[0-9]+$/.test(v)) || 'El número no debe contener caracteres'],
        api: process.env.VUE_APP_API_URL,
    }),
    methods: {
        async listarEmpleados() {
            await axios.get(`${process.env.VUE_APP_API_URL}/empleado`).then(resp => {
                if (resp.data.length > 0) {
                    resp.data.sort((a, b) => a.nombre.localeCompare(b.nombre));
                }
                this.empleados = resp.data;
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
        async crearCargo() {
            await axios.post(`${process.env.VUE_APP_API_URL}/tipo-cargo/crear`, this.formCargo).then(() => {
                this.dialogC = false;
                this.listarCargos();
                this.formCargo = {
                    cargo: null
                }
                Swal.fire({ icon: 'success', text: 'Se creo el cargo correctamente', timer: 1500, showConfirmButton: false });
            })
        },
        async eliminarCargo(id) {
            this.dialogC = false;
            Swal.fire({
                icon: 'info',
                title: 'Seguro quiere eliminar el cargo?',
                showDenyButton: true,
                denyButtonText: 'No',
                confirmButtonText: 'Eliminar',
            }).then(async (result) => {
                /* Read more about isConfirmed, isDenied below */
                if (result.isConfirmed) {
                    await axios.delete(`${process.env.VUE_APP_API_URL}/tipo-cargo/${id}`).then(() => {
                        Swal.fire({ icon: 'success', text: 'Se elimino el cargo correctamente', timer: 1500, showConfirmButton: false });
                        this.listarCargos();
                    })
                }
            }).catch(() => {
                return Swal.fire({ icon: 'error', title: 'No se pudo eliminar el cargo', timer: 1000 });
            });

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
        this.$emit('loadingSweet');
        //await this.listarEmpleados();
        this.$emit('closeSweet');
        //this.listarCargos();
    }
}
</script>

<style></style>