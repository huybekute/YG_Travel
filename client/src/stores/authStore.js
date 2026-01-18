import { defineStore } from "pinia";


const useAuthStore = defineStore('user', {
    state: () => ({
        username: '',
        email: '',
        userID: '',
        token: '',
        role: '',
        isLoggedIn: false
    }),
    actions: {
        login(data) {
            this.username = data.username;
            this.email = data.email;
            this.userID = data.userID;
            this.token = data.token;
            this.role = data.role;
            this.isLoggedIn = true;
            localStorage.setItem('role', data.role);
            localStorage.setItem('token', data.token)
            localStorage.setItem('userID', data.userID)
            localStorage.setItem('username', data.username)
        },
        logout(){
            this.$reset()
            localStorage.removeItem('token')
            localStorage.removeItem('role')
            localStorage.removeItem('userID')
            localStorage.removeItem('username')
        }
    },
    getters: {
        isLogIn : (state) => !!state.token,
        isAdmin: (state) => state.role === 'admin'
    },
});

export default useAuthStore;