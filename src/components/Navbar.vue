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
  reportCta: {
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
const internalActiveHref = ref(
  props.activeHref || (typeof window !== 'undefined' ? window.location.hash : '')
)
const { t } = useI18n()

const currentActiveHref = computed(() => props.activeHref || internalActiveHref.value)
const resolvedSkipLabel = computed(() => props.skipLabel ?? t.value.nav.skipToContent)
const resolvedNavItems = computed(() => props.navItems ?? t.value.nav.items)
const resolvedCta = computed(() => props.cta ?? t.value.nav.cta)
const resolvedReportCta = computed(() => props.reportCta ?? t.value.nav.reportCta)
const resolvedMenuLabel = computed(() => props.menuLabel ?? t.value.nav.menu)
const resolvedMenuAriaLabel = computed(() => props.menuAriaLabel ?? t.value.nav.menuAriaLabel)
const resolvedNavAriaLabel = computed(() => props.navAriaLabel ?? t.value.nav.mainNavAriaLabel)

function handleNavClick(item, event) {
  internalActiveHref.value = item.href
  isMenuOpen.value = false
  emit('navigate', { item, event })
}

function handleLogoClick() {
  internalActiveHref.value = ''
  isMenuOpen.value = false
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
      <BrandLogo @click="handleLogoClick" />

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
          :aria-current="currentActiveHref === item.href ? 'page' : undefined"
          @click="handleNavClick(item, $event)"
        >
          {{ item.label }}
        </a>

        <div class="nav-actions">
          <a
            v-if="resolvedCta"
            class="nav-cta nav-cta--blue"
            :href="resolvedCta.href"
            @click="handleNavClick(resolvedCta, $event)"
          >
            {{ resolvedCta.label }}
            <span v-if="resolvedCta.arrow" class="arr">{{ resolvedCta.arrow }}</span>
          </a>

          <a
            v-if="resolvedReportCta"
            class="nav-cta nav-cta--red"
            :href="resolvedReportCta.href"
            @click="handleNavClick(resolvedReportCta, $event)"
          >
            {{ resolvedReportCta.label }}
            <span v-if="resolvedReportCta.arrow" class="arr">{{ resolvedReportCta.arrow }}</span>
          </a>
        </div>
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
  gap: 20px;
  min-height: 86px;
}

.main-nav {
  display: flex;
  align-items: center;
  gap: 22px;
}
.main-nav > a {
  position: relative;
  padding: 5px 0;
  font-size: 14px;
  font-weight: 650;
  text-decoration: none;
  white-space: nowrap;
}
.main-nav > a::after {
  content: "";
  position: absolute;
  right: 0;
  bottom: 0;
  left: 0;
  height: 1.5px;
  background: var(--logo-red, #db2a26);
  transform: scaleX(0);
  transform-origin: left;
  transition: transform .25s ease;
}
.main-nav > a:hover::after,
.main-nav > a[aria-current="page"]::after {
  transform: scaleX(1);
}
.main-nav > a[aria-current="page"] {
  color: var(--logo-red, #db2a26);
}

.nav-actions {
  display: inline-flex;
  align-items: center;
  gap: 10px;
}

.nav-cta {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 11px 20px;
  border-radius: 999px;
  color: #ffffff;
  font-size: 13.5px;
  font-weight: 700;
  text-decoration: none;
  white-space: nowrap;
  transition: background .25s, transform .25s;
}
.nav-cta .arr {
  color: #ffffff;
  transition: transform .25s;
}
.nav-cta:hover {
  transform: translateY(-1px);
}
.nav-cta:hover .arr {
  transform: translate(2px, -2px);
}

.nav-cta--blue {
  background: var(--logo-blue, #082f77);
}
.nav-cta--blue:hover {
  background: #052259;
}

.nav-cta--red {
  background: var(--logo-red, #db2a26);
}
.nav-cta--red:hover {
  background: #b8201d;
}

@media (min-width: 1081px) {
  html[lang="ru"] .main-nav,
  html[lang="pl"] .main-nav {
    gap: 14px;
  }
  html[lang="ru"] .main-nav > a,
  html[lang="pl"] .main-nav > a {
    font-size: 13px;
  }
  html[lang="ru"] .nav-cta,
  html[lang="pl"] .nav-cta {
    padding: 10px 14px;
    font-size: 12.5px;
  }
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

@media (max-width: 1220px) and (min-width: 1081px) {
  .header-inner {
    gap: 14px;
  }
  .main-nav {
    gap: 15px;
  }
  .main-nav > a {
    font-size: 13px;
  }
  .nav-cta {
    padding: 10px 15px;
    font-size: 12.5px;
  }
}

@media (max-width: 1080px) {
  .menu-btn {
    display: inline-flex;
    align-items: center;
    gap: 9px;
    padding: 10px 14px;
    border: 1px solid var(--line-strong);
    border-radius: 999px;
    cursor: pointer;
    font-size: 11px;
    font-weight: 800;
    letter-spacing: .11em;
    text-transform: uppercase;
    user-select: none;
    background: rgba(251, 248, 240, .6);
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
    outline: 2px solid var(--logo-red, #db2a26);
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
    box-shadow: 0 24px 48px -20px rgba(16, 32, 31, .25);
    opacity: 0;
    pointer-events: none;
    transition: max-height .35s ease, opacity .25s, padding .35s;
  }
  #menu-toggle:checked ~ .main-nav {
    max-height: 540px;
    padding: 12px 32px 24px;
    border-color: var(--line);
    opacity: 1;
    pointer-events: auto;
  }
  .main-nav > a {
    padding: 13px 0;
    border-bottom: 1px solid var(--line);
    font-size: 16px;
  }
  .main-nav > a[aria-current="page"] {
    color: var(--logo-red, #db2a26);
    border-bottom-color: var(--logo-red, #db2a26);
    font-weight: 750;
  }
  .main-nav > a::after {
    display: none;
  }
  .nav-actions {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 10px;
    margin-top: 16px;
  }
  .nav-cta {
    justify-content: center;
    padding: 14px 18px;
    font-size: 14px;
    text-align: center;
  }
}

@media (max-width: 760px) {
  .header-inner {
    min-height: 70px;
  }
  .main-nav {
    padding: 0 20px;
  }
  #menu-toggle:checked ~ .main-nav {
    padding: 10px 20px 22px;
  }
}

@media (max-width: 520px) {
  .nav-actions {
    grid-template-columns: minmax(0, 1fr);
  }
}

@media print {
  .site-header {
    display: none !important;
  }
}
</style>
