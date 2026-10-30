import de from './locales/de'
import en from './locales/en'
import ar from './locales/ar'
import tr from './locales/tr'
import ru from './locales/ru'
import pl from './locales/pl'

export const LANGUAGES = [
  { code: 'de', label: 'DE', name: 'DE – Deutsch', dir: 'ltr' },
  { code: 'en', label: 'EN', name: 'EN – English', dir: 'ltr' },
  { code: 'ar', label: 'AR', name: 'AR – العربية', dir: 'rtl' },
  { code: 'tr', label: 'TR', name: 'TR – Türkçe', dir: 'ltr' },
  { code: 'ru', label: 'RU', name: 'RU – Русский', dir: 'ltr' },
  { code: 'pl', label: 'PL', name: 'PL – Polski', dir: 'ltr' },
]

export const translations = {
  de,
  en,
  ar,
  tr,
  ru,
  pl,
}
