<script setup>
import Navbar from './components/Navbar.vue'
import HeroSection from './components/HeroSection.vue'
import MarqueeBar from './components/MarqueeBar.vue'
import IntroSection from './components/IntroSection.vue'
import ServicesSection from './components/ServicesSection.vue'
import FeatureSection from './components/FeatureSection.vue'
import SiteFooter from './components/SiteFooter.vue'
</script>

<template>
  <Navbar />
  <main id="main">
    <HeroSection />
    <MarqueeBar />
    <IntroSection />
    <ServicesSection />
    <FeatureSection />
  </main>
  <SiteFooter />
</template>
