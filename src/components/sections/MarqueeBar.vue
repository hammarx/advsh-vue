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
const baseItems = computed(() => props.items ?? store.marquee ?? [])

// Repeat the items 3x inside each half so a single half is always wider than any screen (even 4K),
// guaranteeing a seamless, gap-free -50% loop.
const repeatedItems = computed(() => [
  ...baseItems.value,
  ...baseItems.value,
  ...baseItems.value,
])
</script>

<template>
  <div class="marquee" aria-hidden="true">
    <div class="marquee-track">
      <div
        v-for="halfIdx in 2"
        :key="halfIdx"
        class="marquee-group"
      >
        <span
          v-for="(item, idx) in repeatedItems"
          :key="`${halfIdx}-${idx}`"
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
  user-select: none;
}

.marquee-track {
  display: flex;
  width: max-content;
  will-change: transform;
  animation: marquee 48s linear infinite;
}

.marquee:hover .marquee-track {
  animation-play-state: paused;
}

.marquee-group {
  display: flex;
  flex: none;
  align-items: center;
  min-width: 100vw;
  justify-content: space-around;
}

.marquee-group span {
  display: inline-flex;
  align-items: center;
  gap: 16px;
  padding: 13px 18px;
  font-size: 10.5px;
  font-weight: 750;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  white-space: nowrap;
}

html[lang='ar'] .marquee-group span {
  letter-spacing: 0.04em;
  font-size: 11.5px;
}

html[lang='ru'] .marquee-group span {
  letter-spacing: 0.08em;
}

.marquee-group i {
  color: var(--logo-red);
  font-size: 15px;
  font-style: normal;
}

@keyframes marquee {
  0% {
    transform: translate3d(0, 0, 0);
  }
  100% {
    transform: translate3d(-50%, 0, 0);
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
