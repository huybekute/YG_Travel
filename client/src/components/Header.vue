<script setup>
  import { ref, onMounted, onUnmounted, computed } from 'vue';
  import { useRoute } from 'vue-router';
  import { useRouter } from 'vue-router';
  import useAuthStore from '@/stores/authStore'
  
  const route = useRoute()
  const router = useRouter()
  const authStore = useAuthStore()

  const dangXuat = () => {
    authStore.logout();
    router.push("/");
  }


  // hieu ung cuon thanh header
  const isScrolled = ref(false);
  const isChanging = ref(false);

  const handleScroll = () => {
    const scrollPos = window.scrollY;
    if(scrollPos > 50 && !isScrolled.value){
      isChanging.value = true;
      setTimeout(() => {
        isScrolled.value = true;
        isChanging.value = false;
      }, 500);
    }
    else if (scrollPos <= 50 && isScrolled.value){
      isScrolled.value = false;
      isChanging.value = false;
    }
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
    <div v-if="!isAdminPage" class="w-full top-0 z-50 transition-all duration-700 ease-in-out" 
      :class="[isHomePage ? 'fixed bg-transparent backdrop-blur-[2px]' : 'sticky bg-white shadow-md', isChanging ? 'opacity-0 -translate-y-full' : 'opacity-100 translate-y-0']">
        <div class="flex items-center gap-5 justify-between w-full pr-20 transition-all duration-700" 
        :class="isScrolled ? 'h-16 py-5' : 'py-10 h-24'">
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
                    <i class="fa-solid fa-user pr-1 shake-icon text-2xl" v-if="!authStore.isLogIn"></i>
                    <p class="text-lg" v-else>{{ authStore.username }}</p> 
                    <span class="pt-2">▾</span></RouterLink>
                    <div class="absolute flex-col hidden group-hover:flex group-hover:flex-col bg-white 
                    items-center shadow-lg w-46 rounded-md left-1/2 -translate-x-1/2 z-10">
                        <RouterLink to="/auth/dang-nhap" class="flex items-center justify-center w-full px-4 py-3 text-gray-700 
                        hover:text-green-600 transition-colors hover:bg-green-100" v-if="!authStore.isLogIn"><span class="text-md font-medium">Đăng nhập</span></RouterLink>
                        <RouterLink to="/auth/dang-ky" class="flex items-center hover:bg-green-100 justify-center w-full  px-4 py-3 text-gray-700 
                        hover:text-green-600 transition-colors " v-if="!authStore.isLogIn"><span class="text-md font-medium">Đăng ký</span></RouterLink>
                        <RouterLink to="/thong-tin-tai-khoan" class="flex items-center hover:bg-green-100 justify-center w-full  px-4 py-3 text-gray-700 
                        hover:text-green-600 transition-colors" v-if="authStore.isLogIn" ><span class="text-md font-medium">Thông tin tài khoản</span></RouterLink>
                        <RouterLink to="/admin" class="flex items-center hover:bg-green-100 justify-center w-full  px-4 py-3 text-gray-700 
                        hover:text-green-600 transition-colors" v-if="authStore.isLogIn && authStore.isAdmin"><span class="text-md font-medium">Bảng điều khiển</span></RouterLink>
                        <button to="/auth/dang-ky" class="flex items-center hover:bg-green-100 justify-center w-full  px-4 py-3 text-gray-700 
                        hover:text-green-600 transition-colors cursor-pointer" v-if="authStore.isLogIn"><span class="text-md font-medium" @click="dangXuat">Đăng xuất</span></button>
                      
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