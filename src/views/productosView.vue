<template>
    <div class="producto">
        <v-card class="ma-3">
            <v-row class="d-flex  px-6 my-4">
                <v-col lg="8" md="8" sm="6" style="min-width: 200px;">
                    <div class="d-flex align-center "><v-icon size="x-large" icon="mdi-food"></v-icon>
                        <h1 class="px-3">Productos</h1>
                    </div>
                </v-col>
                <v-col lg="2" md="2" sm="3">
                    <v-btn prepend-icon="mdi-plus" color="green" @click="dialogP = true"
                        style="min-width: 170px;">Producto</v-btn>
                </v-col>
                <v-col lg="2" md="2" sm="3">
                    <v-btn prepend-icon="mdi-plus" style="min-width: 170px;" color="yellow"
                        @click="dialogC = true">Categoria</v-btn>
                </v-col>

            </v-row>
            <v-row>
                <v-card class="ma-3 w-100">
                    <v-table fixed-header fixed-footer class="w-100" v-if="productos.length > 0">
                        <thead style="z-index: 1000;" class="bg-table-header">
                            <tr>
                                <th class="text-left">
                                    Nombre
                                </th>
                                <th class="text-left">
                                    Categoría
                                </th>
                                <th class="text-left">
                                    Descripcion
                                </th>
                                <th class="text-left">
                                    Precio
                                </th>
                                <th colspan="2" class="text-center">Acción</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="(item) in productos" :key="item.id">
                                <td class="text-left">{{ item.nombre }}</td>
                                <td class="text-left">{{ item.categoria.nombre }}</td>
                                <td class="text-left">{{ item.descripcion }}</td>
                                <td class="text-left">{{ item.precio.toLocaleString() }}</td>
                                <td style="text-align: center;"><v-btn density="comfortable"
                                        @click="eliminarProducto(item.id)" color="red">eliminar</v-btn>
                                </td>
                            </tr>
                        </tbody>
                    </v-table>
                </v-card>
            </v-row>

        </v-card>
        <v-dialog v-model="dialogP" persistent width="700">
            <v-card>
                <v-card-text>
                    <v-container>
                        <v-form ref="formProducto">
                            <v-row>
                                <v-col cols="12">
                                    <v-text-field class="inline-form-input-name" label="Nombre" type="text" required
                                        variant="outlined" v-model="formProducto.nombre" :rules="nombreRules"
                                        :counter="65"></v-text-field>
                                </v-col>
                                <v-col cols="12">
                                    <v-text-field class="inline-form-input-name" label="Descripción" type="text" required
                                        variant="outlined" v-model="formProducto.descripcion"
                                        :rules="[v => !!v || 'La descripción es requerida']"></v-text-field>
                                </v-col>
                                <v-col cols="12" sm="6" md="6">
                                    <v-text-field label="Precio" type="number" variant="outlined"
                                        hint="Sin comas o puntos (, .)" persistent-hint required
                                        v-model="(formProducto.precio)" :rules="precioRules"></v-text-field>
                                </v-col>
                                <v-col cols="12" sm="6" v-if="categorias.length > 0">
                                    <v-select :items="categorias" item-title="nombre" item-value="id" variant="outlined"
                                        label="Categoría" required v-model="formProducto.categoria"
                                        :rules="[v => !!v || 'Seleccione una categoría']"></v-select>
                                </v-col>
                            </v-row>
                        </v-form>
                    </v-container>
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="red-darken-1" variant="tonal" @click="dialogP = false">
                        Cerrar
                    </v-btn>
                    <v-btn color="green-darken-1" variant="tonal" :disabled="disableBtn" @click="crearProducto()">
                        Crear
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
        <v-dialog v-model="dialogC" width="700">
            <v-card>
                <v-card-text>
                    <v-container>
                        <v-form ref="formCategoria">
                            <v-row>
                                <v-col cols="12">
                                    <v-text-field class="inline-form-input-name" label="Nombre" type="text" required
                                        variant="outlined" v-model="formCategoria.nombre" :rules="nombreRules"
                                        :counter="65"></v-text-field>
                                </v-col>

                                <v-col cols="12">
                                    <v-text-field class="inline-form-input-name" label="Descripción" type="text" required
                                        variant="outlined" v-model="formCategoria.descripcion"
                                        :rules="[v => !!v || 'La descripción es requerida']"></v-text-field>
                                </v-col>
                            </v-row>
                        </v-form>
                    </v-container>
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="red-darken-1" variant="tonal" @click="dialogC = false">
                        Cerrar
                    </v-btn>
                    <v-btn color="green-darken-1" variant="tonal" :disabled="disableBtn" @click="crearCategoria()">
                        Crear
                    </v-btn>
                </v-card-actions>
                <v-table fixed-header fixed-footer height="400" class="w-100" v-if="categorias.length > 0">
                    <thead style="z-index: 1000;" class="bg-table-header">
                        <tr>
                            <th class="text-left">
                                Nombre
                            </th>
                            <th class="text-left">
                                Descripcion
                            </th>
                            <th class="text-center">Acción</th>

                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(item) in categorias" :key="item.id">
                            <td class="text-left">{{ item.nombre }}</td>
                            <td class="text-left">{{ item.descripcion }}</td>
                            <td><v-btn density="comfortable" @click="eliminarCategoria(item.id)"
                                    color="red">eliminar</v-btn>
                            </td>
                        </tr>
                    </tbody>
                </v-table>
            </v-card>
        </v-dialog>
        <editarProductoComponent v-model="dialogEditar" @noactualizo="noactualizoProducto" @actualizo="actualizoProducto"
            @cerrar="cerrarEditarProducto" :editarProducto="actualizarProducto">
        </editarProductoComponent>
    </div>
