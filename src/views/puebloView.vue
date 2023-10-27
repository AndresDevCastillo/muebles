<template>
    <div class="pueblo">
        <v-card class="ma-3">
            <v-row class="px-6 my-4" justify="space-between">
                <v-col lg="9" md="9" sm="12">
                    <div class="d-flex align-center "><v-icon size="x-large" icon="mdi mdi-map-search"></v-icon>
                        <h1 class="px-3">Rutas</h1>
                    </div>
                </v-col>
                <v-col lg="3" md="3" sm="12" class="align-self-end text-end">
                    <v-btn prepend-icon="mdi mdi-plus" color="green" @click="dialogR = true" style="min-width: 170px;">Crear
                        Ruta</v-btn>
                </v-col>
            </v-row>
            <v-row>
                <v-card class="ma-3 w-100">
                    <v-card-title>
                        <v-col md="6" sm="12"><v-text-field v-model="searchRuta" append-inner-icon="mdi-magnify"
                                label="Buscar" variant="outlined" hide-details></v-text-field></v-col>
                    </v-card-title>
                    <v-data-table :headers="headers" :items="rutas" :sort-by="[{ key: 'nombre', order: 'asc' }]"
                        class="elevation-1" :search="searchRuta">
                        <!-- eslint-disable-next-line vue/valid-v-slot -->
                        <template v-slot:item.actions="{ item }">
                            <v-icon size="small" class="me-2" @click="preEditarRuta(item)">
                                mdi-pencil
                            </v-icon>
                            <v-icon size="small" @click="eliminarRuta(item._id)">
                                mdi-delete
                            </v-icon>
                        </template>
                    </v-data-table>

                </v-card>
            </v-row>
        </v-card>
        <v-dialog v-model="dialogR" persistent width="700">
            <v-card>
                <v-card-title>Nuevo Ruta</v-card-title>
                <v-card-text>
                    <v-container>
                        <v-form ref="formProducto">
                            <v-row>
                                <v-col cols="12">
                                    <v-text-field label="Nombre de la ruta" type="text" required variant="outlined"
                                        v-model="formRuta.nombre" :rules="nombreRules" :counter="65"></v-text-field>
                                </v-col>
                                <v-col cols="12" sm="6">
                                    <v-select :items="departamento" variant="outlined" label="Departamento" required
                                        v-model="formRuta.departamento" item-title="departamento" item-value="departamento"
                                        :rules="[v => !!v || 'Seleccione un departamento']"
                                        no-data-text="No hay departamentos"></v-select>
                                </v-col>
                                <v-col cols="12" sm="6">
                                    <v-select :items="ciudades" variant="outlined" label="Ciudad" required
                                        v-model="formRuta.ciudad" :rules="[v => !!v || 'Seleccione una ciudad']"
                                        no-data-text="Escoja un departamento"></v-select>
                                </v-col>
                                <v-col cols="12" sm="6">
                                    <v-select :items="opcCrearRuta" variant="outlined" label="Frecuencia de pago" required
                                        v-model="formRuta.opcRuta" :rules="[v => !!v || 'Seleccione un frecuencia']"
                                        no-data-text="Error en el sistema"></v-select>
                                </v-col>
                                <v-col cols="12" sm="6" v-if="formRuta.opcRuta == 'Semanal'">
                                    <v-select :items="diasSemana" variant="outlined" label="Día" required
                                        v-model="formRuta.semanal" :rules="[v => !!v || 'Seleccione una dia']"
                                        no-data-text="Escoja un dia"></v-select>
                                </v-col>
                                <v-col cols="12" sm="6" v-if="formRuta.opcRuta == 'Quincenal'">
                                    <v-select :items="diasSemana" variant="outlined" label="Día" required
                                        v-model="formRuta.quincenal.dia" :rules="[v => !!v || 'Seleccione una dia']"
                                        no-data-text="Escoja un dia"></v-select>
                                </v-col>
                                <v-col cols="12" sm="6" v-if="formRuta.opcRuta == 'Quincenal'">
                                    <v-select :items="[1, 2, 3, 4]" variant="outlined" label="Semana 1" required
                                        v-model="quincenaNumber.num1" :rules="[v => !!v || 'Seleccione la primera semana']"
                                        no-data-text="Escoja un semana"></v-select>
                                </v-col>
                                <v-col cols="12" sm="6" v-if="formRuta.opcRuta == 'Quincenal'">
                                    <v-select :items="[1, 2, 3, 4]" variant="outlined" label="Semana 2" required
                                        v-model="quincenaNumber.num2" :rules="[v => !!v || 'Seleccione la segundo semana']"
                                        no-data-text="Escoja un semana"></v-select>
                                </v-col>
                                <v-col cols="12" sm="6" v-if="formRuta.opcRuta == 'Mensual'">
                                    <v-select :items="diasSemana" variant="outlined" label="Día" required
                                        v-model="formRuta.mensual.dia" :rules="[v => !!v || 'Seleccione una dia']"
                                        no-data-text="Escoja un dia"></v-select>
                                </v-col>
                                <v-col cols="12" sm="6" v-if="formRuta.opcRuta == 'Mensual'">
                                    <v-select :items="[1, 2, 3, 4]" variant="outlined" label="Semana 1" required
                                        v-model="formRuta.mensual.semanas"
                                        :rules="[v => !!v || 'Seleccione la primera semana']"
                                        no-data-text="Escoja un semana"></v-select>
                                </v-col>
                            </v-row>
                        </v-form>
                    </v-container>
                </v-card-text>
                <v-card-actions class="justify-end">
                    <v-btn color="red-darken-1" variant="tonal" @click="dialogR = false">
                        Cerrar
                    </v-btn>
                    <v-btn color="green-darken-1" variant="tonal" :disabled="disableBtn" @click="crearRuta()">
                        Crear
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
        <v-dialog v-model="dialogReditar" persistent width="700">
            <v-card>
                <v-card-text>
                    <v-container>
                        <v-form ref="formProducto">
                            <v-row>
                                <v-col cols="12">
                                    <v-text-field label="Nombre de la ruta" type="text" required variant="outlined"
                                        v-model="formRutaEditar.nombre" :rules="nombreRules" :counter="65"></v-text-field>
                                </v-col>
                                <v-col cols="12" sm="6">
                                    <v-select :items="departamento" variant="outlined" label="Departamento" required
                                        v-model="formRutaEditar.departamento" item-title="departamento"
                                        item-value="departamento" :rules="[v => !!v || 'Seleccione un departamento']"
                                        no-data-text="No hay departamentos"></v-select>
                                </v-col>
                                <v-col cols="12" sm="6">
                                    <v-select :items="ciudades" variant="outlined" label="Ciudad" required
                                        v-model="formRutaEditar.ciudad" :rules="[v => !!v || 'Seleccione una ciudad']"
                                        no-data-text="Escoja un departamento"></v-select>
                                </v-col>
                                <v-col cols="12" sm="6">
                                    <v-select :items="opcCrearRuta" variant="outlined" label="Frecuencia de pago" required
                                        v-model="formRutaEditar.opcRuta" :rules="[v => !!v || 'Seleccione un frecuencia']"
                                        no-data-text="Error en el sistema"></v-select>
                                </v-col>
                                <v-col cols="12" sm="6" v-if="formRutaEditar.opcRuta == 'Semanal'">
                                    <v-select :items="diasSemana" variant="outlined" label="Día" required
                                        v-model="formRutaEditar.semanal" :rules="[v => !!v || 'Seleccione una dia']"
                                        no-data-text="Escoja un dia"></v-select>
                                </v-col>
                                <v-col cols="12" sm="6" v-if="formRutaEditar.opcRuta == 'Quincenal'">
                                    <v-select :items="diasSemana" variant="outlined" label="Día" required
                                        v-model="formRutaEditar.quincenal.dia" :rules="[v => !!v || 'Seleccione una dia']"
                                        no-data-text="Escoja un dia"></v-select>
                                </v-col>
                                <v-col cols="12" sm="6" v-if="formRutaEditar.opcRuta == 'Quincenal'">
                                    <v-select :items="[1, 2, 3, 4]" variant="outlined" label="Semana 1" required
                                        v-model="quincenaNumberEditar.num1"
                                        :rules="[v => !!v || 'Seleccione la primera semana']"
                                        no-data-text="Escoja un semana"></v-select>
                                </v-col>
                                <v-col cols="12" sm="6" v-if="formRutaEditar.opcRuta == 'Quincenal'">
                                    <v-select :items="[1, 2, 3, 4]" variant="outlined" label="Semana 2" required
                                        v-model="quincenaNumberEditar.num2"
                                        :rules="[v => !!v || 'Seleccione la segundo semana']"
                                        no-data-text="Escoja un semana"></v-select>
                                </v-col>
                                <v-col cols="12" sm="6" v-if="formRutaEditar.opcRuta == 'Mensual'">
                                    <v-select :items="diasSemana" variant="outlined" label="Día" required
                                        v-model="formRutaEditar.mensual.dia" :rules="[v => !!v || 'Seleccione una dia']"
                                        no-data-text="Escoja un dia"></v-select>
                                </v-col>
                                <v-col cols="12" sm="6" v-if="formRutaEditar.opcRuta == 'Mensual'">
                                    <v-select :items="[1, 2, 3, 4]" variant="outlined" label="Semana 1" required
                                        v-model="formRutaEditar.mensual.semanas"
                                        :rules="[v => !!v || 'Seleccione la primera semana']"
                                        no-data-text="Escoja un semana"></v-select>
                                </v-col>
                            </v-row>
                        </v-form>
                    </v-container>
                </v-card-text>
                <v-card-actions class="justify-end">
                    <v-btn color="red-darken-1" variant="tonal" @click="dialogReditar = false">
                        Cerrar
                    </v-btn>
                    <v-btn color="blue-darken-1" variant="tonal" :disabled="disableBtn" @click="editarRuta()">
                        Editar
                    </v-btn>
                </v-card-actions>
                {{ formRutaEditar }}
            </v-card>
        </v-dialog>


    </div>
