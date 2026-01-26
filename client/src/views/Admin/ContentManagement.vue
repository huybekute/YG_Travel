<script setup>
    import { ref, onMounted, computed, watch } from 'vue';
    import apiService from '@/services/APIService';

    //loc danh sach   
    const searchQuery = ref('');
    const selectedProvince = ref('');

    const filteredLocations = computed(() => {
        return locations.value.filter(loc => {
            const matchSearch = loc.name.toLowerCase().includes(searchQuery.value.toLowerCase());
            const matchProvince = selectedProvince.value === '' || 
                loc.provinceName == provinces.value.find(p => p.provinceID == selectedProvince.value)?.name;
            return matchSearch && matchProvince;
        });
    });

    //hien thi danh sach 10/1 page
    const currentPage = ref(1);
    const itemPerPage = 10;

    //ds dia diem hien thi cho trang hien tai
    const listLocationCurrentPage = computed(() => {
        const start = (currentPage.value - 1 ) * itemPerPage
        const end = start + itemPerPage
        return filteredLocations.value.slice(start, end);
    })

    //tong so trang
    const totalPage = computed(() => {
        return Math.ceil(filteredLocations.value.length / itemPerPage);
    })

    //chuyen trang

    const changePage = (page) => {
        if(page >=1  && page <= totalPage.value){
            currentPage.value = page;
        }
    }

    //tu quay lai dau trang khi loc
    watch([searchQuery, selectedProvince], () => {
        currentPage.value = 1;
    });


    //lay danh sach tat ca tinh
    const provinces = ref([])
    const getAllProvinces = async () => {
        try{
            const res = await apiService.get("/province");
            if(res.data){
                provinces.value = res.data;
            }
        }
        catch(error){
            const status = error.response?.status;
            const message = error.response?.data?.message;

            if(status === 500) {
                console.log(message)
            }
            else{
                console.log("Lỗi hệ thống" + error);
            }
        }
        
    }

    const categories = ref([]);
    //lay danh sach the loai
    const getAllCategories = async () => {
        try{
            const res = await apiService.get("/category");
            if(res.data){
                categories.value = res.data;
            }
        }
        catch(error){
            const status = error.response?.status;
            const message = error.response?.data?.message;

            if(status === 500) {
                console.log(message)
            }
            else{
                console.log("Lỗi hệ thống" + error);
            }
        }
    }

    const locations = ref([]);
    //lay danh sach dia diem
    const getAllLocations = async () => {
        try{
            const res = await apiService.get("/location");
            if(res.data){
                locations.value = res.data;
            }
        }
        catch(error){
            const status = error.response?.status;
            const message = error.response?.data?.message;

            if(status === 500) {
                console.log(message)
            }
            else{
                console.log("Lỗi hệ thống" + error);
            }
        }
    }

    onMounted(() => {
        getAllProvinces();
        getAllCategories();
        getAllLocations();
    })


    //them dia diem
    const isModalOpen = ref(false);

    const newLocation = ref({
        locationName: '',
        provinceID: '',
        categoryID: '',
        description: '',
    });

    const toggleModal = () => {
        isModalOpen.value = !isModalOpen.value;
    };

    const addLocation = async () => {
        if(!newLocation.value.locationName.trim() || !newLocation.value.provinceID || !newLocation.value.categoryID) {
            alert("Vui lòng nhập đầy đủ thông tin!");
            return;
        }

        try{
            const res = await apiService.post("/location/", newLocation.value);
            await getAllLocations();
            toggleModal();
            newLocation.value = { locationName: '', provinceID: '', categoryID: '', description: '' };
        }
        catch(err) {
            const status = err.response?.status
            const message = err.response?.data?.message

            if(status === 400){
                alert(message)
            }

            else if(status === 409){
                alert(message)
            }

            else if(status === 500){
                alert(message)
            }

            else {
                alert("Lỗi hệ thống. Vui lòng thử lại sau")
            }
        }
    };


    //xoa dia diem
    const deleteLocation = async (locationID) => {
        if(!confirm("Bạn có chắc chắn muốn xóa địa điểm này không")) return;
        try{
            const res = await apiService.delete(`/location/${locationID}`)
            await getAllLocations();
        }
        catch(err){
            const status = err.response?.status
            const message = err.response?.data?.message
            if(status === 409 || status === 500){
                alert(message)
            }
            else{
                alert("Lỗi xóa " + err);
            }
        }
    }
    
    
    
