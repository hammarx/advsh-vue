<script setup>
import { computed } from 'vue'
import { useSiteStore } from '../../stores/siteStore'

const props = defineProps({
  items: {
    type: Array,
    default: undefined,
  },
})

const store = useSiteStore()
const marqueeItems = computed(() => props.items ?? store.marquee)
</script>

<template>
  <div class="marquee" aria-hidden="true">
    <div class="marquee-track">
      <div
        v-for="groupIdx in 2"
        :key="groupIdx"
        class="marquee-group"
      >
        <span
          v-for="(item, idx) in marqueeItems"
          :key="idx"
        >
          {{ item }} <i>✳</i>
        </span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.marquee {
  overflow: hidden;
  color: var(--cream);
  background: var(--logo-blue);
  border-top: 1px solid var(--logo-blue);
  border-bottom: 1px solid var(--logo-blue);
  direction: ltr;
}
.marquee-track {
  display: flex;
  width: max-content;
  animation: marquee 32s linear infinite;
}
.marquee:hover .marquee-track {
  animation-play-state: paused;
}
.marquee-group {
  display: flex;
  flex: none;
  align-items: center;
}
.marquee-group span {
  display: inline-flex;
  align-items: center;
  gap: 16px;
  padding: 13px 18px;
  font-size: 10.5px;
  font-weight: 750;
  letter-spacing: .18em;
  text-transform: uppercase;
  white-space: nowrap;
}
.marquee-group i {
  color: var(--logo-red);
  font-size: 15px;
  font-style: normal;
}

@keyframes marquee {
  to {
    transform: translateX(-50%);
  }
}

@media (max-width: 760px) {
  .marquee-group span {
    padding: 11px 14px;
    font-size: 9.5px;
  }
}

@media print {
  .marquee {
    display: none !important;
  }
}
</style>
