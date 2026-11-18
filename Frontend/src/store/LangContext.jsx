import React from 'react'
import { useTranslation } from 'react-i18next'

export function LangProvider({ children }) {
  return children
}

export function useLang() {
  const { t, i18n } = useTranslation()
  const lang = i18n.resolvedLanguage === 'en' ? 'en' : 'fr'

  function setLanguage(nextLang) {
    if (nextLang !== 'fr' && nextLang !== 'en') return
    i18n.changeLanguage(nextLang)
  }

  function toggle() {
    setLanguage(lang === 'fr' ? 'en' : 'fr')
  }

  return { lang, t, toggle, setLanguage }
}
