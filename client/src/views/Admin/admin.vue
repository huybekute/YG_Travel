<script setup>
    import { ref } from 'vue';

    const isOpenContent = ref(false);
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
                    <h1>Xin chào, Admin</h1>
                </div>
                <div class="pt-5 px-5">
                    <h1 class="text-lg py-5 font-bold">TỔNG QUAN</h1>
                </div>
                <div class="flex flex-col gap-3 text-lg h-screen ">
                    <RouterLink to ="/admin/dashboard" class=" px-5 py-3" active-class="bg-blue-600">
                        <i class="fa-solid fa-chart-line pr-3"></i>Bảng điều khiển</RouterLink>
                    <RouterLink to ="/admin/user-management" class=" px-5 py-3" active-class="bg-blue-600">
                        <i class="fa-solid fa-table-cells pr-3"></i>Quản lý người dùng</RouterLink>
                    <div class="flex flex-col">
                        <RouterLink to="/admin/content-management" @click="isOpenContent = !isOpenContent" class="px-5 py-3 flex cursor-pointer justify-between items-center" 
                        active-class="bg-blue-600">
                            <div class="flex items-center">
                                <i class="fa-solid fa-table-cells pr-3"></i>
                                <span>Quản lý nội dung</span>
                            </div>
                            <i class="fa-solid fa-chevron-down text-sm transition-transform duration-300" :class="{'rotate-180': isOpenContent}"></i>
                        </RouterLink>
                        <div v-show="isOpenContent" class="flex flex-col overflow-hidden transition-all duration-300 ">
                            <RouterLink to="/admin/content-management/add" class="pl-13 py-2 text-md flex items-center 
                            gap-2" active-class="bg-gray-400">Thêm nội dung</RouterLink>
                            <RouterLink to="/admin/content-management/list" class="pl-13 py-2 text-md flex items-center 
                            gap-2" active-class="bg-gray-400">Danh sách nội dung</RouterLink>
                        </div>
                    </div>
                </div>
            </div>
            <div class="flex-1 p-3 gap-5">
                <div class="flex items-center gap-5 justify-end border-b border-gray-200 pb-3 pr-5">
                    <img src="../../../public/avtAdmin.jpg" class="w-10 h-10 rounded-full object-cover border-4 border-white shadow-md">
                    <div class="relative group flex">
                        <RouterLink to="" class="flex items-center justify-center w-10 h-1 whitespace-nowrap">
                        admin ▾ </RouterLink>
                        <div class="absolute flex-col hidden group-hover:flex group-hover:flex-col bg-white 
                        items-center shadow-lg w-60 rounded-md left-1/2 -translate-x-1/2 mt-2 z-10">
                            <!-- <RouterLink to ="" class="p-2 my-4 rounded-md w-4/5 text-center bg-blue-600 
                            hover:bg-blue-700 text-white font-medium">Đăng nhập</RouterLink>
                            <RouterLink to ="" class="p-2 mb-4 rounded-md w-4/5 text-center bg-blue-600 
                            hover:bg-blue-700 text-white font-medium" >Đăng ký</RouterLink> -->
                        </div>
                    </div>
                </div>
                <div>
                    <RouterView/>
                </div>
            </div>
        </div>
    </div>
</template>