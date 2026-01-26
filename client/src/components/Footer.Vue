<script setup>
    import { ref, onMounted, computed } from 'vue';
    import apiService from '@/services/APIService';
    import { useRoute } from 'vue-router';
    
    const route = useRoute();
    const countUser = ref(0);
    const getCountMember = async () => {
        try{
            const resUser = await apiService.get("/user/countUser");
            if(resUser.data){
                countUser.value = resUser.data.total;
            }
        }
        catch(err){
            console.log("Lỗi hệ thống"); 
        }
    }

    onMounted(() => {
        getCountMember();
    })

    const isAdminPage = computed(() => route.path.startsWith('/admin'));

    

</script>

<template>
    <div class="bg-[#0d162c] pt-10 pb-5 px-10" v-if="!isAdminPage">
        <div class="flex text-white gap-20 px-10 pb-10">
            <div class="flex flex-col w-1/4 gap-4">
                <h1 class="font-bold text-xl ">YG Travel</h1>
                <p class="text-gray-400 leading-relaxed">Nơi mỗi điểm đến là một câu chuyện riêng. 
                    Cùng chúng tôi viết nên hành trình của bạn.</p>
                <div class="flex gap-4 text-gray-400 ">
                    <a href="http://facebook.com/KingYG1804/" class="hover:text-green-400 transition-colors" 
                    target="blank"><i class="fa-brands fa-facebook"></i></a>
                    <a href="https://www.youtube.com/" class="hover:text-green-400 transition-colors"
                    target="blank"><i class="fa-brands fa-youtube"></i></a>
                    <a href="https://www.instagram.com/nguyenpyke/" class="hover:text-green-400 transition-colors"
                    target="blank"><i class="fa-brands fa-instagram"></i></a>
                </div>
            </div>
            <div class="flex flex-col w-1/4 gap-4">
                <h1 class="font-bold text-xl">Về chúng tôi</h1>
                <div class="flex flex-col gap-2 text-gray-400">
                    <p class="hover:text-green-400 transition-colors">300+ Địa điểm tham quan</p>
                    <p class="hover:text-green-400 transition-colors">34 Tỉnh thành Việt Nam</p>
                    <p class="hover:text-green-400 transition-colors">{{ countUser }}+ thành viên</p>

                </div>
            </div>
            <div class="flex flex-col w-1/4 gap-4">
                <h1 class="font-bold text-xl ">Điểm Đến Nổi Bật</h1>
                <div class="flex flex-col gap-2 text-gray-400">
                    <p class="hover:text-green-400 transition-colors">Vịnh Hạ Long</p>
                    <p class="hover:text-green-400 transition-colors">Bến Ninh Kiều</p>
                    <p class="hover:text-green-400 transition-colors">Tuy Hòa</p>
                    <p class="hover:text-green-400 transition-colors">Phan Thiết</p>
                </div>    
            </div>
            <div class="flex flex-col w-1/4 gap-4">
                <h1 class="font-bold text-xl">Thông Tin Liên Hệ</h1>
                <div class="flex flex-col gap-2 text-gray-400">
                    <p class="hover:text-green-400 transition-colors"><i class="fa-solid fa-location-dot 
                        text-green-600/80 pr-2"></i><span>216 Tầm Vu, P. Tân An, TP. Cần Thơ</span></p>
                    <a href="tel:0393244131" class="hover:text-green-400 transition-colors">
                        <i class="fa-solid fa-phone text-green-600/80 pr-2"></i><span>0393244131</span></a>
                    <a href="mailto:huynguyen.2764@gmail.com" class="hover:text-green-400 transition-colors">
                        <i class="fa-solid fa-envelope text-green-600/80 pr-2"></i><span>huynguyen.2764@gmail.com</span></a>
                </div>
            </div>
        </div>
        <div class="border-b border-green-500/20"></div>
        <div class="flex text-gray-400  justify-between px-10 pt-10 pb-5">
            <div class="">
                <p>&copy; 2026 YG Travel. All rights reserved.</p>
            </div>
            <div class="flex gap-10">
                <RouterLink class="hover:text-green-400 transition-colors" to="/dieu-khoan-dich-vu">Điều khoản dịch vụ</RouterLink>
                <RouterLink class="hover:text-green-400 transition-colors" to="/chinh-sach-bao-mat">Chinh sách bảo mật</RouterLink>
            </div>
        </div>
    </div>
</template>