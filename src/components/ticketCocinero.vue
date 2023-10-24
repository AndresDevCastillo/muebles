<template>
    <v-row justify="center">
        <v-dialog v-model="verDialogTicketCocinero" persistent fullscreen :scrim="false" transition="dialog-bottom-transition">
            <v-card>
                <v-toolbar dark theme="dark" class="noImprimir">
                    <v-btn icon dark @click="cerrarDialogo()">
                        <v-icon>mdi-close</v-icon>
                    </v-btn>
                    <v-spacer></v-spacer>
                    <v-toolbar-items>
                        <v-btn variant="text" @click="imprimir()">
                            Imprimir
                        </v-btn>
                    </v-toolbar-items>
                </v-toolbar>
                <v-card-text>
                    <v-col cols="12" sm="6" md="4" xl="4" class="ma-auto">
                        <v-card rounded="4" class="pa-4 mt-2" id="ticketCocinero">
                            <v-row class="w-100 flex-column" id="infoEmpresa" no-gutters
                                style="font-family: 'Roboto', sans-serif; color: #000 !important; margin-top:5px;">
                                <p
                                    style="font-size: 2rem;  text-align: center !important; font-weight: bold !important; text-transform: uppercase !important;">
                                    Empresa X</p>
                                <p style="text-align: center !important; font-size: 1.1rem;">El Sena</p>
                                <p style="text-align: center !important; font-size: 1.1rem;">Montería, Córdoba, Colombia</p>
                            </v-row>
                            <v-row class="w-100 flex-column" no-gutters id="datosGenerales">
                                <v-row class="w-100 flex-column" no-gutters
                                    style="font-family: 'Roboto', sans-serif; color: #000 !important; font-weight: 500 !important;">
                                    <p style=" font-size: 1.2rem;">TICKET: <span>#{{ ticket.ticket.toString().length == 1 ?
                                        '000' :
                                        ticket.ticket.toString().length == 2 ? '00' : ticket.ticket.toString().length ==
                                            3 ?
                                            '0' :
                                            null }}{{ ticket.ticket }}</span></p>
                                    <p style=" font-size: 1.2rem;">FECHA: <span>{{ ticket.fecha }}</span></p>
                                    <p style=" font-size: 1.2rem;">HORA: <span>{{ ticket.hora }}</span></p>
                                    <p style=" font-size: 1.2rem;">MESA: <span>{{ ticket.mesa.nombre }}</span></p>
                                    <p style=" font-size: 1.2rem;">EMPLEADO: <span>{{ ticket.empleado.nombre }}</span></p>

                                </v-row>
                                <v-divider class="divider-dotted"
                                    style="border-style: dotted !important; color: #000; opacity: 1;"></v-divider>
                                <v-row class="w-100 flex-column" no-gutters>
                                    <v-table id="tablaTicketCocinero" class="w-100" fixed-header height="auto" border="1"
                                        border-collapse="collapse" cellspacing="0">
                                        <thead class="fw-bold" style="font-weight: bold; font-size: 1.4rem;">
                                            <tr style="color: #000;">
                                                <th class="text-left"
                                                    style="font-size: 1.30rem; color: #000; border-bottom-style: dotted !important; border-bottom-width: 1px !important; box-shadow: none !important;">
                                                    Cant
                                                </th>
                                                <th class="text-left"
                                                    style="font-size: 1.30rem; color: #000; border-bottom-style: dotted !important; border-bottom-width: 1px !important; box-shadow: none !important;">
                                                    Descripción
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody id="productosTicketCocinero">
                                            <tr v-for="(item, index) in ticket.detalleTicket" :key="index">
                                                <td class="text-left"
                                                    style="font-size: 1.30rem; border-style: none !important;">{{
                                                        item.cantidad }}</td>
                                                <td class="text-left"
                                                    style="font-size: 1.30rem; border-style: none !important;">
                                                    {{ item.producto.nombre }}
                                                </td>
                                            </tr>
                                        </tbody>
                                        <tfoot>
                                            <tr>
                                                <th colspan="2"
                                                    style="border-style: none !important; height: 20px !important; padding: 0 0;">
                                                    <v-divider class="divider-dotted"
                                                        style="border-style: dotted !important; color: #000; opacity: 1;"></v-divider>
                                                </th>
                                            </tr>
                                        </tfoot>
                                    </v-table>
                                </v-row>
                                <v-row no-gutters class="w-100 flex-column" id="terminos">
                                    <p
                                        style="font-size:1.27rem; text-transform: uppercase; margin-top: 6px; font-family: 'Helvetica', Arial, sans-serif;">
                                        <strong>NOTA: </strong>
                                        {{ ticket.descripcion }}
                                    </p>
                                </v-row>
                            </v-row>
                        </v-card>
                    </v-col>
                </v-card-text>
            </v-card>
        </v-dialog>
    </v-row>
