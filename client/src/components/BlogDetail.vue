<script setup>
    import { ref, onMounted, watch } from 'vue';
    import { useRoute, useRouter } from 'vue-router';
    import apiService from '@/services/APIService';

    const route = useRoute();
    const router = useRouter();

    const post = ref(null);
    const categories = ref([]);
    const relatedPosts = ref([]);

    const loadPostDetail = async () => {
        try {
            const slug = route.params.slug;
            const res = await apiService.get(`/blog/detail/${slug}`);
            console.log(res.data)
            post.value = res.data;
            
            document.title = `${post.value.title}`;

            loadRelatedPosts(post.value.categoryID, post.value.postID);
            loadCategories();
        } catch (err) {
            console.log(err)
        }
    };

    const loadRelatedPosts = async (categoryID, currentPostID) => {
        try {
            const res = await apiService.get(`/blog?categoryID=${categoryID}&limit=5&exclude=${currentPostID}`);
            relatedPosts.value = res.data;
        } catch (err) {
            console.error("Lỗi tải bài liên quan:", err);
        }
    };

    const loadCategories = async () => {
        try {
            const res = await apiService.get("/blog-category");
            categories.value = res.data;
        } catch (err) {
            console.error(err);
        }
    };

    const filterByCategory = (catSlug) => {
        router.push(`/blog/${catSlug}`);
    };
    const formatDate = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toLocaleDateString('vi-VN'); 
    };

    watch(() => route.params.slug, () => {
        loadPostDetail();
        window.scrollTo(0, 0); 
    });

    onMounted(loadPostDetail);
</script>

<template>
    <div v-if="post" class="max-w-7xl mx-auto px-4 py-10 bg-gray-50">
        <div class="mb-8 pb-6 bg-white p-6 rounded-lg">
            <div class="text-sm text-gray-500 mb-3 flex items-center gap-2">
                <RouterLink to="/" class="hover:text-green-600">Trang chủ</RouterLink>
                <span>/</span>
                <RouterLink :to="`/blog/${post.categorySlug}`" class="hover:text-green-600">{{ post.categoryName }}</RouterLink>
                <span>/</span>
                <span class="text-gray-400 line-clamp-1">{{ post.title }}</span>
            </div>
            <h1 class="text-3xl md:text-4xl font-extrabold text-gray-800 leading-tight text-center">
                {{ post.title }}
            </h1>
            <div class="flex items-center gap-6 text-sm text-gray-500 mt-4  pt-4">
                <span><i class="fa-regular fa-calendar pr-1.5"></i>{{ formatDate(post.createdAt) }}</span>
                <span><i class="fa-regular fa-eye pr-1.5"></i>{{ post.views }} lượt xem</span>
                <span><i class="fa-regular fa-user pr-1.5"></i>Đăng bởi: {{ post.authorName }}</span>
            </div>
        </div>
        <div class="flex flex-col lg:flex-row gap-8">
            <div class="flex-1 bg-white p-6 md:p-8 rounded-lg border border-gray-100">
                <div class="bg-gray-50 p-5 rounded-md border-l-4 border-green-500 mb-8 text-gray-700 italic leading-relaxed">
                {{ post.excerpt }}
                </div>
                <article 
                    class="prose prose-blue max-w-none text-gray-800 leading-relaxed 
                        prose-headings:font-bold prose-headings:text-gray-900
                        prose-p:mb-5 prose-img:rounded-lg prose-img:shadow-md 
                        prose-ul:list-disc prose-ol:list-decimal 
                        whitespace-pre-line"
                    v-html="post.content">
                </article>
            </div>
            <div class="w-full lg:w-[320px] space-y-8">
                <div class="bg-white shadow-sm border border-gray-100 overflow-hidden sticky top-28">
                <div class="bg-blue-500 text-white px-5 py-3.5 font-bold uppercase text-sm tracking-wide text-center">
                    Danh mục bài viết
                </div>
                <ul class="divide-y text-[14px]">
                    <li v-for="cat in categories" :key="cat.categoryID" 
                        @click="filterByCategory(cat.slug)"
                        class="px-5 py-3 cursor-pointer flex items-center justify-between text-gray-700 transition-colors">
                    <span class="flex items-center gap-2">
                        <i class="fa-solid fa-chevron-right text-[10px] text-gray-300"></i>
                        {{ cat.name }}
                    </span>
                    <span class="text-xs text-gray-400 font-mono">({{ cat.postCount || 0 }})</span>
                    </li>
                </ul>
                </div>
                <!-- <div v-if="relatedPosts.length > 0" class="bg-white p-5 rounded-lg shadow-sm border border-gray-100">
                    <h3 class="text-lg font-bold text-gray-800 uppercase border-l-4 border-blue-600 pl-3 mb-5 tracking-tight">
                        Bài viết liên quan
                    </h3>
                    <div class="space-y-5">
                        <RouterLink v-for="rel in relatedPosts" :key="rel.postID" 
                                    :to="`/baiviet/${rel.slug}`"
                                    class="flex gap-3 group border-b pb-4 last:border-0 last:pb-0">
                        <img :src="rel.thumbnail" class="w-20 h-16 object-cover rounded shadow-sm group-hover:opacity-80 transition-opacity">
                        <div class="flex-1">
                            <h4 class="text-sm font-semibold text-gray-800 line-clamp-2 group-hover:text-blue-700 leading-snug">
                            {{ rel.title }}
                            </h4>
                            <p class="text-xs text-gray-400 mt-1.5">{{ formatDate(rel.createdAt) }}</p>
                        </div>
                        </RouterLink>
                    </div>
                </div> -->
            </div>
        </div>
    </div>
    <div v-else class="text-center py-20 text-gray-500 ">
        Đang tải bài viết...
    </div>
</template>


