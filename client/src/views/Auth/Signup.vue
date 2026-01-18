<script setup>
    import { ref, onMounted, watch } from 'vue';
    import { useRoute } from 'vue-router';
    import { useRouter } from 'vue-router';
    import { watchEffect } from 'vue';

    const showPassSignup = ref(false);

</script>

<template>
    <div class="bg-gray-100 py-5">
        <div class="flex flex-col items-center justify-center gap-10 py-10 mt-10 bg-white w-4/5 mx-auto ">
            <div class="flex">
                <h1 class="text-2xl underline underline-offset-8 text-gray-600">Đăng ký</h1>
            </div>
            <div class="flex flex-col gap-3 mx-auto w-2/5">
                <form>
                    <div class="flex flex-col gap-5">
                        <div class="flex gap-3 flex-col">
                            <label for="usernameSignin" class="text-gray-600">Tên đăng nhập</label>
                            <input type="text" id="usernameSignin" placeholder="Nhập username" required
                            class="px-4 py-2 border border-gray-300 rounded-sm"/>
                        </div>
                        <div class="flex gap-3 flex-col">
                            <label for="usernameSignin" class="text-gray-600">Email</label>
                            <input type="text" id="usernameSignin" placeholder="Nhập email" required
                            class="px-4 py-2 border border-gray-300 rounded-sm"/>
                        </div>
                        <div class="flex gap-3 flex-col">
                                <label for="passwordSignin" class="text-gray-600">Mật khẩu</label>
                                <input id="passwordSignin" placeholder="Nhập mật khẩu" required 
                                :type="showPassSignup ? 'text' : 'password'"
                                class="px-4 py-2 border border-gray-300 rounded-sm"/>
                        </div>
                        <div class="flex flex-col gap-2">
                            <div class="flex gap-3 flex-col">
                                <label for="passwordSignin" class="text-gray-600">Nhập lại mật khẩu</label>
                                <input id="passwordSignin" placeholder="Nhập lại mật khẩu" required 
                                :type="showPassSignup ? 'text' : 'password'"
                                class="px-4 py-2 border border-gray-300 rounded-sm"/>
                            </div>
                            <div class="flex justify-between">
                                <div class="flex gap-1">
                                    <input type="checkbox" id="showpassSignin" v-model="showPassSignup"/>
                                    <label for="showpassSignin" class="text-gray-600">Hiển thị mật khẩu</label>
                                </div>
                                <a href="" class="text-red-500 hover:text-red-600">Quên mật khẩu ?</a>
                            </div>
                        </div>
                        <div class="flex flex-col items-center">
                            <button type="submit" class="rounded-md bg-green-500 py-2 px-10 cursor-pointer ">Đăng ký</button>
                        </div>
                    </div>
                </form>
                <div class="pt-3">
                    <p class="text-xs text-center">Bằng việc đăng ký, bạn đã đồng ý với chúng tôi về <br/>
                    <a href="" class="text-blue-600 hover:text-blue-700 hover:underline ">Điều khoản dịch vụ</a> &  
                    <a href="" class="text-blue-600 hover:text-blue-700 hover:underline ">Chính sách bảo mật</a>
                    </p>
                </div>
            </div>
        </div>
    </div>
</template>
