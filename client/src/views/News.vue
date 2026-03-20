<script setup>
import { ref } from 'vue';

// Giả lập dữ liệu bài viết (Sau này bạn sẽ lấy từ API)
const posts = ref([
  {
    id: 1,
    title: "Hành trình khám phá 13 tỉnh miền Tây sông nước",
    excerpt: "Miền Tây không chỉ có gạo trắng nước trong mà còn có những con người hậu hỷ, những cánh đồng sen ngát hương...",
    author: "Huy Nguyễn",
    date: "15/03/2026",
    category: "Trải nghiệm",
    image: "https://images.unsplash.com/photo-1589782182703-2aad67281b22?auto=format&fit=crop&q=80&w=800",
  },
  {
    id: 2,
    title: "Top 5 món ăn phải thử khi đến Cần Thơ",
    excerpt: "Bánh cống, nem nướng Cái Răng hay lẩu mắm là những hương vị mà bạn không thể nào quên khi ghé thăm thủ phủ miền Tây.",
    author: "YG Travel",
    date: "12/03/2026",
    category: "Ẩm thực",
    image: "https://images.unsplash.com/photo-1562602833-0f4ab2fc46e3?auto=format&fit=crop&q=80&w=800",
  },
  {
    id: 3,
    title: "Kinh nghiệm du lịch Phú Quốc tự túc từ A-Z",
    excerpt: "Làm sao để đi Phú Quốc với chi phí rẻ nhất? Nên ở đâu, chơi gì? Hãy cùng khám phá lịch trình 3 ngày 2 đêm cực chi tiết.",
    author: "Dora Chan",
    date: "10/03/2026",
    category: "Cẩm nang",
    image: "https://images.unsplash.com/photo-1505968409348-bd000797c92e?auto=format&fit=crop&q=80&w=800",
  }
]);

const categories = ["Tất cả", "Trải nghiệm", "Ẩm thực", "Cẩm nang", "Lịch trình"];
const activeCategory = ref("Tất cả");
</script>

<template>
  <div class="min-h-screen bg-gray-50 pt-24 pb-12">
    <header class="max-w-7xl mx-auto px-6 mb-12 text-center">
      <h1 class="text-4xl md:text-5xl font-bold text-gray-900 mb-4">YG Travel Blog</h1>
      <p class="text-gray-600 max-w-2xl mx-auto">
        Nơi chia sẻ những câu chuyện hành trình, kinh nghiệm du lịch và vẻ đẹp của con người miền Tây.
      </p>
    </header>

    <div class="max-w-7xl mx-auto px-6 mb-10 overflow-x-auto">
      <div class="flex justify-center gap-4 min-w-max">
        <button 
          v-for="cat in categories" :key="cat"
          @click="activeCategory = cat"
          :class="activeCategory === cat ? 'bg-green-600 text-white' : 'bg-white text-gray-600 hover:bg-gray-100'"
          class="px-6 py-2 rounded-full font-medium transition-all shadow-sm border border-gray-100"
        >
          {{ cat }}
        </button>
      </div>
    </div>

    <main class="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      <article 
        v-for="post in posts" :key="post.id"
        class="bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-shadow duration-300 group"
      >
        <div class="relative h-56 overflow-hidden">
          <img 
            :src="post.image" 
            class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
          >
          <span class="absolute top-4 left-4 bg-white/90 backdrop-blur px-3 py-1 rounded-lg text-xs font-bold text-green-700">
            {{ post.category }}
          </span>
        </div>

        <div class="p-6">
          <div class="flex items-center gap-2 text-xs text-gray-400 mb-3">
            <span>{{ post.date }}</span>
            <span>•</span>
            <span>{{ post.author }}</span>
          </div>
          <h2 class="text-xl font-bold text-gray-800 mb-3 group-hover:text-green-600 transition-colors">
            {{ post.title }}
          </h2>
          <p class="text-gray-600 text-sm line-clamp-3 leading-relaxed mb-6">
            {{ post.excerpt }}
          </p>
          
          <router-link 
            :to="'/blog/' + post.id"
            class="flex items-center gap-2 text-green-600 font-bold text-sm hover:gap-4 transition-all"
          >
            Đọc tiếp <i class="fa-solid fa-arrow-right"></i>
          </router-link>
        </div>
      </article>
    </main>

    <div class="flex justify-center mt-16 gap-2">
      <button class="w-10 h-10 flex items-center justify-center rounded-xl bg-white border border-gray-200 text-gray-400">1</button>
      <button class="w-10 h-10 flex items-center justify-center rounded-xl bg-green-600 text-white shadow-lg shadow-green-200">2</button>
      <button class="w-10 h-10 flex items-center justify-center rounded-xl bg-white border border-gray-200 text-gray-400">3</button>
    </div>
  </div>
</template>

<style scoped>
.line-clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>