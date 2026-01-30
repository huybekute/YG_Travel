<script setup>
  import Header from './components/Header.vue';
  import Footer from './components/Footer.vue'
  import DoraChan from './components/DoraChan.vue';

</script>

<template>
  <Header/>
  <RouterView/>
  <DoraChan/>
  <Footer/>
</template>
