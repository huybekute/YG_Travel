<script setup>
    import UserCard from '@/components/admin/UserCard.vue';
    import apiService from '@/services/APIService';
    import { ref, onMounted} from 'vue';

    const users = ref([]);

    onMounted(async () => {
        try{
            const res = await apiService.get("/user");
            users.value  = res.data;
        }
        catch(err){
            console("Lỗi load user", err);
        }
    })
    
</script>

<template>
    <div class="flex flex-col gap-5 ">
        <div class="font-sans font-bold pt-3">
            <h1 class="text-2xl text-gray-500">Quản lý người dùng</h1>
        </div> 

        <!-- List user -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            <UserCard v-for="user in users" :key="user.id" :user="user"/>
        </div>
    </div>
    
</template>