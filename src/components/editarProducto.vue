<template>
    <v-dialog persistent width="700">
        <v-card>
            <v-card-title>
            </v-card-title>
            <v-card-text>
                <v-container>
                    <v-form ref="formProductoEditar">
                        <v-row>
                            <v-col cols="12" sm="6" md="6">
                                <v-text-field class="inline-form-input-name" label="Nombre" type="text" required
                                    variant="outlined" v-model="paquete.nombre" :rules="nombreRules"
                                    :counter="65"></v-text-field>
                            </v-col>
                            <v-col cols="12" sm="6" md="6">
                                <v-text-field label="Precio" type="number" variant="outlined"
                                    hint="Sin comas o puntos (, .)" persistent-hint required v-model="(paquete.precio)"
                                    :rules="precioRules"></v-text-field>
                            </v-col>
                            <v-col cols="12">
                                <v-text-field class="inline-form-input-name" label="Descripción" type="text" required
                                    variant="outlined" v-model="paquete.descripcion"
                                    :rules="[v => !!v || 'La descripción es requerida']"></v-text-field>
                            </v-col>
                            <v-col cols="12" sm="6">
                                <v-select :items="categoriaseditar" item-title="nombre" item-value="id" variant="outlined"
                                    label="Categoría" required v-model="paquete.categoria"
                                    :rules="[v => !!v || 'Seleccione una categoría']"></v-select>
                            </v-col>
                        </v-row>
                    </v-form>
                </v-container>
            </v-card-text>
            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="red-darken-1" variant="tonal" @click="cerrarComponente()">
                    Cerrar
                </v-btn>
                <v-btn color="blue-darken-1" variant="tonal" @click="editarPeticion()">
                    Editar
                </v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<script >
import axios from 'axios';
export default {
    name: 'editarProductoComponent',
    props: {
        editarProducto: { default: null }
    },
    nombreRules: [
        v => !!v || 'El nombre es requerido',
        v => (v && v.length <= 65) || 'EL nombre no puede superar los 65 caracteres',
    ],
    precioRules: [v => !!v || 'El precio es requerido', v => (v && /^[0-9]+$/.test(v)) || 'El numero no debe contener caracteres'],
    data: () => ({
        paquete:
            { id: null, nombre: null, descripcion: null, precio: null, categoria: null },
        categoriaseditar: []
    }),
    methods: {
        cerrarComponente() {
            this.$emit('cerrar');
        },
        actualizoTrue() {
            this.$emit('actualizo');
        },
        actualizoFalse() {
            this.$emit('noactualizo');
        },
        async listarCategorias() {
            await axios.get(`${process.env.VUE_APP_API_URL}/categoria`).then((resp) => {
                this.categoriaseditar = resp.data;
            });
        },
        async editarPeticion() {
            const { valid } = await this.$refs.formProductoEditar.validate();
            if (valid) {
                try {
                    this.paquete.precio = parseInt(this.paquete.precio);
                    await axios.put(`${process.env.VUE_APP_API_URL}/producto/actualizar`, this.paquete).then(() => {
                        this.actualizoTrue();
                    });
                }
                catch (e) {
                    this.actualizoFalse();
                }
            }
        }
    },
    watch: {
        editarProducto() {
            this.paquete = this.$props.editarProducto;
            this.listarCategorias();

        }

    },



}
</script>

<style></style>