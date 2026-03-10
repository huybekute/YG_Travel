<script setup> 
    import { ref } from 'vue';
    import { onMounted } from 'vue';
    import apiService from '@/services/APIService';
    
    const user = ref({});
    const userID = localStorage.getItem('userID');
    
    onMounted(async () => {
        const res = await apiService.get(`/user/${userID}`);
        user.value = res.data;
    })
    
</script>

<template>
    <div class="ml-40 mt-10 mb-20">
        <h1 class="font-medium text-2xl">THÔNG TIN TÀI KHOẢN</h1>
        <div class="border border-gray-200 my-5 px-5 py-10 w-3/5">
            <div class="flex gap-5 flex-col">
                <div class="flex">
                    <p class="w-1/3 text-base text-gray-700">Tên đăng nhập</p>
                    <p class="font-medium">{{ user.username || 'Đang cập nhật'}}</p>
                </div>
                <div class="border-b border-dashed border-gray-200"></div>
                <div class="flex">
                    <p class="w-1/3 text-base text-gray-700">Email</p>
                    <p class="font-medium">{{ user.email || 'Đang cập nhật'}}</p>
                </div>
                <div class="border-b border-dashed border-gray-200"></div>
                <div class="flex">
                    <p class="w-1/3 text-base text-gray-700">Họ và tên</p>
                    <p class="font-medium">{{ user.fullname || 'Đang cập nhật'}}</p>
                </div>
                <div class="border-b border-dashed border-gray-200"></div>
                <div class="flex">
                    <p class="w-1/3 text-base text-gray-700">Điện thoại</p>
                    <p class="font-medium">{{ user.phoneNumber || 'Đang cập nhật'}}</p>
                </div>
                <div class="border-b border-dashed border-gray-200"></div>
                <div class="flex">
                    <p class="w-1/3 text-base text-gray-700">Địa chỉ</p>
                    <p class="font-medium">{{ user.address || 'Đang cập nhật'}}</p>
                </div>
                <div class="border-b border-dashed border-gray-200"></div>
                <div class="flex ">
                    <p class="w-1/3 text-base text-gray-700">Ngày đăng ký</p>
                    <p class="font-medium">{{ user.created_at ? new Date(user.created_at).toLocaleDateString('vi-VN') : 'Đang cập nhật' }}</p>
                </div>
            </div>
            <div class="border-b border-gray-200 mt-10 mb-5"></div>
            <div class="flex gap-5">
                <RouterLink to="/sua-thong-tin" class="bg-green-500 text-white rounded-sm p-2 cursor-pointer" >Sửa thông tin</RouterLink>
                <RouterLink to="/doi-mat-khau" class="bg-gray-400 text-white rounded-sm p-2">Đổi mật khẩu</RouterLink>
            </div>
        </div>
    </div>
</template>