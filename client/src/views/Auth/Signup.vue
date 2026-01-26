<script setup>
    import { ref, onMounted, watch } from 'vue';
    import apiService from '@/services/APIService';
    import { useRouter } from 'vue-router';
    import useAuthStore from '@/stores/authStore';


    const router = useRouter();
    const authStore = useAuthStore();

    const showPassSignup = ref(false);

    //ktra mk cua form dang ky
    const passwordMatchError = ref(false);
    const usernameSignup = ref('');
    const emailSignup = ref('');
    const passwordSignup = ref('');
    const confirmPasswordSignup = ref('');
    const passwordLengthError = ref(false);
    const usernameLengthError = ref(false);
    const emailLengthError = ref(false);
    const emailMatchError = ref(false);
    const isSubmit = ref(false);

    //xac thuc username
    const validateUsername = () => {
        if(!usernameSignup.value.trim()) {
            usernameLengthError.value = true;
            return false;
        }
        usernameLengthError.value = false;
        return true;
    }

    //xac thuc email
    const validateEmail = () => {
        if(!emailSignup.value.trim() ) {
            emailLengthError.value = true;
            emailMatchError.value = false;
            return false;
        }
        if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailSignup.value)){
            emailLengthError.value = false;
            emailMatchError.value = true;
            return false;
        }
        emailLengthError.value = false;
        emailMatchError.value = false;
        return true;
    }   

    //xac thuc mk
    const validatePassword = () => {

        //mk it nhat 8 ky tu
        const minLength = 8;
        let isVal = true;
        if(passwordSignup.value.length > 0  && passwordSignup.value.length < minLength){
            passwordLengthError.value = true;
            isVal = false;
        }
        else{
            passwordLengthError.value = false
        }

        //ktra trung khop mk
        if(passwordSignup.value && confirmPasswordSignup.value){
            passwordMatchError.value = (passwordSignup.value !== confirmPasswordSignup.value);
            if(passwordMatchError.value){
                isVal = false;
            }
        }
        else {
            passwordMatchError.value = false;
        }
        return isVal;
    }

    watch(usernameSignup, validateUsername);
    watch(emailSignup, validateEmail);
    watch([passwordSignup, confirmPasswordSignup], validatePassword);


    const submitFormSignup = async () => {
        isSubmit.value = true;
        if (!validatePassword() || !validateUsername() || !validateEmail()) return;
        const userData = {
            username: usernameSignup.value,
            password: passwordSignup.value,
            email: emailSignup.value
        };
            
        try {
            const res = await apiService.post('/user/signup',  userData);
            console.log(res.data);

            authStore.login(res.data);
            await router.push("/");
        }
        catch (error) {
            const status = error.response?.status;
            const message = error.response?.data?.message;

            if (status === 409) {
                alert(message); 
            } 
            else if (status === 400) {
                alert(message);
            }
            else {
                alert("Lỗi hệ thống, vui lòng thử lại sau");
            }
        }
    }

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
                <h1 class="text-2xl underline underline-offset-8 text-gray-600">Đăng ký</h1>
            </div>
            <div class="flex flex-col gap-3 mx-auto w-2/5">
                <form @submit.prevent="submitFormSignup">
                    <div class="flex flex-col gap-5">
                        <div class="flex gap-3 flex-col">
                            <label for="usernameSignin" class="text-gray-600">Tên đăng nhập</label>
                            <input type="text" id="usernameSignin" placeholder="Nhập username" 
                            class="px-4 py-2 border rounded-sm" :class="[isSubmit && usernameLengthError ? 'border-red-500' : 'border-gray-300']" v-model="usernameSignup"/>
                            <div v-if="isSubmit && usernameLengthError">
                                <p class="text-red-500 text-sm">Vui lòng nhập username</p>  
                            </div>
                        </div>
                        <div class="flex gap-3 flex-col">
                            <label for="usernameSignin" class="text-gray-600">Email</label>
                            <input type="text" id="usernameSignin" placeholder="Nhập email" 
                            class="px-4 py-2 border rounded-sm" :class="[isSubmit && (emailLengthError || emailMatchError ) ? 
                            'border-red-500' : 'border-gray-300']" v-model="emailSignup" />
                            <div v-if="isSubmit && emailLengthError">
                                <p class="text-red-500 text-sm">Vui lòng nhập email</p> 
                            </div>
                            <div v-if="isSubmit && emailMatchError">
                                <p class="text-red-500 text-sm">Email không đúng định dạng</p> 
                            </div>
                        </div>
                        <div class="flex gap-3 flex-col">
                                <label for="passwordSignin" class="text-gray-600">Mật khẩu</label>
                                <input id="passwordSignin" placeholder="Nhập mật khẩu" 
                                :type="showPassSignup ? 'text' : 'password'"
                                class="px-4 py-2 border  rounded-sm" :class="[isSubmit && passwordLengthError ? 'border-red-500' : 'border-gray-300']"
                                v-model="passwordSignup"/>
                        </div>
                        <div class="flex flex-col gap-2">
                            <div class="flex gap-3 flex-col">
                                <label for="passwordSignin" class="text-gray-600">Nhập lại mật khẩu</label>
                                <input id="passwordSignin" placeholder="Nhập lại mật khẩu"  
                                :type="showPassSignup ? 'text' : 'password'"
                                class="px-4 py-2 border rounded-sm" :class="[isSubmit && passwordMatchError ? 'border-red-500' : 'border-gray-300']"
                                 v-model="confirmPasswordSignup"/>
                            </div>
                            <div v-if="isSubmit">
                                <p v-if="passwordLengthError" class="text-red-500 text-sm">Mật khẩu phải có ít nhất 8 ký tự</p>
                                <p v-if="passwordMatchError" class="text-red-500 text-sm ">Mật khẩu không trùng khớp</p>
                            </div>
                            <div class="flex justify-between">
                                <div class="flex gap-1">
                                    <input type="checkbox" id="showpassSignin" v-model="showPassSignup"/>
                                    <label for="showpassSignin" class="text-gray-600">Hiển thị mật khẩu</label>
                                </div>
                                <a href="" class="text-red-500 hover:text-red-600">Quên mật khẩu ?</a>
                            </div>
                        </div>
                        <div class="flex flex-col items-center">
                            <button type="submit" class="rounded-md bg-green-500 py-2 px-10 cursor-pointer ">Đăng ký</button>
                        </div>
                    </div>
                </form>
                <div class="flex flex-col text-gray-600 items-center">
                    <p class="">Bạn đã có tài khoản ? <RouterLink to="/auth/dang-nhap" class="text-red-500 hover:text-red-600">Đăng nhập</RouterLink></p>
                </div>
                <div class="pt-3">
                    <p class="text-xs text-center">Bằng việc đăng ký, bạn đã đồng ý với chúng tôi về <br/>
                    <RouterLink to="/dieu-khoan-dich-vu" class="text-blue-600 hover:text-blue-700 hover:underline ">Điều khoản dịch vụ</RouterLink> &  
                    <RouterLink to="/chinh-sach-bao-mat" class="text-blue-600 hover:text-blue-700 hover:underline ">Chính sách bảo mật</RouterLink>
                    </p>
                </div>
            </div>
        </div>
    </div>
</template>
