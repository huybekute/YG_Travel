<script setup>
    import { ref } from 'vue';
import { RouterLink } from 'vue-router';

    //hieu ung thich
    const isLike = ref(false);
    const toggleLike = () =>{
        isLike.value = !isLike.value
    }

    const props = defineProps({
        location: {
            type:Object,
            required: true
        }
    });

    const displayRating = (val) => {
        const num = parseFloat(val);
        return isNaN(num) || num === 0 ? '0.0' : num.toFixed(1);
    };

</script>

<template>
    <div class="group flex flex-col bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 
    border border-gray-100 w-full max-w-sm">
        <div class="relative h-56 overflow-hidden">
            <!-- <img src="../../public/vinhhalong.jpg" class="w-full h-full object-cover transition-transform duration-500 
            group-hover:scale-110" alt="Vịnh Hạ Long"> -->
            <RouterLink :to="{ name: 'location-detail', params: { id: location.locationID } }" class="block h-full">
                <img :src="location.avatar" 
                    class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110 cursor-pointer" 
                    :alt="location.name">
            </RouterLink>
            <div class="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-lg shadow-md flex items-center gap-1">
                    <span class="text-xs font-bold text-gray-800">{{ displayRating(location.avgRating) }}</span>
                    <i class="fa-solid fa-star text-[10px] text-yellow-500"></i>
            </div>
            <span class="absolute top-3 left-3 bg-white/90 backdrop-blur-sm text-green-700 text-xs font-bold px-3 py-1 
            rounded-full shadow-sm">
            {{ location.categoryName }}</span>
        </div>
        <div class="p-5 flex flex-col gap-2">
            <h1 class="text-xl font-bold text-gray-800 group-hover:text-green-600 transition-colors">{{ location.name }}</h1>
            <div class="flex items-center text-gray-500 text-sm">
                <i class="fa-solid fa-location-dot text-red-500 mr-2"></i>
                <span>{{ location.provinceName }}</span>
            </div>
            <p class="text-gray-600 text-sm line-clamp-5 mt-1">{{ location.description }}</p>
            <div class="flex items-center justify-between mt-4 pt-4 border-t border-gray-200">
                <RouterLink :to="{ name: 'location-detail', params: { id: location.locationID } }" class="text-green-600 font-semibold text-sm hover:underline flex items-center gap-1">Chi tiết</RouterLink>
               <button @click="toggleLike" class="flex items-center font-semibold text-sm transition-all duration-300 cursor-pointer select-none"
                    :class="isLike ? 'text-red-500' : 'text-gray-400 hover:text-red-400'">
                    <span>Yêu thích</span><i class="pl-2 transition-all duration-300 transform"
                    :class="[isLike ? 'fa-solid fa-heart scale-125 text-red-500' : 'fa-regular fa-heart scale-100',]"></i>
                </button>
            </div>
        </div>
    </div>
</template>