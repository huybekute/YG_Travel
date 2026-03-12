<script setup>
    import { ref, onMounted } from 'vue';
    import { useRoute } from 'vue-router';
    import apiService from '@/services/APIService';

    const route = useRoute();
    const location = ref(null);
    const album = ref([]);
    const loading = ref(true);

    const locationDetails = ref([]);
    const activeTab = ref('');

    //lay chi tiet dia diem
    const fetchAllData = async () => {
        const id = route.params.id;
        try {
            const resLocation = await apiService.get(`/location/${id}`);
            location.value = resLocation.data;

            const resDetails = await apiService.get(`/location-detail/${id}`);
            locationDetails.value = resDetails.data;
            if (locationDetails.value.length > 0) {
                activeTab.value = locationDetails.value[0].section;
            }

            const resAlbum = await apiService.get(`/image/location/${id}`);
            album.value = resAlbum.data;
        } catch (err) {
            console.error("Lỗi lấy dữ liệu chi tiết:", err);
        } finally {
            loading.value = false;
        }
    };
    const copyLink = () => {
        navigator.clipboard.writeText(window.location.href);
    };

onMounted(fetchAllData);
</script>

<template>
    <div v-if="loading" class="flex justify-center items-center h-screen text-green-600 font-bold">
        ...
    </div>
    <div v-else-if="location" class="pb-20">
        <div class="relative h-[60vh] w-full overflow-hidden ">
            <img :src="location.avatar" 
                 class="w-full h-full object-cover">
            <div class=" animate-fade-in absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col 
                justify-end p-10 md:p-20">
                <h1 class="text-4xl md:text-6xl font-bold text-white mb-4 ">{{ location.name }}</h1>
                <div class="flex flex-col text-gray-200 text-lg w-3/5 gap-4">
                    <p class="text-white leading-relaxed text-lg whitespace-pre-line">
                        {{ location.description }}</p>
                    <div class="flex items-center">
                        <i class="fa-solid fa-location-dot text-red-500 mr-3"></i>
                        <span>{{ location.provinceName }}</span>
                    </div>
                </div>
            </div>
        </div>
        <div class="max-w-6xl mx-auto px-6 mt-12 grid grid-cols-1 lg:grid-cols-3 gap-12">
            <div class="lg:col-span-2 space-y-12">
                <div v-for="item in locationDetails" :key="item.id" :id="'section-' + item.id" class=" space-y-6">
                    <h2 class="text-2xl font-medium text-gray-800 mb-4 flex items-center gap-2">
                        <span class="w-1 h-8 bg-green-500 rounded-full"></span> {{ item.section }}</h2>
                    <div class="text-gray-600 leading-relaxed text-lg whitespace-pre-wrap text-justify">
                        {{ item.content.replaceAll('\\t', '\t') }}
                    </div>
                </div>

                <div v-if="album.length > 0" class="">
                    <h2 class="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                        <span class="w-1 h-8 bg-green-500 rounded-full"></span>Album ảnh</h2>
                        <div class="grid grid-cols-2 md:grid-cols-3 gap-4">
                            <div v-for="(img, index) in album" :key="img.imageID">
                                <a :href="'#view-img-' + index" class="group aspect-square rounded-2xl overflow-hidden shadow-md 
                                block border-2 border-white hover:border-green-500 transition-all cursor-zoom-in">
                                    <img :src="img.imageURL" class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700">
                                </a>
                                <div :id="'view-img-' + index" class="lightbox">
                                    <a href="#" class="lightbox-overlay"></a>
                                    <div class="lightbox-content">
                                        <a v-if="index > 0" :href="'#view-img-' + (index - 1)" class="nav-btn prev-btn">
                                            <i class="fa-solid fa-chevron-left"></i></a>
                                        <img :src="img.imageURL" class="big-img">
                                        <a v-if="index < album.length - 1" :href="'#view-img-' + (index + 1)" class="nav-btn next-btn">
                                            <i class="fa-solid fa-chevron-right"></i></a>
                                        <p v-if="img.description" class="img-caption">{{ img.description }}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
            </div>

            <div class="space-y-6">
                <div class="bg-green-100 p-8 rounded-md border border-green-100 shadow-sm sticky top-24">
                    <p class="text-sm text-green-700 mb-8 leading-relaxed ">
                        Hãy lưu lại để không bỏ lỡ chuyến đi đến <strong>{{ location.name }}</strong> trong tương lai nhé!
                    </p>
                    <!-- <button class="w-full cursor-pointer bg-white border border-gray-200 text-gray-600 py-4 rounded-md  font-bold transition-all active:scale-95 mb-4 uppercase tracking-widest text-sm flex justify-center items-center gap-2">
                        Thêm vào danh sách<br/> yêu thích
                    </button> -->
                    <div class="flex items-center gap-2 mb-4">
                            <i class="fa-solid fa-list-ul text-green-600"></i>
                            <h3 class="text-md font-bold tracking-widest text-gray-800">Mục lục</h3>
                    </div>
                    <div v-for="item in locationDetails" :key="item.id" class="mb-2">
                        <a :href="'#section-' + item.id" 
                        class="text-md font-medium text-gray-600 hover:text-green-600 hover:translate-x-1 transition-all flex items-center gap-2">
                            <span class="w-1 h-4 rounded-full"></span> 
                            {{ item.section }}
                        </a>
                    </div> 
                    <div class="mt-8 pt-8 border-t border-green-200">
                        <div class="space-y-2 mb-6">
                            <div class="flex items-center gap-3 text-blue-800/70 text-[11px]">
                                <i class="fa-solid fa-circle-info"></i>
                                <span>Thông tin được tổng hợp từ YG Travel</span>
                            </div>
                            <div class="flex items-center gap-3 text-blue-800/70 text-[11px]">
                                <i class="fa-solid fa-camera"></i>
                                <span>Đừng quên mang theo máy ảnh nhé</span>
                            </div>
                        </div>
                        <div class="flex items-center gap-6 justify-end">
                            <a :href="`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(location.name)}`" 
                            target="_blank"class="flex items-center gap-2 text-gray-500 hover:text-red-500 transition-colors group">
                                <i class="fa-solid fa-location-dot text-lg group-hover:scale-110 transition-transform"></i></a>
                            <button @click="copyLink" 
                            class="flex items-center gap-2 text-gray-500 hover:text-blue-500 transition-colors group cursor-pointer">
                                <i class="fa-solid fa-share-nodes text-lg group-hover:scale-110 transition-transform"></i>
                            </button>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    </div>
