<script setup>
  import { ref, onMounted, onUnmounted } from 'vue';

  const showSearch = ref(false);

  const handleScroll = () => {
    if(window.scrollY > 50) {
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
</script>

<template>
  <div class="flex flex-col">
    <!-- anh nen -->
    <div class="relative w-full overflow-hidden h-screen">
      <img src="../../public/Home/HomePage.jpg" class="absolute w-full h-full object-cover" >
      <div class="absolute inset-0 bg-black/40"></div>
    </div>
    
    <!-- thanh search -->
    <div class="flex gap-5 p-6 bg-white rounded-2xl mx-auto z-10 -mt-12 shadow-2xl border border-gray-100 transition-all duration-700 ease-out"
      :class="[showSearch ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-10 scale-95 pointer-events-none']">
      <div class="flex flex-col gap-2 w-48">
        <select class="bg-white/10 backdrop-blur-md border border-white/20 rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-green-500 transition-all cursor-pointer">
          <option value="" disabled selected>Chọn điểm đến</option>
          <option class="text-black" value="halong">Vịnh Hạ Long</option>
          <option class="text-black" value="phuquoc">Phú Quốc</option>
          <option class="text-black" value="hanoi">Thủ đô Hà Nội</option>
        </select>
      </div>
      <div class="border-r border-gray-200 px-5"></div>
      <div class="flex flex-col gap-2 w-48">
        <select class="bg-white/10 backdrop-blur-md border border-white/20 rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-green-500 transition-all cursor-pointer">
          <option value="" disabled selected>Chủ đề</option>
          <option class="text-black" value="halong">Biển, đảo</option>
          <option class="text-black" value="phuquoc">Nghỉ dưỡng</option>
          <option class="text-black" value="hanoi">Núi rừng</option>
        </select>
      </div>
      <div class="border-r border-gray-200 px-5"></div>
      <div class="flex flex-col gap-2 w-48">
        <select class="bg-white/10 backdrop-blur-md border border-white/20 rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-green-500 transition-all cursor-pointer">
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
    <!-- kHAM PHA -->
    <div class="flex py-10">
      <h1 class="font-bolds text-2xl mx-auto">Khám Phá Kho Báu Việt Nam Cùng YG Travel</h1>
    </div>
  </div>
</template>

