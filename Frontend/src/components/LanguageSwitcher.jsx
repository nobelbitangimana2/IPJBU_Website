import React, { useId } from 'react'
import { useTranslation } from 'react-i18next'
import { useLang } from '../store/LangContext'

function FrenchFlag() {
  return (
    <svg viewBox="0 0 3 2" aria-hidden="true" focusable="false">
      <rect width="1" height="2" fill="#0055A4" />
      <rect x="1" width="1" height="2" fill="#fff" />
      <rect x="2" width="1" height="2" fill="#EF4135" />
    </svg>
  )
}

function EnglishFlag({ id }) {
  return (
    <svg viewBox="0 0 60 30" aria-hidden="true" focusable="false">
      <clipPath id={`uk-s-${id}`}><path d="M0,0 v30 h60 v-30 z" /></clipPath>
      <clipPath id={`uk-t-${id}`}><path d="M30,15 h30 v15 z v15 h-30 z h-30 v-15 z v-15 h30 z" /></clipPath>
      <g clipPath={`url(#uk-s-${id})`}>
        <path d="M0,0 v30 h60 v-30 z" fill="#012169" />
        <path d="M0,0 L60,30 M60,0 L0,30" stroke="#fff" strokeWidth="6" />
        <path d="M0,0 L60,30 M60,0 L0,30" clipPath={`url(#uk-t-${id})`} stroke="#C8102E" strokeWidth="4" />
        <path d="M30,0 v30 M0,15 h60" stroke="#fff" strokeWidth="10" />
        <path d="M30,0 v30 M0,15 h60" stroke="#C8102E" strokeWidth="6" />
      </g>
    </svg>
  )
}

export default function LanguageSwitcher({ mobile = false, disabled = false }) {
  const { lang, setLanguage } = useLang()
  const { t } = useTranslation()
  const id = useId().replace(/:/g, '')
  const baseClass = mobile ? 'navbar__mobile-lang' : 'navbar__lang'

  return (
    <div
      className={mobile ? 'navbar__mobile-languages' : 'navbar__languages'}
      role="group"
      aria-label={t('language.choose')}
    >
      <button
        type="button"
        className={`${baseClass}${lang === 'fr' ? ` ${baseClass}--active` : ''}`}
        onClick={() => setLanguage('fr')}
        aria-label="Français"
        aria-pressed={lang === 'fr'}
        disabled={disabled}
        title="Français"
      >
        <FrenchFlag />
      </button>
      <button
        type="button"
        className={`${baseClass}${lang === 'en' ? ` ${baseClass}--active` : ''}`}
        onClick={() => setLanguage('en')}
        aria-label="English"
        aria-pressed={lang === 'en'}
        disabled={disabled}
        title="English"
      >
        <EnglishFlag id={id} />
      </button>
    </div>
  )
}
