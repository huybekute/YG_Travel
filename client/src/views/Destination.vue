<script setup>
    import { ref, onMounted, computed, watch } from 'vue';
    import apiService from '@/services/APIService';
    import LocationCard from '@/components/LocationCard.vue';
    import { useRoute } from 'vue-router'
    
    const route = useRoute()

    const locations = ref([]);
    const provinces = ref([]);
    const categories = ref([]);
    const loading = ref(true);

    const searchQuery = ref('');
    const selectedProvince = ref('');
    const selectedCategory = ref('');

    // phan trang
    const currentPage = ref(1);
    const itemPerPage = 9; //9item

    const fetchData = async () => {
        loading.value = true;
        try {
            const resLocation = await apiService.get("/location")
            locations.value = resLocation.data;

            const resProvince = await apiService.get("/province")
            provinces.value = resProvince.data;

            const resCategory = await apiService.get("/category")
            categories.value = resCategory.data
            
        } catch (error) {
            console.error("Lỗi tải dữ liệu:", error);
        } finally {
            loading.value = false;
        }
    };

    // loc dia diem

    const filteredLocations = computed(() => {
        return locations.value.filter(loc => {
            const matchSearch = loc.name.toLowerCase().includes(searchQuery.value.toLowerCase());
            const matchProvince = selectedProvince.value === '' || 
                loc.provinceName == provinces.value.find(p => p.provinceID == selectedProvince.value)?.name;
            const matchCategory = selectedCategory.value === '' ||
                loc.categoryName == categories.value.find(p => p.categoryID == selectedCategory.value)?.name;
            return matchSearch && matchProvince && matchCategory;
        });
    });

    // danh sach in current page
    const listLocationCurrentPage = computed(() => {
        const start = (currentPage.value - 1) * itemPerPage;
        return filteredLocations.value.slice(start, start + itemPerPage);
    });

    const totalPage = computed(() => Math.ceil(filteredLocations.value.length / itemPerPage));

    const changePage = (page) => {
        if (page >= 1 && page <= totalPage.value) {
            currentPage.value = page;
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    watch([searchQuery, selectedProvince, selectedCategory], () => {
        currentPage.value = 1;
    });

    onMounted(fetchData);
    // lay du lieu tu url query
    onMounted(() => {
        if(route.query.province){
            selectedProvince.value = route.query.province
        }
        if(route.query.category){
            selectedCategory.value = route.query.category
        }
    })
    
</script>

<template>
    <div class="py-16 bg-gray-50 min-h-screen">
        <div class="container mx-auto px-4">
            <div class="flex flex-col lg:flex-row gap-8">
                <div class="w-full lg:w-1/4">
                    <div class="bg-white p-6 rounded-3xl shadow-sm sticky top-24 border border-gray-100">
                        <div class="flex items-center gap-2 mb-8 pb-4 border-b">
                            <i class="fa-solid fa-sliders text-green-600"></i>
                            <h3 class="font-bold text-gray-800 uppercase tracking-wider text-sm">Bộ lọc tìm kiếm</h3>
                        </div>
                        <div class="mb-6">
                            <label class="block text-[10px] font-black text-gray-400 uppercase mb-2 ml-1">Tên địa điểm</label>
                            <div class="relative">
                                <i class="fa-solid fa-magnifying-glass absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 text-xs"></i>
                                <input v-model="searchQuery" type="text" placeholder="Bạn muốn đi đâu?" 
                                    class="w-full pl-10 pr-4 py-3 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-green-500 text-sm outline-none transition-all">
                            </div>
                        </div>
                        <div class="mb-6">
                            <label class="block text-[10px] font-black text-gray-400 uppercase mb-2 ml-1">Tỉnh thành</label>
                            <select v-model="selectedProvince" class="w-full bg-gray-50 border-none rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-green-500 outline-none appearance-none cursor-pointer">
                                <option value="">Tất cả tỉnh thành</option>
                                <option v-for="p in provinces" :key="p.provinceID" :value="p.provinceID">{{ p.name }}</option>
                            </select>
                        </div>
                        <div class="mb-8">
                            <label class="block text-[10px] font-black text-gray-400 uppercase mb-2 ml-1">Loại hình</label>
                            <div class="flex flex-wrap gap-2">
                                <button @click="selectedCategory = ''"
                                    :class="selectedCategory === '' ? 'bg-green-600 text-white' : 'bg-gray-100 text-gray-500'"
                                    class="px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer">Tất cả</button>
                                <button v-for="cat in categories" :key="cat.categoryID"
                                    @click="selectedCategory = cat.categoryID"
                                    :class="selectedCategory == cat.categoryID ? 'bg-green-600 text-white shadow-md' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'"
                                    class="px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer">
                                    {{ cat.name }}
                                </button>
                            </div>
                        </div>
                        <button @click="searchQuery = ''; selectedProvince = ''; selectedCategory = ''" 
                            class="w-full py-3 text-xs font-bold border-2 rounded-xl 
                            bg-red-500 text-white transition-all hover:bg-red-600 cursor-pointer uppercase">
                            Xóa tất cả bộ lọc
                        </button>
                    </div>
                </div>
                <div class="w-full lg:w-3/4">
                    <div v-if="loading" class="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div v-for="n in 6" :key="n" class="h-80 bg-gray-200 animate-pulse rounded-[2rem]"></div>
                    </div>
                    <div v-else>
                        <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                            <LocationCard 
                                v-for="loc in listLocationCurrentPage" 
                                :key="loc.locationID" 
                                :location="loc" 
                            />
                        </div>
                        <div v-if="totalPage > 1" class="flex justify-center items-center gap-2 mt-12">
                            <button @click="changePage(currentPage - 1)" :disabled="currentPage === 1"
                                class="w-10 h-10 flex items-center justify-center rounded-xl border border-gray-200 hover:bg-green-600 hover:text-white disabled:opacity-30 transition-all">
                                <i class="fa-solid fa-chevron-left text-xs"></i>
                            </button>
                            <button v-for="page in totalPage" :key="page" @click="changePage(page)"
                                :class="currentPage === page ? 'bg-green-600 text-white shadow-lg' : 'hover:bg-gray-100 text-gray-500'"
                                class="w-10 h-10 font-bold rounded-xl transition-all">
                                {{ page }}
                            </button>
                            <button @click="changePage(currentPage + 1)" :disabled="currentPage === totalPage"
                                class="w-10 h-10 flex items-center justify-center rounded-xl border border-gray-200 hover:bg-green-600 hover:text-white disabled:opacity-30 transition-all">
                                <i class="fa-solid fa-chevron-right text-xs"></i>
                            </button>
                        </div>
                        <div v-if="filteredLocations.length === 0" class="text-center py-20 bg-white rounded-[2rem] border-2 border-dashed border-gray-100">
                            <i class="fa-solid fa-map-location-dot text-5xl text-gray-200 mb-4"></i>
                            <h3 class="text-gray-400 font-bold">Không tìm thấy địa điểm phù hợp</h3>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>