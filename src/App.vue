<script setup>
import Navbar from '@/components/layout/Navbar.vue'
import SiteFooter from '@/components/layout/SiteFooter.vue'
import HomeView from '@/views/HomeView.vue'
import CounselingView from '@/views/CounselingView.vue'
import ReportView from '@/views/ReportView.vue'
import { currentPath } from '@/router'
</script>

<template>
  <Navbar />
  <main id="main">
    <ReportView v-if="currentPath === '/vorfall-melden'" />
    <CounselingView v-else-if="currentPath === '/beratung' || currentPath === '/kontakt'" />
    <HomeView v-else />
  </main>
  <SiteFooter />
</template>
