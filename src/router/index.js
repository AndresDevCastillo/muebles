import {
    createRouter,
    createWebHashHistory
} from 'vue-router';
//Store para validar tipoCargo
import store from '../store';
const routes = [{
        path: '/',
        name: 'login',
        component: () =>
            import ('@/components/login.vue'),
        beforeEnter: (to, from, next) => {
            const data = store.getters.usuario;
            let ruta;
            if (data.usuario) {
                if (to.fullPath == "/") {
                    switch (data.usuario.rol) {
                        case 'Admin':
                            ruta = '/inicio/empleados';
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
        component: () =>
            import ('@/views/inicio.vue'),
        children: [{
                path: '/inicio/prestamo',
                name: 'prestamo',
                component: () =>
                    import ('@/views/prestamoView.vue'),
                beforeEnter: (to, from, next) => {
                    const data = store.getters.usuario;
                    if (data.usuario) {
                        const cargo = data.usuario.rol.toLowerCase();
                        if (cargo == "cobrador" || cargo == undefined) {
                            return next(from);
                        }
                        return next();
                    }
                    next('/');
                }
            },
            {
                path: '/inicio/empleados',
                name: 'empleados',
                component: () =>
                    import ('@/views/empleadosView.vue'),
                beforeEnter: (to, from, next) => {
                    const data = store.getters.usuario;
                    if (data.usuario) {
                        const cargo = data.usuario.rol.toLowerCase();
                        if (cargo == "cobrador" || cargo == undefined) {
                            return next(from);
                        }
                        return next();
                    }
                    next('/');
                }
            },
            {
                path: '/inicio/rutas',
                name: 'rutas',
                component: () =>
                    import ('@/views/puebloView.vue'),
                beforeEnter: (to, from, next) => {
                    const data = store.getters.usuario;
                    if (data.usuario) {
                        const cargo = data.usuario.rol.toLowerCase();
                        if (cargo == "cobrador" || cargo == undefined) {
                            return next(from);
                        }
                        return next();
                    }
                    next('/');
                }
            },
            {
                path: '/inicio/inventario',
                name: 'inventario',
                component: () =>
                    import ('@/views/inventarioView.vue'),
                beforeEnter: (to, from, next) => {
                    const data = store.getters.usuario;
                    if (data.usuario) {
                        const cargo = data.usuario.rol.toLowerCase();
                        if (cargo == "cobrador" || cargo == undefined) {
                            return next(from);
                        }
                        return next();
                    }
                    next('/');
                }
            },
            {
                path: '/inicio/productos',
                name: 'productosVista',
                component: () =>
                    import ('@/views/productosView.vue'),
                beforeEnter: (to, from, next) => {
                    const data = store.getters.usuario;
                    if (data.usuario) {
                        const cargo = data.usuario.rol.toLowerCase();
                        if (cargo == "cobrador" || cargo == undefined) {
                            return next(from);
                        }
                        return next();
                    }
                    next('/');
                }
            },
            {
                path: '/inicio/empleados',
                name: 'empleados',
                component: () =>
                    import ('@/views/empleadosView.vue'),
                beforeEnter: (to, from, next) => {
                    const data = store.getters.usuario;
                    if (data.usuario) {
                        const cargo = data.usuario.rol.toLowerCase();
                        if (cargo == "cobrador" || cargo == undefined) {
                            return next(from);
                        }
                        return next();
                    }
                    next('/');
                }
            }, {
                path: '/inicio/clientes',
                name: 'clienteVista',
                component: () =>
                    import ('@/views/clienteView.vue'),
                beforeEnter: (to, from, next) => {
                    const data = store.getters.usuario;
                    if (data.usuario) {
                        const cargo = data.usuario.rol.toLowerCase();
                        if (cargo == "cobrador" || cargo == undefined) {
                            return next(from);
                        }
                        return next();
                    }
                    next('/');
                }
            },
            /*{
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
            }*/
        ],
    },

];

const router = createRouter({
    history: createWebHashHistory(process.env.BASE_URL),
    routes
})
export default router