<script setup>
  import Header from './components/Header.vue';
  import Footer from './components/Footer.vue'
  import DoraChan from './components/DoraChan.vue';
  import TravelMap from './components/TravelMap.vue';
  import { ref } from 'vue';

  const doraRef = ref(null);

  // xu ly khi ng dung click vao tinh tren Map
  const selectProvince = async (name) => {
    if (doraRef.value) {
      doraRef.value.openChatWithProvince(name);
    }
  }

</script>

<template>
  <Header/>
  <RouterView/>
  <DoraChan ref="doraRef" />
  <TravelMap @select-province="selectProvince" />
  <Footer/>
</template>


