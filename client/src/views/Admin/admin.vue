<script setup>
    import { ref } from 'vue';
    import useAuthStore from '@/stores/authStore';
    import { useRouter } from 'vue-router';
    
    const router = useRouter();
    const authStore = useAuthStore();
    const isOpenContent = ref(false);

    const dangXuat = () => {
        authStore.logout();
        router.push("/");
    }
</script>

<template>
    <div>
        <div class="flex">
            <div class="flex flex-col bg-gray-200 py-5">
                <div class="pb-5">
                    <h1 class="text-2xl px-5 font-bold">Admin</h1>
                </div>
                <div class="flex items-center gap-5 px-3">
                    <img src="../../../public/avtAdmin.jpg" class="w-16 h-16 rounded-full object-cover border-4
                     border-white shadow-md">
                    <h1>Xin chào,<br/> {{ authStore.username }}</h1>
                </div>
                <div class="pt-5 px-5">
                    <h1 class="text-lg py-3 font-bold">TỔNG QUAN</h1>
                </div>
                <div class="flex flex-col gap-2 text-lg h-screen ">
                    <RouterLink to ="/admin/dashboard" class=" px-5 py-3" active-class="bg-blue-600">
                        <i class="fa-solid fa-chart-line pr-3"></i>Bảng điều khiển</RouterLink>
                    <RouterLink to ="/admin/admin-management" class=" px-5 py-3" active-class="bg-blue-600">
                        <i class="fa-solid fa-table-cells pr-3"></i>Quản lý Admin</RouterLink>    
                    <RouterLink to ="/admin/user-management" class=" px-5 py-3" active-class="bg-blue-600">
                        <i class="fa-solid fa-table-cells pr-3"></i>Quản lý người dùng</RouterLink>
                    <RouterLink to ="/admin/content-management" class=" px-5 py-3" active-class="bg-blue-600">
                        <i class="fa-solid fa-table-cells pr-3"></i>Quản lý địa điểm</RouterLink>
                </div>
            </div>
            <div class="flex-1 p-3 gap-5 bg-gray-100">
                <div class="flex items-center gap-5 justify-end  pr-10 py-4">
                    <!-- <img src="../../../public/avtAdmin.jpg" class="w-10 h-10 rounded-full object-cover border-4 border-white shadow-md"> -->
                    <div class="relative group flex">
                        <RouterLink to="" class="flex items-center justify-center w-10 h-1 whitespace-nowrap pr-5">
                        {{ authStore.username }} ▾ </RouterLink>
                        <div class="absolute flex-col hidden group-hover:flex group-hover:flex-col bg-white 
                        items-center shadow-lg w-46 rounded-md left -translate-x-1/2 mt-3 z-10">
                            <RouterLink to="/auth/dang-ky" class="flex items-center hover:bg-green-100 justify-center w-full  px-4 py-3 text-gray-700 
                            hover:text-green-600 transition-colors" v-if="authStore.isLogIn" ><span class="text-md font-medium">Trang chủ</span></RouterLink>
                            <RouterLink to="/admin" class="flex items-center hover:bg-green-100 justify-center w-full  px-4 py-3 text-gray-700 
                            hover:text-green-600 transition-colors" v-if="authStore.isLogIn && authStore.isAdmin"><span class="text-md font-medium">Thông tin tài khoản</span></RouterLink>
                            <button to="/auth/dang-ky" class="flex items-center hover:bg-green-100 justify-center w-full  px-4 py-3 text-gray-700 
                            hover:text-green-600 transition-colors cursor-pointer" v-if="authStore.isLogIn"><span class="text-md font-medium" @click="dangXuat">Đăng xuất</span></button>
                        </div>
                    </div>
                </div>
                <div class="border-b border-gray-300"></div>
                <div>
                    <RouterView/>
                </div>
            </div>
        </div>
    </div>
</template>