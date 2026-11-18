import React from 'react'
import Button from '../components/Button'
import Reveal from '../components/Reveal'
import { useTranslation } from 'react-i18next'
import './Activities.css'

const OBJECTIVE_ICONS = ['📚', '🌐', '🛠️', '🏭', '💡']

export default function Programmes() {
  const { t } = useTranslation()
  const objectives = OBJECTIVE_ICONS.map((icon, index) => ({
    id: index + 1,
    icon,
    title: t(`prog.objectives.${index + 1}.title`),
    desc: t(`prog.objectives.${index + 1}.desc`),
  }))
  const steps = Array.from({ length: 10 }, (_, index) => t(`prog.steps.${index + 1}`))

  return (
    <div className="activities-page">

      <div className="page-hero">
        <div className="container page-hero__inner">
          <span className="page-hero__label">IPJBU – DUHINDURINGENDO</span>
          <h1 className="page-hero__title">{t('prog.hero.title')}</h1>
          <p className="page-hero__sub">{t('prog.hero.sub')}</p>
        </div>
      </div>

      {/* Objectives */}
      <section className="section section--white">
        <div className="container">
          <Reveal className="section__header">
            <span className="section__label">{t('prog.obj.label')}</span>
            <h2 className="section__title">{t('prog.obj.title')}</h2>
          </Reveal>
          <div className="act__grid">
            {objectives.map(({ id, icon, title, desc }) => (
              <Reveal key={id} as="article" className="act-card prog-obj-card" delay={(id - 1) * 55}>
                <div className="prog-obj-card__icon-wrap">
                  <span className="prog-obj-card__icon" aria-hidden="true">{icon}</span>
                  <span className="prog-obj-card__num">{id}</span>
                </div>
                <div className="act-card__body">
                  <h3 className="act-card__title">{title}</h3>
                  <p className="act-card__desc">{desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* How we work */}
      <section className="section section--cream">
        <div className="container">
          <Reveal className="section__header">
            <span className="section__label">{t('prog.how.label')}</span>
            <h2 className="section__title">{t('prog.how.title')}</h2>
            <p className="section__subtitle">{t('prog.how.sub')}</p>
          </Reveal>
          <ol className="prog-steps">
            {steps.map((step, i) => (
              <li key={i} className="prog-step">
                <span className="prog-step__num" aria-hidden="true">{i + 1}</span>
                <span className="prog-step__text">{step}</span>
              </li>
            ))}
          </ol>
          <p className="prog-steps__note">{t('prog.note')}</p>
        </div>
      </section>

      {/* CTA */}
      <section className="section section--green">
        <div className="container text-center">
          <h2 className="section__title" style={{ marginBottom: '0.75rem' }}>
            {t('prog.cta.title')}
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.78)', marginBottom: '1.5rem', fontSize: '1rem' }}>
            {t('prog.cta.sub')}
          </p>
          <Button to="/contact" size="lg">{t('prog.cta.btn')}</Button>
        </div>
      </section>

    </div>
  )
}
