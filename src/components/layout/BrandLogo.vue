<script setup>
import { computed } from 'vue'
import { useI18n } from '@/i18n/useI18n'
import logoSvg from '@/assets/advsh-logo.svg'

const props = defineProps({
  href: {
    type: String,
    default: '#top',
  },
  ariaLabel: {
    type: String,
    default: undefined,
  },
  subtitleLines: {
    type: Array,
    default: undefined,
  },
  showSubtitle: {
    type: Boolean,
    default: true,
  },
  variant: {
    type: String,
    default: 'default', // 'default' | 'footer'
  },
})

const { t } = useI18n()

const resolvedAriaLabel = computed(() => props.ariaLabel ?? t.value.nav.logoAriaLabel)
const resolvedSubtitles = computed(() => props.subtitleLines ?? t.value.nav.logoSubtitle)
</script>

<template>
  <a
    class="logo"
    :class="{ 'logo--footer': variant === 'footer' }"
    :href="href"
    :aria-label="resolvedAriaLabel"
  >
    <img
      class="logo-mark"
      :src="logoSvg"
      alt=""
      width="250"
      height="165"
      aria-hidden="true"
    />

    <span v-if="showSubtitle && resolvedSubtitles.length" class="logo-sub">
      <template v-for="(line, index) in resolvedSubtitles" :key="index">
        {{ line }}<br v-if="index < resolvedSubtitles.length - 1" />
      </template>
    </span>
  </a>
</template>

<style scoped>
.logo {
  display: inline-flex;
  align-items: center;
  gap: 14px;
  flex-shrink: 0;
  color: inherit;
  text-decoration: none;
}

.logo-mark {
  flex: none;
  height: 40px;
  width: auto;
  display: block;
}

.logo-sub {
  flex-shrink: 0;
  padding-left: 14px;
  border-left: 1px solid var(--line-strong);
  color: var(--muted);
  font-size: 9.5px;
  font-weight: 700;
  line-height: 1.45;
  letter-spacing: .12em;
  text-transform: uppercase;
  white-space: nowrap;
}

html[lang="ru"] .logo-sub,
html[lang="pl"] .logo-sub {
  font-size: 8.5px;
  letter-spacing: .06em;
}

html[lang="ar"] .logo-sub {
  font-size: 10px;
  letter-spacing: 0;
}

[dir="rtl"] .logo-sub {
  padding-left: 0;
  padding-right: 14px;
  border-left: 0;
  border-right: 1px solid var(--line-strong);
}

.logo--footer {
  color: var(--cream);
}
.logo--footer .logo-mark {
  height: 50px;
  padding: 6px 10px;
  border-radius: 12px;
  background: var(--cream);
}
.logo--footer .logo-sub {
  color: rgba(244, 239, 228, .62);
  border-color: rgba(244, 239, 228, .22);
}

@media (max-width: 1240px) {
  .logo:not(.logo--footer) .logo-sub {
    display: none;
  }
}

@media (max-width: 760px) {
  .logo:not(.logo--footer) .logo-mark {
    height: 34px;
  }
}

@media (max-width: 480px) {
  .logo:not(.logo--footer) .logo-mark {
    height: 30px;
  }
}
</style>
