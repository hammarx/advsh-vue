<script setup>
import HeroSection from '@/components/sections/HeroSection.vue'
import MarqueeBar from '@/components/sections/MarqueeBar.vue'
import IntroSection from '@/components/sections/IntroSection.vue'
import ServicesSection from '@/components/sections/ServicesSection.vue'
import FeatureSection from '@/components/sections/FeatureSection.vue'
import { useScrollSpy } from '@/composables/useScrollSpy'

useScrollSpy()
</script>

<template>
  <HeroSection />
  <MarqueeBar />
  <IntroSection />
  <ServicesSection />
  <FeatureSection />
</template>
