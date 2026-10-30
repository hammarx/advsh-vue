import { storeToRefs } from 'pinia'
import { useSiteStore } from '../stores/siteStore'

export function useI18n() {
  const store = useSiteStore()
  const { currentLang, currentLanguage, t } = storeToRefs(store)

  return {
    currentLang,
    currentLanguage,
    languages: store.languages,
    t,
    tr: store.tr,
    setLang: store.setLang,
  }
}
