<script setup>
import { computed } from 'vue'
import LanguageSwitcher from './LanguageSwitcher.vue'
import { useI18n } from '@/i18n/useI18n'

const props = defineProps({
  announcement: {
    type: String,
    default: undefined,
  },
  currentLang: {
    type: String,
    default: undefined,
  },
  languages: {
    type: Array,
    default: undefined,
  },
})

const emit = defineEmits(['lang-change'])
const { t } = useI18n()

const resolvedAnnouncement = computed(() => props.announcement ?? t.value.nav.announcement)
</script>

<template>
  <div class="topline">
    <div class="shell topline-inner">
      <p>
        <span class="topline-dot"></span>
        <slot>{{ resolvedAnnouncement }}</slot>
      </p>
      <LanguageSwitcher
        :current-lang="currentLang"
        :languages="languages"
        @change="emit('lang-change', $event)"
      />
    </div>
  </div>
</template>

<style scoped>
.topline {
  color: var(--text-on-dark-soft);
  background: var(--logo-blue);
  font-size: 10.5px;
  font-weight: 600;
  letter-spacing: .17em;
  text-transform: uppercase;
}
:global(html[lang="ar"]) .topline {
  letter-spacing: .04em;
}
:global(html[lang="ru"]) .topline {
  letter-spacing: .05em;
}
.topline-inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
  min-height: 37px;
}
.topline p {
  display: flex;
  align-items: center;
  gap: 9px;
}
.topline-dot {
  width: 6px;
  height: 6px;
  flex: none;
  border-radius: 50%;
  background: var(--logo-red);
  box-shadow: 0 0 0 4px var(--logo-red-glow);
}

@media (max-width: 760px) {
  .topline-inner > p:first-child {
    display: none;
  }
  .topline-inner {
    justify-content: center;
    min-height: 34px;
  }
}

@media print {
  .topline {
    display: none !important;
  }
}
</style>
