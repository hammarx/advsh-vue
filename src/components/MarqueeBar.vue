<script setup>
import { computed } from 'vue'
import { useI18n } from '../i18n/useI18n'

const props = defineProps({
  items: {
    type: Array,
    default: undefined,
  },
})

const { t } = useI18n()
const marqueeItems = computed(() => props.items ?? t.value.marquee)
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
  background: var(--logo-blue, #082f77);
  border-top: 1px solid var(--logo-blue, #082f77);
  border-bottom: 1px solid var(--logo-blue, #082f77);
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
  color: var(--logo-red, #db2a26);
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