</template>

<script>
import axios from 'axios';
import Swal from 'sweetalert2';
import editarProductoComponent from '../components/editarProducto.vue';

export default {
    name: 'productosVista',
    components: {
        editarProductoComponent,
    },
    data: () => ({
        disableBtn: false,
        productos: [],
        categorias: [], dialogP: false,
        dialogC: false,
        actualizarProducto: { id: null, nombre: null, descripcion: null, precio: null, categoria: { id: null, nombre: null, descripcion: null, } },
        dialogEditar: false,
        formProducto: {
            nombre: null,
            precio: null,
            categoria: null,
            descripcion: null
        },
        formCategoria: {
            nombre: null,
            descripcion: null,
            esatdo: null
        },
        nombreRules: [
            v => !!v || 'El nombre es requerido',
            v => (v && v.length <= 65) || 'EL nombre no puede superar los 65 caracteres',
        ],
        precioRules: [v => !!v || 'El precio es requerido', v => (v && /^[0-9]+$/.test(v)) || 'El numero no debe contener caracteres'],

    }),
    async created() {
        this.$emit('loadingSweet');
        await this.listarProductos();
        this.$emit('closeSweet');
        await this.listarCategorias();
    },
    methods: {
        async listarProductos() {
            await axios.get(`${process.env.VUE_APP_API_URL}/producto`).then((resp) => {
                if (resp.data.length > 0) {
                    resp.data.sort((a, b) => a.nombre.localeCompare(b.nombre));
                }
                this.productos = resp.data;
            });
        },
        async listarCategorias() {
            await axios.get(`${process.env.VUE_APP_API_URL}/categoria`).then((resp) => {
                if (resp.data.length > 0) {
                    resp.data.sort((a, b) => a.nombre.localeCompare(b.nombre));
                }
                this.categorias = resp.data;
            });
        },
        async crearProducto() {
            const { valid } = await this.$refs.formProducto.validate();
            if (valid) {
                this.disableBtn = true;
                this.dialogP = false;
                this.formProducto.precio = parseInt(this.formProducto.precio)
                await axios.post(`${process.env.VUE_APP_API_URL}/producto/crear`, this.formProducto).then((resp) => {
                    if (resp.status == 201) {
                        return Swal.fire({
                            icon: 'success',
                            title: 'Exitoso',
                            text: 'Producto creado correctamente!',
                            showConfirmButton: false,
                            timer: 1500
                        })
                    }
                }).catch(() => {
                    return Swal.fire({ icon: 'error', title: 'No se pudo crear el producto', showConfirmButton: false, timer: 1500 });
                });
                this.disableBtn = false;
                await this.listarProductos();
                this.formProducto = {
                    nombre: null,
                    precio: null,
                    estado: null,
                    categoria: null,
                    descripcion: null
                }
            }
        },
        async eliminarProducto(id) {
            Swal.fire({
                icon: 'info',
                title: 'Seguro quiere eliminar el producto?',
                showDenyButton: true,
                denyButtonText: 'No',
                confirmButtonText: 'Eliminar',
            }).then(async (result) => {
                /* Read more about isConfirmed, isDenied below */
                if (result.isConfirmed) {
                    await axios.delete(`${process.env.VUE_APP_API_URL}/producto/${id}`).then(() => {
                        this.listarProductos();
                        Swal.fire({ icon: 'success', title: 'Se elimino correctamente', timer: 1500, showConfirmButton: false });
                    })
                }
            }).catch(() => {
                return Swal.fire({ icon: 'error', title: 'No se pudo eliminar el producto', showConfirmButton: false, timer: 1500 });
            });
        },
        cerrarEditarProducto() {
            this.dialogEditar = false;
        },
        editarProductoFunction(item) {
            this.dialogEditar = true;
            item.categoria = parseInt(item.categoria.id);
            this.actualizarProducto = item;
        },
        actualizoProducto() {
            this.dialogEditar = false;
            Swal.fire({ icon: 'success', title: 'Se edito correctamente', timer: 1500, showConfirmButton: false });
            this.listarProductos();
        },
        noactualizoProducto() {
            this.dialogEditar = false;
            Swal.fire({ icon: 'error', title: 'No se edito correctamente', timer: 1500, showConfirmButton: false });
            this.listarProductos();
        },
        async crearCategoria() {
            const { valid } = await this.$refs.formCategoria.validate();
            if (valid) {
                this.disableBtn = true;
                this.dialogC = false;
                await axios.post(`${process.env.VUE_APP_API_URL}/categoria/crear`, this.formCategoria).then((resp) => {
                    if (resp.status == 201) {
                        return Swal.fire({
                            icon: 'success',
                            title: 'Exitoso',
                            text: 'Categoría creada correctamente!',
                            showConfirmButton: false,
                            timer: 1500
                        })
                    }

                }).catch(() => {
                    return Swal.fire({ icon: 'error', title: 'No se pudo crear la categoría', showConfirmButton: false, timer: 1500 });
                });
                this.disableBtn = false;
                await this.listarCategorias();
                this.formCategoria = {
                    nombre: null,
                    estado: null,
                    descripcion: null
                }
            }
        },
        async eliminarCategoria(id) {
            this.dialogC = false;
            Swal.fire({
                icon: 'info',
                title: 'Seguro quiere eliminar la categoria?',
                showDenyButton: true,
                denyButtonText: 'No',
                confirmButtonText: 'Eliminar',
            }).then(async (result) => {
                /* Read more about isConfirmed, isDenied below */
                if (result.isConfirmed) {
                    await axios.delete(`${process.env.VUE_APP_API_URL}/categoria/${id}`).then(() => {
                        this.listarCategorias();
                        Swal.fire({ icon: 'success', title: 'Se elimino correctamente', timer: 1000, showConfirmButton: false });
                    })
                }
            }).catch(() => {
                return Swal.fire({ icon: 'error', title: 'No se pudo eliminar la categoria', timer: 1000 });
            });
        },
    }
}

</script>

<style></style>