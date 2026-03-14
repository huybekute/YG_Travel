<script setup>
    import UserCard from '@/components/admin/UserCard.vue';
    import apiService from '@/services/APIService';
    import { ref, onMounted, computed } from 'vue';

    const admins = ref([]);
    const onlyAdmin = computed(() => {
        return admins.value.filter(a => a?.role === "ADMIN");
    })

    const getListAdmin = async () => {
        try {
            const res = await apiService.get("/user");
            admins.value = res.data || res;
        } catch (err) {
            console.error("Lỗi load user", err);
        }
    }

    onMounted(getListAdmin);

    // const getListAdmin = async () => {
    //     try {
    //         const res = await apiService.get("/user");
    //         admins.value = res.data || res;
    //     } catch (err) {
    //         console.error("Lỗi load user", err);
    //     }
    // }
    // onMounted(getListAdmin);

    // tao Admin moi
    const isModalOpen = ref(false);
    const newAdmin = ref({
        username: '',
        email: '',
        password: '',
        role: 'ADMIN'
    });

    const createAdminAccount = async () => {
        if (!newAdmin.value.username || !newAdmin.value.email || !newAdmin.value.password) {
            alert("Vui lòng điền đủ thông tin!");
            return;
        }
        try {
            await apiService.post("/user/createUser", newAdmin.value);
            
            newAdmin.value = { 
                username: '', 
                email: '', 
                password: '', 
                role: 'ADMIN' 
            };
            isModalOpen.value = false;
            location.reload();

        } catch (err) {
            alert(err.response?.data?.message);
        }
    }

    
</script>

<template>
    <div class="flex flex-col gap-5 ">
        <div class="font-bold pt-3 pr-4 flex justify-between">
            <h1 class="text-2xl text-gray-500">Quản lý ADMIN</h1>
            <button @click="isModalOpen = true" 
                class="bg-blue-600 text-white px-5 py-2.5 rounded-md flex items-center gap-2 
                transition-all shadow-lg active:scale-95 cursor-pointer text-sm">
                <i class="fa-solid fa-plus"></i> Thêm ADMIN
            </button>
        </div> 


        <!-- List admin -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            <UserCard v-for="admin in onlyAdmin" :key="admin.userID" :user="admin"/>
        </div>


        <!-- Form tao tk admin  -->
        <div v-if="isModalOpen" class="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div class="absolute inset-0 bg-black/20" @click="isModalOpen = false"></div>
            <div class="bg-white rounded-xl shadow-2xl z-10 w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
                <div class="px-6 py-4 border-b bg-gray-50 flex justify-between items-center">
                    <h3 class="text-lg font-bold text-gray-800">Tạo tài khoản ADMIN</h3>
                    <button @click="isModalOpen = false" class="text-gray-400 hover:text-red-500 text-xl cursor-pointer">&times;</button>
                </div>
                
                <div class="p-6 space-y-4">
                    <div>
                        <label class="block text-xs font-bold text-gray-400 uppercase mb-1">Username</label>
                        <input v-model="newAdmin.username" type="text" class="w-full border rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-blue-500 text-sm"/>
                    </div>
                    <div>
                        <label class="block text-xs font-bold text-gray-400 uppercase mb-1">Email</label>
                        <input v-model="newAdmin.email" type="email" class="w-full border rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-blue-500 text-sm"/>
                    </div>
                    <div>
                        <label class="block text-xs font-bold text-gray-400 uppercase mb-1">Mật khẩu</label>
                        <input v-model="newAdmin.password" type="password" class="w-full border rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-blue-500 text-sm"/>
                    </div>
                </div>

                <div class="px-6 py-4 bg-gray-50 border-t flex justify-end gap-3">
                    <button @click="isModalOpen = false" class="px-4 py-2 text-sm font-semibold text-gray-500">Hủy</button>
                    <button @click="createAdminAccount" class="bg-blue-600 text-white px-6 py-2 rounded-lg text-sm font-bold shadow-md hover:bg-blue-700">Lưu</button>
                </div>
            </div>
        </div>
    </div>
    
</template>