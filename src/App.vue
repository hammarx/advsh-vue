<script setup>
import Navbar from '@/components/layout/Navbar.vue'
import SiteFooter from '@/components/layout/SiteFooter.vue'
</script>

<template>
  <Navbar />
  <main id="main">
    <RouterView />
  </main>
  <SiteFooter />
</template>
