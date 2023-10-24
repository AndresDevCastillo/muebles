<template>
    <div class="ganancias gananciasF">
        <v-row class="ma-6 mb-6">
            <v-col cols="12"><v-card class="w-100 d-flex gananciasF">
                    <v-container>
                        <v-row dense>
                            <v-col md="4">
                                <div class="col-xxl-4 col-md-6">
                                    <div class="card revenue-card"
                                        :class="{ 'info-card-gana': hoy.total >= 0, 'info-card-pierde': hoy.total < 0 }">
                                        <div class="card-body">
                                            <h5 class="card-title">Hoy <span>| {{ hoy.fecha }}</span></h5>

                                            <div class="d-flex align-items-center">
                                                <div
                                                    class="card-icon rounded-circle d-flex align-items-center justify-content-center">
                                                    <i class="bi bi-currency-dollar"></i>
                                                </div>
                                                <div class="ps-3">
                                                    <h6>${{ hoy.total.toLocaleString() }}</h6>
                                                    <span class="text-success small pt-1 fw-bold">${{
                                                        hoy.ganancia.toLocaleString() }}</span>
                                                    <span> - </span>
                                                    <span class="text-error small pt-2">${{ hoy.gasto.toLocaleString()
                                                    }}</span>

                                                </div>

                                            </div>
                                            <h4 class="card-title">Ventas: <span> {{ hoy.factura }}</span></h4>
                                        </div>

                                    </div>
                                </div>
                            </v-col>

                            <v-col md="4">
                                <div class="col-xxl-4 col-md-6">
                                    <div class="card info-card revenue-card"
                                        :class="{ 'info-card-gana': mes.total >= 0, 'info-card-pierde': mes.total < 0 }">
                                        <div class="card-body">
                                            <h5 class="card-title">Mensual <span>| {{ mes.fecha }}</span></h5>

                                            <div class="d-flex align-items-center">
                                                <div
                                                    class="card-icon rounded-circle d-flex align-items-center justify-content-center">
                                                    <i class="bi bi-currency-dollar"></i>
                                                </div>
                                                <div class="ps-3">
                                                    <h6>${{ mes.total.toLocaleString() }}</h6>
                                                    <span class="text-success small pt-1 fw-bold">${{
                                                        mes.ganancia.toLocaleString() }}</span>
                                                    <span> - </span>
                                                    <span class="text-error small pt-2">${{ mes.gasto.toLocaleString()
                                                    }}</span>

                                                </div>
                                            </div>
                                            <h4 class="card-title">Ventas: <span> {{ mes.factura }}</span></h4>

                                        </div>

                                    </div>
                                </div>
                            </v-col>

                            <v-col md="4">
                                <div class="col-xxl-4 col-md-6">
                                    <div class="card info-card revenue-card"
                                        :class="{ 'info-card-gana': yearC.total >= 0, 'info-card-pierde': yearC.total < 0 }">
                                        <div class="card-body">
                                            <h5 class="card-title">Anual <span>| {{ yearC.fecha }}</span></h5>

                                            <div class="d-flex align-items-center">
                                                <div
                                                    class="card-icon rounded-circle d-flex align-items-center justify-content-center">
                                                    <i class="bi bi-currency-dollar"></i>
                                                </div>
                                                <div class="ps-3">
                                                    <h6>${{ yearC.total.toLocaleString() }}</h6>
                                                    <span class="text-success small pt-1 fw-bold">${{
                                                        yearC.ganancia.toLocaleString()
                                                    }}</span>
                                                    <span> - </span>
                                                    <span class="text-error small pt-2">${{ yearC.gasto.toLocaleString()
                                                    }}</span>

                                                </div>
                                            </div>
                                            <h4 class="card-title">Ventas: <span> {{ yearC.factura }}</span></h4>

                                        </div>

                                    </div>
                                </div>
                            </v-col>
                        </v-row>
                    </v-container>
                </v-card>
            </v-col>
            <v-col lg="6" md="6" sm="12">
                <canvas class="mb-6" id="graficaDia"></canvas>
            </v-col>
            <v-col lg="6" md="6" sm="12">
                <canvas class="mb-6" id="graficaMes"></canvas>
            </v-col>
            <v-col lg="12" md="12" sm="12">
                <canvas class="mb-6" id="graficaYear"></canvas>
            </v-col>
        </v-row>
    </div>
</template>

