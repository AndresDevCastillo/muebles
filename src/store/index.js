//import Vue from 'vue'
import { createStore } from 'vuex'
import { createVuexPersistedState } from "vue-persistedstate"

//Vue.use(Vuex);

export default new createStore({
    state: {
        usuario: null,
    },
    mutations: {
        setusuario(state, data) {
            state.usuario = data
        },
    },

    getters: {
        usuario(state) {
            return state.usuario
        },
    },

    actions: {

    },
    modules: {},
    plugins: [createVuexPersistedState()]

});