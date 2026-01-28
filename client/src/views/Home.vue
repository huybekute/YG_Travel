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


    const showLocation = ref(false);
    const locationSection = ref(null);

    const showReason = ref(false);
    const reasonSection = ref(null);

    // const showFelling = ref(false);
    // const fellingSection = ref(null);

    onMounted(() => {
        //hieu ung danh sach dia diem
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if(entry.isIntersecting) { 
                    showLocation.value = true
                }
                else{
                    showLocation.value = false
                }
            })
        },{threshold: 0.1})

        if(locationSection.value){
            observer.observe(locationSection.value)
        }      

        //hieu ung cho reason
        const reasonObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if(entry.isIntersecting) { 
                    showReason.value = true;
                } 
                else {
                    showReason.value = false;
                }
            });
        }, { threshold: 0.1 });

        if(reasonSection.value){
            reasonObserver.observe(reasonSection.value);
        }

        //hieu ung cho cam nhan tu khach hang
        // const fellingObserver = new IntersectionObserver((entries) => {
        //     entries.forEach(entry => {
        //         if(entry.isIntersecting) {
        //             showFelling.value = true;
        //         }
        //         else{
        //             showFelling.value = false
        //         }
        //     })
        // }, { threshold: 0.1 });
        
        // if(fellingSection.value) {
        //     fellingObserver.observe(fellingSection.value);
        // }
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
        <div class="flex flex-col py-16 gap-10 transition-all duration-700 ease-out transform bg-white" 
        :class="[showLocation ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20']" ref="locationSection">
            <div class="text-center flex gap-4 flex-col">
                <h1 class="text-3xl font-extrabold">Khám Phá Kho Báu Việt Nam Cùng YG Travel</h1>
                <div class="w-80 h-1 bg-green-500 mx-auto  rounded-full"></div>
                <p class="text-gray-600">Những điểm đến độc đáo và ấn tượng nhất Việt Nam
                    <br/> từ di sản thiên nhiên đến văn hóa nghìn năm
                </p>
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
        <div ref="reasonSection" class="bg-slate-50 py-16 flex flex-col gap-20 transition-all duration-700 ease-out px-20 transform"
        :class="[showReason ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20']">
            <div class="text-center flex flex-col gap-4">
                <h1 class="text-3xl font-extrabold">Lý Do Chọn Chúng Tôi</h1>
                <div class="w-20 h-1 bg-green-500 mx-auto rounded-full"></div>
                <p class="text-gray-600">Không chỉ là những chuyến đi, chúng tôi mang đến<br/> 
                    những hành trình chạm vào cảm xúc và khám phá những "kho báu" tiềm ẩn của Việt Nam.</p>
            </div>
            
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 px-4">
                <div class="bg-white p-8 rounded-2xl group hover:-translate-y-2 transition-all duration-300 shadow-md">
                    <div class="mb-6 inline-block p-4 rounded-full bg-red-50 text-red-500 group-hover:bg-red-500 
                    group-hover:text-white transition-colors"><i class="fa-solid fa-heart text-2xl"></i></div>
                    <h3 class="text-xl font-bold text-gray-800 mb-3">Chạm Vào Cảm Xúc</h3>
                    <p class="text-gray-500 text-sm leading-relaxed">Mỗi hành trình được thiết kế để mang lại những cảm xúc
                        chân thực, nơi tâm hồn bạn được kết nối với thiên nhiên.</p>
                </div>
                <div class="bg-white p-8 rounded-2xl group hover:-translate-y-2 transition-all duration-300 shadow-md" >
                    <div class="mb-6 inline-block p-4 rounded-full bg-amber-50 text-amber-500 group-hover:bg-amber-500 
                    group-hover:text-white transition-colors"><i class="fa-solid fa-gem text-2xl"></i></div>
                    <h3 class="text-xl font-bold text-gray-800 mb-3">Kho Báu Tiềm Ẩn</h3>
                    <p class="text-gray-500 text-sm leading-relaxed">
                        Dẫn lối bạn đến những cung đường chưa in dấu chân đông đúc, khám phá vẻ đẹp nguyên sơ của dải
                        đất hình chữ S.</p>
                </div>
                <div class="bg-white p-8 rounded-2xl group hover:-translate-y-2 transition-all duration-300 shadow-md">
                    <div class="mb-6 inline-block p-4 rounded-full bg-green-50 text-green-500 group-hover:bg-green-500
                    group-hover:text-white transition-colors"><i class="fa-solid fa-leaf text-2xl"></i></div>
                    <h3 class="text-xl font-bold text-gray-800 mb-3">Dấu Chân Bản Địa</h3>
                    <p class="text-gray-500 text-sm leading-relaxed">
                        Hòa mình vào đời sống địa phương, thưởng thức phong vị thuần túy và lắng nghe những câu chuyện kể từ 
                        ngàn xưa.</p>
                    </div>
                <div class="bg-white p-8 rounded-2xl group hover:-translate-y-2 transition-all duration-300 shadow-md">
                    <div class="mb-6 inline-block p-4 rounded-full bg-blue-50 text-blue-500 group-hover:bg-blue-500 
                    group-hover:text-white transition-colors"><i class="fa-solid fa-anchor text-2xl"></i></div>
                    <h3 class="text-xl font-bold text-gray-800 mb-3">Hành Trình Trọn Vẹn</h3>
                    <p class="text-gray-500 text-sm leading-relaxed">
                        Chúng tôi cung cấp mọi chi tiết nhỏ nhất để bạn hoàn toàn thảnh thơi tận hưởng từng khoảnh khắc đáng nhớ.</p>
                </div>
            </div>
        </div>

        <!-- Cam nhan cua khach hang  -->
        <!-- <div ref="fellingSection" class="bg-white pt-16 pb-30 flex flex-col gap-20 transition-all duration-700 ease-out px-20 transform"
        :class="[showFelling ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20']">
            <div class="text-center flex flex-col gap-4 ">
                <h1 class="text-3xl font-extrabold">Cảm nhận của khách hàng</h1>
                <div class="w-20 h-1 bg-green-500 mx-auto rounded-full"></div>
            </div>
            <div class="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 px-4">
                <div class="p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all hover:-translate-y-2">
                    <div class="flex gap-1 text-orange-400 mb-4">
                        <i class="fa-solid fa-star"></i><i class="fa-solid fa-star"></i><i class="fa-solid fa-star"></i><i class="fa-solid fa-star"></i><i class="fa-solid fa-star"></i>
                    </div>
                    <p class="text-gray-600 italic mb-6">"Nhờ YG Travel mà mình tìm thấy một bản làng ở Hà Giang đẹp như tranh vẽ, hoàn toàn không có khói bụi thành phố."</p>
                    <div class="flex items-center gap-4">
                        <div class="w-12 h-12 bg-slate-200 rounded-full"></div>
                        <div>
                            <h4 class="font-bold text-slate-800">Minh Tú</h4>
                            <p class="text-xs text-gray-400">Chuyến đi Hà Giang - 2025</p>
                        </div>
                    </div>
                </div>
                <div class="p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all hover:-translate-y-2">
                    <div class="flex gap-1 text-orange-400 mb-4">
                        <i class="fa-solid fa-star"></i><i class="fa-solid fa-star"></i><i class="fa-solid fa-star"></i><i class="fa-solid fa-star"></i><i class="fa-solid fa-star"></i>
                    </div>
                    <p class="text-gray-600 italic mb-6">"Nhờ YG Travel mà mình tìm thấy một bản làng ở Hà Giang đẹp như tranh vẽ, hoàn toàn không có khói bụi thành phố."</p>
                    <div class="flex items-center gap-4">
                        <div class="w-12 h-12 bg-slate-200 rounded-full"></div>
                        <div>
                            <h4 class="font-bold text-slate-800">Minh Tú</h4>
                            <p class="text-xs text-gray-400">Chuyến đi Hà Giang - 2025</p>
                        </div>
                    </div>
                </div>
                <div class="p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all hover:-translate-y-2">
                    <div class="flex gap-1 text-orange-400 mb-4">
                        <i class="fa-solid fa-star"></i><i class="fa-solid fa-star"></i><i class="fa-solid fa-star"></i><i class="fa-solid fa-star"></i><i class="fa-solid fa-star"></i>
                    </div>
                    <p class="text-gray-600 italic mb-6">"Nhờ YG Travel mà mình tìm thấy một bản làng ở Hà Giang đẹp như tranh vẽ, hoàn toàn không có khói bụi thành phố."</p>
                    <div class="flex items-center gap-4">
                        <div class="w-12 h-12 bg-slate-200 rounded-full"></div>
                        <div>
                            <h4 class="font-bold text-slate-800">Minh Tú</h4>
                            <p class="text-xs text-gray-400">Chuyến đi Hà Giang - 2025</p>
                        </div>
                    </div>
                </div>
            </div>
        </div> -->
    </div>
</template>
