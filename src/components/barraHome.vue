<template>
    <div>

        <v-app-bar theme="dark" prominent app>
            <v-app-bar-nav-icon variant="text" @click.stop="drawer = !drawer"></v-app-bar-nav-icon>

            <v-toolbar-title>Software de facturación</v-toolbar-title>

            <v-spacer></v-spacer>
            <v-btn icon @click="cerrarSesion">
                <v-icon>mdi mdi-exit-to-app</v-icon>
                <v-tooltip activator="parent" location="bottom">Cerrar sesión</v-tooltip>
            </v-btn>
            <!-- <v-btn variant="text" icon="mdi-magnify"></v-btn>

            <v-btn variant="text" icon="mdi mdi-bell"></v-btn>

            <v-btn variant="text" icon="mdi mdi-help"></v-btn> -->

        </v-app-bar>
        <v-navigation-drawer app theme="dark" v-model="drawer" temporary>
            <v-list>
                <v-list-item prepend-icon="mdi mdi-home-account" :title="title"
                    :subtitle="subtitle"></v-list-item>
            </v-list>

            <v-divider></v-divider>

            <v-list density="comfortable" nav>
                <div v-for="(item, index) in this.menu" :key="index">
                    <v-list-item :prepend-icon="item.icon" :title="item.title" class="items-bar"
                        :to="item.href"></v-list-item>
                </div>
                <!-- <v-list-item prepend-icon="mdi-star" title="Starred" class="items-bar"></v-list-item> -->
            </v-list>
            <template v-slot:append>
                <v-footer class="d-flex flex-column" style="bottom: 0; width: 100%;">
                    <div class="d-flex w-100 align-center px-2">
                        <v-btn v-for="icon in icons" :key="icon" class="mx-2" :icon="icon" variant="plain" size="small"></v-btn>
                    </div>
                    <div class=" py-2  text-center w-100">
                        {{ new Date().getFullYear() }} — Engineersoft
                    </div>
                </v-footer>
            </template>

        </v-navigation-drawer>
    </div>
</template>

<script>
const menuJSON = require('../json/menu');
export default {
    name: 'barraHome',
    components: {

    },
    data: () => ({
        title: null,
        subtitle: null,
        menu: [],
        drawer: false,
        link: { icon: null, title: null, href: null },
        icons: [
            'mdi-facebook',
            'mdi-twitter',
            'mdi-linkedin',
            'mdi-instagram',
        ],
    }),
    methods: {
        ponerLink(item) {
            this.link = { ...item };
        },
        cerrarSesion() {
            this.$store.commit('setusuario', null);
            this.$router.push('/');
        }
    },
    created() {
        if (this.$store.getters.usuario) {
            this.title = this.$store.getters.usuario.empleado.nombre;
            this.subtitle = this.$store.getters.usuario.empleado.tipoCargo;
            const cargo = this.$store.getters.usuario.empleado.tipoCargo;
            menuJSON.default.filter(menu => {
                if (menu.cargo == cargo) {
                    this.menu = menu.menu;
                }
            });
        }

    },
}
</script>

<style >
/* .v-main {
    min-height: 700px !important;
} */



.items-bar>.v-list-item__content>.v-list-item-title {
    padding: 10px 0;
}

.items-bar>.v-list-item__content>.v-list-item-title {
    font-size: 1.2rem;
    padding-top: 10px;
    text-align: left;
}



.Titulo-Home {
    text-decoration: none;
    color: white;
}
</style>