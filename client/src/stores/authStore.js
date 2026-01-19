import { defineStore } from "pinia";


const useAuthStore = defineStore('user', {
    state: () => ({
        username: localStorage.getItem('username') || '',
        email: '',
        userID: localStorage.getItem('userID') || '',
        token: localStorage.getItem('token') || '',
        role: localStorage.getItem('role') || '',
        isLoggedIn: !!localStorage.getItem('token')
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
            // this.$reset()
            this.username = '';
            this.email = '';
            this.userID = '';
            this.token = '';
            this.role = '';
            this.isLoggedIn = false;
            localStorage.clear();
            // this.$reset();
        }
    },
    getters: {
        isLogIn : (state) => !!state.token,
        isAdmin: (state) => state.role === "ADMIN"
    },
});

export default useAuthStore;