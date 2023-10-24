import {
    createRouter,
    createWebHashHistory
} from 'vue-router';
import facturaVista from '../views/facturaView.vue';
import productosVista from '../views/productosView';
import empleadoVista from '../views/empleadoView';
import agregarPedidoVista from '../views/agregarPedidoView.vue';
import gastosVista from '../views/gastosView.vue';
/* import crearPedidoVista from '../views/crearPedidoView.vue' */
import gananciasVista from '../views/gananciasView.vue';
import loginVista from '../views/loginView.vue';
import inicioVista from '../views/inicio.vue';
import empleadosVista from '../views/empleadosView.vue';
import clientesVista from '../views/clienteView.vue';
import adminFacturasVista from '../views/adminFacturasView.vue';
import adminPedidosVista from '../views/adminPedidosView.vue';
import inventarioVista from '../views/inventarioView.vue'
import historialVista from '../views/historialView.vue';
import cocineroVista from '../views/cocineroView.vue';
//Creación de rutas a los archivos
//Store para validar tipoCargo
import store from '../store';
const routes = [{
    path: '/',
    name: 'login',
    component: loginVista,
    beforeEnter: (to, from, next) => {
        const data = store.getters.usuario;
        let ruta;
        if (data) {
            if (to.fullPath == "/") {
                switch (data.empleado.tipoCargo) {
                    case 'Engineersoft':
                        ruta = '/inicio/empleados';
                        break;
                    case 'Mesero':
                        ruta = '/inicio/agregarPedido';
                        break;
                    case 'Admin':
                        ruta = '/inicio/empleado';
                        break;
                    case 'Cajero':
                        ruta = '/inicio/productos';
                        break;
                }
            }
            return next(ruta);
        }
        next();
    }
},
{
    path: '/inicio',
    name: 'inicio',
    component: inicioVista,
    children: [{
        path: '/inicio/factura',
        name: 'factura',
        component: facturaVista,
        beforeEnter: (to, from, next) => {
            const data = store.getters.usuario;
            if (data) {
                const cargo = store.getters.usuario.empleado.tipoCargo.toLowerCase();
                if (cargo == "mesero" || cargo == undefined) {
                    return next(from);
                }
                return next();
            }
            next('/');
        }
    },
    {
        path: '/inicio/productos',
        name: 'productos',
        component: productosVista,
        beforeEnter: (to, from, next) => {
            const data = store.getters.usuario;
            if (data) {
                const cargo = store.getters.usuario.empleado.tipoCargo.toLowerCase();
                if (cargo == "mesero" || cargo == undefined) {
                    return next(from);
                }
                return next();
            }
            next('/');
        }
    },
    {
        //Para Engineersoft
        path: '/inicio/empleados',
        name: 'empleadosEngineersoft',
        component: empleadosVista,
        beforeEnter: (to, from, next) => {
            const data = store.getters.usuario;
            if (data) {
                const cargo = store.getters.usuario.empleado.tipoCargo.toLowerCase();
                if (cargo == "mesero" || cargo == "admin" || cargo == "cajero" || cargo == undefined) {
                    return next(from);
                }
                return next();
            }
            next('/');
        }
    },
    {
        path: '/inicio/empleado',
        name: 'empleados',
        component: empleadoVista,
        beforeEnter: (to, from, next) => {
            const data = store.getters.usuario;
            if (data) {
                const cargo = store.getters.usuario.empleado.tipoCargo.toLowerCase();
                if (cargo == "mesero" || cargo == "cajero" || cargo == undefined) {
                    return next(from);
                }
                return next();
            }
            next('/');
        }
    },
    {
        path: '/inicio/agregarPedido',
        name: 'agregarPedido',
        component: agregarPedidoVista,
        beforeEnter: (to, from, next) => {
            const data = store.getters.usuario;
            if (data) {
                const cargo = store.getters.usuario.empleado.tipoCargo.toLowerCase();
                if (cargo == "admin" || cargo == "cajero" || cargo == undefined) {
                    return next(from);
                }
                return next();
            }
            next('/');
        }
    },
    {
        path: '/inicio/ganancias',
        name: 'gananciasVista',
        component: gananciasVista,
        beforeEnter: (to, from, next) => {
            const data = store.getters.usuario;
            if (data) {
                const cargo = store.getters.usuario.empleado.tipoCargo.toLowerCase();
                if (cargo == "mesero" || cargo == "cajero" || cargo == undefined) {
                    return next(from);
                }
                return next();
            }
            next('/');
        }
    },
    {
        path: '/inicio/clientes',
        name: 'clientesVista',
        component: clientesVista,
        beforeEnter: (to, from, next) => {
            const data = store.getters.usuario;
            if (data) {
                const cargo = store.getters.usuario.empleado.tipoCargo.toLowerCase();
                if (cargo == "mesero" || cargo == "cajero" || cargo == undefined) {
                    return next(from);
                }
                return next();
            }
            next('/');
        }
    },
    {
        path: '/inicio/facturas',
        name: 'facturasView',
        component: adminFacturasVista,
        beforeEnter: (to, from, next) => {
            const data = store.getters.usuario;
            if (data) {
                const cargo = store.getters.usuario.empleado.tipoCargo.toLowerCase();
                if (cargo == "mesero" || cargo == "cajero" || cargo == undefined) {
                    return next(from);
                }
                return next();
            }
            next('/');
        }
    },
    {
        path: '/inicio/pedidos',
        name: 'pedidosView',
        component: adminPedidosVista,
        beforeEnter: (to, from, next) => {
            const data = store.getters.usuario;
            if (data) {
                const cargo = store.getters.usuario.empleado.tipoCargo.toLowerCase();
                if (cargo == undefined) {
                    return next(from);
                }
                return next();
            }
            next('/');
        }
    }, {
        path: '/inicio/gastos',
        name: 'gastosView',
        component: gastosVista,
        beforeEnter: (to, from, next) => {
            const data = store.getters.usuario;
            if (data) {
                const cargo = store.getters.usuario.empleado.tipoCargo.toLowerCase();
                if (cargo == "mesero" || cargo == "cajero" || cargo == undefined) {
                    return next(from);
                }
                return next();
            }
            next('/');
        }
    },
    {
        path: '/inicio/inventario',
        name: 'inventarioVista',
        component: inventarioVista,
        beforeEnter: (to, from, next) => {
            const data = store.getters.usuario;
            if (data) {
                const cargo = store.getters.usuario.empleado.tipoCargo.toLowerCase();
                if (cargo == "mesero" || cargo == "cajero" || cargo == undefined) {
                    return next(from);
                }
                return next();
            }
            next('/');
        }
    },
    {
        path: '/inicio/historial',
        name: 'historialVista',
        component: historialVista,
        beforeEnter: (to, from, next) => {
            const data = store.getters.usuario;
            if (data) {
                const cargo = store.getters.usuario.empleado.tipoCargo.toLowerCase();
                if (cargo == "mesero" || cargo == "cajero" || cargo == undefined) {
                    return next(from);
                }
                return next();
            }
            next('/');
        }
    },
    {
        path: '/inicio/cocinero',
        name: 'cocineroVista',
        component: cocineroVista,
        beforeEnter: (to, from, next) => {
            const data = store.getters.usuario;
            if (data) {
                const cargo = store.getters.usuario.empleado.tipoCargo.toLowerCase();
                if (cargo == "mesero" || cargo == "cajero" || cargo == undefined) {
                    return next(from);
                }
                return next();
            }
            next('/');
        }
    }
    ],
},

];

const router = createRouter({
    history: createWebHashHistory(process.env.BASE_URL),
    routes
})
export default router