</template>

<style scoped>
    .animate-fade-in { animation: fadeIn 1s ease-out; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } 
    }

    .lightbox {
        position: fixed;
        inset: 0;
        z-index: 9999;
        display: none; 
        align-items: center;
        justify-content: center;
        padding: 2rem;
    }

    .lightbox:target {
        display: flex;
    }

    .lightbox-overlay {
        position: absolute;
        inset: 0;
        background: rgba(0, 0, 0, 0.85);
        backdrop-filter: blur(5px);
        cursor: default;
    }

    .lightbox-content {
        position: relative;
        max-width: 90%;
        max-height: 90vh;
        z-index: 10;
        display: flex;
        flex-direction: column;
        align-items: center;
    }

    .big-img {
        max-width: 100%;
        max-height: 80vh;
        border-radius: 0.75rem;
        box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
        transform: scale(0.9);
        transition: transform 0.3s ease-out;
    }

    .lightbox:target .big-img {
        transform: scale(1);
    }

    .close-button {
        position: absolute;
        top: -40px;
        right: 0;
        color: white;
        font-size: 35px;
        text-decoration: none;
        line-height: 1;
    }

    .close-button:hover {
        color: #ef4444;
    }

    .img-caption {
        color: white;
        margin-top: 1rem;
        font-size: 0.9rem;
        background: rgba(0,0,0,0.5);
        padding: 0.5rem 1rem;
        border-radius: 99px;
    }

    .nav-btn {
        position: absolute;
        top: 50%;
        transform: translateY(-50%);
        color: white;
        font-size: 2rem;
        padding: 20px;
        text-decoration: none;
        transition: all 0.3s;
        z-index: 20;
        background: rgba(255, 255, 255, 0.1);
        border-radius: 50%;
        width: 60px;
        height: 60px;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    /* .nav-btn:hover {
        background: rgba(255, 255, 255, 0.3);
        color: #22c55e; 
    } */

    .prev-btn {
        left: -80px;
    }

    .next-btn {
        right: -80px;
    }

    @media (max-width: 768px) {
        .nav-btn {
            width: 40px;
            height: 40px;
            font-size: 1.2rem;
        }
        .prev-btn { left: -10px; }
        .next-btn { right: -10px; }
    }
    
    [id^="section-"] {
        scroll-margin-top: 30vh; 
        scroll-behavior: smooth;
    }


</style>
