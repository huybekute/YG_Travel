<script setup>
  import { ref, onMounted, onUnmounted, computed } from 'vue';
  import { useRoute } from 'vue-router';
  
  const route = useRoute()

  const isScrolled = ref(false);
  const handleScroll = () => {
    isScrolled.value = window.scrollY > 20; 
  };
  onMounted(() => {
    window.addEventListener('scroll', handleScroll);
  });

  onUnmounted(() => {
    window.removeEventListener('scroll', handleScroll);
  });
  const isAdminPage = computed(() => route.path.startsWith('/admin'));

  const isHomePage = computed(() => route.path === '/')

</script>

<template>
    <div class="flex sticky w-full top-0 z-50" v-if="!isAdminPage" :class="isHomePage ? 'bg-[#0f1c17]' : 'bg-white shadow-md'">
        <div class="flex items-center gap-5 justify-between w-full pr-20 transition-all duration-300" 
        :class="isScrolled ? 'h-16 py-3' : 'py-10 h-24'">
            <div>
                <RouterLink to="/">
                  <img v-if="isHomePage" src="/Home/LogoHome.png" alt="YG Travel" class="w-40 pl-5">
                  <img v-else src="/Logo.jpg" alt="YG Travel" class="w-40 pl-5 ">
                </RouterLink>
                
            </div>
            <div class="flex items-center gap-5 text-lg  rounded-full px-1 py-1 transition-colors"  
            :class="isHomePage ? 'bg-[#1c2b25] text-gray-300 hover:text-white' : 'bg-[#f7f7f5] border border-gray-200'">
                <RouterLink to="/" class="px-4 py-2 rounded-full transition-colors "
                active-class="bg-green-600 text-white">Trang Chủ</RouterLink>
                <RouterLink to="/gioi-thieu" class="px-4 py-2 rounded-full transition-colors"
                active-class="bg-green-600">Giới Thiệu</RouterLink>
                <RouterLink to="/travel-map" class="px-4 py-2 rounded-full transition-colors"
                active-class="bg-green-600 ">Travel Map</RouterLink>
                <RouterLink to="/diem-den" class="px-4 py-2 rounded-full transition-colors"
                active-class="bg-green-600">Điểm Đến</RouterLink>
                <RouterLink to="/lien-he" class="px-4 py-2 rounded-full transition-colors"
                active-class="bg-green-600">Liên Hệ</RouterLink>
            </div>
            <div class="relative group">
                  <RouterLink to="/auth" class="flex items-center justify-center w-10 h-10 " :class="isHomePage ? 'text-white': 'text-black'">
                    <i class="fa-solid fa-user pr-1 shake-icon text-2xl"></i> <span class="pt-3">▾</span></RouterLink>
                    <div class="absolute flex-col hidden group-hover:flex group-hover:flex-col bg-white 
                    items-center shadow-lg w-40 rounded-md left-1/2 -translate-x-1/2 z-10 gap-2">
                        <RouterLink to ="/auth/dang-nhap" class="">Đăng nhập</RouterLink>
                        <RouterLink to ="/auth/dang-ky" class="" >Đăng ký</RouterLink>
                        <!-- <RouterLink to ="" class="p-2 my-4 rounded-md w-4/5 text-center bg-blue-600 
                        hover:bg-blue-700 text-white font-medium">Thông tin tài khoản</RouterLink>
                        <RouterLink to ="" class="p-2 mb-4 rounded-md w-4/5 text-center bg-blue-600 
                        hover:bg-blue-700 text-white font-medium" >Bảng điều khiển</RouterLink>
                        <button class="p-2 mb-4 rounded-md w-4/5 text-center bg-blue-600 
                        hover:bg-blue-700 text-white font-medium">Đăng xuất</button> -->
                    </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
@keyframes shake {
  0%   { transform: rotate(0deg); }
  25%  { transform: rotate(-8deg); }
  50%  { transform: rotate(8deg); }
  75%  { transform: rotate(-8deg); }
  100% { transform: rotate(0deg); }
}

.shake-icon {
  display: inline-block;
  animation: shake 0.8s infinite ease-in-out;
}
</style>