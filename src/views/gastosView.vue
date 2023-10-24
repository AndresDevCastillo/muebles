<template>
    <div class="gastos">
        <v-card class="ma-3">
            <v-row class="d-flex px-6 my-4">
                <v-col lg="9" md="9" sm="8" style="min-width: 200px">
                    <v-row class="align-center" no-gutters>
                        <v-icon size="x-large" icon="mdi mdi-cash"></v-icon>
                        <h1 class="px-3">Gastos</h1>
                    </v-row>
                </v-col>

                <v-col lg="3" md="3" sm="4">
                    <v-btn prepend-icon="mdi-plus" style="min-width: 170px" color="green" @click="dialogG = true">Crear
                        Gasto</v-btn>
                </v-col>
                <v-table fixed-header fixed-footer class="w-100" v-if="gastos.length > 0">
                    <thead style="z-index: 1000" class="bg-table-header">
                        <tr>
                            <th class="text-left">Nombre</th>
                            <th class="text-left">Descripcion</th>
                            <th class="text-left">Categoria</th>
                            <th class="text-left">Monto</th>
                            <th class="text-center">Acción</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="item in gastos" :key="item.id">
                            <td class="text-left">{{ item.nombre }}</td>
                            <td class="text-left">{{ item.descripcion }}</td>
                            <td class="text-left">{{ item.categoria }}</td>
                            <td class="text-left">{{ item.monto.toLocaleString() }}</td>
                            <td style="text-align: center">
                                <v-btn density="comfortable" @click="eliminarGasto(item.id)" color="red">eliminar</v-btn>
                            </td>
                        </tr>
                    </tbody>
                </v-table>
            </v-row>
        </v-card>
        <v-dialog v-model="dialogG" persistent width="700">
            <v-card>
                <v-card-title> </v-card-title>
                <v-card-text>
                    <v-container>
                        <v-form ref="formGasto">
                            <v-row>
                                <v-col cols="12">
                                    <v-text-field class="inline-form-input-name" label="Nombre" type="text" required
                                        variant="outlined" v-model="formGasto.nombre" :rules="nombreRules"
                                        :counter="65"></v-text-field>
                                </v-col>
                                <v-col cols="12">
                                    <v-text-field class="inline-form-input-name" label="Descripción" type="text" required
                                        variant="outlined" v-model="formGasto.descripcion"
                                        :rules="[(v) => !!v || 'La descripción es requerida']"></v-text-field>
                                </v-col>
                                <v-col cols="12" sm="6" v-if="categorias.length > 0">
                                    <v-select :items="categorias" variant="outlined" label="Categoría" required
                                        v-model="formGasto.categoria"
                                        :rules="[(v) => !!v || 'Seleccione una categoría']"></v-select>
                                </v-col>
                                <v-col cols="12" sm="6" md="6">
                                    <v-text-field label="Precio" type="Monto" variant="outlined"
                                        hint="Sin comas o puntos (, .)" persistent-hint required v-model="formGasto.monto"
                                        :rules="gastoRules"></v-text-field>
                                </v-col>
                            </v-row>
                        </v-form>
                    </v-container>
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="red-darken-1" variant="tonal" @click="dialogG = false">
                        Cerrar
                    </v-btn>
                    <v-btn color="green-darken-1" variant="tonal" @click="crearGasto()">
                        Crear
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </div>
</template>

<script>
import axios from "axios";
import Swal from "sweetalert2";
export default {
    name: "gastosVista",
    data: () => ({
        formGasto: {
            nombre: null,
            descripcion: null,
            categoria: null,
            monto: 0,
        },
        gastoRules: [
            (v) => !!v || "El monto es requerido",
            (v) =>
                (v && /^[0-9]+$/.test(v)) || "El numero no debe contener caracteres",
        ],
        categorias: [
            "Servicios Públicos",
            "Compra de productos e insumos",
            "Arriendo",
            "Nómina",
            "Gastos administrativos",
            "Mercadeo y publicidad",
            "Transporte, domicilios y logísica",
            "Mantenimiento y reparaciones",
            "Muebles, equipos o maquinaria",
            "Otros",
        ],
        dialogG: false,
        gastos: [],
    }),
    methods: {
        async crearGasto() {
            this.formGasto.monto = parseInt(this.formGasto.monto);
            axios
                .post(`${process.env.VUE_APP_API_URL}/gasto/crear`, this.formGasto)
                .then(async (resp) => {
                    if (resp.status == 201) {
                        Swal.fire({
                            icon: "success",
                            title: "Exitoso",
                            text: "Gasto creado correctamente!",
                            timer: 1500,
                            showConfirmButton: false,
                        });
                        await this.limpiarForm();
                        await this.listarGastos();
                        return;
                    }
                })
                .catch(() => {
                    return Swal.fire({
                        icon: "error",
                        title: "No se pudo crear el gasto",
                        timer: 1000,
                    });
                });
        },
        async limpiarForm() {
            this.dialogG = false;
            await this.$refs.formGasto.reset();
        },
        async listarGastos() {
            await axios.get(`${process.env.VUE_APP_API_URL}/gasto`).then((resp) => {
                this.gastos = resp.data;
            });
        },
        async eliminarGasto(idGasto) {
            Swal.fire({
                icon: "info",
                title: "Seguro quiere eliminar el gasto?",
                showDenyButton: true,
                denyButtonText: "No",
                confirmButtonText: "Eliminar",
            }).then(async (result) => {
                if (result.isConfirmed) {
                    await axios.delete(`${process.env.VUE_APP_API_URL}/gasto/${idGasto}`)
                        .then(async () => {
                            Swal.fire({
                                icon: "success",
                                title: "Se elimino correctamente",
                                timer: 1000,
                                showConfirmButton: false,
                            });
                            await this.listarGastos();
                        });
                }
            }).catch(() => {
                return Swal.fire({
                    icon: "error",
                    title: "No se pudo eliminar el gasto",
                    timer: 1000,
                });
            });
        },
    },
    async created() {
        this.$emit("loadingSweet");
        await this.listarGastos();
        this.$emit("closeSweet");
    },
};
</script>

<style></style>
