import store from '../store';
export class Session {
    expiredSession() {
        const current_hours = new Date.now();
        const current_login = new Date(store.getters.usuario.hora_login);
        console.log(current_hours, current_login);
    }
}