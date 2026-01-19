<script setup>
    import { ref, watch } from 'vue';
    import apiService from '@/services/APIService';
    import useAuthStore from '@/stores/authStore';
    import { useRouter } from 'vue-router';
    import { onMounted } from 'vue';


    const router = useRouter()
    const authStore = useAuthStore();

    const showPassSignin = ref(false);
    const usernameSignin = ref('');
    const usernameLengthError = ref(false);
    const passwordSignin = ref('');
    const passwordLengthError = ref(false);
    const isSubmit = ref(false);

    const validateUsername = () => {
        if(!usernameSignin.value.trim()) {
            usernameLengthError.value = true;
            return false;
        }
        usernameLengthError.value = false;
        return true;
    }

    const validatePassword = () => {
        if(!passwordSignin.value){
            passwordLengthError.value = true;
            return false;
        }
        passwordLengthError.value = false;
        return true;
    }


    const submitFormSignin = async () => {
        isSubmit.value = true;
        if(!validateUsername() || !validatePassword()) return;
        const userData = {
            username : usernameSignin.value,
            password : passwordSignin.value
        }
        
        try{
            const res = await apiService.post('/user/login', userData);
            
            authStore.login(res.data);
            await router.push("/");
        }
        catch(error){
            const status = error.response?.status;
            const message = error.response?.data?.message;

            if(status === 500) {
                alert(message);
            }

            else if(status === 400) {
                alert(message);
            }

            else if(status === 404) {
                alert(message);
            }

            else{
                alert("Lỗi hệ thống vui lòng thử lại sau");
            }
        }
    }

    watch(usernameSignin, validateUsername);
    watch(passwordSignin, validatePassword);

    const blockAccessIfLoggedIn = () => {
        if(authStore.isLogIn){
            router.replace("/");
        }
    }

    onMounted(() => {
        blockAccessIfLoggedIn();
    })

</script>

<template>
    <div class="bg-gray-100 py-5">
        <div class="flex flex-col items-center justify-center gap-10 py-10 mt-10 bg-white w-4/5 mx-auto ">
            <div class="flex">
                <h1 class="text-2xl underline underline-offset-8 text-gray-600">Đăng nhập</h1>
            </div>
            <div class="flex flex-col gap-3 mx-auto w-2/5">
                <form @submit.prevent="submitFormSignin">
                    <div class="flex flex-col gap-5">
                        <div class="flex gap-3 flex-col">
                            <label for="usernameSignin" class="text-gray-600">Tên đăng nhập/Email</label>
                            <input type="text" id="usernameSignin" placeholder="Nhập username hoặc email" 
                            class="px-4 py-2 border rounded-sm" v-model="usernameSignin" :class="[isSubmit && usernameLengthError ? 'border-red-500' : 'border-gray-300']"/>
                            <div v-if="isSubmit && usernameLengthError">
                                <p class="text-red-500 text-sm">Vui lòng nhập username</p>  
                            </div>
                        </div>
                        <div class="flex flex-col gap-2">
                            <div class="flex gap-3 flex-col">
                                <label for="passwordSignin" class="text-gray-600">Mật khẩu</label>
                                <input id="passwordSignin" placeholder="Nhập mật khẩu" 
                                :type="showPassSignin ? 'text' : 'password'"
                                class="px-4 py-2 border rounded-sm" v-model="passwordSignin" :class="[isSubmit && passwordLengthError ? 'border-red-500' : 'border-gray-300']"/>
                                <div v-if="isSubmit && passwordLengthError  ">
                                    <p class="text-red-500 text-sm">Vui lòng nhập mật khẩu</p>  
                                </div>
                            </div>
                            <div class="flex justify-between">
                                <div class="flex gap-1">
                                    <input type="checkbox" id="showpassSignin" v-model="showPassSignin"/>
                                    <label for="showpassSignin" class="text-gray-600">Hiển thị mật khẩu</label>
                                </div>
                                <a href="" class="text-red-500 hover:text-red-600">Quên mật khẩu ?</a>
                            </div>
                        </div>
                        <div class="flex flex-col items-center">
                            <button type="submit" class="rounded-md bg-green-500 py-2 px-10 cursor-pointer ">Đăng nhập</button>
                        </div>
                    </div>
                </form>
                <div class="flex flex-col text-gray-600 items-center">
                    <p class="">Bạn chưa có tài khoản ? <RouterLink to="/auth/dang-ky" class="text-red-500 hover:text-red-600">Đăng ký ngay</RouterLink></p>
                </div>
            </div>
        </div>
    </div>
</template>
