<template>
    <div class="pueblo">
        <v-card class="ma-3">
            <v-row class="px-6 my-4" justify="space-between">
                <v-col lg="9" md="9" sm="12">
                    <div class="d-flex align-center "><v-icon size="x-large" icon="mdi mdi-table-furniture"></v-icon>
                        <h1 class="px-3">Pueblo</h1>
                    </div>
                </v-col>
                <v-col lg="3" md="3" sm="5" class="align-self-end text-end">
                    <v-btn prepend-icon="mdi mdi-plus" color="green" @click="dialogR = true" style="min-width: 170px;">Crear
                        Ruta</v-btn>
                </v-col>
            </v-row>
            <v-row>
                <v-card class="ma-3 w-100">
                    <h1>Data</h1>
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
                                        v-model="opcElegida" :rules="[v => !!v || 'Seleccione un frecuencia']"
                                        no-data-text="Error en el sistema"></v-select>
                                </v-col>
                                <v-col cols="12" sm="6">
                                    <v-select v-if="opcElegida == 'Diario'" :items="diasSemana" variant="outlined"
                                        label="Día" required v-model="formRuta.diario"
                                        :rules="[v => !!v || 'Seleccione una dia']" no-data-text="Escoja un dia"></v-select>
                                </v-col>

                            </v-row>
                        </v-form>
                    </v-container>
                </v-card-text>
                <v-card-actions class="justify-end">
                    <v-btn color="red-darken-1" variant="tonal" @click="dialogR = false">
                        Cerrar
                    </v-btn>
                    <v-btn color="green-darken-1" variant="tonal" :disabled="disableBtn" @click="crearProducto">
                        Crear
                    </v-btn>
                </v-card-actions>
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
        api: process.env.VUE_APP_API_URL,
        token: null,
        dialogR: null,
        opcCrearRuta: ['Diario', 'Semanal', 'Quincenal', 'Mensual'],
        opcElegida: null,
        diasSemana: ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo"],
        formRuta: {
            nombre: null,
            ciudad: null,
            departamento: null,
            diario: null,
            semanal: null,
            quincenal: {
                dia: null,
                semanas: []
            },
            mensual: {
                dia: null,
                semanas: []
            }
        },
        departamento: [],
        ciudades: [],
        nombreRules: [
            v => !!v || 'El nombre es requerido',
            v => (v && v.length <= 65) || 'EL nombre no puede superar los 65 caracteres',
        ],
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
        }
    },
    async created() {
        this.token = this.$store.getters.usuario.usuario.access_token;
        this.$emit('loadingSweet');
        await this.obtenerUbicacion();
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
    }
}
</script>

<style></style>