<script>
import Chart from "chart.js/auto";
import Axios from "axios";
export default {
    name: "gananciasVista",
    data: () => ({
        hoy: {
            fecha: 'Lunes',
            total: 0,
            ganancia: 0,
            gasto: 0,
            factura: 0
        },
        mes: {
            fecha: 'Enero',
            total: 0,
            ganancia: 0,
            gasto: 0,
            factura: 0
        },
        yearC: {
            fecha: 2023,
            total: 0,
            ganancia: 0,
            gasto: 0,
            factura: 0
        },
        miImagen: null,
        year: null,
        dataYearName: null,
        dataYearCantidad: null,
        dataMesName: null,
        dataMesCantidad: null,
        dataDiaName: null,
        dataDiaCantidad: null,
        chart: null,
        datosCharts: null,
    }),
    methods: {
        async listarGraficaYear(year) {
            this.dataYearName = [];
            this.dataYearCantidad = [];
            await Axios.get(
                `${process.env.VUE_APP_API_URL}/factura/estadisticas/year/${year}`
            ).then((resp) => {
                resp.data.map((producto) => {
                    this.dataYearName.push(producto.nombre);
                    this.dataYearCantidad.push(producto.cantidad);
                });
            });
            let ctx = document.getElementById("graficaYear");
            this.year = {
                type: "bar",
                data: {
                    labels: this.dataYearName,
                    datasets: [
                        {
                            label: "Ventas totales",
                            data: this.dataYearCantidad,
                            borderWidth: 1,
                        },
                    ],
                },
                options: {
                    plugins: {
                        title: {
                            display: true,
                            text: 'Ventas Anuales',
                        },
                    },
                    scales: {
                        y: {
                            beginAtZero: true,
                        },
                    },
                },
            };

            this.chart = new Chart(ctx, this.year);
        },
        async listarGraficaMes(year, mes) {
            this.dataMesName = [];
            this.dataMesCantidad = [];
            await Axios.get(
                `${process.env.VUE_APP_API_URL}/factura/estadisticas/mes/${year}/${mes}`
            ).then((resp) => {
                resp.data.map((producto) => {
                    this.dataMesName.push(producto.nombre);
                    this.dataMesCantidad.push(producto.cantidad);
                });
            });
            let ctx = document.getElementById("graficaMes");
            this.year = {
                type: "pie",
                data: {
                    labels: this.dataMesName,
                    datasets: [
                        {
                            label: "Ventas totales",
                            data: this.dataMesCantidad,
                            borderWidth: 1,
                        },
                    ],
                },
                options: {
                    plugins: {
                        title: {
                            display: true,
                            text: 'Ventas Mensuales',
                        },
                    },
                    scales: {
                        y: {
                            beginAtZero: true,
                        },
                    },
                },
            };

            this.chart = new Chart(ctx, this.year);
        },
        async listarGraficaDia(year, mes, dia) {
            this.dataDiaName = [];
            this.dataDiaCantidad = [];
            await Axios.get(
                `${process.env.VUE_APP_API_URL}/factura/estadisticas/dia/${year}/${mes}/${dia}`
            ).then((resp) => {
                resp.data.map((producto) => {
                    this.dataDiaName.push(producto.nombre);
                    this.dataDiaCantidad.push(producto.cantidad);
                });
            });
            let ctx = document.getElementById("graficaDia");
            this.dia = {
                type: "polarArea",
                data: {
                    labels: this.dataDiaName,
                    datasets: [
                        {
                            label: "Ventas totales",
                            data: this.dataDiaCantidad,
                            borderWidth: 1,
                        },
                    ],
                },
                options: {
                    plugins: {
                        title: {
                            display: true,
                            text: 'Ventas Diarias',
                        },
                    },
                    scales: {
                        y: {
                            beginAtZero: true,
                        },
                    },
                },
            };

            this.chart = new Chart(ctx, this.dia);
        },
        async gananciaYear(year) {
            await Axios.get(`${process.env.VUE_APP_API_URL}/factura/ganancias/year/${year}`).then(resp => {
                this.yearC = resp.data;
            });
        },
        async gananciaMes(year, mes) {
            await Axios.get(`${process.env.VUE_APP_API_URL}/factura/ganancias/mes/${year}/${mes}`).then(resp => {
                this.mes = resp.data;
            });
        },
        async gananciaDia(year, mes, dia) {
            await Axios.get(`${process.env.VUE_APP_API_URL}/factura/ganancias/dia/${year}/${mes}/${dia}`).then(resp => {
                this.hoy = resp.data;
            });
        }
    },

    async mounted() {
        this.miImagen = require('../assets/icons/shop-solid.svg');
        const fechaActual = new Date();
        const year = fechaActual.getFullYear();
        const mes = fechaActual.getMonth() + 1;
        const hoy = fechaActual.getDate();
        const dia = hoy.toString().padStart(2, '0');
        this.$emit('loadingSweet');
        await this.gananciaDia(year, mes, dia);
        await this.gananciaMes(year, mes);
        await this.gananciaYear(year);
        await this.listarGraficaDia(year, mes, dia);
        await this.listarGraficaMes(year, mes);
        await this.listarGraficaYear(year);
        this.$emit('closeSweet');


    },
};
</script>

<style>
.card {
    margin-bottom: 30px;
    border: none;
    border-radius: 5px;
    box-shadow: 0px 0 30px rgba(147, 187, 255, 0.1);
}

.card-header,
.card-footer {
    border-color: #ebeef4;
    background-color: #fff;
    color: #798eb3;
    padding: 15px;
}

.card-title {
    padding: 20px 0 15px 0;
    font-size: 18px;
    font-weight: 500;
    color: #012970;
    font-family: "Poppins", sans-serif;
}

.card-title span {
    color: #899bbd;
    font-size: 14px;
    font-weight: 400;
}

.card-body {
    padding: 0 20px 20px 20px;
}

.info-card {
    padding-bottom: 10px;
}

.info-card-gana h6 {
    font-size: 28px;
    color: #012970;
    font-weight: 700;
    margin: 0;
    padding: 0;
}

.info-card-pierde h6 {
    font-size: 28px;
    color: #ce0202;
    font-weight: 700;
    margin: 0;
    padding: 0;
}

.filter {
    position: absolute;
    right: 0px;
    top: 15px;
}

.filter .icon {
    color: #aab7cf;
    padding-right: 20px;
    padding-bottom: 5px;
    transition: 0.3s;
    font-size: 16px;
}

.filter .icon:hover,
.filter .icon:focus {
    color: #4154f1;
}
</style>
