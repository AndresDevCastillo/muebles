<template>
    <v-row justify="center">
        <v-dialog v-model="verDialogTicket" persistent fullscreen :scrim="false" transition="dialog-bottom-transition">
            <v-card>
                <v-toolbar dark theme="dark" class="noImprimir">
                    <v-btn icon dark @click="cerrarDialogo()">
                        <v-icon>mdi-close</v-icon>
                    </v-btn>
                </v-toolbar>
                <v-card-text>
                    <v-col cols="12" sm="6" md="4" xl="4" class="ma-auto">
                        <v-card rounded="4" class="pa-4 mt-2" id="ticket">
                            <v-img
                                :src="require('@/assets/eliminado.png')"
                                width="100%"
                                contain style="position: absolute; top: 45%; z-index: 9; transform: rotate(-45deg);"></v-img>
                            <v-row class="w-100 flex-column" id="infoEmpresa" no-gutters style="
                  font-family: 'Roboto', sans-serif;
                  color: #000 !important;
                  margin-top: 5px;
                ">

                                <p style="
                    font-size: 2rem;
                    text-align: center !important;
                    font-weight: bold !important;
                    text-transform: uppercase !important;
                  ">
                                    Empresa X
                                </p>
                                <p style="text-align: center !important; font-size: 1.1rem">
                                    EngineerSoft
                                </p>
                                <p style="text-align: center !important; font-size: 1.1rem">
                                    Montería, Córdoba, Colombia
                                </p>
                            </v-row>
                            <v-row class="w-100 flex-column" no-gutters id="datosGenerales">
                                <v-row class="w-100 flex-column" no-gutters style="
                    font-family: 'Roboto', sans-serif;
                    color: #000 !important;
                    font-weight: 500 !important;
                  ">
                                    <p style="font-size: 1.2rem">
                                        TICKET: <span>{{ datos.codigo.toString().length == 1 ? '000' :
                                            datos.codigo.toString().length == 2 ? '00' : datos.codigo.toString().length == 3
                                                ?
                                                '0' :
                                                null }}{{ datos.codigo }}</span>
                                    </p>
                                    <p style="font-size: 1.2rem">
                                        FECHA CREACIÓN: <span>{{ datos.fecha_factura }}</span>
                                    </p>
                                    <p style="font-size: 1.2rem">
                                        HORA: <span>{{ datos.hora_factura }}</span>
                                    </p>
                                    <p style="font-size: 1.2rem">
                                        FECHA ELIMINACIÓN: <span>{{ datos.fecha_historial }}</span>
                                    </p>
                                    <p style="font-size: 1.2rem">
                                        HORA: <span>{{ datos.hora_historial }}</span>
                                    </p>
                                    <p style="font-size: 1.2rem">
                                        CLIENTE: <span>{{ datos.cliente }} - {{ datos.cedula_cliente }}</span>
                                    </p>
                                </v-row>
                                <v-divider class="divider-dotted" style="
                    border-style: dotted !important;
                    color: #000;
                    opacity: 1;
                  "></v-divider>
                                <v-row class="w-100 flex-column" no-gutters>
                                    <v-table id="tablaTicket" class="w-100" fixed-header height="auto" border="1"
                                        border-collapse="collapse" cellspacing="0">
                                        <thead class="fw-bold" style="font-weight: bold; font-size: 1.3rem">
                                            <tr style="color: #000">

                                                <th class="text-left" style="
                            font-size: 1.2rem;
                            color: #000;
                            border-bottom-style: dotted !important;
                            border-bottom-width: 1px !important;
                            box-shadow: none !important;
                          ">
                                                    Descripción
                                                </th>
                                                <th class="text-left" style="
                            font-size: 1.2rem;
                            color: #000;
                            border-bottom-style: dotted !important;
                            border-bottom-width: 1px !important;
                            box-shadow: none !important;
                          ">
                                                    Cant
                                                </th>
                                                <!-- <th class="text-left" style="
                            font-size: 1.2rem;
                            color: #000;
                            border-bottom-style: dotted !important;
                            border-bottom-width: 1px !important;
                            box-shadow: none !important;
                          ">
                                                    Pagar
                                                </th> -->
                                            </tr>
                                        </thead>
                                        <tbody id="productosTicket">
                                            <tr v-for="(item, index) in datos.detalleHistorial" :key="index">
                                                <td class="text-left" style="
                            font-size: 1.2rem;
                            max-width: 60px !important;
                            border-style: none !important;
                          ">
                                                    {{ item.producto }}
                                                </td>
                                                <td class="text-left" style="
                            font-size: 1.2rem;
                            border-style: none !important;
                          ">
                                                    {{ item.cantidad }}
                                                </td>


                                                <!-- <td class="text-left" style="
                            font-size: 1.2rem;
                            border-style: none !important;
                          ">
                                                    {{ item.cantidad * item.producto.precio }}
                                                </td> -->
                                            </tr>
                                        </tbody>
                                        <tfoot>
                                            <tr>
                                                <th colspan="4" style="
                            border-top: 1px dotted #000;
                            border-bottom: 1px dotted rgb(0, 0, 0);
                          ">
                                                    <p style="
                              font-size: 1.2rem;
                              font-weight: bold;
                              text-align: right;
                            ">
                                                        VALOR VENTA: $<span>{{ datos.neto }}</span>
                                                    </p>

                                                    <p style="
                              font-size: 1.2rem;
                              font-weight: bold;
                              text-align: right;
                            ">
                                                        PROPINA: $<span>{{ datos.propina }}</span>
                                                    </p>
                                                    <p style="
                              font-size: 1.2rem;
                              font-weight: bold;
                              text-align: right;
                            ">
                                                        DESCUENTO: $<span>{{ datos.descuento }}</span>
                                                    </p>
                                                    <p style="
                              font-weight: bold;
                              text-align: right;
                              font-size: 1.4rem;
                            ">
                                                        TOTAL: $<span>{{ datos.total }}</span>
                                                    </p>
                                                </th>
                                            </tr>
                                        </tfoot>
                                    </v-table>
                                </v-row>
                                <v-row class="w-100 flex-column" no-gutters id="infoVendedores">
                                    <p>
                                        MESERO: <span>{{ datos.empleado }} - {{ datos.cedula_empleado }}</span>
                                    </p>
                                    <v-divider class="divider-dotted" style="
                      border-style: dotted !important;
                      color: #000;
                      opacity: 1;
                    "></v-divider>
                                </v-row>
                                <v-row no-gutters class="w-100 flex-column" id="terminos">
                                    <p style="
                      margin-top: 14px;
                      text-align: center;
                      font-weight: bold;
                      text-transform: uppercase;
                    " id="agradecimiento">
                                        *** Gracias por su compra {{ datos.cliente }} ***
                                    </p>
                                </v-row>
                            </v-row>
                        </v-card>
                        <v-card id="lienzo"></v-card>
                    </v-col>
                </v-card-text>
            </v-card>
        </v-dialog>
    </v-row>
