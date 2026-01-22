<script setup>
    import { ref, onMounted } from 'vue';
    import apiService from '@/services/APIService';

    //xoa dia diem
    const deleteLocation = async () => {
        
    }

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

    onMounted(() => {
        getAllProvinces();
        getAllCategories();
    })


    //them dia diem
    const isModalOpen = ref(false);

    const newLocation = ref({
        name: '',
        provinceID: '',
        category: '',
        description: '',
        image: ''
    });

    const toggleModal = () => {
        isModalOpen.value = !isModalOpen.value;
    };

    const createLocation = () => {
        console.log("Dữ liệu lưu:", newLocation.value);
        // Viết logic gọi API POST ở đây
        toggleModal(); // Đóng modal sau khi lưu
    };

</script>

<template>
    <!-- Khung quan ly dia diem -->
    <div class="p-6">
        <div class="flex justify-between items-center mb-6">
            <h1 class="text-2xl font-bold text-gray-800">Quản lý địa điểm</h1>
            <button class="bg-green-600 hover:bg-green-500 text-white px-4 py-2 rounded-lg flex 
            items-center transition-all gap-2 " @click="toggleModal"><i class="fa-solid fa-plus"></i> Thêm địa điểm</button>
        </div>
        <div class="bg-white p-4 border-b flex gap-4 shadow-sm">
            <div class="relative w-1/3">
                <i class="fa-solid fa-magnifying-glass absolute left-3 top-3 text-gray-400"></i>
                <input type="text" placeholder="Tìm kiếm địa điểm..." class="pl-10 pr-4 py-2 border rounded-lg w-full focus:ring-2 focus:ring-green-500 outline-none" />
            </div>
            <select class="border rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-green-500">
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
            <div class="flex items-center px-6 py-4 hover:bg-green-50/50 transition-colors group ">
                <div class="w-1/5">
                    <p class="font-semibold text-gray-800 transition-colors">Vịnh Hạ Long</p>
                    <p class="text-xs text-gray-400 mt-1">ID: #1024</p>
                </div>
                <div class="w-32">
                    <span class="py-1 font-medium">Quảng Ninh</span>
                </div>
                <div class="w-32">
                    <span class="py-1 font-medium">Biển đảo</span>
                </div>
                <div class="flex-1">
                    <span class="py-1 font-medium line-clamp-2">Vịnh Hạ Long là một vịnh nhỏ thuộc phần bờ tây vịnh Bắc Bộ tại khu vực biển Đông Bắc Việt Nam, bao gồm vùng biển đảo của thành phố Hạ Long thuộc tỉnh Quảng Ninh.</span>
                </div>
                <div class="w-1/5 flex justify-center gap-3">
                    <button title="Chỉnh sửa" class="p-2 text-blue-500 rounded-lg transition-colors">
                        <i class="fa-solid fa-pen-to-square"></i>
                    </button>
                    <button title="Xóa" class="p-2 text-red-500 rounded-lg transition-colors">
                        <i class="fa-solid fa-trash"></i>
                    </button>
                </div>
            </div>
        </div>
        <div class="flex justify-between items-center mt-6 text-sm text-gray-500">
            <p>Hiển thị 1 - 10 của <span class="font-bold text-gray-800">300</span> địa điểm</p>
            <div class="flex gap-2">
                <button class="px-4 py-2 border rounded-lg hover:bg-gray-100 disabled:opacity-50">Trước</button>
                <button class="px-4 py-2 bg-green-600 text-white rounded-lg font-medium">1</button>
                <button class="px-4 py-2 border rounded-lg hover:bg-gray-100">Tiếp</button>
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
                    <input type="text" v-model="newLocation.name" placeholder="Nhập tên địa điểm" class="w-full border rounded-lg
                     px-4 py-2 outline-none focus:ring-2 focus:ring-green-500 text-sm"/>
                </div>
                <div class="grid grid-cols-2 gap-4">
                    <div>
                        <label class="block text-xs font-bold text-gray-500 tracking-wider mb-1">Tỉnh thành</label>
                        <select class="w-full border rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-green-500 text-sm" v-model="newLocation.provinceID">
                            <option value="">Tất cả tỉnh thành</option>
                            <option v-for="province in provinces" :key="province.provinceID" :value="province.provinceID">{{ province.name }}</option>
                        </select>
                    </div>
                    <div>
                        <label class="block text-xs font-bold text-gray-500 tracking-wider mb-1">Loại hình</label>
                        <select class="w-full border rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-green-500 text-sm" v-model="newLocation.provinceID">
                            <option value="">Tất cả loại hình</option>
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
                <button @click="createLocation" class="px-6 py-2 bg-green-600 text-white rounded-lg text-sm font-bold
                 hover:bg-green-500 shadow-md transition-all">Lưu thông tin</button>
            </div>
        </div>
    </div>
</template>