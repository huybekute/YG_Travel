<script setup>
import { ref, onMounted } from 'vue';

const featuredNews = ref({
  id: 1,
  title: "Top 10 địa điểm không thể bỏ qua tại Hà Giang mùa hoa tam giác mạch",
  summary: "Khám phá vẻ đẹp hùng vĩ của cao nguyên đá Đồng Văn và những cánh đồng hoa tím lịm trải dài khắp các sườn đồi...",
  category: "Cẩm nang du lịch",
  image: "https://vtv1.mediacdn.vn/2019/11/11/hagiang-15734444585141258602956.jpg",
});

const newsList = ref([
  {
    id: 2,
    title: "YG Travel ra mắt tour du lịch trải nghiệm văn hóa bản địa mới",
    summary: "Hành trình đưa du khách đến gần hơn với đời sống thường nhật của người dân vùng cao...",
    date: "14/03/2024",
    views: 1240,
    image: "https://image.vietnam.travel/sites/default/files/styles/top_banner/public/2022-10/Travel%20Information%20Center.jpg?itok=y0XG0X9s"
  },
  // Thêm các bài viết khác ở đây
]);
</script>
<template>
  <div class="bg-gray-50 min-h-screen py-16">
    <div class="container mx-auto px-4">
      <div class="text-center mb-16">
        <h1 class="text-4xl font-bold text-gray-800 mb-4">Tin Tức & Cẩm Nang Du Lịch</h1>
        <div class="w-24 h-1 bg-green-500 mx-auto rounded-full"></div>
      </div>

      <div v-if="featuredNews" class="mb-16 group cursor-pointer">
        <div class="bg-white rounded-[2rem] overflow-hidden shadow-sm border border-gray-100 flex flex-col lg:flex-row">
          <div class="lg:w-2/3 overflow-hidden">
            <img :src="featuredNews.image" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700">
          </div>
          <div class="lg:w-1/3 p-10 flex flex-col justify-center">
            <span class="text-green-600 font-bold text-sm uppercase mb-4">{{ featuredNews.category }}</span>
            <h2 class="text-3xl font-bold text-gray-800 mb-4 group-hover:text-green-600 transition-colors">
              {{ featuredNews.title }}
            </h2>
            <p class="text-gray-600 mb-6 line-clamp-3">{{ featuredNews.summary }}</p>
            <router-link :to="'/news/' + featuredNews.id" class="text-gray-800 font-bold flex items-center gap-2">
              Đọc thêm <i class="fa-solid fa-arrow-right text-sm"></i>
            </router-link>
          </div>
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <div v-for="post in newsList" :key="post.id" class="bg-white rounded-3xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-xl transition-all group">
          <div class="aspect-video overflow-hidden">
            <img :src="post.image" class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500">
          </div>
          <div class="p-6">
            <div class="flex items-center gap-4 mb-3 text-xs text-gray-400 font-medium">
              <span><i class="fa-regular fa-calendar mr-1"></i> {{ post.date }}</span>
              <span><i class="fa-regular fa-eye mr-1"></i> {{ post.views }} lượt xem</span>
            </div>
            <h3 class="text-xl font-bold text-gray-800 mb-3 line-clamp-2 group-hover:text-green-600">
              {{ post.title }}
            </h3>
            <p class="text-gray-500 text-sm line-clamp-3 mb-4">{{ post.summary }}</p>
            <router-link :to="'/news/' + post.id" class="inline-block text-green-600 font-bold text-sm">
              Xem chi tiết
            </router-link>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>