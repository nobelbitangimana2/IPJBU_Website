import i18n from 'i18next'
import LanguageDetector from 'i18next-browser-languagedetector'
import { initReactI18next } from 'react-i18next'
import fr from './fr.json'
import en from './en.json'

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      fr: { translation: fr },
      en: { translation: en },
    },
    fallbackLng: 'fr',
    supportedLngs: ['fr', 'en'],
    defaultNS: 'translation',
    keySeparator: false,
    interpolation: { escapeValue: false },
    detection: {
      order: ['localStorage'],
      lookupLocalStorage: 'ipjbu-lang',
      caches: ['localStorage'],
    },
  })

i18n.on('languageChanged', (language) => {
  document.documentElement.lang = language
})

document.documentElement.lang = i18n.resolvedLanguage || 'fr'

export default i18n
