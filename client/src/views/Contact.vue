<script setup>
    import { ref } from 'vue';
    import apiService from '@/services/APIService';
    import Toast from "../utils/swal.js"

    const formData = ref({
        fullName: '',
        phone: '',
        email: '',
        message: ''
    });

    const isSubmitting = ref(false);
    const submitForm = async () => {
        isSubmitting.value = true;
        try {
            const response = await apiService.post('/contact/send', formData.value);
            
            Toast.successToast('', 'Cảm ơn bạn, chúng tôi đã nhận được thông tin')
            formData.value = {
                fullName: '',
                phone: '',
                email: '',
                message: ''
            };
        } catch (error) {
            const errorMsg = error.response?.data?.message || "Không thể gửi lúc này.";
            Toast.errorToast('', errorMsg)
        } finally {
            isSubmitting.value = false;
        }
    };
</script>

<template>
    <div class="mx-auto p-6 md:p-12 font-sans text-gray-800">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-10 bg-white shadow-lg rounded-2xl overflow-hidden mb-10 max-w-7xl mx-auto">
            <div class="p-8 bg-gray-50 relative">
                <h2 class="text-2xl font-bold text-gray-900 mb-6 uppercase">YG Travel</h2>
                <div class="space-y-6">
                    <div>
                        <h3 class="font-bold text-blue-600 mb-1">Địa chỉ:</h3>
                        <p class="text-sm">216 Tầm Vu, Phường Tân An, Thành Phố Cần Thơ</p>
                    </div>
                    <div>
                        <h3 class="font-bold text-blue-600 mb-1">Email:</h3>
                        <p class="text-sm text-blue-500 underline">huynguyen.2764@gmail.com</p>
                    </div>
                    <div>
                        <h3 class="font-bold text-blue-600 mb-1">Điện thoại:</h3>
                        <p class="text-sm font-bold">0393244131</p>
                    </div>
                </div>

                <div class="absolute bottom-0 left-0 w-16 h-16 bg-orange-500 rounded-tr-full opacity-80"></div>
            </div>
            <div class="p-8">
                <h2 class="text-2xl font-bold mb-6">Liên hệ với chúng tôi</h2>
                <form @submit.prevent="submitForm" class="space-y-4">
                    <div>
                        <input v-model="formData.fullName" type="text" placeholder="Họ & tên" class="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none" required />
                    </div>
                    <div>
                        <input v-model="formData.phone" type="tel" placeholder="Số điện thoại" class="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none" required />
                    </div>
                    <div>
                        <input v-model="formData.email" type="email" placeholder="Địa chỉ email" class="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none" required />
                    </div>
                    <div>
                        <textarea v-model="formData.message" placeholder="Tin nhắn" rows="4" class="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none resize-none"></textarea>
                    </div>
                    <button type="submit" :disabled="isSubmitting" class="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg flex items-center gap-2 transition-all shadow-md active:scale-95 disabled:opacity-50">
                        <i v-if="!isSubmitting" class="fa-solid fa-paper-plane"></i>
                        <i v-else class="fa-solid fa-spinner animate-spin"></i> {{ isSubmitting ? 'Đang gửi...' : 'Gửi' }}
                    </button>
                </form>
            </div>
        </div>

        <div class="w-full h-[450px] rounded-2xl overflow-hidden shadow-inner border border-gray-200">
            <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3596.4962259553704!2d105.7647611101187!3d10.014261772748842!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31a08833003c9e65%3A0x8d2b098fb4d8af01!2zMjE2IFThuqdtIFZ1LCBIxrBuZyBM4bujaSwgTmluaCBLaeG7gXUsIEPhuqduIFRoxqEsIFZp4buHdCBOYW0!5e1!3m2!1svi!2s!4v1773234980528!5m2!1svi!2s"             width="100%" height="100%" style="border:0;" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>
        </div>
    </div>
</template>