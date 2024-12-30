<template>
    <div class="modal-venta">
        <v-dialog v-model="this.$props.dialogCrearVenta" persistent width="700">
            <v-card>
                <v-card-title> Nueva venta </v-card-title>
                <v-card-text>
                    <v-form v-model="valid" ref="formPrestamo">
                        <v-row>
                            <v-col cols="12">
                                <v-autocomplete label="Nombre del cliente"
                                    no-data-text="Sin clientes disponible para venta" return-object :items="clientes"
                                    :item-title="(item) => {
                                        return `${item.nombres} ${item.apellidos}`;
                                    }
                                        " variant="outlined" v-model="form.cliente"
                                    :rules="campoRules"></v-autocomplete>
                            </v-col>
                            <v-col cols="12">
                                <v-autocomplete :items="vendedores" variant="outlined" label="Vendedor" required
                                    v-model="form.vendedor" item-title="nombre" item-value="nombre"
                                    :rules="[(v) => !!v || 'Seleccione un vendedor']"
                                    no-data-text="No hay vendedores"></v-autocomplete>
                            </v-col>
                            <v-col md="6" cols="12">
                                <v-autocomplete label="Producto" return-object no-data-text="Sin productos registrados"
                                    item-value="producto._id" :items="productos" item-title="producto.nombre"
                                    variant="outlined" v-model="form.producto" :rules="campoRules"></v-autocomplete>
                            </v-col>
                            <v-col md="6" cols="12">
                                <v-text-field type="number" label="Cantidad" placeholder="Ingrese cantidad del producto"
                                    min="1" variant="outlined" v-model="form.cantidad"
                                    :rules="cantidadRules"></v-text-field>
                            </v-col>
                            <v-col :cols="cols2[0]">
                                <v-select label="Forma de pago" :items="formasPago" item-value="index"
                                    item-title="forma" placeholder="Escoja forma de pago" variant="outlined"
                                    v-model="formaPago" :rules="campoRules"></v-select>
                            </v-col>
                            <v-col :cols="cols2[1]" v-if="formaPago == 2">
                                <v-text-field type="number" label="Cuotas" placeholder="Ingrese cantidad de cuotas"
                                    min="1" variant="outlined" v-model="form.cuotas"
                                    :rules="cantidadRules"></v-text-field>
                            </v-col>
                            <v-col cols="12" v-if="formaPago == 2">
                                <v-chip color="green">
                                    Fechas seleccionadas:
                                    {{ form.pago_fechas.length }}</v-chip>
                            </v-col>
                            <v-col cols="12" v-if="formaPago == 2">
                                <VueDatePicker format="yyyy-MM-dd" :rules="campoRules" :enable-time-picker="false"
                                    cancelText="Cancelar" locale="es" selectText="Seleccionar"
                                    v-model="form.pago_fechas" multi-dates :min-date="new Date()"
                                    placeholder="Selecciona fechas de pago" teleport-center
                                    @cleared="form.pago_fechas = []" />
                            </v-col>
                            <v-col cols="12">
                                <h6 class="mb-3 text-h6">Marca la ubicación de cobro</h6>
                                <MapsComponent @ubicacion="(ubi) => {
                                    form.ubicacionMap = ubi;
                                }
                                    " />
                            </v-col>
                        </v-row>
                    </v-form>
                </v-card-text>
                <v-card-actions class="justify-end">
                    <v-btn color="red-darken-1" variant="tonal" @click="cerrarDialog()">
                        Cerrar
                    </v-btn>
                    <v-btn color="green-darken-1" variant="tonal" :disabled="disableBtn" @click="guardar">
                        Crear
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </div>

</template>

