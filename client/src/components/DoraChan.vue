<script setup>
    import { ref, computed, watch, nextTick, onMounted } from 'vue';
    import { useRoute } from 'vue-router';
    import apiModel from '@/services/APIModel';
    import apiService from '@/services/APIService';
    
    const route = useRoute()

    const isChatOpen = ref(false);
    const userMsg = ref(""); 
    const chatContainer = ref(null);
    const isAdminPage = computed(() => route.path.startsWith('/admin'));

    // tu dong cuon xuong duoi khung chat
    const scrollToBottom = async () => {
        await nextTick();
        if (chatContainer.value) {
            chatContainer.value.scrollTo({
                top: chatContainer.value.scrollHeight,
                behavior: 'smooth'
            });
        }
    };


    // lay goi y tu he thong
    const chatHistory = ref([]); // role: dora or user
    const isLoad = ref(false);

    const getRecommendations = async () => {
        // neu tin nhan trong hoac dang load thi ko gui
        if (!userMsg.value.trim() || isLoad.value) return;

        //luu tin nhan vao lich su
        const messageToSend = userMsg.value;
        chatHistory.value.push({ role: 'user', text: messageToSend });
        isLoad.value = true;
        userMsg.value = '';
   
        try{
            const res = await apiModel.post("/recommendation", { query: messageToSend});
            let doraRes = "";
            if(res.data && res.data.answer){
                doraRes = res.data.answer
            }

            else {
                doraRes = "Dora không tìm thấy thông tin phù hợp trong sách hướng dẫn.";
            }
            chatHistory.value.push({ role: 'dora', text: doraRes });
        }
        catch(error){
            console.log("Lỗi gọi model: " + error);
            chatHistory.value.push({ role: 'dora', text: "Xin lỗi, Dora đang gặp chút sự cố kết nối!" });
        }
        finally{
            isLoad.value = false;
            userMsg.value = '';
        }
    }

    const locations = ref([])
    const getAllLocation = async () => {
        try{
            const res = await apiService.get("/location/")
            if(res.data){
                locations.value = res.data
            }
        }
        catch(err){
            const status = err.response?.status;
            const message = err.response?.data?.message;

            if(status === 400 || status === 500 || status === 404 || status === 409) {
                console.log(message);
            }
        }
    }


    onMounted(() =>{
        getAllLocation();
    })
    
    // khi co tin nhan moi thi cuon trang
    watch(chatHistory, () => {
        scrollToBottom();
    }, { deep: true });

</script>

<template>
    <div class="fixed bottom-12 right-6 z-50 flex flex-col items-end font-sans" v-if="!isAdminPage">
        <div v-if="isChatOpen" class="mb-4 w-120 h-140 bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-gray-100 transition-all">
            <div class="bg-blue-600 p-4 text-white flex justify-between items-center shadow-sm">
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
            <div ref="chatContainer" class="flex-1 p-4 overflow-y-auto bg-gray-50 flex flex-col gap-3">
                <div class="self-start bg-white p-3 rounded-2xl rounded-bl-none shadow-sm text-sm max-w-[85%] border border-gray-100">
                    <p>Chào bạn, Dora Chan có thể giúp gì cho bạn?</p>
                </div>
                <div v-for="(msg, index) in chatHistory" :key="index" :class="['max-w-[85%] p-3 rounded-2xl text-sm shadow-sm border transition-all whitespace-pre-line', 
                    msg.role === 'user' ? 'self-end bg-blue-600 text-white rounded-br-none border-blue-500' 
                    : 'self-start bg-white text-gray-800 rounded-bl-none border-gray-100']">{{ msg.text }}
                </div>
                <!-- loading -->
                <div v-if="isLoad" class="self-start flex gap-1 ml-2 items-center">
                    <div class="flex gap-1">
                        <span class="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce"></span>
                        <span class="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce [animation-delay:0.2s]"></span>
                        <span class="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce [animation-delay:0.4s]"></span>
                    </div>
                </div>
            </div>
            <div class="p-3 bg-white border-t flex gap-2 items-center">
                <input v-model="userMsg" @keyup.enter="getRecommendations" :disabled="isLoad" type="text" placeholder="Nhập tin nhắn..." 
                    class="flex-1 text-sm border rounded-full px-4 py-2 outline-none focus:border-blue-500 disabled:bg-gray-50" />
                <button @click="getRecommendations" :disabled="isLoad || !userMsg.trim()" class="text-blue-600 hover:scale-110 
                transition-transform"><i class="fas fa-paper-plane"></i></button>
            </div>
        </div>
        <button @click="isChatOpen = !isChatOpen" class="relative flex items-center justify-center w-14 h-14 rounded-full shadow-2xl transition-all hover:scale-110 active:scale-95 text-white text-2xl">
            <img src="/DoraChan.jpg" class="w-14 h-14 rounded-full border-2 border-white object-cover">
            <span v-if="!isChatOpen" class="absolute -top-1 -right-1 flex h-4 w-4">
                <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                <span class="relative inline-flex rounded-full h-4 w-4 bg-red-500"></span>
            </span>
        </button>
    </div>
</template>

