<script setup>
    import UserCard from '@/components/admin/UserCard.vue';
    import apiService from '@/services/APIService';
    import { ref, onMounted, computed } from 'vue';

    const admins = ref([]);
    const onlyAdmin = computed(() => {
        return admins.value.filter(a => a?.role === "ADMIN");
    })

    

    onMounted(async () => {
        try{
            const res = await apiService.get("/user");
            admins.value  = res.data || res;
        }
        catch(err){
            console.error("Lỗi load user", err);
        }
    })
    
</script>

<template>
    <div class="flex flex-col gap-5 ">
        <div class="font-bold pt-3">
            <h1 class="text-2xl text-gray-500">Quản lý ADMIN</h1>
        </div> 

        <!-- List user -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            <UserCard v-for="admin in onlyAdmin" :key="admin.userID" :user="admin"/>
        </div>
    </div>
    
</template>