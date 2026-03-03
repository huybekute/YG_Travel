<script setup>
  import Header from './components/Header.vue';
  import Footer from './components/Footer.vue'
  import DoraChan from './components/DoraChan.vue';
  import TravelMap from './components/TravelMap.vue';

</script>

<template>
  <Header/>
  <RouterView/>
  <DoraChan/>
  <TravelMap/>
  <Footer/>
</template>


