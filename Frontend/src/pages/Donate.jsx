import React from 'react'
import { useLang } from '../store/LangContext'
import { useData } from '../store/DataContext'
import Button from '../components/Button'
import './Donate.css'

export default function Donate() {
  const { lang, t } = useLang()
  const { contact } = useData()

  return (
    <div className="donate-page">
      <div className="page-hero">
        <div className="container page-hero__inner">
          <span className="page-hero__label">{t('nav.donate')}</span>
          <h1 className="page-hero__title">
            {lang === 'fr' ? 'Soutenez notre action' : 'Support our work'}
          </h1>
          <p className="page-hero__sub">
            {lang === 'fr'
              ? "Votre soutien aide les jeunes, les orphelins et les femmes vulnérables à développer leur autonomie."
              : 'Your support helps youth, orphans and vulnerable women build lasting independence.'}
          </p>
        </div>
      </div>

      <section className="section section--cream">
        <div className="container donate__grid">
          <div className="donate__card">
            <span className="donate__icon" aria-hidden="true">💚</span>
            <h2>{lang === 'fr' ? 'Faire un don' : 'Make a donation'}</h2>
            <p>
              {lang === 'fr'
                ? "Pour connaître les modalités de don, les coordonnées bancaires ou organiser un soutien matériel, contactez directement l'équipe IPJBU."
                : 'To receive donation instructions, banking details or arrange support in kind, contact the IPJBU team directly.'}
            </p>
            {contact?.email && (
              <a className="donate__contact" href={`mailto:${contact.email}`}>✉ {contact.email}</a>
            )}
            {contact?.phone && (
              <a className="donate__contact" href={`tel:${contact.phone.replace(/\s/g, '')}`}>📞 {contact.phone}</a>
            )}
            <Button to="/contact" size="lg">
              {lang === 'fr' ? 'Contacter l’IPJBU' : 'Contact IPJBU'}
            </Button>
          </div>

          <div className="donate__impact">
            <h2>{lang === 'fr' ? 'Votre soutien fait la différence' : 'Your support makes a difference'}</h2>
            <ul>
              <li>{lang === 'fr' ? 'Financer des formations agro-pastorales' : 'Fund agro-pastoral training'}</li>
              <li>{lang === 'fr' ? 'Fournir des semences, outils et intrants' : 'Provide seeds, tools and inputs'}</li>
              <li>{lang === 'fr' ? 'Accompagner les communautés vulnérables' : 'Support vulnerable communities'}</li>
            </ul>
          </div>
        </div>
      </section>
    </div>
  )
}
