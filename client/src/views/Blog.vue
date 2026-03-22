<script setup>
    import { ref, onMounted } from 'vue';
    import { useRouter, useRoute } from 'vue-router';
    import apiService from '@/services/APIService';
    import BlogCard from '@/components/BlogCard.vue';
    import { watch } from 'vue';
    import { computed } from 'vue';

    const router = useRouter();
    const route = useRoute();

    const posts = ref([]);
    const blogCategories = ref([]);

    const currentCategoryName = computed(() => {
        const slug = route.params.slug;
        if (!slug) return "Kinh Nghiệm Điểm Đến";
        
        const found = blogCategories.value.find(c => c.slug === slug);
        return found ? found.name : "Kinh Nghiệm Điểm Đến";
    });

    const loadData = async () => {
        try {
            const slug = route.params.slug;
            const url = slug ? `/blog?category=${slug}` : "/blog";

            const postRes = await apiService.get(url); 
            const catRes = await apiService.get("/blog-category");
            posts.value = postRes.data;
            blogCategories.value = catRes.data;
        } 
        catch (err) {
            console.error("Lỗi load trang blog:", err);
        }
    };

    watch(() => route.params.slug, () => {
        loadData();
    });
    const goToDetail = (slug) => {
        router.push(`/baiviet/${slug}`);
    };

    const filterByCategory = (slug) => {
        router.push(`/blog/${slug}`);
    };

    onMounted(loadData);
</script>

<template>
    <div class="max-w-7xl mx-auto px-4 py-10 bg-gray-50">
        <div class="mb-10">
            <div class="flex items-center gap-3">
                <h2 class="text-3xl font-extrabold text-gray-800 uppercase tracking-tight">
                    {{ currentCategoryName }}</h2>
                <!-- <svg class="w-12 h-4 text-gray-400" viewBox="0 0 100 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M0 10Q12.5 0 25 10T50 10T75 10T100 10" stroke="currentColor" stroke-width="3" fill="none"/>
                </svg> -->
            </div>
        </div>
        <div class="flex flex-col lg:flex-row gap-8">
            <div class="flex-1">
                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <BlogCard  v-for="post in posts" :key="post.postID" :post="post" @click="goToDetail(post.slug)"/>
                </div>
                <div class="mt-10 flex justify-center" v-if="totalPages > 1">
                </div>
            </div>
            <div class="w-full lg:w-72">
                <div class="bg-white border overflow-hidden sticky top-24">
                    <div class="bg-blue-500 text-white px-4 py-3 font-bold uppercase text-sm text-center">
                        Danh mục bài viết
                    </div>
                    <ul class="divide-y text-[14px]">
                        <li v-for="cat in blogCategories" :key="cat.categoryID" 
                            @click="filterByCategory(cat.slug)"
                            :class="['px-4 py-3 cursor-pointer flex items-center justify-between transition-colors']">
                            <div class="flex items-center gap-2">
                                <i class="fa-solid fa-chevron-right text-[10px]" :class="route.params.slug === cat.slug ? 'text-green-600' : 'text-gray-400'"></i>
                                {{ cat.name }}
                            </div>
                            <span class="text-[11px] font-mono px-2 py-0.5 rounded-full" >
                                ({{ cat.postCount || 0 }})
                            </span>
                        </li>
                    </ul>
                    </div>
            </div>
        </div>
    </div>
</template>
