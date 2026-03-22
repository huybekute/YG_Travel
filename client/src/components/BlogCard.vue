<script setup>
    defineProps({
    post: {
        type: Object,
        required: true,
        default: () => ({
        title: '',
        thumbnail: '',
        views: 0,
        excerpt: ''
        })
    }
    });
</script>

<template>
    <div class="bg-white rounded-md shadow-sm overflow-hidden border border-gray-100 flex flex-col h-full hover:shadow-lg transition-shadow duration-300">
        <div class="relative aspect-[4/3] overflow-hidden">
        <img :src="post.thumbnail || ''" class="w-full h-full object-cover"/>
        </div>
        <div class="p-5 flex flex-col flex-1">
            <h3 class="text-[16px] font-bold text-gray-800 leading-snug mb-2 line-clamp-2 hover:text-green-600
             transition-colors">{{ post.title }}</h3>
            <div class="text-gray-500 text-sm mb-4 flex items-center gap-1.5 font-medium">
                <span>{{ post.views || 0 }} lượt xem</span>
            </div>
            <p class="text-gray-500 text-[14px] leading-relaxed line-clamp-3">
                {{ post.excerpt }}
            </p>
        </div>
    </div>
</template>
