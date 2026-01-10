<script setup>
  import { ref, onMounted } from 'vue';
  

  //tao nut am thanh video
  const videoRef = ref(null);
  const isMute = ref(true);
  
  const toogleMute = () => {
    if(!videoRef.value) return;
    isMute.value = !isMute.value;
    videoRef.value.muted = isMute.value
  }

  //text travel in VN

  const fullText = "TRAVEL IN VIETNAM"
  const displayText = ref('');
  const showTyping = ref(true);
  const typingSpped = 120;

  const startTyping = (() => {
    let idx = 0;
    const interval = setInterval(() => {
      if(idx < fullText.length){
        displayText.value += fullText[idx];
        idx++;
      }
      else{
        clearInterval(interval);
          setTimeout(() => {
            showTyping.value = false
        }, 3000);
      }
    }, typingSpped)
  })

    onMounted(() => {
    if(videoRef.value){
      videoRef.value.muted = true;
      startTyping();
    }
  })
  

</script>

<template>
  <div>
    <div class="relative w-full min-h-screen overflow-hidden pt-10 ">
      <video ref="videoRef" src="../../public/Home/HomeVideo.mp4" class="absolute w-full h-full object-cover" autoplay loop muted playsinline></video>
      <transition name="">
        <h1 v-if="showTyping" class="absolute inset-0 z-10 flex items-center justify-center text-white text-4xl md:text-6xl 
        font-bold tracking-wide"><span class="inline-block text-left" style="width: 18ch" >{{ displayText }}</span></h1>
      </transition>
      <button @click="toogleMute" class="absolute bottom-6 right-6 z-20 bg-black/60 text-white w-12 h-12 rounded-full flex items-center
      justify-center hover:bg-black/80 transition"><i :class="isMute ? 'fa-solid fa-volume-xmark' : 'fa-solid fa-volume-high'"></i></button>
      <div class="absolute inset-0 bg-black/40"></div>
    </div>
    
    <div class="bg-blue-500 pt-20">
      <p>addad</p>
      <p>addad</p>
      <p>addad</p>
      <p>addad</p>
      <p>addad</p>

    </div>
  </div>
</template>

