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

    const visiblePage = computed(() => {
        const page = []
        const total = totalPage.value
        const current = currentPage.value
        const range = 1

        for(let i=1; i<=total; i++){
            if(i===1 || i===total || (i >= current - range && i <= current + range)) page.push(i)
            else if(i=== current - range - 1 || current + range + 1) page.push("...")
        }

        return page.filter((item, index, arr) => item !== "..." || arr[index - 1] !== "...");
    })

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
    
    //cap nhat dia diem
    const isUpdateModalOpen =  ref(false);
    const updateLocationData = ref({
        locationID: '',
        locationName: '',
        provinceID: '',
        categoryID: '',
        description: '',
    });

    const openUpdateModal = (location) => {
        updateLocationData.value = {
            locationID: location.locationID,
            locationName: location.name,
            provinceID: provinces.value.find(p => p.name === location.provinceName)?.provinceID || '',
            categoryID: categories.value.find(c => c.name === location.categoryName)?.categoryID || '',
            description: location.description
        }

        isUpdateModalOpen.value = true;
    }

    const updateLocation = async () => {
        try{
            const id = updateLocationData.value.locationID;
            const res = await apiService.put(`/location/${id}`, updateLocationData.value)
            await getAllLocations()
            isUpdateModalOpen.value = false
        }
        catch(err){
            const status = err.response?.status
            const message = err.response?.data?.message
            if(status === 400 || status === 409 || status === 500 || status === 404) {
                alert(message)
            }      
            else{
                alert("Lỗi hệ thống: " + err);
            }
        }
    }
    
    // quan ly anh
    const isImageModalOpen = ref(false);
    const isUploading = ref(false);
    const currentImages = ref([]); 
    const targetLocation = ref(null); 
    const selectedFiles = ref({});
    const imageDescription = ref('');

    // load anh cua dia diem
    const openImageManager = async (location) => {
        targetLocation.value = location;
        isImageModalOpen.value = true;
        await getLocationImage(location.locationID);
    };
    
    //lay hinh anh
    const getLocationImage = async (locationID) => {
        try {
            const res = await apiService.get(`/image/location/${locationID}`);
            currentImages.value = res.data;
        } catch (err) {
            console.error("Lỗi lấy danh sách ảnh:", err);
        }
    };

    // xu ly khi chon anh tu may tinh
    const onFileSelected = (event) => {
        selectedFiles.value = Array.from(event.target.files);
    };

    // upload anh
    const uploadImage = async () => {
        if (selectedFiles.value.length === 0) return alert("Phải chọn ảnh");
        
        isUploading.value = true;
        const formData = new FormData();
        selectedFiles.value.forEach(file => {
            formData.append('images', file); 
        });
        formData.append('locationID', targetLocation.value.locationID);
        formData.append('description', imageDescription.value);

        try {
            await apiService.post('/image', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            await fetchLocationImages(targetLocation.value.locationID); 
            selectedFiles.value = [];
            imageDescription.value = '';

        } catch (err) {
            alert("Lỗi upload: " + (err.response?.data?.message || err.message));
        } finally {
            isUploading.value = false;
        }
    };

    // xoa anh
    const deleteImage = async (imageID) => {
        if(!confirm("Xóa ảnh này là mất luôn đó, chắc chưa ní")) return;
        try {
            await apiService.delete(`/image/${imageID}`);
            currentImages.value = currentImages.value.filter(img => img.imageID !== imageID);
        } catch (err) {
            alert("Lỗi xóa ảnh");
        }
    };


    const isDetailModalOpen = ref(false);
    const locationDetails = ref([]);
    const targetDetailLocation = ref(null);
    const newDetailEntry = ref({ section: '', content: '' });

    const openDetailManager = async (location) => {
        targetDetailLocation.value = location;
        isDetailModalOpen.value = true;
        await getLocationDetails(location.locationID);
    };

    //lay chi tiet dia diem
    const getLocationDetails = async (locationID) => {
        try {
            const res = await apiService.get(`/location-detail/${locationID}`);
            locationDetails.value = res.data;
        } catch (err) {
            console.error("Lỗi lấy chi tiết:", err);
        }
    };

    // them chi tiet dia diem
    const addDetail = async () => {
        if (!newDetailEntry.value.section.trim() || !newDetailEntry.value.content.trim()) {
            return alert("Vui lòng điền đầy đủ thông tin");
        }

        try {
            await apiService.post('/location-detail/add', {
                locationID: targetDetailLocation.value.locationID,
                section: newDetailEntry.value.section,
                content: newDetailEntry.value.content
            });
            newDetailEntry.value = { section: '', content: '' }; // reset form
            await getLocationDetails(targetDetailLocation.value.locationID);
        } catch (err) {
            alert("Lỗi khi thêm chi tiết");
            console.log(err)
        }
    };

    // xoa chi tiet
    const deleteDetail = async (id) => {
        if (!confirm("Bạn có chắc chắn muốn xóa")) return;
        try {
            await apiService.delete(`/location-detail/delete/${id}`);
            locationDetails.value = locationDetails.value.filter(d => d.id !== id);
        } catch (err) {
            alert("Lỗi xóa chi tiết");
        }
    };


    // review manageemnt
    const isReviewModalOpen = ref(false);
    const locationReviews = ref([]);
    const targetReviewLocation = ref(null);

    const openReviewManager = async (location) => {
        targetReviewLocation.value = location;
        isReviewModalOpen.value = true;
        await getLocationReviewForAdmin(location.locationID);
    };

    //lay review theo dia diem
    const getLocationReviewForAdmin = async (locationID) => {
        try {
            const res = await apiService.get(`/review/admin/location/${locationID}`);
            locationReviews.value = res.data;
        } catch (err) {
            console.error("Lỗi", err);
        }
    };

    // xoa review
    const deleteReview = async (reviewID) => {
        if (!confirm("Bạn chắc chắn muốn xóa đánh giá này chứ?")) return;
        try {
            await apiService.delete(`/review/delete/${reviewID}`);
            locationReviews.value = locationReviews.value.filter(r => r.reviewID !== reviewID);
            await getAllLocations();
        } catch (err) {
            alert("Lỗi " + (err.response?.data?.message || err.message));
        }
    };

    const toggleStatus = async (review) => {
        const newStatus = review.status === 1 ? 0 : 1;
        try {
            await apiService.put(`/review/update/${review.reviewID}`, {
                status: newStatus
            });
            review.status = newStatus;
        } catch (err) {
            alert("Lỗi: " + err);
        }
    };

</script>

<template>
    <!-- Khung quan ly dia diem -->
    <div class="p-6">
        <div class="flex justify-between items-center mb-6">
            <div class="font-bold pt-3">
                <h1 class="text-2xl text-gray-500">Quản lý địa điểm</h1>
            </div> 
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
                <div class="w-1/5 flex justify-center gap-1">
                    <button @click="openUpdateModal(location)" title="Chỉnh sửa" class="p-2 text-blue-500 rounded-lg transition-colors cursor-pointer">
                        <i class="fa-solid fa-pen-to-square"></i>
                    </button>
                    <button @click="deleteLocation(location.locationID)" title="Xóa" class="p-2 text-red-500 rounded-lg transition-colors cursor-pointer">
                        <i class="fa-solid fa-trash"></i>
                    </button>
                    <button @click="openImageManager(location)" title="Quản lý ảnh" class="p-2 text-green-500 rounded-lg transition-colors cursor-pointer">
                        <i class="fa-solid fa-images"></i>
                    </button>
                    <button @click="openDetailManager(location)" class="p-2 text-purple-600 rounded-lg cursor-pointer" title="Quản lý Tab chi tiết">
                        <i class="fa-solid fa-rectangle-list"></i>
                    </button>
                    <button @click="openReviewManager(location)" title="Quản lý đánh giá" 
                        class="p-2 text-amber-500 rounded-lg transition-colors cursor-pointer">
                        <i class="fa-solid fa-star"></i>
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
                <button class="cursor-pointer" v-for="page in visiblePage" :key="page" @click="changePage(page)" 
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

    <!-- form cap nhat dia diem -->
    <div v-if="isUpdateModalOpen" class="fixed inset-0 z-50 flex items-center justify-center">
        <div class="absolute inset-0 bg-black/20" @click="isUpdateModalOpen = false"></div>
        <div class="bg-white rounded-xl shadow-2xl z-10 w-full max-w-lg overflow-hidden">
            <div class="px-6 py-4 border-b flex justify-between items-center">
                <h3 class="text-lg font-bold text-blue-800">Chỉnh sửa địa điểm</h3>
                <button @click="isUpdateModalOpen = false" class="text-gray-400 hover:text-red-500">
                    <i class="fa-solid fa-xmark text-xl"></i>
                </button>
            </div>
            <div class="p-6 space-y-4">
                <div>
                    <label class="block text-xs font-bold text-gray-500 mb-1 uppercase">Tên địa điểm</label>
                    <input type="text" v-model="updateLocationData.locationName" class="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none text-sm"/>
                </div>
                <div class="grid grid-cols-2 gap-4">
                    <div>
                        <label class="block text-xs font-bold text-gray-500 mb-1 uppercase">Tỉnh thành</label>
                        <select class="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none text-sm" v-model="updateLocationData.provinceID">
                            <option v-for="province in provinces" :key="province.provinceID" :value="province.provinceID">{{ province.name }}</option>
                        </select>
                    </div>
                    <div>
                        <label class="block text-xs font-bold text-gray-500 mb-1 uppercase">Loại hình</label>
                        <select class="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none text-sm" v-model="updateLocationData.categoryID">
                            <option v-for="category in categories" :key="category.categoryID" :value="category.categoryID">{{ category.name }}</option>
                        </select>
                    </div>
                </div>
                <div>
                    <label class="block text-xs font-bold text-gray-500 mb-1 uppercase">Mô tả</label>
                    <textarea v-model="updateLocationData.description" rows="4" class="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none text-sm"></textarea>
                </div>
            </div>
            <div class="px-6 py-4 bg-gray-50 border-t flex justify-end gap-3">
                <button @click="isUpdateModalOpen = false" class="px-4 py-2 text-sm font-semibold text-gray-600">Hủy</button>
                <button type="submit" @click="updateLocation" class="px-6 py-2 bg-blue-600 text-white rounded-lg text-sm font-bold hover:bg-blue-700 shadow-md">Cập nhật thay đổi</button>
            </div>
        </div>
    </div>

    <!-- Form them anh -->
    <div v-if="isImageModalOpen" class="fixed inset-0 z-[60] flex items-center justify-center p-4">
        <div class="absolute inset-0 bg-black/20" @click="isImageModalOpen = false"></div>
        <div class="bg-white rounded-2xl shadow-2xl z-10 w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
            <div class="p-6 border-b flex justify-between items-center">
                <h3 class="text-xl font-bold text-gray-800">Album ảnh: {{ targetLocation?.name }}</h3>
                <button @click="isImageModalOpen = false" class="text-gray-400 hover:text-red-500 text-2xl">&times;</button>
            </div>

            <div class="p-6 overflow-y-auto flex-1">
                <div class="mb-8 p-4 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
                    <div class="flex flex-col gap-4">
                        <div>
                            <label class="block text-xs font-bold text-gray-400 mb-1 uppercase">Chọn ảnh</label>
                            <input type="file" @change="onFileSelected" accept="image/*" class="text-sm text-gray-500 file:mr-4 
                            file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-green-50
                             file:text-green-700 hover:file:bg-green-100 cursor-pointer w-full" multiple/>
                        </div>
                        <div>
                            <label class="block text-xs font-bold text-gray-400 mb-1 uppercase">Mô tả ảnh</label>
                            <input v-model="imageDescription" type="text" placeholder="Nhập mô tả..." class="w-full border rounded-lg px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-green-500"/>
                        </div>
                        <button @click="uploadImage" :disabled="isUploading" class="bg-green-600 text-white px-6 py-2 rounded-lg font-bold text-sm hover:bg-green-700 disabled:opacity-50 w-3/10 items-center mx-auto">
                            {{ isUploading ? 'Đang tải...' : 'Upload' }}
                        </button>
                    </div>
                </div>

                <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                    <div v-for="img in currentImages" :key="img.imageID" class="group relative aspect-square rounded-xl overflow-hidden bg-gray-100 border">
                        <img :src="img.imageURL" class="w-full h-full object-cover" />
                        <div class="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <button @click="deleteImage(img.imageID)" class="p-2 text-red-500">
                                <i class="fa-solid fa-trash text-sm"></i>
                            </button>
                        </div>
                    </div>
                    <div v-if="currentImages.length === 0" class="col-span-full py-10 text-center text-gray-400">
                        Chưa có ảnh nào cho địa điểm này.
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- Form them chi tiet dia diem -->
    <div v-if="isDetailModalOpen" class="fixed inset-0 z-[60] flex items-center justify-center p-4">
        <div class="absolute inset-0 bg-black/20" @click="isDetailModalOpen = false"></div>
        <div class="bg-white rounded-2xl shadow-2xl z-10 w-full max-w-2xl max-h-[85vh] overflow-hidden flex flex-col">
            
            <div class="p-5 border-b bg-purple-50 flex justify-between items-center">
                <div>
                    <h3 class="text-lg font-bold text-purple-900">Chi tiết địa điểm: {{ targetDetailLocation?.name }}</h3>
                </div>
                <button @click="isDetailModalOpen = false" class="text-gray-400 hover:text-red-500 text-2xl">&times;</button>
            </div>

            <div class="p-6 overflow-y-auto flex-1 space-y-6 custom-scrollbar">
                
                <div class="p-4 bg-gray-50 rounded-xl border-2 border-dashed border-purple-200 space-y-3">
                    <h4 class="text-xs font-bold text-gray-500 uppercase flex items-center gap-2">
                        <i class="fa-solid fa-circle-plus text-purple-500"></i> Thêm mục mới
                    </h4>
                    <input v-model="newDetailEntry.section" type="text" placeholder="Tiêu đề (VD: Lịch sử, Giá vé, Cách đi...)" 
                        class="w-full border rounded-lg px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-purple-400"/>
                    <textarea v-model="newDetailEntry.content" rows="4" placeholder="Nội dung.." 
                        class="w-full border rounded-lg px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-purple-400"></textarea>
                    <button @click="addDetail" class="w-full bg-purple-600 text-white py-2.5 rounded-lg font-bold hover:bg-purple-700 shadow-md transition-all active:scale-95">
                        Lưu 
                    </button>
                </div>

                <div class="space-y-3">
                    <h4 class="text-xs font-bold text-gray-500 uppercase">Thông tin chi tết ({{ locationDetails.length }})</h4>
                    <div v-if="locationDetails.length === 0" class="text-center py-10 text-gray-400 text-sm">
                        Chưa có thông tin chi tiết cho địa điểm này
                    </div>
                    <div v-for="item in locationDetails" :key="item.id" 
                         class="group border rounded-xl p-4 bg-white hover:border-purple-300 transition-all shadow-sm">
                        <div class="flex justify-between items-start mb-2">
                            <span class="px-2 py-1 bg-purple-100 text-purple-700 rounded text-[10px] font-bold uppercase">
                                {{ item.section }}
                            </span>
                            <button @click="deleteDetail(item.id)" class="text-gray-300 hover:text-red-500 transition-colors">
                                <i class="fa-solid fa-trash-can text-sm"></i>
                            </button>
                        </div>
                        <p class="text-gray-600 text-xs line-clamp-3 leading-relaxed">{{ item.content }}</p>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- Form review -->
    <div v-if="isReviewModalOpen" class="fixed inset-0 z-[60] flex items-center justify-center p-4">
        <div class="absolute inset-0 bg-black/20" @click="isReviewModalOpen = false"></div>
        <div class="bg-white rounded-2xl shadow-2xl z-10 w-full max-w-3xl max-h-[80vh] overflow-hidden flex flex-col">
            
            <div class="p-5 border-b bg-amber-50 flex justify-between items-center">
                <div>
                    <h3 class="text-lg font-bold text-amber-900">Đánh giá địa điểm: {{ targetReviewLocation?.name }}</h3>
                    <p class="text-xs text-amber-700">Tổng cộng: {{ locationReviews.length }} lượt đánh giá</p>
                </div>
                <button @click="isReviewModalOpen = false" class="text-gray-400 hover:text-red-500 text-2xl">&times;</button>
            </div>

            <div class="p-6 overflow-y-auto flex-1 space-y-4 custom-scrollbar bg-gray-50">
                <div v-if="locationReviews.length === 0" class="text-center py-20 text-gray-400">
                    <i class="fa-regular fa-comment-dots text-4xl mb-3 block"></i>
                    Chưa có đánh giá nào cho địa điểm này.
                </div>
                <div v-for="rev in locationReviews" :key="rev.reviewID" 
                     class="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex gap-4 group">
                    <img :src="rev.avatar || 'https://ui-avatars.com/api/?name=' + rev.fullname" 
                         class="w-12 h-12 rounded-full border shadow-sm object-cover">
                    <div class="flex-1 min-w-0">
                        <div class="flex justify-between items-start">
                            <div>
                                <h4 class="font-bold text-gray-800 text-sm">{{ rev.fullname }}</h4>
                                <div class="flex gap-1 text-[10px] text-yellow-400">
                                    <i v-for="s in 5" :key="s" :class="s <= rev.rating ? 'fa-solid fa-star' : 'fa-regular fa-star'"></i>
                                </div>
                            </div>
                            <span class="text-[10px] text-gray-400 font-medium">
                                {{ new Date(rev.createdAt).toLocaleDateString('vi-VN') }}
                            </span>
                        </div>
                        <p class="text-gray-600 text-xs mt-2 leading-relaxed">
                            "{{ rev.comment || 'Không có nội dung bình luận.' }}"
                        </p>
                    </div>
                    <div class="flex items-center gap-3 border-l pl-4">
                        <div class="flex flex-col items-center gap-1">
                            <label class="relative inline-flex items-center cursor-pointer">
                                <input type="checkbox" :checked="rev.status === 1" @change="toggleStatus(rev)"class="sr-only peer">
                                <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
                            </label>
                            <span class="text-[9px] font-bold uppercase" :class="rev.status === 1 ? 'text-green-600' : 'text-gray-400'">
                                {{ rev.status === 1 ? 'Hiện' : 'Ẩn' }}
                            </span>
                        </div>
                        <button @click="deleteReview(rev.reviewID)" 
                                class="p-2 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                                title="Xóa vĩnh viễn"><i class="fa-solid fa-trash-can text-sm"></i>
                        </button>
                    </div> 
                </div>
            </div>
        </div>
    </div>
    
    <div class="text-red-500 ml-5 flex mb-10">
        <p>Ảnh của các địa điểm được lưu trên clouldinary
            <a href="https://console.cloudinary.com/app/c-c97c604e6dac79dc2ca32d239feff8/assets/media_library/folders/ce6c9520c8890c047661d167770e84597d?view_mode=mosaic" 
            class="text-blue-500 underline" target="blank">Tại đây</a></p>
    </div>
</template>