</template>

<script>
import axios from 'axios';
import Swal from 'sweetalert2';
export default {
    name: 'puebloVista',
    data: () => ({
        disableBtn: false,
        api: process.env.VUE_APP_API_URL,
        token: null,
        dialogR: null,
        dialogReditar: null,
        searchRuta: null,
        opcCrearRuta: ['Diario', 'Semanal', 'Quincenal', 'Mensual'],
        diasSemana: ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo"],
        formRuta: {
            nombre: null,
            ciudad: null,
            departamento: null,
            opcRuta: null,
            diario: null,
            semanal: null,
            quincenal: {
                dia: null,
                semanas: [null, null]
            },
            mensual: {
                dia: null,
                semanas: []
            }
        },
        formRutaEditar: {
            nombre: null,
            ciudad: null,
            departamento: null,
            opcRuta: null,
            diario: null,
            semanal: null,
            quincenal: {
                dia: null,
                semanas: [null, null]
            },
            mensual: {
                dia: null,
                semanas: []
            }
        },
        quincenaNumber: {
            num1: null,
            num2: null
        },
        quincenaNumberEditar: {
            num1: null,
            num2: null
        },
        departamento: [],
        ciudades: [],
        nombreRules: [
            v => !!v || 'El nombre es requerido',
            v => (v && v.length <= 65) || 'EL nombre no puede superar los 65 caracteres',
        ],
        dialog: false,
        dialogDelete: false,
        headers: [
            { title: 'Ruta', key: 'nombre' },
            { title: 'Ciudad', key: 'ciudad' },
            { title: 'Departamento', key: 'departamento' },
            { title: 'Frecuencia Pago', key: 'opcRuta' },
            { title: 'Accion', key: 'actions', sortable: false },
        ],
        rutas: []
    }),
    methods: {
        async obtenerUbicacion() {
            await axios.get(`${this.api}/pueblo/ubicacion`, {
                headers: {
                    Authorization: `Bearer ${this.token}`
                }
            }).then((resp) => {
                this.departamento = resp.data;
            }).catch(error => {
                console.log(error);
                return Swal.fire({ icon: 'error', title: 'No se pudo obtener los departamentos', showConfirmButton: false, timer: 1500 });
            });
        }, async obtenerRutas() {
            await axios.get(`${this.api}/pueblo`, {
                headers: {
                    Authorization: `Bearer ${this.token}`
                }
            }).then((resp) => {
                this.rutas = resp.data;
            }).catch(error => {
                console.log(error);
                return Swal.fire({ icon: 'error', title: 'No se pudo obtener las rutas', showConfirmButton: false, timer: 1500 });
            });
        },
        async crearRuta() {
            this.disableBtn = true;
            this.dialogR = false;
            await axios.post(`${this.api}/pueblo/crear`, this.formRuta, {
                headers: {
                    Authorization: `Bearer ${this.token}`
                },
            }).then(() => {
                this.formRuta = {
                    nombre: null,
                    ciudad: null,
                    departamento: null,
                    opcRuta: null,
                    diario: null,
                    semanal: null,
                    quincenal: {
                        dia: null,
                        semanas: [null, null]
                    },
                    mensual: {
                        dia: null,
                        semanas: []
                    }
                }
                this.quincenaNumber = {
                    num1: null,
                    num2: null
                }
                return Swal.fire({ icon: 'success', title: 'Se creo la ruta correctamente', showConfirmButton: false, timer: 1500 });
            }).catch(() => {
                return Swal.fire({ icon: 'error', title: 'No se pudo crear el pueblo', showConfirmButton: false, timer: 1500 });
            })
            await this.obtenerRutas();
            this.disableBtn = false;
        },
        async eliminarRuta(id) {
            Swal.fire({
                icon: 'info',
                title: 'Seguro quiere eliminar la ruta?',
                showDenyButton: true,
                denyButtonText: 'No',
                confirmButtonText: 'Eliminar',
            }).then(async (result) => {
                /* Read more about isConfirmed, isDenied below */
                if (result.isConfirmed) {
                    await axios.delete(`${this.api}/pueblo/${id}`, {
                        headers: {
                            Authorization: `Bearer ${this.token}`
                        }
                    }).then(() => {
                        this.obtenerRutas();
                        Swal.fire({ icon: 'success', title: 'Se elimino correctamente', timer: 1500, showConfirmButton: false });
                    })
                }
            }).catch(() => {
                return Swal.fire({ icon: 'error', title: 'No se pudo eliminar la ruta', showConfirmButton: false, timer: 1500 });
            });
        },
        preEditarRuta(item) {
            item.id = item._id;
            delete item._id;
            delete item.__v;
            this.formRutaEditar = item;
            this.dialogReditar = true;
        },
        async editarRuta() {

            this.disableBtn = true;
            this.dialogReditar = false;
            await axios.put(`${this.api}/pueblo/actualizar`, this.formRutaEditar, {
                headers: {
                    Authorization: `Bearer ${this.token}`
                }
            }).then(() => {
                this.formRutaEditar = {
                    nombre: null,
                    ciudad: null,
                    departamento: null,
                    opcRuta: null,
                    diario: null,
                    semanal: null,
                    quincenal: {
                        dia: null,
                        semanas: [null, null]
                    },
                    mensual: {
                        dia: null,
                        semanas: []
                    }
                }
                this.quincenaNumberEditar = {
                    num1: null,
                    num2: null
                }
                return Swal.fire({ icon: 'success', title: 'Se edito la ruta correctamente', showConfirmButton: false, timer: 1500 });
            }).catch(() => {
                return Swal.fire({ icon: 'error', title: 'No se pudo editar el pueblo', showConfirmButton: false, timer: 1500 });
            })
            await this.obtenerRutas();
            this.disableBtn = false;
        }
    },
    async created() {
        this.token = this.$store.getters.usuario.usuario.access_token;
        this.$emit('loadingSweet');
        await this.obtenerUbicacion();
        await this.obtenerRutas();
        this.$emit('closeSweet');
    },
    watch: {
        "formRuta.departamento": {
            handler(departamentoNombre) {
                this.formRuta.ciudad = null;
                this.departamento.map(departamento => {
                    if (departamento.departamento == departamentoNombre) {
                        this.ciudades = departamento.ciudades;
                    }
                })
            },
        },
        "formRuta.opcRuta": {
            handler(newValue) {
                this.formRuta.diario = null,
                    this.formRuta.semanal = null,
                    this.formRuta.quincenal = {
                        dia: null,
                        semanas: []
                    }
                this.formRuta.mensual = {
                    dia: null,
                    semanas: []
                }
                if (newValue == "Diario") {
                    this.formRuta.diario = true;
                }
            }
        },
        "formRutaEditar.departamento": {
            handler(departamentoNombre) {
                this.departamento.map(departamento => {
                    if (departamento.departamento == departamentoNombre) {
                        this.ciudades = departamento.ciudades;
                    }
                })
            },
        },
        "formRutaEditar.opcRuta": {
            handler(newValue) {
                this.formRutaEditar.diario = null,
                    this.formRutaEditar.semanal = null,
                    this.formRutaEditar.quincenal = {
                        dia: null,
                        semanas: []
                    }
                this.formRutaEditar.mensual = {
                    dia: null,
                    semanas: []
                }
                if (newValue == "Diario") {
                    this.formRutaEditar.diario = true;
                }
            }
        },
        "quincenaNumber.num1": {
            handler(newValue) {
                this.formRuta.quincenal.semanas[0] = newValue;
            }
        },
        "quincenaNumber.num2": {
            handler(newValue) {
                this.formRuta.quincenal.semanas[1] = newValue;
            }
        },
        "quincenaNumberEditar.num1": {
            handler(newValue) {
                this.formRutaEditar.quincenal.semanas[0] = newValue;
            }
        },
        "quincenaNumberEditar.num2": {
            handler(newValue) {
                this.formRutaEditar.quincenal.semanas[1] = newValue;
            }
        }


    }
}
</script>