</script>

<template>
    <!-- Khung quan ly dia diem -->
    <div class="p-6">
        <div class="flex justify-between items-center mb-6">
            <h1 class="text-2xl font-bold text-gray-800">Quản lý địa điểm</h1>
            <button class="bg-green-600 hover:bg-green-500 text-white px-4 py-2 rounded-lg flex 
            items-center transition-all gap-2 cursor-pointer" @click="toggleModal"><i class="fa-solid fa-plus"></i> Thêm địa điểm</button>
        </div>
        <div class="bg-white p-4 border-b flex gap-4 shadow-sm">
            <div class="relative w-1/3">
                <i class="fa-solid fa-magnifying-glass absolute left-3 top-3 text-gray-400"></i>
                <input v-model="searchQuery" type="text" placeholder="Tìm kiếm địa điểm..." class="pl-10 pr-4 py-2 border rounded-lg w-full focus:ring-2 focus:ring-green-500 outline-none" />
            </div>
            <select v-model="selectedProvince" class="border rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-green-500">
                <option value="">Tất cả tỉnh thành</option>
                <option v-for="province in provinces" :key="province.provinceID" :value="province.provinceID">{{ province.name }}</option>
            </select>
        </div>
        <div class="bg-gray-50 flex items-center px-6 py-3 text-xs font-bold text-gray-500 border-x tracking-wider ">
            <div class="w-1/5">TÊN ĐỊA ĐIỂM </div>
            <div class="w-32">TÊN TỈNH</div>
            <div class="w-32">LOẠI HÌNH</div>
            <div class="flex-1 flex justify-center">MÔ TẢ</div>
            <div class="w-1/5 flex justify-center">HÀNH ĐỘNG</div>
        </div>
        <div class="bg-white border shadow-sm divide-y">
            <div class="flex items-center px-6 py-4 hover:bg-green-100 transition-colors group"
            v-for="location in listLocationCurrentPage" :key="location.locationID">
                <div class="w-1/5">
                    <p class="font-semibold text-gray-800 transition-colors">{{ location.name }}</p>
                    <p class="text-xs text-gray-400 mt-1">#{{ location.locationID }}</p>
                </div>
                <div class="w-32">
                    <span class="py-1 font-medium">{{ location.provinceName }}</span>
                </div>
                <div class="w-32">
                    <span class="py-1 font-medium">{{ location.categoryName }}</span>
                </div>
                <div class="flex-1 justify-center items-center flex">
                    <span class="py-1 font-medium line-clamp-2">{{ location.description }}</span>
                </div>
                <div class="w-1/5 flex justify-center gap-3">
                    <button title="Chỉnh sửa" class="p-2 text-blue-500 rounded-lg transition-colors cursor-pointer">
                        <i class="fa-solid fa-pen-to-square"></i>
                    </button>
                    <button @click="deleteLocation(location.locationID)" title="Xóa" class="p-2 text-red-500 rounded-lg transition-colors cursor-pointer">
                        <i class="fa-solid fa-trash"></i>
                    </button>
                </div>
            </div>
        </div>
        <div class="flex justify-between items-center mt-6 text-sm text-gray-500">
            <p>Hiển thị {{ filteredLocations.length > 0 ? (currentPage - 1) * itemPerPage + 1 : 0 }} - 
        {{ Math.min(currentPage * itemPerPage, filteredLocations.length) }} của <span class="font-bold text-gray-800">{{ filteredLocations.length }}</span> địa điểm</p>
            <div class="flex gap-2">
                <button @click="changePage(currentPage - 1)" :disabled="currentPage === 1" class="px-4 py-2 border rounded-lg 
                hover:bg-gray-100 disabled:opacity-50 cursor-pointer">Trước</button>
                <button class="cursor-pointer" v-for="page in totalPage" :key="page" @click="changePage(page)" 
                :class="['px-4 py-2 rounded-lg font-medium', 
                currentPage === page ? 'bg-green-600 text-white' : 'border hover:bg-gray-100']">{{ page }}</button>
                <button @click="changePage(currentPage + 1)" :disabled="currentPage === totalPage || totalPage === 0"
                class="px-4 py-2 border rounded-lg hover:bg-gray-100 disabled:opacity-50 cursor-pointer">Tiếp</button>
            </div>
        </div>
    </div>

    <!-- Form them dia diem -->
    <div v-if="isModalOpen" class="fixed inset-0 z-50 flex items-center justify-center">
        <div class="absolute inset-0 bg-black/10" @click="toggleModal"></div>
        <div class="bg-white rounded-xl shadow-2xl z-10 w-full max-w-lg overflow-hidden transform transition-all">
            <div class="px-6 py-4 border-b flex justify-between items-center bg-gray-50">
                <h3 class="text-lg font-bold text-gray-800">Thêm địa điểm mới</h3>
                <button @click="toggleModal" class="text-gray-400 hover:text-red-500">
                        <i class="fa-solid fa-xmark text-xl"></i></button>
            </div>
            <div class="p-6 space-y-4">
                <div>
                    <label class="block text-xs font-bold text-gray-500 tracking-wider mb-1">Tên địa điểm</label>
                    <input type="text" v-model="newLocation.locationName" placeholder="Nhập tên địa điểm" class="w-full border rounded-lg
                     px-4 py-2 outline-none focus:ring-2 focus:ring-green-500 text-sm"/>
                </div>
                <div class="grid grid-cols-2 gap-4">
                    <div>
                        <label class="block text-xs font-bold text-gray-500 tracking-wider mb-1">Tỉnh thành</label>
                        <select class="w-full border rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-green-500 text-sm" v-model="newLocation.provinceID">
                            <option value="" selected disabled>Tất cả tỉnh thành</option>
                            <option v-for="province in provinces" :key="province.provinceID" :value="province.provinceID">{{ province.name }}</option>
                        </select>
                    </div>
                    <div>
                        <label class="block text-xs font-bold text-gray-500 tracking-wider mb-1">Loại hình</label>
                        <select class="w-full border rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-green-500 text-sm" v-model="newLocation.categoryID">
                            <option value="" selected disabled>Tất cả loại hình</option>
                            <option v-for="category in categories" :key="category.categoryID" :value="category.categoryID">{{ category.name }}</option>
                        </select>
                    </div>
                </div>
                <div>
                    <label class="block text-xs font-bold text-gray-500 tracking-wider mb-1">Mô tả</label>
                    <textarea v-model="newLocation.description" rows="3" class="w-full border rounded-lg px-4 py-2 outline-none 
                    focus:ring-2 focus:ring-green-500 text-sm" placeholder="Nhập mô tả..."></textarea>
                </div>
            </div>
            <div class="px-6 py-4 bg-gray-50 border-t flex justify-end gap-3">
                <button @click="toggleModal" class="px-4 py-2 text-sm font-semibold text-gray-600 hover:text-gray-800">Hủy</button>
                <button @click="addLocation" class="px-6 py-2 bg-green-600 text-white rounded-lg text-sm font-bold
                 hover:bg-green-500 shadow-md transition-all">Lưu thông tin</button>
            </div>
        </div>
    </div>
</template>