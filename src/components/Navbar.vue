<script setup>
import { ref, computed } from 'vue'
import TopBar from './TopBar.vue'
import BrandLogo from './BrandLogo.vue'
import { useI18n } from '../i18n/useI18n'

const props = defineProps({
  skipLabel: {
    type: String,
    default: undefined,
  },
  skipTarget: {
    type: String,
    default: '#main',
  },
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
  activeHref: {
    type: String,
    default: '',
  },
  navItems: {
    type: Array,
    default: undefined,
  },
  cta: {
    type: Object,
    default: undefined,
  },
  menuLabel: {
    type: String,
    default: undefined,
  },
  menuAriaLabel: {
    type: String,
    default: undefined,
  },
  navAriaLabel: {
    type: String,
    default: undefined,
  },
})

const emit = defineEmits(['navigate', 'lang-change'])
const isMenuOpen = ref(false)
const { t } = useI18n()

const resolvedSkipLabel = computed(() => props.skipLabel ?? t.value.nav.skipToContent)
const resolvedNavItems = computed(() => props.navItems ?? t.value.nav.items)
const resolvedCta = computed(() => props.cta ?? t.value.nav.cta)
const resolvedMenuLabel = computed(() => props.menuLabel ?? t.value.nav.menu)
const resolvedMenuAriaLabel = computed(() => props.menuAriaLabel ?? t.value.nav.menuAriaLabel)
const resolvedNavAriaLabel = computed(() => props.navAriaLabel ?? t.value.nav.mainNavAriaLabel)

function handleNavClick(item, event) {
  isMenuOpen.value = false
  emit('navigate', { item, event })
}
</script>

<template>
  <a class="skip-link" :href="skipTarget">{{ resolvedSkipLabel }}</a>

  <TopBar
    :announcement="announcement"
    :current-lang="currentLang"
    :languages="languages"
    @lang-change="emit('lang-change', $event)"
  />

  <header class="site-header">
    <div class="shell header-inner">
      <BrandLogo />

      <input
        id="menu-toggle"
        v-model="isMenuOpen"
        class="menu-toggle"
        type="checkbox"
        :aria-label="resolvedMenuAriaLabel"
      />
      <label class="menu-btn" for="menu-toggle">
        <span class="menu-bars" aria-hidden="true">
          <span></span>
          <span></span>
        </span>
        <span>{{ resolvedMenuLabel }}</span>
      </label>

      <nav class="main-nav" :aria-label="resolvedNavAriaLabel">
        <a
          v-for="item in resolvedNavItems"
          :key="item.key || item.href + item.label"
          :href="item.href"
          :aria-current="activeHref === item.href ? 'page' : undefined"
          @click="handleNavClick(item, $event)"
        >
          {{ item.label }}
        </a>

        <a
          v-if="resolvedCta"
          class="nav-cta"
          :href="resolvedCta.href"
          @click="handleNavClick(resolvedCta, $event)"
        >
          {{ resolvedCta.label }}
          <span v-if="resolvedCta.arrow" class="arr">{{ resolvedCta.arrow }}</span>
        </a>
      </nav>
    </div>
  </header>
</template>

<style scoped>
.skip-link {
  position: absolute;
  top: -100px;
  left: 24px;
  z-index: 200;
  padding: 12px 18px;
  border-radius: 0 0 12px 12px;
  color: var(--cream);
  background: var(--ink);
  font-size: 14px;
  font-weight: 700;
}
.skip-link:focus {
  top: 0;
}

.site-header {
  position: sticky;
  top: 0;
  z-index: 100;
  background: rgba(244, 239, 228, .92);
  border-bottom: 1px solid var(--line);
  backdrop-filter: blur(14px);
  -webkit-backdrop-filter: blur(14px);
}

.header-inner {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 26px;
  min-height: 86px;
}

