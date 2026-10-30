import { ref, reactive, computed, watchEffect } from 'vue'
import { defineStore } from 'pinia'
import { LANGUAGES, translations } from '../i18n/translations'

const STORAGE_KEY = 'advsh_lang'

function getInitialLang() {
  if (typeof window !== 'undefined' && window.localStorage) {
    const saved = window.localStorage.getItem(STORAGE_KEY)
    if (saved && translations[saved]) return saved
  }
  return 'de'
}

function resolvePath(obj, path) {
  if (!obj || !path) return undefined
  return path.split('.').reduce((acc, part) => (acc != null ? acc[part] : undefined), obj)
}

export const useSiteStore = defineStore('site', () => {
  // 1. Language & Locale State
  const currentLang = ref(getInitialLang())
  const languages = LANGUAGES

  const currentLanguage = computed(
    () => languages.find((l) => l.code === currentLang.value) || languages[0]
  )

  const t = computed(() => translations[currentLang.value] || translations.de)

  function setLang(code) {
    if (translations[code]) {
      currentLang.value = code
      if (typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.setItem(STORAGE_KEY, code)
      }
    }
  }

  function tr(keyPath, fallback = '') {
    const val = resolvePath(t.value, keyPath)
    if (val !== undefined) return val
    const deFallback = resolvePath(translations.de, keyPath)
    return deFallback !== undefined ? deFallback : fallback || keyPath
  }

  // 2. Central Theme / Brand Color Tokens
  const theme = reactive({
    logoBlue: '#082f77',
    logoBlueHover: '#052259',
    logoRed: '#db2a26',
    logoRedHover: '#b8201d',
    yellow: '#f0c24b',
    cream: '#f4efe4',
    paper: '#fbf8f0',
    ink: '#10201f',
  })

  function updateTheme(newColors = {}) {
    Object.assign(theme, newColors)
  }

  // 3. Central Organization & Contact Data
  const contact = reactive({
    generalPhone: '0431 640 878 27',
    generalPhoneHref: 'tel:+4943164087827',
    beaggtivPhone: '0431 640 890 06',
    beaggtivPhoneHref: 'tel:+4943164089006',
    euFamPhone: '0431 696 684 56',
    euFamPhoneHref: 'tel:+4943169668456',
    fishPhone: '0431 696 684 55',
    fishPhoneHref: 'tel:+4943169668455',
    generalEmail: 'info@advsh.de',
    generalEmailHref: 'mailto:info@advsh.de',
    beaggtivEmail: 'MRgD@advsh.de',
    beaggtivEmailHref: 'mailto:MRgD@advsh.de',
    addressLines: ['Martensdamm 4', '24103 Kiel'],
  })

  // 4. Navigation & UI State
  const activeHref = ref(typeof window !== 'undefined' ? window.location.hash : '')
  const isMobileMenuOpen = ref(false)

  function setActiveHref(href) {
    activeHref.value = href
    isMobileMenuOpen.value = false
  }

  function clearActiveHref() {
    activeHref.value = ''
    isMobileMenuOpen.value = false
  }

  // 5. Section Content Getters
  const nav = computed(() => t.value.nav)
  const hero = computed(() => t.value.hero)
  const marquee = computed(() => t.value.marquee)
  const intro = computed(() => t.value.intro)
  const services = computed(() => t.value.services)
  const feature = computed(() => t.value.feature)
  const footer = computed(() => t.value.footer)

  // Sync HTML lang/dir/title and CSS Custom Properties
  watchEffect(() => {
    if (typeof document === 'undefined') return
    const langMeta = currentLanguage.value
    const localeData = t.value

    document.documentElement.lang = langMeta.code
    document.documentElement.dir = langMeta.dir
    if (localeData.pageTitle) {
      document.title = localeData.pageTitle
    }
  })

  watchEffect(() => {
    if (typeof document === 'undefined') return
    const root = document.documentElement.style
    root.setProperty('--logo-blue', theme.logoBlue)
    root.setProperty('--logo-blue-hover', theme.logoBlueHover)
    root.setProperty('--logo-red', theme.logoRed)
    root.setProperty('--logo-red-hover', theme.logoRedHover)
    root.setProperty('--yellow', theme.yellow)
    root.setProperty('--cream', theme.cream)
    root.setProperty('--paper', theme.paper)
    root.setProperty('--ink', theme.ink)
  })

  return {
    // Locale
    currentLang,
    currentLanguage,
    languages,
    t,
    tr,
    setLang,
    // Theme
    theme,
    updateTheme,
    // Contact
    contact,
    // Navigation UI
    activeHref,
    isMobileMenuOpen,
    setActiveHref,
    clearActiveHref,
    // Sections
    nav,
    hero,
    marquee,
    intro,
    services,
    feature,
    footer,
  }
})
