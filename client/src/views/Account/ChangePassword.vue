<script setup> 
    import { ref } from 'vue';
    import apiService from '@/services/APIService';
    import { watch } from 'vue';
    import { useRouter } from 'vue-router';

    const router = useRouter()
    
    const userID = localStorage.getItem('userID');
    const passData = ref({
        currentPass: "",
        newPass : "",
        confirmNewPass : ""
    })

    const currentPassError = ref("")
    const passwordMatchError = ref(false)
    const passwordLengthError = ref(false)

    const validatePassword = () => {

        //mk it nhat 8 ky tu
        const minLength = 8;
        let isVal = true;
        if(passData.value.newPass.length > 0  && passData.value.newPass.length < minLength){
            passwordLengthError.value = true;
            isVal = false;
        }
        else{
            passwordLengthError.value = false
        }

        //ktra trung khop mk
        if(passData.value.newPass && passData.value.confirmNewPass){
            passwordMatchError.value = (passData.value.newPass !== passData.value.confirmNewPass);
            if(passwordMatchError.value){
                isVal = false;
            }
        }
        else {
            passwordMatchError.value = false;
        }
        return isVal;
    }

    watch(passData, () => {
        validatePassword();
        currentPassError.value = "";
    }, { deep: true });

    const changePass = async () => {
        if(!validatePassword()){
            return;
        }
        try{
            const res = await apiService.put(`/user/updatePassword/${userID}`, {currentPass: passData.value.currentPass, newPass: passData.value.newPass})
            if (res.status === 200) {
                router.push("/thong-tin-tai-khoan");
            }
        }
        catch(error){
            const msg = error.response?.data?.message || "Lỗi hệ thống";
            if(error.response?.status === 400){
                currentPassError.value = error.response.data.message;
            }
        }
    }
</script>

<template>
    <div class="ml-40 mt-10 mb-20">
        <h1 class="font-medium text-2xl">ĐỔI MẬT KHẨU</h1>
        <div class="border border-gray-200 my-5 px-5 py-10 w-3/5">
            <div class="flex gap-5 flex-col">
                <div class="flex">
                    <p class="w-1/3 text-base my-auto">Mật khẩu hiện tại</p>
                    <input type="password" class="border border-gray-300 rounded-sm px-1 py-1 w-full max-w-sm focus:ring-1
                    focus:outline-none focus:ring-blue-300" placeholder="Nhập mật khẩu hiện tại" v-model="passData.currentPass">
                </div>
                <div class="flex -mt-3 -mb-3">
                    <p class="w-1/3"></p>
                    <p v-if="currentPassError" class="text-red-500 text-sm">Mật khẩu hiện tại không đúng</p>
                </div>
                <div class="flex">
                    <p class="w-1/3 text-base my-auto">Mật khẩu mới</p>
                    <input type="password" class="border border-gray-300 rounded-sm px-1 py-1 w-full max-w-sm focus:ring-1
                    focus:outline-none focus:ring-blue-300" placeholder="Nhập mật khẩu mới" v-model="passData.newPass">
                </div>
                <div class="flex -mt-3 -mb-3">
                    <p class="w-1/3"></p>
                    <p v-if="passwordLengthError" class="text-red-500 text-sm">Mật khẩu phải có ít nhất 8 ký tự</p>
                </div>
                <div class="flex">
                    <p class="w-1/3 text-base my-auto">Xác nhận mật khẩu</p>
                    <input type="password" class="border border-gray-300 rounded-sm px-1 py-1 w-full max-w-sm focus:ring-1
                    focus:outline-none focus:ring-blue-300" placeholder="Xác nhận mật khẩu" v-model="passData.confirmNewPass">
                </div>
                <div class="flex -mt-3">
                    <p class="w-1/3"></p>
                    <p v-if="passwordMatchError" class="text-red-500 text-sm">Mật khẩu không trùng khớp</p>
                </div>
                <div class="flex mx-auto mt-5">
                    <button @click="changePass" class="bg-green-500 text-white rounded-sm p-2 cursor-pointer">Xác nhận</button>
                </div>
            </div>
            <!-- <div class="border-b border-gray-200 mt-10 mb-5"></div> -->
            <!-- <div class="flex gap-5">
                <RouterLink to="/sua-thong-tin" class="bg-green-500 text-white rounded-sm p-2 cursor-pointer" >Sửa thông tin</RouterLink>
                <RouterLink to="/thong-tin-tai-khoan" class="bg-gray-400 text-white rounded-sm p-2">Thông tin tài khoản</RouterLink>
            </div> -->
        </div>
    </div>
</template>