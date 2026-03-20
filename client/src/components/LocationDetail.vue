<script setup>
    import { ref, onMounted } from 'vue';
    import { useRoute } from 'vue-router';
    import apiService from '@/services/APIService';
    import { useRouter } from 'vue-router';
    import Swal from 'sweetalert2';

    const route = useRoute();
    const router = useRouter();

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

            //review
            await fetchReviews();
        } catch (err) {
            console.error("Lỗi lấy dữ liệu chi tiết:", err);
        } finally {
            loading.value = false;
        }
    };

    const copyLink = () => {
        navigator.clipboard.writeText(window.location.href);
    };

    const reviews = ref([]);
    const newReview = ref({ rating: 5, comment: '' });
    const isSubmitting = ref(false);
    // lay ds review
    const fetchReviews = async () => {
        const id = route.params.id;
        try {
            const res = await apiService.get(`/review/location/${id}`);
            reviews.value = res.data;
        } catch (err) {
            console.error("Lỗi lấy đánh giá:", err);
        }
    };

    //submit review
    const submitReview = async () => {
        isSubmitting.value = true;
        try {
            await apiService.post('/review/saveReview', {
                locationID: route.params.id,
                rating: newReview.value.rating,
                comment: newReview.value.comment
            });
            newReview.value.comment = '';
            newReview.value.rating = 5;
            await fetchReviews();
        } catch (err) {
            Swal.fire({
                icon: 'warning',
                title: 'Bạn chưa đăng nhập!',
                text: "Vui lòng đăng nhập để chia sẻ trải nghiệm",
                confirmButtonColor: '#2563eb',
                confirmButtonText: 'Đăng nhập ngay', 
                showCancelButton: true, 
                cancelButtonText: 'Để sau',
            }).then((result) => {
                if (result.isConfirmed) {
                    router.push('/auth/dang-nhap'); 
                }
            });
        } finally {
            isSubmitting.value = false;
        }
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
                        <!-- {{ item.content.replaceAll('\\t', '\t') }} -->
                          <div v-html="item.content.replaceAll('\\t', '\t')"></div>
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
                <div class="pt-10 border-t border-gray-100">
                    <h2 class="text-2xl font-bold text-gray-800 mb-8 flex items-center gap-2">
                        <span class="w-1 h-8 bg-green-500 rounded-full"></span>Đánh giá về địa điểm này
                    </h2>

                    <div class="bg-gray-50 p-6 rounded-2xl mb-10">
                        <h3 class="font-bold text-gray-700 mb-4">Chia sẻ trải nghiệm của bạn</h3>
                        <div class="space-y-4">
                            <div class="flex items-center gap-2">
                                <span class="text-sm text-gray-500 mr-2"></span>
                                <div class="flex gap-1">
                                    <button v-for="star in 5" :key="star" @click="newReview.rating = star"
                                        class="text-2xl transition-transform active:scale-125">
                                        <i :class="star <= newReview.rating ? 'fa-solid fa-star text-yellow-400' : 'fa-regular fa-star text-gray-300'"></i>
                                    </button>
                                </div>
                            </div>
                            <textarea v-model="newReview.comment" rows="3" 
                                class="w-full p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 outline-none text-sm"
                                placeholder="Cảm nhận của bạn về địa điểm này..."></textarea>
                            <button @click="submitReview" :disabled="isSubmitting"
                                class="bg-green-600 text-white px-8 py-3 rounded-md font-bold hover:bg-green-700 transition-all disabled:opacity-50">
                                {{ isSubmitting ? 'Đang gửi...' : 'Gửi đánh giá' }}
                            </button>
                        </div>
                    </div>

                    <div class="space-y-6">
                        <div v-if="reviews.length === 0" class="text-center py-10 text-gray-400">
                            Chưa có đánh giá nào. Hãy là người đầu tiên!
                        </div>
                        <div v-for="rev in reviews" :key="rev.reviewID" class="flex gap-4 p-4 hover:bg-gray-50 rounded-2xl 
                        transition-colors">
                            <img src="../../public/avtUser.jpg" class="w-12 h-12 rounded-full object-cover border border-gray-100"> 
                            <div class="flex-1">
                                <div class="flex justify-between items-start">
                                    <div>
                                        <h4 class="font-bold text-gray-800 text-sm">{{ rev.fullname || rev.username }}</h4>
                                        <div class="flex gap-1 text-[10px] text-yellow-400 my-1">
                                            <i v-for="s in rev.rating" :key="s" class="fa-solid fa-star"></i>
                                        </div>
                                    </div>
                                    <span class="text-[10px] text-gray-400">{{ new Date(rev.createdAt).toLocaleDateString('vi-VN') }}</span>
                                </div>
                                <p class="text-gray-600 text-sm mt-2 leading-relaxed">{{ rev.comment }}</p>
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
