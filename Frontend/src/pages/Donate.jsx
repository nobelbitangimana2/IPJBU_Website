import React from 'react'
import { useTranslation } from 'react-i18next'
import { useData } from '../store/DataContext'
import Button from '../components/Button'
import Reveal from '../components/Reveal'
import './Donate.css'

export default function Donate() {
  const { t } = useTranslation()
  const { content, contact } = useData()
  const donationMethods = (content.donationMethods || []).filter(Boolean)

  return (
    <div className="donate-page">
      <div className="page-hero">
        <div className="container page-hero__inner">
          <span className="page-hero__label">{t('nav.donate')}</span>
          <h1 className="page-hero__title">{t('donate.hero.title')}</h1>
          <p className="page-hero__sub">{t('donate.hero.sub')}</p>
        </div>
      </div>

      <section className="section section--cream">
        <div className="container donate__grid">
          <Reveal as="article" className="donate__card">
            <h2>{t('donate.methods.title')}</h2>
            <p>{t('donate.methods.body')}</p>
          </Reveal>

          <Reveal as="article" className="donate__impact" delay={90}>
            <h2>{t('donate.payment.title')}</h2>
            {donationMethods.length ? (
              <ul>
                {donationMethods.map((method, index) => <li key={`${method}-${index}`}>{method}</li>)}
              </ul>
            ) : (
              <p className="donate__placeholder">{t('donate.payment.empty')}</p>
            )}
          </Reveal>
        </div>
      </section>

      <section className="section section--white">
        <div className="container donate__thanks">
          <Reveal className="donate__thanks-content">
            <h2>{t('donate.thanks')}</h2>
            <p>{t('donate.contact')}</p>
            <div className="donate__contact-links">
              {contact?.email && <a href={`mailto:${contact.email}`}>{contact.email}</a>}
              {contact?.phone && <a href={`tel:${contact.phone.replace(/\s/g, '')}`}>{contact.phone}</a>}
            </div>
            <Button to="/contact" size="lg">{t('contactus')}</Button>
          </Reveal>
        </div>
      </section>
    </div>
  )
}
