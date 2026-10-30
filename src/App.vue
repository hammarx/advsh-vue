<script setup>
import Navbar from './components/layout/Navbar.vue'
import SiteFooter from './components/layout/SiteFooter.vue'
import HomeView from './views/HomeView.vue'
</script>

<template>
  <Navbar />
  <main id="main">
    <HomeView />
  </main>
  <SiteFooter />
</template>
