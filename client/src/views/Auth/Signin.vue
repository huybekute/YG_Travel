<script setup>
    import { ref } from 'vue';
    

    const showwPassSignin = ref(false)
</script>

<template>
    <div class="">
        <form>
            <div class="flex flex-col gap-5">
                <div class="flex flex-col gap-2">
                    <label for="usernameSignin"   class="text-gray-600">Tên đăng nhập/Email</label>
                    <input type="text" id="usernameSignin" class="px-4 py-2 border border-gray-300 rounded-sm" 
                    placeholder="Nhập username hoặc email" required/>
                </div>
                <div class="flex flex-col gap-2">
                    <div class="flex-col flex gap-2">
                        <label for="passwordSignin" class="text-gray-600 gap-2">Mật khẩu</label>
                        <input id="passwordSignin" class="px-4 py-2 border border-gray-300 rounded-sm" 
                        placeholder="Nhập mật khẩu" :type="showPassSignin ? 'text' : 'password'" required/>
                    </div>
                    <div class="flex justify-between">
                        <div class="flex gap-1">
                            <input type="checkbox" id="checkboxSignin" v-model="showPassSignin"/>
                            <label for="checkboxSignin" class="text-gray-600" >Hiển thị mật khẩu</label>
                        </div>
                        <a href="" class="text-red-500 hover:text-red-600">Quên mật khẩu ?</a>
                    </div>
                </div>
                <div class="flex flex-col gap-2 items-center">
                    <button type="submit" class="rounded-sm text-white bg-blue-500 py-2 px-10 cursor-pointer">Đăng nhập</button>
                </div>
            </div> 
        </form>
    </div>
</template>