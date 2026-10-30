<script setup>
import { computed } from 'vue'
import { useSiteStore } from '../../stores/siteStore'
import SectionHeader from '../ui/SectionHeader.vue'
import ServiceCard from '../ui/ServiceCard.vue'

const props = defineProps({
  sectionId: { type: String, default: 'angebote' },
  label: { type: String, default: null },
  headingLine1: { type: String, default: null },
  headingAccent: { type: String, default: null },
  moreLink: { type: Object, default: null },
  items: { type: Array, default: null },
})

const store = useSiteStore()

const services = computed(() => store.services || {})
const displayLabel = computed(() => props.label ?? services.value.label)
const displayHeadingLine1 = computed(() => props.headingLine1 ?? services.value.headingLine1)
const displayHeadingAccent = computed(() => props.headingAccent ?? services.value.headingAccent)
const displayMoreLink = computed(() => props.moreLink ?? services.value.moreLink)
const displayItems = computed(() => props.items ?? services.value.items ?? [])
</script>

<template>
  <section class="section section--paper" :id="sectionId">
    <div class="shell">
      <SectionHeader
        :label="displayLabel"
        :headingLine1="displayHeadingLine1"
        :headingAccent="displayHeadingAccent"
        :moreLink="displayMoreLink"
      />

      <div class="services-grid">
        <ServiceCard
          v-for="item in displayItems"
          :key="item.num"
          :item="item"
        />
      </div>
    </div>
  </section>
</template>

<style scoped>
.services-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 16px;
}

@media (max-width: 760px) {
  .services-grid {
    grid-template-columns: minmax(0, 1fr);
  }
}
</style>
