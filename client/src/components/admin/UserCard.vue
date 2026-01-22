<script setup>
  import apiService from '@/services/APIService';
  import { ref, watch } from 'vue';


    const props = defineProps({
        user: {
          type: Object,
          required: true
        }
    });

    const emit = defineEmits(['user-delete', 'user-update']);

    const deleteUser = async () => {
      if(!confirm("Bạn có chắc chắn muốn xóa người dùng này")) return;
      try{
        const res = await apiService.delete(`/user/${props.user.userID}` );
        if(res.status === 200 ){
          emit('user-delete', props.user.userID);
          window.location.reload();
        }
      }
      catch(error){
        const status = error.response?.status;
        const message = error.response?.data?.message;
        if(status === 500){
          console.log(message)
        }
        else if(status === 404){
          console.log(message);
        }
        else {
          console.log("Lỗi hệ thống")
        }

      }
    }

    const showPass = ref(false)
    const passwordLengthError = ref(false);
    const passwordMatchError = ref(false);
    const password = ref('');
    const confirmPassword = ref('');
    const isSubmit = ref(false);

    //ktra mk
    const validatePassword = () => {
        
        //mk it nhat 8 ky tu
        const minLength = 8;
        let isVal = true;
        if(password.value.length > 0  && password.value.length < minLength){
            passwordLengthError.value = true;
            isVal = false;
        }
        else{
            passwordLengthError.value = false
        }

        //ktra trung khop mk
        if(password.value && confirmPassword.value){
            passwordMatchError.value = (password.value !== confirmPassword.value);
            if(passwordMatchError.value){
                isVal = false;
            }
        }
        else {
            passwordMatchError.value = false;
        }
        return isVal;
    }

    //update password cho user
    const updatePassword = async () => {
      isSubmit.value = true;
      if (!validatePassword()) return;
      if(!confirm("Bạn có chắc chắn muốn cập nhật mật khẩu")) return;
      try{
        const res = await apiService.put(`/user/updatePassword/${props.user.userID}`,
          { password: password.value }
        );
        if(res.status === 200 ){
          emit("user-update", props.user.userID);
          closeModal();
          window.location.reload();
          
        }
      }
      catch(error){
        const status = error.response?.status;
        const message = error.response?.data?.message;
        if(status === 500){
          alert(message)
        }
        else if(status === 404){
          alert(message);
        }
        else {
          alert("Lỗi hệ thống")
        }

      }
    }

    //an hien form rest
    const isShow = ref(false);
    const openModal = () => {
      isShow.value = true
    }

    const closeModal = () => {
      isShow.value = false;

      //reset form
      isSubmit.value = false;
      password.value = '';
      confirmPassword.value = '';
      passwordLengthError.value = false;
      passwordMatchError.value = false;
    }

    watch([password, confirmPassword], validatePassword);

</script>

