import store from '../store';
import router from '@/router';
class Session {
    expiredSession() {
        const time_day = new Date().getTime();
        const current_login = new Date(store.getters.usuario.hora_login);
        const current_login_sig = current_login;
        current_login_sig.setDate(current_login_sig.getDate() + 1);
        //2023-05-12:12:00:00
        if (time_day >= current_login_sig.getTime()) {
            this.clearDataStore();
            router.push('/');
        }
    }

    clearDataStore() {
        store.commit('setusuario', { usuario: null, hora_login: null });
    }
}
export default new Session();