<script>
import Session from "@/validation/session";
import Swal from "sweetalert2";
import axios from "axios";
export default {
    name: 'crearVenta',
    props: { dialogCrearVenta: { type: Boolean, default: false } },
    data() {
        return {
            api: import.meta.env.VITE_APP_API_URL,
            token: null,
            vendedores: [],
            valid: true,
            clientes: [],
            productos: [],
            disableBtn: false,
            form: {
                cliente: null,
                ruta: null,
                producto: null,
                fecha_inicio: "",
                vendedor: null,
                cantidad: 1,
                cuotas: 1,
                pago_fechas: [],
                total: 0,
                ubicacionMap: {
                    lat: null,
                    lng: null,
                },
            },
            campoRules: [(v) => !!v || "Campo requerido"],
            cantidadRules: [
                (v) => !!v || "Campo requerido",
                (v) => parseInt(v) > 0 || "Ingrese una cantidad mayor a 0",
            ],
            formasPago: [
                { index: 1, forma: "De contado" },
                { index: 2, forma: "A crédito" },
            ],
            formaPago: null,
        };
    },
    methods: {
        cerrarDialog() {
            this.$emit("cerrarDialog");
        },
        actualizarTodo() {
            this.getVendedores();
            this.getClientes();
            this.getProductosInventario();
            this.$emit("actualizarTodo");
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
        async getClientes() {
            await axios
                .get(`${this.api}/prestamo/clientes`, {
                    headers: {
                        Authorization: `Bearer ${this.token}`,
                    },
                })
                .then((resp) => {
                    this.clientes = resp.data;
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
        async getProductosInventario() {
            await axios
                .get(`${this.api}/inventario/existe`, {
                    headers: {
                        Authorization: `Bearer ${this.token}`,
                    },
                })
                .then((resp) => {
                    this.productos = resp.data;
                })
                .catch((error) => {
                    switch (error.response.status) {
                        case 401:
                            Session.expiredSession();
                            break;
                        default:
                            Swal.fire({
                                icon: "info",
                                text: "No se pudo obtener los productos",
                                showConfirmButton: false,
                                timer: 1600,
                            });
                            break;
                    }
                });
        },
        async guardar() {
            const { valid } = await this.$refs.formPrestamo.validate();
            if (valid) {
                if (
                    this.form.ubicacionMap.lat == null ||
                    this.form.ubicacionMap.lng == null
                ) {
                    Swal.fire({
                        icon: "error",
                        title: "Ubicación",
                        text: "Debe seleccionar una ubicación en el mapa",
                        showConfirmButton: false,
                        timer: 1600,
                    });
                    return;
                }
                this.form.cantidad = parseInt(this.form.cantidad);
                this.form.cuotas = parseInt(this.form.cuotas);
                let total,
                    pagos = [];
                if (
                    this.formaPago == 2 &&
                    this.form.pago_fechas.length != this.form.cuotas
                ) {
                    return Swal.fire({
                        icon: "warning",
                        text: "Las fechas de pago deben ser iguales a la cantidad de cuotas",
                        showConfirmButton: false,
                        timer: 1690,
                    });
                }
                if (this.form.cantidad <= this.form.producto.existencias) {
                    this.disableBtn = true;
                    if (this.form.pago_fechas.length > 1) {
                        this.form.pago_fechas = this.ordenarFechas(this.form.pago_fechas);
                    }
                    if (parseInt(this.formaPago) == 1) {
                        total =
                            this.form.cantidad * this.form.producto.producto.valor_contado;
                        this.form.cuotas = 0;
                    } else {
                        total =
                            this.form.cantidad * this.form.producto.producto.valor_credito;
                        const cuotaBase = Math.ceil(total / this.form.cuotas); //Redondeo hacia arriba
                        const valorCuota = Math.floor(cuotaBase / 100) * 100; //Redondeo hacia abajo, con parte entera de 100
                        const restVal = Math.round(
                            (cuotaBase - valorCuota) * this.form.cuotas
                        ); //Diferencia, con redondeo al más cercano
                        pagos = this.form.pago_fechas.map((pago, index) => {
                            return index == 0
                                ? { fecha: pago, monto: valorCuota + restVal }
                                : { fecha: pago, monto: valorCuota };
                        });
                    }
                    const paquete = {
                        cliente: this.form.cliente._id, //`${this.form.cliente.nombres} ${this.form.cliente.apellidos}`,
                        ruta: this.form.cliente.direccion.nombre,
                        producto: this.form.producto.producto.nombre, //ObjectId del inventario
                        vendedor: this.form.vendedor,
                        inventario: this.form.producto._id,
                        fecha_inicio: new Date().toISOString(),
                        cantidad: this.form.cantidad,
                        cuotas: this.form.cuotas,
                        pago_fechas: pagos,
                        total: total,
                        ubicacionMap: this.form.ubicacionMap,
                    };
                    await axios
                        .post(`${this.api}/prestamo/crear`, paquete, {
                            headers: {
                                Authorization: `Bearer ${this.token}`,
                            },
                        })
                        .then(() => {
                            this.form.pago_fechas = [];
                            this.$refs.formPrestamo.reset();
                            Swal.fire({
                                icon: "success",
                                text: "Venta registrada correctamente",
                                showConfirmButton: false,
                                timer: 1710,
                            });
                            this.cerrarDialog();
                        })
                        .catch((error) => {
                            switch (error.response.status) {
                                case 401:
                                    Session.expiredSession();
                                    break;
                                default:
                                    Swal.fire({
                                        icon: "info",
                                        text: "No se pudo crear la venta",
                                        showConfirmButton: false,
                                        timer: 1710,
                                    });
                                    break;
                            }
                        });
                } else {
                    this.disableBtn = false;
                    return Swal.fire({
                        icon: "warning",
                        text: `No hay suficientes ${this.form.producto.producto.nombre}, sólo hay ${this.form.producto.existencias}`,
                        showConfirmButton: false,
                        timer: 1600,
                    });
                }
            }
            this.disableBtn = false;
            await this.actualizarTodo();
        },
    },
    computed: {
        cols2() {
            //Para que los input del modal sean responsive
            const { xxl, xl, lg, md } = this.$vuetify.display;
            let resp = [12, 12];
            if (xxl || xl || lg || md) {
                resp = [6, 6];
            }
            return resp;
        },
    },
    async mounted() {
        this.token = this.$store.getters.usuario.usuario.access_token;
        await this.getVendedores();
        await this.getClientes();
        await this.getProductosInventario();
        await this.getVendedores(); 
    }
};
</script>

<style scoped>
</style>