</template>
<script>
import {
    jsPDF
} from "jspdf";
import "jspdf-autotable";
export default {
    name: 'ticketCocineroComponent',
    props: {
        dialog2: { type: Boolean, default: false, required: true },
        ticket: {
            type: Object,
            default: () => {
                return {
                    ticket: null,
                    fecha: null,
                    hora: null,
                    detalleTicket: [],
                    empleado: {},
                    mesa: {},
                };
            },
            required: true,
        },
    },
    data: () => ({
        verDialogTicketCocinero: false,
        compras: [
            {
                cantidad: 2,
                descripcion: "Tocinetas",
                precioU: 1000,
                pagar: 0,//cantidad*precioU
            },
            {
                cantidad: 1,
                descripcion: "Dorito de Queso",
                precioU: 2000,
                pagar: 0
            }
        ]

    }),
    methods: {
        cerrarDialogo() {
            this.$emit('cerrarDialogoTicketCocinero');
        },
        imprimir() {
            const doc = new jsPDF('p', 'pt', 'letter');
            doc.viewerPreferences({
                'HideWindowUI': true,
                'PrintArea': 'CropBox',
                'HideMenubar': true,
                'HideToolbar': true,
                'ViewArea': 'CropBox',
                'DisplayDocTitle': true
            });
            const infoEmpresa = document.getElementById('infoEmpresa');
            const datosGenerales = document.getElementById('datosGenerales');
            const margin = 6;
            const scale = (doc.internal.pageSize.width - margin * 2) / document.body.clientWidth;
            //const scale_mobile = (doc.internal.pageSize.width - margin * 2) / document.body.getBoundingClientRect();
            doc.setDocumentProperties({
                title: 'ticketCocinero.pdf'
            });

            //Revisar dispositivo
            if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
                //Mobile
                doc.html(infoEmpresa, {
                    x: margin,
                    y: margin,
                    //width: 1320,
                    //height: 200,
                    //windowHeight: 200,
                    //windowWidth: 1320,
                    /* html2canvas: {
                        scale: scale_mobile,
                        //height: 200,
                        //width: 1320,
                        //windowWidth: 1320,
                        //windowHeight: 200,
                    }, */
                    filename: 'ticket.pdf',
                    callback: (pdf) => {
                        /*  pdf.autoTable({
                             html: tabla,
                             head: [['Producto', 'Descripcion', 'Precio', 'Descuento']],
                             useCss: true,
                             startY: 150,
                             styles: { overflow: 'ellipsize', cellWidth: 'wrap' },
                             // Override the default above for the text column
                             columnStyles: { text: { cellWidth: 'auto' } },
                             margin: { left: margin },
                             bodyStyles: { textColor: '#00000' },
                             headStyles: {
                                 fillColor: '#F3F2F7',
                                 textColor: '#00000',
                                 fontStyle: '"Roboto" sans-serif',
                                 lineWidth: {
                                     bottom: 1
                                 }
                             },
                         });
                         finalY = pdf.lastAutoTable.finalY; */
                        pdf.html(datosGenerales, {
                            x: margin,
                            y: 40,
                            /*  width: 1320,
                             windowWidth: 1320, */
                            /* html2canvas: {
                                scale: scale_mobile,
                                //height: 200,
                                // width: 1320,
                                // windowWidth: 1320,
                                //windowHeight: 200,
                            }, */
                            filename: 'ticket.pdf',
                            callback: (newPdf) => {
                                newPdf.autoPrint();
                                newPdf.output('dataurlnewwindow', { filename: 'ticket.pdf' });
                                /*  newPdf.html(parteFinal, {
                                     x: margin,
                                     y: finalY + 80,
                                     width: 1320,
                                     windowWidth: 1320,
                                     html2canvas: {
                                         scale: scale_mobile,
                                         //height: 200,
                                         width: 1320,
                                         windowWidth: 1320,
                                         //windowHeight: 200,
                                     },
                                     filename: 'factura.pdf',
                                     callback: (newPdf2) => {
                                         newPdf2.autoPrint();
                                         newPdf2.output('dataurlnewwindow', {
                                             filename: 'factura.pdf'
                                         });
                                         return newPdf2;
                                     }
                                 });
                              */
                            }
                        });
                    },
                });

            } else {
                //PC
                doc.html(infoEmpresa, {
                    x: margin,
                    y: margin,
                    //width: 1320,
                    //height: 200,
                    //windowHeight: 200,
                    //windowWidth: 1320,
                    html2canvas: {
                        scale: scale,
                        //height: 200,
                        //width: 1320,
                        //windowWidth: 1320,
                        //windowHeight: 200,
                    },
                    filename: 'ticketCocinero.pdf',
                    callback: (pdf) => {
                        //pdf.output('dataurlnewwindow', { filename: 'ticketCocinero.pdf' });
                        pdf.html(datosGenerales, {
                            x: margin,
                            y: 40,
                            /*  width: 1320,
                             windowWidth: 1320, */
                            html2canvas: {
                                scale: scale,
                                //height: 200,
                                /*  width: 1320,
                                 windowWidth: 1320,*/
                                //windowHeight: 200,
                            },
                            filename: 'ticket.pdf',
                            callback: (newPdf) => {
                                // newPdf.autoPrint();
                                newPdf.output('dataurlnewwindow', { filename: 'ticketCocinero.pdf' });
                            }
                        });

                        /* pdf.autoTable({
                            html: tabla,
                            head: [['Producto', 'Descripcion', 'Precio', 'Descuento']],
                            useCss: true,
                            startY: 150,
                            styles: { overflow: 'ellipsize', cellWidth: 'wrap' },
                            // Override the default above for the text column
                            columnStyles: { text: { cellWidth: 'auto' } },
                            margin: { left: margin },
                            bodyStyles: { textColor: '#00000' },
                            headStyles: {
                                fillColor: '#F3F2F7',
                                textColor: '#00000',
                                fontStyle: '"Roboto" sans-serif',
                                lineWidth: {
                                    bottom: 1
                                }
                            },
                        });
                        finalY = pdf.lastAutoTable.finalY;
                        pdf.html(parte3, {
                            x: margin,
                            y: finalY + 20,
                            width: 1320,
                            windowWidth: 1320,
                            html2canvas: {
                                scale: scale,
                                //height: 200,
                                width: 1320,
                                windowWidth: 1320,
                                //windowHeight: 200,
                            },
                            filename: 'factura.pdf',
                            callback: (newPdf) => {
                                newPdf.html(parteFinal, {
                                    x: margin,
                                    y: finalY + 80,
                                    width: 1320,
                                    windowWidth: 1320,
                                    html2canvas: {
                                        scale: scale,
                                        //height: 200,
                                        width: 1320,
                                        windowWidth: 1320,
                                        //windowHeight: 200,
                                    },
                                    filename: 'factura.pdf',
                                    callback: (newPdf2) => {
                                        newPdf2.autoPrint();
                                        newPdf2.output('dataurlnewwindow', {
                                            filename: 'factura.pdf'
                                        });
                                        return newPdf2;
                                    }
                                });
                            }
                        }); */
                    },
                });
            }
        },
    },
    watch: {
        dialog2() {
            this.verDialogTicketCocinero = this.$props.dialog2;
        }
    },

}
</script>
<style scoped>
p {
    font-family: Arial !important;
}

@media print {
    .noImprimir {
        display: none !important;
    }
}
</style>