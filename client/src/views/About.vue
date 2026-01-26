<!-- <script setup>
import { onMounted, ref } from 'vue';

// Logic để xử lý hiệu ứng hiện dần khi cuộn trang (Thay cho thư viện AOS)
onMounted(() => {
  const observerOptions = {
    threshold: 0.1
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('opacity-100', 'translate-y-0');
        entry.target.classList.remove('opacity-0', 'translate-y-10');
      }
    });
  }, observerOptions);

  document.querySelectorAll('.reveal').forEach((el) => observer.observe(el));
});

// Dữ liệu mẫu
const stats = [
  { count: '1k+', title: 'Điểm đến phổ biến' },
  { count: '8m+', title: 'Khách hàng hài lòng' }
];

const guides = [
  { name: 'NGUYEN MINH DIEN', role: 'Founder', img: 'https://via.placeholder.com/400x500', fb: '#' },
  { name: 'BAO NGAN', role: 'Co-founder', img: 'https://via.placeholder.com/400x500', fb: '#' },
];
</script>

<template>
  <div class="bg-white font-sans text-gray-900 overflow-x-hidden">
    
    <section class="py-20 container mx-auto px-4 lg:px-20">
      <div class="flex flex-col lg:flex-row gap-12">
        <div class="lg:w-1/4 reveal opacity-0 translate-y-10 transition-all duration-1000">
          <span class="px-5 py-2 bg-green-100 text-green-700 rounded-full font-bold text-sm tracking-wide">
            VỀ CHÚNG TÔI
          </span>
        </div>

        <div class="lg:w-3/4 flex flex-col md:flex-row gap-10 reveal opacity-0 translate-y-10 transition-all duration-1000 delay-200">
          <div class="md:w-2/3">
            <h2 class="text-3xl md:text-5xl font-extrabold mb-6 leading-tight text-gray-800">
              Kinh nghiệm và công ty du lịch chuyên nghiệp ở Việt Nam
            </h2>
            <p class="text-gray-600 text-lg mb-8 leading-relaxed">
              Chúng tôi chuyên tạo ra những trải nghiệm thành phố khó quên cho du khách muốn khám phá trái tim và tâm hồn của cảnh quan đô thị. Các tour du lịch có hướng dẫn viên chuyên nghiệp sẽ đưa bạn qua những con phố sôi động.
            </p>
            <ul class="grid grid-cols-1 md:grid-cols-2 gap-y-4 mb-10 font-medium">
              <li class="flex items-center gap-3"><i class="fas fa-check-circle text-green-500"></i> Cơ quan Trải nghiệm</li>
              <li class="flex items-center gap-3"><i class="fas fa-check-circle text-green-500"></i> Đội ngũ Chuyên nghiệp</li>
              <li class="flex items-center gap-3"><i class="fas fa-check-circle text-green-500"></i> Du lịch Chi phí Thấp</li>
              <li class="flex items-center gap-3"><i class="fas fa-check-circle text-green-500"></i> Hỗ trợ Trực tuyến 24/7</li>
            </ul>
            <a href="#" class="inline-flex items-center gap-3 bg-green-600 hover:bg-green-700 text-white px-10 py-4 rounded-full font-bold shadow-xl transition-all hover:scale-105 active:scale-95">
              Khám phá Tours <i class="fas fa-arrow-right"></i>
            </a>
          </div>

          <div class="md:w-1/3">
            <div class="bg-amber-400 p-10 rounded-3xl text-center shadow-2xl transform hover:rotate-2 transition-transform">
              <span class="block text-gray-800 font-bold uppercase text-xs mb-3 tracking-widest">Năm kinh nghiệm</span>
              <span class="text-7xl font-black text-gray-900 block mb-3">5+</span>
              <p class="text-gray-800 font-medium">Chúng tôi đồng hành cùng bạn</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="py-20 bg-gray-50 px-4">
      <div class="container mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
        <div class="reveal opacity-0 translate-y-10 transition-all duration-1000">
          <img src="https://via.placeholder.com/500x600" class="rounded-3xl shadow-lg w-full h-[400px] object-cover" alt="Feature 1">
        </div>
        <div class="reveal opacity-0 translate-y-10 transition-all duration-1000 delay-200">
          <img src="https://via.placeholder.com/500x600" class="rounded-3xl shadow-lg w-full h-[400px] object-cover" alt="Feature 2">
        </div>
        <div class="flex flex-col gap-6 reveal opacity-0 translate-y-10 transition-all duration-1000 delay-400">
          <div class="bg-indigo-900 text-white p-8 rounded-3xl shadow-xl">
            <div class="flex items-center gap-4 mb-4">
              <div class="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center"><i class="fas fa-award text-2xl text-amber-400"></i></div>
              <h5 class="font-bold text-xl">Đạt giải thưởng</h5>
            </div>
            <p class="text-indigo-200 text-sm">Chúng tôi cam kết về sự xuất sắc và đổi mới không ngừng.</p>
          </div>
          <div class="bg-green-600 text-white p-8 rounded-3xl shadow-xl">
            <div class="flex items-center gap-4 mb-4">
              <div class="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center"><i class="fas fa-map-marked-alt text-2xl"></i></div>
              <h5 class="font-bold text-xl">5000+ Điểm đến</h5>
            </div>
            <p class="text-green-100 text-sm">Khám phá những vùng đất mới lạ cùng đội ngũ chuyên gia.</p>
          </div>
        </div>
      </div>
    </section>

    <section class="py-20 container mx-auto px-4">
      <div class="text-center mb-16 reveal opacity-0 translate-y-10 transition-all duration-1000">
        <h2 class="text-4xl font-black text-gray-800 mb-4">Hướng dẫn viên giàu kinh nghiệm</h2>
        <p class="text-gray-500 italic">"Hơn 34,500 trải nghiệm tuyệt vời cùng khách hàng"</p>
      </div>
      
      <div class="flex flex-wrap justify-center gap-12">
        <div v-for="guide in guides" :key="guide.name" 
             class="group relative w-full max-w-[300px] h-[450px] rounded-[2rem] overflow-hidden shadow-2xl reveal opacity-0 translate-y-10 transition-all duration-1000 delay-300">
          <img :src="guide.img" class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
          <div class="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent flex flex-col justify-end p-8 text-white">
            <h6 class="text-xl font-bold mb-1">{{ guide.name }}</h6>
            <span class="text-green-400 font-medium mb-4">{{ guide.role }}</span>
            <div class="flex gap-4 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
              <a :href="guide.fb" class="hover:text-green-400 text-lg"><i class="fab fa-facebook-f"></i></a>
              <a href="#" class="hover:text-green-400 text-lg"><i class="fab fa-instagram"></i></a>
              <a href="#" class="hover:text-green-400 text-lg"><i class="fab fa-youtube"></i></a>
            </div>
          </div>
        </div>
      </div>
    </section>

  </div>
</template>

<style scoped>
/* Class phụ trợ để làm mượt transition */
.reveal {
  will-change: transform, opacity;
}
</style> -->