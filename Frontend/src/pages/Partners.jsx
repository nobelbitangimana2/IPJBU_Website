import React from 'react'
import Button from '../components/Button'
import { useData } from '../store/DataContext'
import { useLang } from '../store/LangContext'
import Reveal from '../components/Reveal'
import './Partners.css'

const TYPE_ICONS = ['🌾', '💰', '🤝', '📢']

export default function Partners() {
  const { content }     = useData()
  const { t }           = useLang()
  const types = TYPE_ICONS.map((icon, index) => ({
    icon,
    title: t(`partners.types.${index + 1}.title`),
    desc: t(`partners.types.${index + 1}.desc`),
  }))

  const rawPartners = content?.partners ?? []
  const partners = rawPartners.map((p, i) =>
    typeof p === 'string'
      ? { id: i, name: p, logoUrl: null, websiteUrl: null, description: null }
      : { id: i, name: p.name, logoUrl: p.logoUrl ?? null, websiteUrl: p.websiteUrl ?? null, description: p.description ?? null }
  )

  return (
    <div className="partners-page">

      <div className="page-hero">
        <div className="container page-hero__inner">
          <span className="page-hero__label">IPJBU – DUHINDURINGENDO</span>
          <h1 className="page-hero__title">{t('partners.hero.title')}</h1>
          <p className="page-hero__sub">{t('partners.hero.sub')}</p>
        </div>
      </div>

      {/* Current partners */}
      <section className="section section--white">
        <div className="container">
          <Reveal className="section__header">
            <span className="section__label">{t('partners.supporting')}</span>
            <h2 className="section__title">{t('partners.title')}</h2>
          </Reveal>

          {partners.length === 0 ? (
            <div className="partners__empty">
              <span className="partners__empty-icon" aria-hidden="true">🤝</span>
              <h3>{t('partners.empty.title')}</h3>
              <p>
                {t('partners.empty.body')}
              </p>
              <Button to="/contact">{t('partners.cta.btn')}</Button>
            </div>
          ) : (
            <div className="partners__grid">
              {partners.map((p, index) => (
                <Reveal key={p.id} as="article" className="partner-card" delay={index * 65}>
                  {p.logoUrl && (
                    <div className="partner-card__logo-wrap">
                      <img src={p.logoUrl} alt={`Logo ${p.name}`} className="partner-card__logo" loading="lazy" />
                    </div>
                  )}
                  <div className="partner-card__body">
                    <h3 className="partner-card__name">{p.name}</h3>
                    {p.description && <p className="partner-card__desc">{p.description}</p>}
                    {p.websiteUrl && (
                      <a href={p.websiteUrl} target="_blank" rel="noopener noreferrer"
                        className="partner-card__link"
                        aria-label={`${t('partners.visit')} ${p.name}`}>
                        {t('partners.visit')} &uarr;
                      </a>
                    )}
                  </div>
                  </Reveal>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Partnership types */}
      <section className="section section--cream">
        <div className="container">
          <Reveal className="section__header">
            <span className="section__label">{t('partners.types.label')}</span>
            <h2 className="section__title">{t('partners.types.title')}</h2>
          </Reveal>
          <div className="partners__types-grid">
            {types.map(({ icon, title, desc }, index) => (
              <Reveal key={title} as="article" className="partners-type-card" delay={index * 65}>
                <span className="partners-type-card__icon" aria-hidden="true">{icon}</span>
                <h3 className="partners-type-card__title">{title}</h3>
                <p className="partners-type-card__desc">{desc}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section section--green">
        <div className="container text-center">
          <h2 className="section__title" style={{ marginBottom: '0.75rem' }}>
            {t('partners.network.title')}
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.78)', marginBottom: '1.75rem', maxWidth: 560, margin: '0 auto 1.75rem', fontSize: '1.05rem', lineHeight: 1.7 }}>
            {t('partners.network.sub')}
          </p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Button to="/contact" size="lg">{t('partners.cta.btn')}</Button>
            <Button to="/opportunities" size="lg" variant="outline-white">
              {t('partners.opportunities')}
            </Button>
          </div>
        </div>
      </section>

    </div>
  )
}
