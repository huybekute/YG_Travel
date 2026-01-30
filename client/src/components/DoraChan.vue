<script setup>
    import { ref, computed } from 'vue';
    import { useRoute } from 'vue-router';
    
    const route = useRoute()

    const isChatOpen = ref(false);
    const userMsg = ref(""); 
    
    const isAdminPage = computed(() => route.path.startsWith('/admin'));
</script>

<template>
    <div class="fixed bottom-12 right-6 z-50 flex flex-col items-end" v-if="!isAdminPage">
        <div v-if="isChatOpen" class="mb-4 w-80 h-[450px] bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden border 
        border-gray-100 transition-all">
            <div class="bg-blue-600 p-4 text-white flex justify-between items-center">
                <div class="flex items-center gap-3">
                    <img src="/DoraChan.jpg" class="w-10 h-10 rounded-full border-2 border-white object-cover">
                    <div class="flex flex-col">
                        <span class="font-bold text-sm">Dora Chan</span>
                        <span class="text-[10px] text-blue-100">Trợ lý YG Travel</span>
                    </div>
                </div>
                <button @click="isChatOpen = false" class="hover:bg-blue-700 p-1 rounded transition-colors">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            <div class="flex-1 p-4 overflow-y-auto bg-gray-50 space-y-3">
                <div class="bg-white p-3 rounded-2xl rounded-bl-none shadow-sm text-sm max-w-[85%] border border-gray-100">
                    <p>Chào bạn, Dora Chan có thể giúp gì cho bạn</p>
                </div>
            </div>
            <div class="p-3 bg-white border-t flex gap-2 items-center">
                <input v-model="userMsg" type="text" placeholder="Nhập tin nhắn..." 
                       class="flex-1 text-sm border rounded-full px-4 py-2 outline-none focus:border-blue-500" />
                <button class="text-blue-600 hover:scale-110 transition-transform">
                    <i class="fas fa-paper-plane"></i>
                </button>
            </div>
        </div>
        <!-- <div v-if="!isChatOpen" class="mb-3 mr-2 bg-white px-4 py-2 rounded-xl shadow-lg border border-gray-100 text-sm font-medium text-gray-700 relative animate-bounce pointer-events-none">
            Tôi có thể giúp gì cho bạn?
            <div class="absolute -bottom-1.5 right-6 w-3 h-3 bg-white rotate-45 border-r border-b border-gray-100"></div>
        </div> -->
        <button @click="isChatOpen = !isChatOpen" class="relative flex items-center justify-center w-14 h-14 bg-blue-600 rounded-full 
        shadow-2xl transition-all hover:scale-110 active:scale-95 text-white text-2xl">
            <img src="/DoraChan.jpg" class="w-14 h-14 rounded-full border-2 border-white object-cover">
            <span v-if="!isChatOpen" class="absolute -top-1 -right-1 flex h-4 w-4">
                <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                <span class="relative inline-flex rounded-full h-4 w-4 bg-red-500"></span>
            </span>
        </button>
    </div>
</template>