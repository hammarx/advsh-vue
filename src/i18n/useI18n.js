import { ref, computed, watchEffect } from 'vue'
import { LANGUAGES, translations } from './translations'

const currentLang = ref('de')

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

export function useI18n() {
  const t = computed(() => translations[currentLang.value] || translations.de)
  const currentLanguage = computed(
    () => LANGUAGES.find((l) => l.code === currentLang.value) || LANGUAGES[0]
  )

  function setLang(code) {
    if (translations[code]) {
      currentLang.value = code
    }
  }

  return {
    currentLang,
    currentLanguage,
    languages: LANGUAGES,
    t,
    setLang,
  }
}
