<script setup>
    import { ref, onMounted, onUnmounted } from 'vue';
    import apiService from '@/services/APIService';
    import LocationCard from '@/components/LocationCard.vue';


    // hieu ung thanh search
    const showSearch = ref(false);

    const handleScroll = () => {
        if (window.scrollY > 50) {
            showSearch.value = true;
        }
        else {
            showSearch.value = false;
        }
    }

    onMounted(() => {
        window.addEventListener('scroll', handleScroll);
    });

    onUnmounted(() => {
        window.removeEventListener('scroll', handleScroll);
    });

    //lay danh sach tat ca tinh
    const provinces = ref([])
    const getAllProvinces = async () => {
        try {
            const res = await apiService.get("/province");
            if (res.data) {
                provinces.value = res.data;
            }
        }
        catch (error) {
            const status = error.response?.status;
            const message = error.response?.data?.message;

            if (status === 500) {
                console.log(message)
            }
            else {
                console.log("Lỗi hệ thống" + error);
            }
        }

    }

    const categories = ref([]);
    //lay danh sach the loai
    const getAllCategories = async () => {
        try {
            const res = await apiService.get("/category");
            if (res.data) {
                categories.value = res.data;
            }
        }
        catch (error) {
            const status = error.response?.status;
            const message = error.response?.data?.message;

            if (status === 500) {
                console.log(message)
            }
            else {
                console.log("Lỗi hệ thống" + error);
            }
        }
    }

    onMounted(() => {
        getAllProvinces();
        getAllCategories();
    })


    //hieu ung danh sach dia diem
    const showLocation = ref(false);
    const locationSection = ref(null);

    onMounted(() => {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if(entry.isIntersecting) { 
                    showLocation.value = true
                }else{
                    showLocation.value = false
                }
            })
        },{threshold: 0.1})

        if(locationSection.value){
            observer.observe(locationSection.value)
        }      
    })

    
</script>

<template>
    <div class="flex flex-col">
        <!-- anh nen -->
        <div class="relative w-full overflow-hidden h-screen">
            <img src="../../public/Home/HomePage.jpg" class="absolute w-full h-full object-cover">
            <div class="absolute inset-0 bg-black/40"></div>
            <!-- <div class="relative z-10 text-center px-6 pt-50">
                <h1 class="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6 drop-shadow-2xl tracking-tight">
                    Khám Phá Việt Nam <br class="hidden md:block"> Theo Cách Riêng Của Bạn
                </h1>
                <p class="text-lg md:text-2xl text-gray-200 mb-8 max-w-3xl mx-auto font-light italic">
                    "Hành trình từ trái tim đến những kỳ quan bất tận cùng YG Travel"
                </p>
                
                <button @click="window.scrollTo({top: 600, behavior: 'smooth'})" 
                    class="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-full font-medium transition-all transform hover:scale-105 shadow-lg">
                    Bắt đầu trải nghiệm ngay
                </button>
            </div> -->
        </div>

        <!-- thanh search -->
        <div class="flex gap-5 p-6 bg-white rounded-2xl mx-auto z-10 -mt-12 shadow-md border border-gray-100 transition-all duration-700 ease-out "
            :class="[showSearch ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-10 scale-95 pointer-events-none']">
            <div class="flex flex-col gap-2 w-48">
                <select
                    class="bg-white/10 backdrop-blur-md border border-white/20 rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-green-500 transition-all cursor-pointer">
                    <option value="" disabled selected>Chọn điểm đến</option>
                    <option class="text-black" v-for="province in provinces" :key="province.provinceID"
                        :value="province.provinceID">{{ province.name }}</option>
                </select>
            </div>
            <div class="border-r border-gray-200 px-5"></div>
            <div class="flex flex-col gap-2 w-48">
                <select
                    class="bg-white/10 backdrop-blur-md border border-white/20 rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-green-500 transition-all cursor-pointer">
                    <option value="" disabled selected>Chủ đề</option>
                    <option class="text-black" v-for="category in categories" :key="category.categoryID"
                        :value="category.categoryID">{{ category.name }}</option>
                </select>
            </div>
            <div class="border-r border-gray-200 px-5"></div>
            <div class="flex flex-col gap-2 w-48">
                <select
                    class="bg-white/10 backdrop-blur-md border border-white/20 rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-green-500 transition-all cursor-pointer">
                    <option value="" disabled selected>Sắp xếp</option>
                    <option class="text-black" value="halong">Phổ biến nhất</option>
                    <option class="text-black" value="phuquoc">Đánh giá cao nhất</option>
                    <option class="text-black" value="hanoi">Mới nhất</option>
                </select>
            </div>
            <div class="border-r border-gray-200 px-5"></div>
            <div class="items-center flex">
                <button class="px-4 py-2 text-sm bg-green-600 hover:bg-green-700 text-white rounded-full shadow-md transition-all
                flex gap-2 items-center"><span>Tìm kiếm</span><i class="fa-solid fa-magnifying-glass text-sm"></i></button>
            </div>
        </div>
        <!-- List Location -->
        <div class="flex flex-col py-15 gap-10 transition-all duration-700 ease-out transform bg-white" 
        :class="[showLocation ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20']" ref="locationSection">
            <div class="text-center">
                <h1 class="text-3xl font-extrabold">Khám Phá Kho Báu Việt Nam Cùng YG Travel</h1>
                <div class="w-80 h-1 bg-green-500 mx-auto mt-3 rounded-full"></div>
            </div>
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 px-10">
                <LocationCard/>
                <LocationCard/>
                <LocationCard/>
                <LocationCard/>
                <LocationCard/>
                <LocationCard/>
                <LocationCard/>
                <LocationCard/>
                <LocationCard/>
                <LocationCard/>
                <LocationCard/>
                <LocationCard/>
            </div>
            <div class="flex pt-5">
                <RouterLink to="/diem-den" class="group bg-green-500 py-3 px-8 rounded-full text-white mx-auto hover:bg-green-600 transition-all 
                duration-300">Xem tất cả điểm đến<i class="fa-solid fa-arrow-right ml-3 text-sm transform group-hover:translate-x-2 transition-transform"></i></RouterLink>
            </div>
        </div>

        <!-- Tai sao lai chon chung toi  -->
        <div class="bg-slate-50 py-10 flex flex-col">
            <div class="text-center flex flex-col gap-4">
                <h1 class="text-3xl font-extrabold">Lý Do Chọn Chúng Tôi</h1>
                <div class="w-20 h-1 bg-green-500 mx-auto rounded-full"></div>
                <p class="text-gray-600">Không chỉ là những chuyến đi, chúng tôi mang đến<br/> 
                    những hành trình chạm vào cảm xúc và khám phá những "kho báu" tiềm ẩn của Việt Nam.</p>
            </div>
            <div class="grid grid-cols-4 gap-10">
                <div class="bg-white">
                    <i class="fa-solid fa-shield-lock"></i>
                </div>
            </div>
        </div>
    </div>
</template>
