<script setup>
    import { ref, onMounted, computed } from 'vue';
    import apiService from '@/services/APIService';

    const countLocation = ref(0);
    const countUser = ref(0);
    const countFavorite = ref(0);
    const countView = ref(0);
    const countLocationByProvince = ref([]);
    const countLocationByCategory = ref([]);
    const topFavorites = ref([]);

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

            //dem so dia diem theo tinh
            const resCountLocationByProvince = await apiService.get("/location/countLocationByProvince")
            if(resCountLocationByProvince.data){
                countLocationByProvince.value = resCountLocationByProvince.data;
            }

            //dem so dia diem theo the loai
            const resCountLocationByCategory = await apiService.get("/location/countLocationByCategory")
            if(resCountLocationByCategory.data){
                countLocationByCategory.value = resCountLocationByCategory.data
            }

            //lay top dia diem
            const resTop = await apiService.get("/location/getTopLocation");
            if(resTop.data) {
                topFavorites.value = resTop.data;
            }
        }
        catch(error){
            console.log("Lỗi: " + error);
        }
    }
    
    onMounted(() => {
        stat();
    })

    // Tính toán dữ liệu cho biểu đồ tròn
    const categoryStat = computed(() => {
        if (countLocationByCategory.value.length === 0) return [];

        const total = countLocationByCategory.value.reduce((sum, item) => sum + item.count, 0);
        let cumulativePercent = 0;

        return countLocationByCategory.value.map((item, index) => {
            const start = cumulativePercent;
            const percent = total > 0 ? (item.count / total) * 100 : 0;
            cumulativePercent += percent;
            
            // tao mau ngau nhien
            return {
                ...item,
                start,
                percent,
                color: `hsl(${index * (360 / countLocationByCategory.value.length)}, 70%, 60%)`
            };
        });
    });

    // tao gradient cho css
    const conicGradient = computed(() => {
        const segments = categoryStat.value.map(
            c => `${c.color} ${c.start}% ${c.start + c.percent}%`
        );
        return `conic-gradient(${segments.join(', ')})`;
    });

    //tinh toan ty le ve bieu do
    const statsWithProgress = computed(() => {
        if (countLocationByProvince.value.length === 0) return [];
        
        const max = Math.max(...countLocationByProvince.value.map(item => item.count));
        
        return countLocationByProvince.value.map(item => ({
            ...item,
            percentage: max > 0 ? (item.count / max) * 100 : 0
        }));
    });

</script>
<template>

    <!-- list ds -->
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
    
    <div class="p-4 flex gap-6">
        <!--bieu do ty le loa hinh du lich -->
        <div class="bg-white p-6 rounded-lg shadow-md border-t-4 border-orange-500">
            <h2 class="text-gray-700 text-lg font-bold uppercase mb-6">Tỉ lệ Loại hình du lịch</h2>
            <div class="flex flex-col md:flex-row items-center justify-around gap-8">
                <div class="relative w-48 h-48 rounded-full shadow-inner flex items-center justify-center"
                    :style="{ background: conicGradient }">
                    <div class="absolute w-32 h-32 bg-white rounded-full flex flex-center items-center justify-center shadow-sm">
                        <div class="text-center">
                            <p class="text-xs text-gray-400 font-bold uppercase">Tổng cộng</p>
                            <p class="text-xl font-black text-gray-700">{{ countLocation }}</p>
                        </div>
                    </div>
                </div>
                <div class="flex-1 grid grid-cols-1 gap-3 w-full">
                    <div v-for="item in categoryStat" :key="item.categoryName" 
                        class="flex items-center justify-between p-2 hover:bg-gray-50 rounded-lg transition-colors">
                        <div class="flex items-center gap-3">
                            <div class="w-3 h-3 rounded-full" :style="{ backgroundColor: item.color }"></div>
                            <span class="text-sm font-medium text-gray-600">{{ item.categoryName }}</span>
                        </div>
                        <span class="text-xs font-bold text-gray-400 pl-10">{{ Math.round(item.percent) }}%</span>
                    </div>
                </div>
            </div>
        </div>
        <!-- Top dia diem duoc yeu thich nhat -->
        <div class="bg-white p-6 rounded-xl shadow-md border-t-4 border-red-500 flex flex-col flex-1">
            <h2 class="text-gray-700 text-lg font-bold uppercase mb-6 flex items-center gap-2">
                <i class="fa-solid fa-fire text-red-500"></i> Top Địa Điểm Được Yêu Thích Nhất</h2>
            <div class="space-y-4">
                <div v-for="(loc, index) in topFavorites" :key="index" 
                    class="flex items-center justify-between p-3 bg-gray-50 rounded-lg transition-all group">
                    <div class="flex items-center gap-3 overflow-hidden">
                        <span class="font-bold text-gray-300">#{{ index + 1 }}</span>
                        <p class="text-sm font-medium text-gray-700 truncate w-48">{{ loc.name }}</p>
                    </div>
                    <div class="flex items-center text-red-500 font-bold">
                        <span class="text-sm">{{ loc.favoriteCount }}</span>
                        <i class="fa-solid fa-heart ml-1 text-[10px]"></i>
                    </div>
                </div>
            </div>
        </div> 
    </div>

    <!--Bieu do dme so dia diem theo tinh-->
    <div class="p-4">
        <div class="bg-white p-6 rounded-lg shadow-md border-t-4 border-purple-500">
            <div class="flex items-center justify-between mb-6">
                <h2 class="text-gray-700 text-lg font-bold uppercase tracking-tight">Địa điểm theo Tỉnh thành</h2>
            </div>
            <div class="space-y-5">
                <div v-for="(item, index) in statsWithProgress" :key="index" class="group">
                    <div class="flex justify-between items-end mb-1">
                        <span class="text-sm font-semibold text-gray-600 group-hover:text-purple-600 transition-colors">
                            {{ item.provinceName }}
                        </span>
                        <span class="text-xs font-bold text-gray-400">
                            {{ item.count }} <span class="font-normal">địa điểm</span>
                        </span>
                    </div>
                    <div class="w-full bg-gray-100 rounded-full h-2.5 overflow-hidden">
                        <div 
                            class="h-full bg-purple-500 rounded-full transition-all duration-700 ease-in-out"
                            :style="{ width: item.percentage + '%' }"
                        ></div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>