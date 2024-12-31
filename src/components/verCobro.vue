<template>
    <div>
        <v-dialog v-model="this.$props.dialogVerCobro" persistent width="700">
			<v-card>
				<v-card-text>
					<v-container>
						<v-form>
							<v-row>
								<v-progress-linear v-model="skill" color="green" height="25">
									<template v-slot:default="{ value }">
										<strong>{{ Math.ceil(value) }}%</strong>
									</template>
								</v-progress-linear>
								<v-col cols="12">
									<v-text-field label="Documento" type="text" required variant="outlined"
										v-model="localVerCobro.cliente.documento" disabled></v-text-field>
								</v-col>
								<v-col cols="12" sm="6">
									<v-text-field variant="outlined" label="Nombre" disabled required
										v-model="localVerCobro.cliente.nombres"></v-text-field>
								</v-col>
								<v-col cols="12" sm="6">
									<v-text-field variant="outlined" label="Apellido" disabled required
										v-model="localVerCobro.cliente.apellidos"></v-text-field>
								</v-col>
								<v-col cols="12" sm="6">
									<v-text-field variant="outlined" label="Ruta" disabled required v-model="localVerCobro.cliente.direccion.nombre
										"></v-text-field>
								</v-col>
								<v-col cols="12" sm="6">
									<v-text-field variant="outlined" label="Producto" disabled required
										v-model="localVerCobro.producto"></v-text-field>
								</v-col>
								<v-col cols="12" sm="6">
									<v-text-field variant="outlined" label="Fecha de Inicio" disabled required
										v-model="localVerCobro.fecha_inicio"></v-text-field>
								</v-col>
								<v-col cols="12" sm="6">
									<v-text-field variant="outlined" label="N° Cuotas" disabled required
										v-model="localVerCobro.cuotas"></v-text-field>
								</v-col>
								<v-col cols="12" sm="6">
									<v-text-field variant="outlined" label="Cuotas atrasadas" disabled required
										v-model="localVerCobro.cuotas_atrasadas"></v-text-field>
								</v-col>
								<v-col cols="12" sm="6">
									<v-text-field variant="outlined" label="Total" disabled required
										v-model="localVerCobro.total"></v-text-field>
								</v-col>
								<v-card-text v-if="localVerCobro.cuotas !== 0">
									<div class="font-weight-bold ms-1 mb-2">
										Restante : ${{
											calcularRestante(
												localVerCobro.abono,
												localVerCobro.total
											)
										}}
									</div>
									<div class="font-weight-bold ms-1 mb-2">
										Abonado : ${{
											calcularAbono(localVerCobro.abono)
										}}
									</div>
									<v-timeline density="compact" align="start">
										<v-timeline-item v-for="monto in localVerCobro.abono" :key="monto"
											dot-color="green" size="x-small">
											<div class="mb-4">
												<div class="font-weight-normal">
													<strong>
														Abono: ${{
															monto.monto.toLocaleString()
														}}
													</strong>
												</div>
												<div>
													{{
														formatDate(monto.fecha)
													}}
												</div>
											</div>
										</v-timeline-item>
									</v-timeline>
								</v-card-text>
							</v-row>
						</v-form>
					</v-container>
				</v-card-text>
				<v-card-actions class="justify-end">
					<v-btn color="red-darken-1" variant="tonal" @click="cerrarDialog">
						Cerrar
					</v-btn>
				</v-card-actions>
			</v-card>
		</v-dialog>
    </div>
</template>
<script>
export default {
	name: 'VerCobro',
	props: {
		dialogVerCobro: Boolean,
		cobro: {
			type: Object,
			default() {
				return null;
			}
		}
	},
	data() {
		return {
			localVerCobro: this.cobro ? { ...this.cobro } : { ...this.defaultCobro }
		};
	},
	watch: {
		cobro: {
			handler(newVal) {
				this.localVerCobro = newVal ? { ...newVal } : { ...this.defaultCobro };
			},
			deep: true
		}
	},
	methods: {
		cerrarDialog() {
			this.$emit('cerrarDialog');
		},
        calcularRestante(abono, total) {
			let abonoTotal = 0;
			abono.forEach((abono) => {
				abonoTotal += abono.monto;
			});
			return (total - abonoTotal).toLocaleString();
		},
        calcularAbono(abono) {
			let abonoTotal = 0;
			abono.forEach((abono) => {
				abonoTotal += abono.monto;
			});
			return abonoTotal.toLocaleString();
		},
        defaultCobro() {
            return {
                abono: [],
                mora: null,
                _id: null,
                cliente: {
                    _id: null,
                    documento: null,
                    nombres: null,
                    apellidos: null,
                    telefono: null,
                    correo: null,
                    direccion: { nombre: null },
                    mora: null,
                    __v: null,
                },
                ruta: null,
                producto: null,
                fecha_inicio: null,
                cuotas: null,
                pago_fechas: [
                    {
                        fecha: null,
                        monto: null,
                    },
                ],
                cuotas_atrasadas: null,
                completado: null,
                total: null,
            };
        },
        formatDate(value) {
			const date = new Date(value);
			const year = date.getFullYear();
			const month = (date.getMonth() + 1).toString().padStart(2, "0");
			const day = date.getDate().toString().padStart(2, "0");
			const hours = date.getHours().toString().padStart(2, "0");
			const minutes = date.getMinutes().toString().padStart(2, "0");
			const seconds = date.getSeconds().toString().padStart(2, "0");

			return `${year}-${month}-${day} | ${hours}:${minutes}:${seconds}`;
		},
	},
    computed: {
        skill() {
			let abonado = 0;
			this.localVerCobro.abono.forEach((abono) => {
				abonado += abono.monto;
			});
			if (this.localVerCobro.cuotas == 0) {
				return 100;
			}
			return (abonado * 100) / this.localVerCobro.total;
		},
    }
}
</script>
