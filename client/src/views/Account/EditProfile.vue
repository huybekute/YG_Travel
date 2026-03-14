<script setup>
    import { ref, onMounted } from 'vue';
    import { useRouter } from 'vue-router';
    import apiService from '@/services/APIService';

    const router = useRouter();
    const user = ref({
        fullname: '',
        phoneNumber: '',
        address: ''
    });
    const userID = localStorage.getItem('userID');
    const isSubmitting = ref(false);

    // du lieu cu bo vao o input
    onMounted(async () => {
        try {
            const res = await apiService.get(`/user/${userID}`);
            user.value = res.data;
        } catch (err) {
            console.error("Lỗi load dữ liệu:", err);
        }
    })

    // sua thong tin
    const updateProfile = async () => {
        isSubmitting.value = true;
        try {
            await apiService.put(`/user/${userID}`, {
                fullname: user.value.fullname,
                phoneNumber: user.value.phoneNumber,
                address: user.value.address
            });
            router.push('/thong-tin-tai-khoan'); 
        } catch (err) {
            console.log("Lỗi khi cập nhật: " + (err.response?.data?.message || err.message));
        } finally {
            isSubmitting.value = false;
        }
    }
</script>

<template>
    <div class="ml-40 mt-10 mb-20">
        <h1 class="font-medium text-2xl uppercase">SỬA THÔNG TIN</h1>
        <div class="border border-gray-200 my-5 px-5 py-10 w-3/5 rounded-sm">
            <div class="flex gap-6 flex-col">
                <div class="flex items-center opacity-60">
                    <p class="w-1/3 text-base text-gray-700">Tên đăng nhập</p>
                    <input type="text" :value="user.username" disabled class="bg-gray-100 border border-gray-200 p-2 w-2/3 outline-none cursor-not-allowed">
                </div>
                <div class="flex items-center opacity-60">
                    <p class="w-1/3 text-base text-gray-700">Email</p>
                    <input type="text" :value="user.email" disabled class="bg-gray-100 border border-gray-200 p-2 w-2/3 outline-none cursor-not-allowed">
                </div>
                <div class="border-b border-dashed border-gray-200"></div>
                <div class="flex items-center">
                    <p class="w-1/3 text-base text-gray-700">Họ và tên</p>
                    <input v-model="user.fullname" type="text" placeholder="Họ và tên" class="border border-gray-300 
                    focus:border-green-500 p-2 w-2/3 outline-none transition-all">
                </div>
                <div class="flex items-center">
                    <p class="w-1/3 text-base text-gray-700">Điện thoại</p>
                    <input v-model="user.phoneNumber" type="text" placeholder="Số điện thoại" class="border border-gray-300
                     focus:border-green-500 p-2 w-2/3 outline-none transition-all">
                </div>
                <div class="flex items-center">
                    <p class="w-1/3 text-base text-gray-700">Địa chỉ</p>
                    <textarea v-model="user.address" rows="2" placeholder="Địa chỉ" class="border border-gray-300 
                    focus:border-green-500 p-2 w-2/3 outline-none transition-all resize-none"></textarea>
                </div>
            </div>
            <div class="border-b border-gray-200 mt-10 mb-5"></div>
            <div class="flex gap-5">
                <button @click="updateProfile" :disabled="isSubmitting"
                        class="bg-green-600 text-white rounded-sm px-6 py-2 cursor-pointer hover:bg-green-700 transition-colors disabled:opacity-50">
                    {{ isSubmitting ? 'Đang lưu...' : 'Lưu thay đổi' }}
                </button>
                <button @click="router.back()" class="bg-gray-200 text-gray-700 rounded-sm px-6 py-2 cursor-pointer 
                    hover:bg-gray-300 transition-colors">Hủy bỏ
                </button>
            </div>
        </div>
    </div>
</template>