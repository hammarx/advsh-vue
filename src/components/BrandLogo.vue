<script setup>
import { computed } from 'vue'
import { useI18n } from '../i18n/useI18n'
import logoSvg from '../assets/advsh-logo.svg'

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
  gap: 15px;
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
  padding-left: 15px;
  border-left: 1px solid var(--line-strong);
  color: var(--muted);
  font-size: 9.5px;
  font-weight: 700;
  line-height: 1.45;
  letter-spacing: .13em;
  text-transform: uppercase;
}

:global(html[lang="ru"]) .logo-sub {
  font-size: 9px;
  letter-spacing: .08em;
}
:global([dir="rtl"]) .logo-sub {
  padding-left: 0;
  padding-right: 15px;
  border-left: 0;
  border-right: 1px solid var(--line-strong);
}

.logo--footer {
  color: var(--cream);
}
.logo--footer .logo-mark {
  height: 54px;
}
.logo--footer .logo-sub {
  color: rgba(244, 239, 228, .48);
  border-color: rgba(244, 239, 228, .22);
}

@media (max-width: 980px) {
  .logo:not(.logo--footer) .logo-sub {
    display: none;
  }
}

@media (max-width: 760px) {
  .logo:not(.logo--footer) .logo-mark {
    height: 35px;
  }
}

@media (max-width: 480px) {
  .logo:not(.logo--footer) .logo-mark {
    height: 32px;
  }
}
</style>
