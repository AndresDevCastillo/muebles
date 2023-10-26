<template>
    <div class="inventario">
        <v-card class="ma-3">
            <v-row class="px-6 my-4">
                <v-col lg="10" md="10" sm="9">
                    <div class="d-flex align-center "><v-icon size="x-large" icon="mdi-store-edit"></v-icon>
                        <h1 class="px-3">Inventario</h1>
                    </div>
                </v-col>
                <v-col lg="2" md="2" sm="3">
                    <v-btn prepend-icon="mdi-plus" color="yellow" @click="dialogoI = true">Crear
                        Stock</v-btn>
                </v-col>
            </v-row>
            <v-row>
                <v-card class="ma-3 w-100">
                    <v-table fixed-header fixed-footer class="w-100">
                        <thead style="z-index: 1000;" class="bg-table-header">
                            <tr>
                                <th class="text-left">
                                    Nombre
                                </th>
                                <th class="text-left">
                                    Precio
                                </th>
                                <th class="text-left">
                                    Cantidad
                                </th>
                                <th class="text-left">
                                    Existencia
                                </th>
                                <th colspan="2" class="text-center">Acción</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td colspan="6" class="text-center">Sin productos</td>
                            </tr>
                            <tr v-for="(item) in inventario" :key="item.id">
                                <td class="text-left">{{ item.producto.nombre }}</td>
                                <td class="text-left">{{ item.producto.precio }}</td>
                                <td class="text-left">{{ item.cantidad }}</td>
                                <td class="text-left">{{ item.existencia }}</td>
                                <td class="text-right"><v-btn density="comfortable"
                                        @click="editarStockVista(Object.assign({}, item))" color="blue">Actualizar</v-btn>
                                </td>
                                <td class="text-left"><v-btn density="comfortable" @click="eliminarProducto(item.id)"
                                        color="red">eliminar</v-btn>
                                </td>
                            </tr>
                        </tbody>
                    </v-table>
                </v-card>
            </v-row>

        </v-card>
        <v-dialog v-model="dialogoI" width="700">
            <v-card>
                <v-card-text>
                    <v-container>
                        <v-form ref="formInventario">
                            <v-row>
                                <v-col cols="12">
                                    <v-text-field label="Existencia" type="number" min="1" required
                                        variant="outlined" v-model="formInventario.existencia" :rules="existenciaRule"
                                        :counter="65"></v-text-field>
                                </v-col>
                                <v-col cols="12">
                                    <v-select :items="productos" no-data-text="Sin productos" item-title="nombre" item-value="id" variant="outlined"
                                        label="Productos" required v-model="formInventario.producto"
                                        :rules="[v => !!v || 'Seleccione un Producto']"></v-select>
                                </v-col>
                            </v-row>
                        </v-form>
                    </v-container>
                </v-card-text>
                <v-card-actions class="justify-end">
                    <v-btn color="red-darken-1" variant="tonal" @click="dialogoI = false">
                        Cerrar
                    </v-btn>
                    <v-btn color="green-darken-1" variant="tonal" :disabled="disableBtn" @click="crearInventario">
                        Crear
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
        <v-dialog v-model="dialogoE" width="700">
            <v-card>
                <v-card-text>
                    <v-container>
                        <v-form ref="formInventarioEditar">
                            <v-row>
                                <v-col cols="12">
                                    <v-text-field label="Existencia" min="1" type="number" required
                                        variant="outlined" v-model="formInventarioEditar.existencia" :rules="existenciaRule"
                                        :counter="65"></v-text-field>
                                </v-col>
                            </v-row>
                        </v-form>
                    </v-container>
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="red-darken-1" variant="tonal" @click="dialogoE = false">
                        Cerrar
                    </v-btn>
                    <v-btn color="green-darken-1" variant="tonal" :disabled="disableBtn" @click="actualizarInventario()">
                        Actualizar
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
    name: 'inventarioVista',
    data: () => ({
        token: null,
        api: process.env.VUE_APP_API_URL,
        inventario: [],
        productos: [],
        dialogoI: false,
        dialogoE: false,
        disableBtn: false,
        formInventario: {
            producto: null,
            cantidad: 0,
            existencia: 1,
            estado: true
        },
        formInventarioEditar: {
            id: null,
            producto: null,
            cantidad: 0,
            existencia: 1,
            estado: true
        },
        existenciaRule: [
            (v) => (!!v) || "Añada al menos un producto",
            (v) =>
                (/^[0-9]+$/.test(v)) || "El numero no debe contener caracteres",
            (v) => (parseInt(v) > 0) || "El numero debe ser mayor o igual a 0",
        ],
    }),
    methods: {
        async listarInventario() {
            await axios.get(`${this.api}/inventario`, {
                headers: {
                    Authorization: `Bearer ${this.token}`
                }
            }).then((resp) => {
                console.log(resp.data)
                this.inventario = resp.data;
            }).catch(error => {
                console.log(error)
                return Swal.fire({ icon: 'error', title: 'No se pudo obtener los productos en stock', showConfirmButton: false, timer: 1500 });
            });
        },
        async listarProductos() {
            await axios.get(`${this.api}/inventario/productos`, {
                headers: {
                    Authorization: `Bearer ${this.token}`
                }
            }).then(resp => {
                this.productos = resp.data;
            }).catch(error => {
                console.log(error)
                return Swal.fire({ icon: 'error', title: 'No se pudo obtener los productos del inventario', showConfirmButton: false, timer: 1500 });
            })
        },
        async eliminarProducto(id) {
            Swal.fire({
                icon: 'info',
                title: 'Seguro quiere eliminar el producto del inventario?',
                showDenyButton: true,
                denyButtonText: 'No',
                confirmButtonText: 'Eliminar',
            }).then(async (result) => {
                /* Read more about isConfirmed, isDenied below */
                if (result.isConfirmed) {
                    await axios.delete(`${this.api}/inventario/${id}`, {
                        headers: {
                            Authorization: `Bearer ${this.token}`
                        }
                    }).then(() => {
                        Swal.fire({ icon: 'success', title: 'Se elimino correctamente', timer: 1500, showConfirmButton: false });
                    })
                }
            }).catch(() => {
                return Swal.fire({ icon: 'error', title: 'No se pudo eliminar el producto del inventario', showConfirmButton: false, timer: 1500 });
            });
            await this.listarInventario();
            await this.listarProductos();
        },
        async crearInventario() {
            const { valid } = await this.$refs.formInventario.validate();
            if (valid) {
                this.disableBtn = true;
                this.formInventario.existencia = parseInt(this.formInventario.existencia);
                this.formInventario.cantidad = this.formInventario.existencia;
                this.dialogoI = false;
                await axios.post(`${this.api}/inventario/crear`, this.formInventario, {
                    headers: {
                        Authorization: `Bearer ${this.token}`
                    }
                }).then((resp) => {
                    if (resp.status == 201) {
                        return Swal.fire({
                            icon: 'success',
                            title: 'Exitoso',
                            text: 'Stock creado correctamente!',
                            showConfirmButton: false,
                            timer: 1500
                        })
                    }
                }).catch(error => {
                    console.log(error);
                    return Swal.fire({ icon: 'error', title: 'No se pudo crear el stock', showConfirmButton: false, timer: 1500 });

                })
            }
            this.disableBtn = false;
            this.formInventario = {
                producto: null,
                cantidad: 0,
                existencia: 1,
                estado: true
            },
                await this.listarInventario();
            await this.listarProductos();
        },
        editarStockVista(item) {
            this.formInventarioEditar.cantidad = item.cantidad;
            this.formInventarioEditar.estado = true;
            this.formInventarioEditar.id = item.id;
            this.formInventarioEditar.existencia = item.existencia;
            this.formInventarioEditar.producto = item.producto.id;
            this.dialogoE = true;

        },
        async actualizarInventario() {
            this.disableBtn = true;
            const { valid } = await this.$refs.formInventarioEditar.validate();
            if (valid) {
                this.dialogoE = false;
                this.formInventarioEditar.existencia = parseInt(this.formInventarioEditar.existencia);
                this.formInventarioEditar.cantidad = this.formInventarioEditar.existencia;
                axios.put(`${this.api}/inventario/actualizar`, this.formInventarioEditar).then(async () => {
                    await this.listarInventario();
                    await this.listarProductos();
                    return Swal.fire({
                        icon: 'success',
                        title: 'Exitoso',
                        text: 'Inventario actualizado correctamente!',
                        showConfirmButton: false,
                        timer: 1500
                    })
                }).catch(error => {
                    console.log(error);
                    return Swal.fire({ icon: 'error', title: 'No se pudo crear el stock', showConfirmButton: false, timer: 1500 });
                });
            }
            this.disableBtn = false;
        }
    },
    async created() {
        this.token = this.$store.getters.usuario.usuario.access_token;
        this.$emit('loadingSweet');
        await this.listarInventario();
        await this.listarProductos();
        this.$emit('closeSweet');

    }

}
</script>

<style></style>