<script setup>
    import UserCard from '@/components/admin/UserCard.vue';
</script>

<template>
    <div class="flex flex-col gap-5 ">
        <div class="font-sans font-bold pt-3">
            <h1 class="text-2xl text-gray-500">Quản lý người dùng</h1>
        </div>
        <div class="">
            <UserCard/>
        </div>
    </div>
    
</template>