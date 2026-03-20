<script setup>
    import { ref, onMounted } from 'vue'
    import apiService from '@/services/APIService'
    import Toast from "../../utils/swal.js"

    const contacts = ref([])

    const getContact = async () => {
        try {
            const res = await apiService.get('/contact/all')
            contacts.value = res.data;
        } 
        catch (err) {
            console.error("Lỗi lấy danh sách liên hệ:", err)
        }
    }

    const toggleStatus = async (id, currentStatus) => {
        const newStatus = currentStatus === 'pending' ? 'processed' : 'pending'
        try {
            await apiService.put(`/contact/status/${id}`, { status: newStatus })
            const index = contacts.value.findIndex(c => c.contactID === id);
            if (index !== -1) contacts.value[index].status = newStatus;
        } catch (err) {
            alert("Không thể cập nhật trạng thái");
        }
    }

    const deleteContact = async (id) => {
        if (!(await (Toast.confirmRequestToast('warning', 'Xác nhận xóa', 'Bạn có chắc chắn muốn xóa liên hệ này'))).isConfirmed) return;
        try {
            await apiService.delete(`/contact/${id}`);
            contacts.value = contacts.value.filter(c => c.contactID !== id);
        } catch (err) {
            alert("Lỗi khi xóa");
        }
    }
    onMounted(getContact);
</script>

<template>
    <div class="p-6 bg-gray-50 min-h-screen">
        <div class="max-w-7xl mx-auto">
            <div class="flex justify-between items-center mb-8">
                <h1 class="text-2xl font-bold text-gray-500 flex items-center gap-3">Quản lý liên hệ </h1>
            </div>
            <div v-if="contacts.length === 0" class="flex flex-col items-center justify-center p-20 text-gray-400 bg-white rounded-3xl border border-gray-100 shadow-sm">
                <i class="fa-solid fa-box-open text-4xl mb-4"></i>
                <p>Hiện không có liên hệ nào</p>
            </div>
            <div class="grid grid-cols-1 gap-4">
                <div v-for="item in contacts" :key="item.contactID" class="bg-white p-5 rounded-md border 
                border-gray-100 shadow-sm hover:shadow-md transition-all group flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div class="flex-1 min-w-[200px]">
                        <div class="flex items-center gap-3 mb-2">
                            <span class="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-sm">
                                {{ item.fullName.charAt(0).toUpperCase() }}
                            </span>
                            <div>
                                <div class="font-bold text-gray-900">{{ item.fullName }}</div>
                                <div class="text-xs text-blue-600 font-medium">{{ item.phone }}</div>
                            </div>
                        </div>
                        <div class="text-sm text-gray-500 flex items-center gap-2">
                            <i class="fa-regular fa-envelope text-xs"></i>
                            {{ item.email }}
                        </div>
                    </div>
                    <div class="flex-[2] p-4 rounded-2xl relative">
                        <p class="text-sm text-gray-700 leading-relaxed mb-2">"{{ item.message }}"</p>
                        <div class="text-[11px] text-gray-400 flex items-center gap-2">
                            {{ new Date(item.createdAt).toLocaleString('vi-VN') }}
                        </div>
                    </div>
                    <div class="flex gap-10 items-center justify-between md:justify-center gap-4 min-w-[150px]">
                        <button @click="toggleStatus(item.contactID, item.status)" :class="item.status === 'pending' 
                                ? 'bg-yellow-100 text-yellow-500 border-red-100 ' 
                                : 'bg-green-100 text-green-600 border-green-100'"
                            class="cursor-pointer w-full md:w-32 px-4 py-2 rounded-xl border text-xs font-bold transition-all shadow-sm flex items-center justify-center gap-2">
                            {{ item.status === 'pending' ? 'Chờ xử lý' : 'Xong' }}
                        </button>
                        <button @click="deleteContact(item.contactID)" class="text-red-500  p-2 transition-all transform cursor-pointer">
                            <i class="fa-solid fa-trash-can"></i>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>