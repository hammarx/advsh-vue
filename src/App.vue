<script setup>
import Navbar from './components/Navbar.vue'
import { useI18n } from './i18n/useI18n'

const { t } = useI18n()
</script>

<template>
  <Navbar />
  <main id="main" class="shell">
    <h1>{{ t.helloWorld }}</h1>
  </main>
</template>



