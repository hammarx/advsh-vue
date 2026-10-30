import { ref, computed, watchEffect } from 'vue'
import { LANGUAGES, translations } from './translations'

const STORAGE_KEY = 'advsh_lang'

function getInitialLang() {
  if (typeof window !== 'undefined' && window.localStorage) {
    const saved = window.localStorage.getItem(STORAGE_KEY)
    if (saved && translations[saved]) return saved
  }
  return 'de'
}

const currentLang = ref(getInitialLang())

function applyDocumentLocale(langCode) {
  if (typeof document === 'undefined') return
  const langMeta = LANGUAGES.find((l) => l.code === langCode) || LANGUAGES[0]
  const localeData = translations[langCode] || translations.de

  document.documentElement.lang = langMeta.code
  document.documentElement.dir = langMeta.dir
  if (localeData.pageTitle) {
    document.title = localeData.pageTitle
  }
}

watchEffect(() => {
  applyDocumentLocale(currentLang.value)
})

function resolvePath(obj, path) {
  if (!obj || !path) return undefined
  return path.split('.').reduce((acc, part) => (acc != null ? acc[part] : undefined), obj)
}

export function useI18n() {
  const t = computed(() => translations[currentLang.value] || translations.de)
  const currentLanguage = computed(
    () => LANGUAGES.find((l) => l.code === currentLang.value) || LANGUAGES[0]
  )

  function setLang(code) {
    if (translations[code]) {
      currentLang.value = code
      if (typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.setItem(STORAGE_KEY, code)
      }
    }
  }

  /**
   * Translate a dot-separated key path (e.g. 'nav.reportCta.label') with fallback to German or a custom string.
   */
  function tr(keyPath, fallback = '') {
    const val = resolvePath(t.value, keyPath)
    if (val !== undefined) return val
    const deFallback = resolvePath(translations.de, keyPath)
    return deFallback !== undefined ? deFallback : fallback || keyPath
  }

  return {
    currentLang,
    currentLanguage,
    languages: LANGUAGES,
    t,
    tr,
    setLang,
  }
}