.main-nav {
  display: flex;
  align-items: center;
  gap: 27px;
}
.main-nav > a {
  position: relative;
  font-size: 14px;
  font-weight: 650;
  text-decoration: none;
  white-space: nowrap;
}
.main-nav > a:not(.nav-cta) {
  padding: 5px 0;
}
.main-nav > a:not(.nav-cta)::after {
  content: "";
  position: absolute;
  right: 0;
  bottom: 0;
  left: 0;
  height: 1.5px;
  background: var(--coral);
  transform: scaleX(0);
  transform-origin: left;
  transition: transform .25s ease;
}
.main-nav > a:not(.nav-cta):hover::after,
.main-nav > a[aria-current="page"]::after {
  transform: scaleX(1);
}
.main-nav > a[aria-current="page"] {
  color: var(--teal);
}

.main-nav > .nav-cta {
  display: inline-flex;
  align-items: center;
  gap: 9px;
  padding: 12px 22px;
  border-radius: 999px;
  color: var(--cream);
  background: var(--ink);
  transition: background .25s, transform .25s;
}
.nav-cta .arr {
  transition: transform .25s;
}
.nav-cta:hover {
  background: var(--teal);
  transform: translateY(-1px);
}
.nav-cta:hover .arr {
  transform: translate(2px, -2px);
}

.menu-toggle {
  position: absolute;
  width: 1px;
  height: 1px;
  opacity: 0;
  pointer-events: none;
}
.menu-btn {
  display: none;
}

@media (max-width: 1120px) {
  .header-inner {
    gap: 18px;
  }
  .main-nav {
    gap: 19px;
  }
  .main-nav > a {
    font-size: 13px;
  }
}

@media (max-width: 980px) {
  .menu-btn {
    display: inline-flex;
    align-items: center;
    gap: 9px;
    padding: 9px 12px;
    border: 1px solid var(--line-strong);
    border-radius: 999px;
    cursor: pointer;
    font-size: 11px;
    font-weight: 800;
    letter-spacing: .11em;
    text-transform: uppercase;
    user-select: none;
  }
  .menu-bars {
    display: grid;
    gap: 4px;
    width: 16px;
  }
  .menu-bars span {
    display: block;
    height: 1.5px;
    background: currentColor;
    transition: transform .25s;
  }
  #menu-toggle:checked + .menu-btn .menu-bars span:first-child {
    transform: translateY(2.75px) rotate(45deg);
  }
  #menu-toggle:checked + .menu-btn .menu-bars span:last-child {
    transform: translateY(-2.75px) rotate(-45deg);
  }
  #menu-toggle:focus-visible + .menu-btn {
    outline: 2px solid var(--coral);
    outline-offset: 3px;
  }

  .main-nav {
    position: absolute;
    top: 100%;
    right: 0;
    left: 0;
    display: flex;
    flex-direction: column;
    align-items: stretch;
    gap: 0;
    max-height: 0;
    padding: 0 32px;
    overflow: hidden;
    background: var(--cream);
    border-bottom: 1px solid transparent;
    opacity: 0;
    pointer-events: none;
    transition: max-height .35s ease, opacity .25s, padding .35s;
  }
  #menu-toggle:checked ~ .main-nav {
    max-height: 440px;
    padding: 12px 32px 24px;
    border-color: var(--line);
    opacity: 1;
    pointer-events: auto;
  }
  .main-nav > a:not(.nav-cta) {
    padding: 13px 0;
    border-bottom: 1px solid var(--line);
    font-size: 16px;
  }
  .main-nav > a:not(.nav-cta)::after {
    display: none;
  }
  .main-nav > .nav-cta {
    justify-content: center;
    margin-top: 14px;
    padding: 14px 20px;
    border-bottom: 0;
    font-size: 14px;
  }
}

@media (max-width: 760px) {
  .header-inner {
    min-height: 72px;
  }
}

@media print {
  .site-header {
    display: none !important;
  }
}
</style>
