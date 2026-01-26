<script setup>
    import { ref } from 'vue';

    //hieu ung thich
    const isLike = ref(false);
    const toggleLike = () =>{
        isLike.value = !isLike.value
    }
</script>

<template>
    <div class="group flex flex-col bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 
    border border-gray-100 w-full max-w-sm">
        <div class="relative h-56 overflow-hidden">
            <img src="../../public/vinhhalong.jpg" class="w-full h-full object-cover transition-transform duration-500 
            group-hover:scale-110" alt="Vịnh Hạ Long">
            <span class="absolute top-3 left-3 bg-white/90 backdrop-blur-sm text-green-700 text-xs font-bold px-3 py-1 
            rounded-full shadow-sm">Biển, đảo</span>
        </div>
        <div class="p-5 flex flex-col gap-2">
            <h1 class="text-xl font-bold text-gray-800 group-hover:text-green-600 transition-colors">Vịnh Hạ Long</h1>
            <div class="flex items-center text-gray-500 text-sm">
                <i class="fa-solid fa-location-dot text-red-500 mr-2"></i>
                <span>Quảng Ninh</span>
            </div>
            <p class="text-gray-600 text-sm line-clamp-3 mt-1">
                Khám phá vẻ đẹp kỳ vĩ của hàng nghìn hòn đảo đá vôi nhấp nhô trên mặt nước xanh ngắt.</p>
            <div class="flex items-center justify-between mt-4 pt-4 border-t border-gray-200">
                <a href="#" class="text-green-600 font-semibold text-sm hover:underline flex items-center gap-1">Chi tiết</a>
               <button @click="toggleLike" class="flex items-center font-semibold text-sm transition-all duration-300 cursor-pointer select-none"
                    :class="isLike ? 'text-red-500' : 'text-gray-400 hover:text-red-400'">
                    <span>Yêu thích</span><i class="pl-2 transition-all duration-300 transform"
                    :class="[isLike ? 'fa-solid fa-heart scale-125 text-red-500' : 'fa-regular fa-heart scale-100',]"></i>
                </button>
            </div>
        </div>
    </div>
</template>