</template>
<script>
import { jsPDF } from "jspdf";
import "jspdf-autotable";
export default {
    name: "detalleHistorialComponent",
    props: {
        dialog: { type: Boolean, default: false, required: true },
        datos: {
            type: Object,
            default: () => {
                return {
                    codigo: null,
                    medio_pago: null,
                    descuento: 0,
                    total: 0,
                    propina: 0,
                    lugar: null,
                    fecha: null,
                    hora: null,
                    detalleFactura: [],
                    empleado: null,
                    cliente: null,
                    mesa: null,
                };
            },
            required: true,
        },
    },

    data: () => ({
        verDialogTicket: false,
    }),
    methods: {
        cerrarDialogo() {
            this.$emit("cerrarDialogoTicket");
        },
        imprimir() {
            const imgResource = require('@/assets/elim.jpg');
            const imagenMarca = new Image();
            imagenMarca.onload = () => {
                imagenMarca.src = imgResource;
            }
            const doc = new jsPDF("p", "px", "letter");
            doc.viewerPreferences({
                HideWindowUI: true,
                PrintArea: "CropBox",
                HideMenubar: true,
                HideToolbar: true,
                ViewArea: "CropBox",
                DisplayDocTitle: true,
            });
            const ticket = document.getElementById('ticket');

            const infoEmpresa = document.getElementById("infoEmpresa");
            const datosGenerales = document.getElementById("datosGenerales");
            const margin = 6;
            const scale =
                (doc.internal.pageSize.width - margin * 2) / document.body.clientWidth;
            //const scale_mobile = (doc.internal.pageSize.width - margin * 2) / document.body.getBoundingClientRect();
            doc.setDocumentProperties({
                title: "ticket.pdf",
            });

            //Revisar dispositivo
            if (
                /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
                    navigator.userAgent
                )
            ) {
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
                    filename: "ticket.pdf",
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
                            filename: "ticket.pdf",
                            callback: (newPdf) => {
                                newPdf.autoPrint();
                                newPdf.output("dataurlnewwindow", { filename: "ticket.pdf" });
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
                            },
                        });
                    },
                });
            } else {
                //PC
                doc.html(ticket, {
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
                    callback: (doc) => {
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
                            filename: "ticket.pdf",
                            callback: (pdf) => {
                                pdf.html(datosGenerales, {
                                    x: margin,
                                    y: 40,
                                    /*  width: 1320,
                                     windowWidth: 1320, */
                                    html2canvas: {
                                        scale: scale,
                                        //height: 200,
                                        /*  width: 1320,
                                                                         windowWidth: 1320, */
                                        //windowHeight: 200,
                                    },
                                    filename: "ticket.pdf",
                                    callback: (newPdf) => {
                                        /* var canvas = document.createElement('canvas');
                                        var context = canvas.getContext('2d');
                                        canvas.height = imagenMarca.height;
                                        canvas.width = imagenMarca.width;
                                        context.drawImage(imagenMarca, 0, 0);
                                        const dataURL = canvas.toDataURL('image/jpeg');
                                        const totalPages = newPdf.internal.getNumberOfPages();
                                        let i;
                                        for (i = 1; i <= totalPages; i++) {
                                            newPdf.setPage(i);
                                            newPdf.addImage(dataURL, 'JPEG', 10, 10, 500, 500);
                                            /* newPdf.setTextColor(150);
                                            newPdf.text(50, newPdf.internal.pageSize.height / 2, 'Watermark');
                                        } */
                                        newPdf.autoPrint();
                                        newPdf.output("dataurlnewwindow", { filename: "ticket.pdf" });
                                    },
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
                })
            }
        },

    },
    watch: {
        dialog() {
            this.verDialogTicket = this.$props.dialog;

        },
    },
};
</script>
<style scoped>
.ticketEliminado {
    background-image: url('../assets/sello.png');
}

p {
    font-family: Arial !important;
}

@media print {
    .noImprimir {
        display: none !important;
    }
}
</style>
