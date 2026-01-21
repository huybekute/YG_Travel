<script setup>
    import { ref, onMounted } from 'vue';
    import apiService from '@/services/APIService';

    const countLocation = ref(0);
    const countUser = ref(0);
    const countFavorite = ref(0);
    const countView = ref(0);

    //thong ke 
    const stat = async () => {
        try{
            //tk dia diem
            const resLocation = await apiService.get("/location/");
            if(resLocation.data){
                countLocation.value = resLocation.data.length;
            };

            //tk user
            const resUser = await apiService.get("/user/");
            if(resUser.data){
                countUser.value = resUser.data.length;
            }

            //tk luot yeu thich
            const resFavorite = await apiService.get("/favorite-list/stats");
            if(resFavorite.data){
                countFavorite.value = resFavorite.data.total;
            }

            //tk view
            const resView = await apiService.get("/access-log/stats");
            if(resView.data){
                countView.value = resView.data.total;
            }
            
        }
        catch(error){
            console.log("Lỗi: " + error);
        }
    }

    onMounted(() => {
        stat();
    })

</script>
<template>
    <div class="flex flex-col">
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 p-4">
            <div class="bg-white p-6 rounded-lg shadow-md border-l-4 border-green-500">
                <h1 class="text-gray-500 text-sm font-bold uppercase">Tổng địa điểm</h1>
                <p class="text-3xl font-semibold text-gray-800">{{ countLocation }}</p>
            </div>

            <div class="bg-white p-6 rounded-lg shadow-md border-l-4 border-blue-500">
                <h1 class="text-gray-500 text-sm font-bold uppercase">Người dùng đăng ký</h1>
                <p class="text-3xl font-semibold text-gray-800">{{ countUser }}</p>
            </div>

            <div class="bg-white p-6 rounded-lg shadow-md border-l-4 border-red-500">
                <h1 class="text-gray-500 text-sm font-bold uppercase">Tổng lượt yêu thích</h1>
                <p class="text-3xl font-semibold text-gray-800">{{ countFavorite }}</p>
            </div>

            <div class="bg-white p-6 rounded-lg shadow-md border-l-4 border-yellow-500">
                <h1 class="text-gray-500 text-sm font-bold uppercase">Số lượt truy cập</h1>
                <p class="text-3xl font-semibold text-gray-800">{{ countView }}</p>
            </div>
        </div>
    </div>
</template>