<template>
  <div class="max-w-md bg-white border border-gray-200 rounded shadow-sm overflow-hidden font-sans">
    <div class="p-4 flex flex-col">
      <h2 class="text-[22px] font-medium text-[#7a89a0] mb-2"> {{ user.fullname || 'Đang cập nhật' }}</h2>
      <div class="text-[14px] text-gray-600 flex flex-1 justify-between">
        <div class="text-[14px] text-gray-600 space-y-1.5">
            <p class="flex items-center gap-1.5"><span class="text-gray-500 text-xs"><i class="fa-solid fa-user mr-1"></i></span><span 
                class="font-bold text-gray-700">Username :</span> {{ user.username || 'Đang cập nhật' }}</p>
            <p class="flex items-center gap-1.5"><span class="text-gray-500 text-xs"><i class="fa-solid fa-address-card"></i></span><span 
                class="font-bold text-gray-700">Address :</span> {{ user.address || 'Đang cập nhật' }}</p>
            <p class="flex items-center gap-1.5"><span class="text-gray-500 text-xs"><i class="fa-solid fa-envelope"></i></span> <span 
                class="font-bold text-gray-700">Email :</span> {{ user.email || 'Đang cập nhật' }}</p>
            <p class="flex items-center gap-1.5"><span class="text-gray-500 text-xs"><i class="fa-solid fa-phone"></i></span> <span 
                class="font-bold text-gray-700">Phone :</span> {{ user.phoneNumber || 'Đang cập nhật' }}</p>
        </div>
        <!-- <div class="ml-10">
          <img src="/avtUser.jpg" class="w-28 h-28 rounded-full border-2 border-gray-300 object-cover shadow-sm"/>
        </div> -->
      </div>
      <div class="flex justify-end gap-2 mt-4">   
        <button class="flex items-center gap-1 bg-[#2ecc71] hover:bg-[#27ae60] text-white px-3 py-1.5 rounded text-[14px] 
        transition-colors shadow-sm" @click="openModal">Đặt lại mật khẩu</button>     
        <button class="flex items-center gap-1 bg-[#e74c3c] hover:bg-[#c0392b] text-white px-3 py-1.5 rounded text-[14px] 
        transition-colors shadow-sm" @click="deleteUser" v-if="user.role !== 'ADMIN'">Xóa</button>
      </div>
    </div>
  </div>

  <!-- form reset password -->
  <div v-if="isShow" class="fixed inset-0 z-50 flex items-center justify-center p-4">
    <div class="absolute inset-0 bg-black/50" @click="closeModal"></div>
    <div class="relative bg-white w-full max-w-sm rounded-lg shadow-2xl p-6 flex flex-col gap-4 transform transition-all">
      <div class="flex justify-between items-center border-b pb-2">
        <h3 class="text-lg font-bold text-gray-700">Đặt lại mật khẩu</h3>
        <button @click="closeModal" class="text-gray-400 hover:text-gray-600 transition-colors">
          <i class="fa-solid fa-xmark"></i>
        </button>
      </div>

      <div class="flex flex-col gap-4">
        <div class="flex gap-2 flex-col">
          <label for="password" class="text-sm font-medium text-gray-600">Nhập mật khẩu mới</label>
          <input id="password" v-model="password" :type="showPass ? 'text' : 'password'"
            class="px-4 py-2 border rounded focus:ring-2 focus:ring-green-400 outline-none transition-all"
            placeholder="Mật khẩu mới" @input="validatePassword"/>
          <p v-if="passwordLengthError && isSubmit" class="text-red-500 text-xs italic">Mật khẩu phải ít nhất 8 ký tự.</p>
        </div>

        <div class="flex gap-2 flex-col">
          <label for="submitPass" class="text-sm font-medium text-gray-600">Nhập lại mật khẩu</label>
          <input id="submitPass" v-model="confirmPassword" :type="showPass ? 'text' : 'password'"
            class="px-4 py-2 border rounded focus:ring-2 focus:ring-green-400 outline-none transition-all"
            placeholder="Xác nhận lại" @input="validatePassword"/>
          <p v-if="passwordMatchError && isSubmit" class="text-red-500 text-xs italic">Mật khẩu không khớp.</p>
        </div>

        <div class="flex items-center gap-2 select-none">
          <input type="checkbox" id="showpassSignin" v-model="showPass" class="w-4 h-4 cursor-pointer"/>
          <label for="showpassSignin" class="text-sm text-gray-600 cursor-pointer">Hiển thị mật khẩu</label>
        </div>
      </div>

      <div class="flex justify-end gap-3 mt-2">
        <button @click="closeModal" class="px-4 py-2 text-sm text-gray-500 hover:bg-gray-100 rounded transition-colors">Hủy</button>
        <button @click="updatePassword" class="px-4 py-2 text-sm bg-green-600 hover:bg-green-700 text-white rounded shadow-md transition-all">Xác nhận</button>
      </div>
    </div>
  </div>
</template>