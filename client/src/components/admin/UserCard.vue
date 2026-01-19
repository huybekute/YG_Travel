<script setup>
    defineProps({
        user: {
          type: Object,
          required: true
        }
    });

</script>

<template>
  <div class="max-w-md bg-white border border-gray-200 rounded shadow-sm overflow-hidden font-sans">
    <div class="p-4 flex flex-col">
      <h2 class="text-[22px] font-medium text-[#7a89a0] mb-2"> {{ user.name || 'Đang cập nhật' }}</h2>
      <div class="text-[14px] text-gray-600 flex flex-1 justify-between">
        <div class="text-[14px] text-gray-600 space-y-1.5">
            <p class="flex items-center gap-1.5"><span class="text-gray-500 text-xs"><i class="fa-solid fa-user mr-1"></i></span><span 
                class="font-bold text-gray-700">Username :</span> {{ user.username || 'Đang cập nhật' }}</p>
            <p class="flex items-center gap-1.5"><span class="text-gray-500 text-xs"><i class="fa-solid fa-address-card"></i></span><span 
                class="font-bold text-gray-700">Address :</span> {{ user.address || 'Đang cập nhật' }}</p>
            <p class="flex items-center gap-1.5"><span class="text-gray-500 text-xs"><i class="fa-solid fa-envelope"></i></span> <span 
                class="font-bold text-gray-700">Email :</span> {{ user.email || 'Đang cập nhật' }}</p>
            <p class="flex items-center gap-1.5"><span class="text-gray-500 text-xs"><i class="fa-solid fa-phone"></i></span> <span 
                class="font-bold text-gray-700">Phone :</span> {{ user.phone || 'Đang cập nhật' }}</p>
        </div>
        <!-- <div class="ml-10">
          <img src="/avtUser.jpg" class="w-28 h-28 rounded-full border-2 border-gray-300 object-cover shadow-sm"/>
        </div> -->
      </div>
      <div class="flex justify-end gap-2 mt-4">        
        <button class="flex items-center gap-1 bg-[#e74c3c] hover:bg-[#c0392b] text-white px-3 py-1.5 rounded text-[14px] 
        transition-colors shadow-sm">Xóa</button>
      </div>
    </div>
  </div>
</template>