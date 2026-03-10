<script setup>
    import { ref, onMounted, computed } from 'vue';
    import apiService from '@/services/APIService';
    
    const countUser = ref(0);
    const countLocation = ref(0)
    const getCountStat = async () => {
        try{
            const resUser = await apiService.get("/user/countUser");
            if(resUser.data){
                countUser.value = resUser.data.total;
            }

            const resLocation = await apiService.get("/location/");
            if(resLocation.data){
                countLocation.value = resLocation.data.length;
            };
        }
        catch(err){
            console.log("Lỗi hệ thống"); 
        }
    }

    onMounted(() => {
        getCountStat();
    })

</script>

<template>
    <div class="bg-gray-50 min-h-screen">
        <!-- Su menh -->
        <div class="relative h-[550px] flex items-center justify-center text-white">
            <img src="../../public/About/about.jpg" class="absolute inset-0 w-full h-full object-cover brightness-50 object-center"/>
            <div class="relative z-10 text-center px-4">
                <h1 class="text-5xl font-medium mb-4 tracking-tight uppercase">Về chúng tôi</h1>
                <p class="text-xl font-light max-w-2xl mx-auto leading-relaxed">
                    Không chỉ là điểm đến, chúng tôi gợi mở những câu chuyện ẩn giấu <br/> sau mỗi dải đất hình chữ S đầy cảm hứng.</p>
            </div>
        </div>

        <div class="max-w-6xl mx-auto py-24 px-6">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-20 items-center">
                <div>
                    <h2 class="text-3xl font-medium text-gray-800 mb-8 underline decoration-green-500 underline-offset-8">Sứ mệnh </h2>
                    <p class="text-gray-600 leading-relaxed mb-6 text-lg font-light">
                        Được thành lập bởi những trái tim yêu xê dịch, <strong>YG Travel</strong> ra đời với mục tiêu trở thành người bạn 
                        đồng hành tin cậy, giúp bạn tìm thấy những tọa độ tuyệt vời nhất cho mỗi chuyến hành trình.</p>
                    <p class="text-gray-600 leading-relaxed text-lg font-light mb-6">Chúng tôi tin rằng mỗi chuyến đi là một chương mới 
                        trong cuốn sách cuộc đời. Vì vậy, thay vì mang đến những lịch trình gò bó, chúng tôi cung cấp những gợi ý chân 
                        thực về văn hóa, ẩm thực và cảnh sắc để bạn tự do kiến tạo trải nghiệm của riêng mình.</p>
                </div>
                <div class="relative">
                    <img src="../../public/About/Sumenh.jpg" class="rounded-3xl shadow-2xl transition-all duration-700 h-[450px]"/>
                    <div class="absolute -top-6 -right-6 bg-white py-6 px-10 rounded-2xl shadow-xl hidden md:block">
                        <p class="text-4xl font-bold text-green-600">{{ countLocation }}+</p>
                        <p class="text-gray-800 font-medium pl-2">Địa điểm</p>
                    </div>
                </div>
            </div>
        </div>

        <!-- Tam nhin -->
        <div class="bg-white border-y border-gray-100">
            <div class="max-w-6xl mx-auto py-24 px-6">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-20 items-center">
                    <div class="relative order-2 md:order-1">
                        <img src="../../public/About/Tamnhin.jpg" 
                            class="rounded-3xl shadow-2xl transition-all duration-700 w-full object-cover h-[450px]"/>
                        <div class="absolute -bottom-6 -left-6 bg-blue-600 py-6 px-10 rounded-2xl shadow-xl hidden md:block">
                            <p class="text-blue-100 text-sm uppercase tracking-widest text-center">Cộng đồng</p>
                            <p class="text-4xl font-bold text-white italic text-center">{{ countUser }}+</p>
                            <p class="text-blue-50 font-medium italic text-center">Thành viên</p>
                        </div>
                    </div>
                    <div class="order-1 md:order-2">
                        <h2 class="text-3xl font-medium text-gray-800 mb-8 underline decoration-blue-500 underline-offset-8 tracking-wide">Tầm nhìn</h2>
                        <p class="text-gray-600 leading-relaxed mb-6 text-lg font-light">
                            <strong>YG Travel</strong> hướng tới việc trở thành nền tảng gợi ý du lịch hàng đầu, nơi mỗi điểm đến không 
                            chỉ là một dấu chấm trên bản đồ, mà còn là một trải nghiệm sống động được cá nhân hóa cho từng bước chân 
                            khám phá.
                        </p>
                        <p class="text-gray-600 leading-relaxed text-lg font-light">
                            Chúng tôi khao khát kết nối cộng đồng yêu du lịch văn minh, tôn vinh các giá trị bản địa và góp phần gìn giữ 
                            vẻ đẹp nguyên bản của thiên nhiên thông qua những hành trình tử tế và bền vững.
                        </p>
                    </div>
                </div>
            </div>
        </div>

        <!-- gia tri cot loi -->
        <div class="max-w-6xl mx-auto py-20 px-6 border-t border-gray-100">
            <div class="mb-16">
                <h2 class="text-3xl font-medium text-gray-800 mb-2 underline decoration-orange-500 underline-offset-8 tracking-wide
                text-center">Giá trị cốt lõi</h2>
            </div>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-12">
                <div>
                    <h3 class="text-xl font-medium text-gray-800 mb-4 tracking-tight text-center">Chân thực</h3>
                    <p class="text-gray-600 leading-relaxed font-light text-lg ">
                        Mọi gợi ý đều dựa trên trải nghiệm thực tế, giúp bạn khám phá vẻ đẹp vẻ đẹp sơ khai, 
                            chưa bị mài mòn bởi dấu chân du lịch công nghiệp.
                    </p>
                </div>
                <div>
                    <h3 class="text-xl font-medium text-gray-800 mb-4 tracking-tight text-center">Tử tế</h3>
                    <p class="text-gray-600 leading-relaxed font-light text-lg">
                        Chúng tôi luôn huyến khích lối sống du lịch có trách nhiệm, tôn trọng văn hóa bản địa và bảo vệ môi trường bền vững.
                    </p>
                </div>
                <div>
                    <h3 class="text-xl font-medium text-gray-800 mb-4 tracking-tight text-center">Đồng điệu</h3>
                    <p class="text-gray-600 leading-relaxed font-light text-lg">
                        Xây dựng mạng lưới chia sẻ kinh nghiệm tin cậy
                        kết nối những tâm hồn cùng tần số, cùng đam mê khám phá những góc nhìn mới.</p>
                </div>

            </div>
        </div>
    </div>
</template>