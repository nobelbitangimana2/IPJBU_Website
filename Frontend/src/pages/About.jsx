import React from 'react'
import Button from '../components/Button'
import Reveal from '../components/Reveal'
import { useData } from '../store/DataContext'
import { useLang } from '../store/LangContext'
import './About.css'

const VALUES = [
  { icon: '🤝', titleKey: 'val.integrity.title', textKey: 'val.integrity.desc' },
  { icon: '📊', titleKey: 'val.account.title', textKey: 'val.account.desc' },
  { icon: '🌍', titleKey: 'val.solidarity.title', textKey: 'val.solidarity.desc' },
  { icon: '💚', titleKey: 'val.empathy.title', textKey: 'val.empathy.desc' },
]

const ORGANS = [
  { icon: '🏛️', titleKey: 'about.organs.general', descKey: 'about.organs.general.desc' },
  { icon: '⚙️', titleKey: 'about.organs.executive', descKey: 'about.organs.executive.desc' },
  { icon: '🔍', titleKey: 'about.organs.oversight', descKey: 'about.organs.oversight.desc' },
]

const MEMBER_TYPES = [
  { typeKey: 'about.members.founders', descKey: 'about.members.founders.desc' },
  { typeKey: 'about.members.active', descKey: 'about.members.active.desc' },
  { typeKey: 'about.members.honorary', descKey: 'about.members.honorary.desc' },
  { typeKey: 'about.members.supporters', descKey: 'about.members.supporters.desc' },
]

export default function About() {
  const { content, team } = useData()
  const { t } = useLang()

  return (
    <div className="about-page">

      {/* Hero */}
      <div className="page-hero">
        <div className="container page-hero__inner">
          <span className="page-hero__label">{t('about.hero.label')}</span>
          <h1 className="page-hero__title">{t('about.hero.title')}</h1>
          <p className="page-hero__sub">{t('about.hero.sub')}</p>
        </div>
      </div>

      {/* Présentation */}
      <section className="section section--white">
        <div className="container">
          <div className="about__intro-grid">
            <div className="about__intro-text">
              <span className="section__label">{t('about.presentation.label')}</span>
              <h2 className="section__title">IPJBU – DUHINDURINGENDO</h2>
              <p style={{ color: 'var(--text-light)', lineHeight: 1.75, marginTop: '1rem' }}>
                {t('about.presentation.one')}
              </p>
              <p style={{ color: 'var(--text-light)', lineHeight: 1.75, marginTop: '0.75rem' }}>
                {t('about.presentation.two')}
              </p>
              <p style={{ color: 'var(--text-light)', lineHeight: 1.75, marginTop: '0.75rem' }}>
                {t('about.presentation.three')}
              </p>
            </div>
            <div className="about__intro-aside">
              <div className="about__legal-card">
                <span className="about__legal-icon" aria-hidden="true">📜</span>
                <h3>{t('about.legal.title')}</h3>
                <p>{t('about.legal.body')}</p>
                <p className="about__legal-ref"><strong>{t('about.legal.reference')}</strong></p>
                <p className="about__legal-motto">{t('about.legal.motto')}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="section section--basil about__mv-section">
        <div className="container">
          <div className="about__mv-grid">
            <div className="about__mv-card">
              <span className="about__mv-icon" aria-hidden="true">🎯</span>
              <h3>{t('about.mission')}</h3>
              <p>{content.mission || t('about.loading')}</p>
            </div>
            <div className="about__mv-card">
              <span className="about__mv-icon" aria-hidden="true">🌍</span>
              <h3>{t('about.vision')}</h3>
              <p>{content.vision || t('about.loading')}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Objectif principal */}
      <section className="section section--cream">
        <div className="container">
          <Reveal className="section__header">
            <span className="section__label">{t('about.objective.label')}</span>
            <h2 className="section__title">{t('about.objective.title')}</h2>
          </Reveal>
          <div className="about__obj-block">
            <span className="about__obj-icon" aria-hidden="true">🚀</span>
            <p className="about__obj-text">{t('about.objective.body')}</p>
          </div>
        </div>
      </section>

      {/* Valeurs */}
      <section className="section section--white">
        <div className="container">
          <Reveal className="section__header">
            <span className="section__label">{t('about.values.label')}</span>
            <h2 className="section__title">{t('about.values.title')}</h2>
          </Reveal>
          <div className="about__values-grid">
            {VALUES.map(({ icon, titleKey, textKey }, index) => (
              <Reveal key={titleKey} as="article" className="about__val-card" delay={index * 65}>
                <span className="about__val-icon" aria-hidden="true">{icon}</span>
                <h4 className="about__val-title">{t(titleKey)}</h4>
                <p className="about__val-text">{t(textKey)}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Public cible */}
      <section className="section section--cream">
        <div className="container">
          <Reveal className="section__header">
            <span className="section__label">{t('about.beneficiaries.label')}</span>
            <h2 className="section__title">{t('about.beneficiaries.title')}</h2>
          </Reveal>
          <div className="about__target-grid">
            {[
              { icon: '👩‍🌾', label: t('about.target.youth'), desc: t('about.target.youth.desc') },
              { icon: '👦', label: t('about.target.orphans'), desc: t('about.target.orphans.desc') },
              { icon: '🤱', label: t('about.target.women'), desc: t('about.target.women.desc') },
            ].map(({ icon, label, desc }, index) => (
              <Reveal key={label} as="article" className="about__target-card" delay={index * 65}>
                <span className="about__target-icon" aria-hidden="true">{icon}</span>
                <h4>{label}</h4>
                <p>{desc}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Organes */}
      <section className="section section--white">
        <div className="container">
          <Reveal className="section__header">
            <span className="section__label">{t('about.governance.label')}</span>
            <h2 className="section__title">{t('about.governance.title')}</h2>
          </Reveal>
          <div className="about__organs-grid">
            {ORGANS.map(({ icon, titleKey, descKey }) => (
              <Reveal key={titleKey} as="article" className="about__organ-card">
                <span className="about__organ-icon" aria-hidden="true">{icon}</span>
                <h4 className="about__organ-title">{t(titleKey)}</h4>
                <p className="about__organ-desc">{t(descKey)}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Types de membres */}
      <section className="section section--cream">
        <div className="container">
          <Reveal className="section__header">
            <span className="section__label">{t('about.members.label')}</span>
            <h2 className="section__title">{t('about.members.title')}</h2>
          </Reveal>
          <div className="about__members-grid">
            {MEMBER_TYPES.map(({ typeKey, descKey }) => (
              <Reveal key={typeKey} as="article" className="about__member-card">
                <h4 className="about__member-type">{t(typeKey)}</h4>
                <p className="about__member-desc">{t(descKey)}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Équipe */}
      <section className="section section--white">
          <div className="container">
            <Reveal className="section__header">
              <span className="section__label">{t('about.team.eyebrow')}</span>
              <h2 className="section__title">{t('about.team.title')}</h2>
            </Reveal>
            {team.length > 0 ? (
              <div className="about__team-grid">
                {team.map(({ id, name, role, bio, photoUrl }, index) => (
                  <Reveal key={id} as="article" className="about__team-card" delay={index * 70}>
                    <div className="about__team-photo-wrap">
                      {photoUrl ? (
                        <img src={photoUrl} alt={name} className="about__team-photo" loading="lazy" />
                      ) : (
                        <span className="about__team-avatar" aria-hidden="true">
                          {name.split(/\s+/).filter(Boolean).slice(0, 2).map(part => part[0]).join('').toUpperCase()}
                        </span>
                      )}
                    </div>
                    <div className="about__team-info">
                      <h3 className="about__team-name">{name}</h3>
                      <p className="about__team-role">{role}</p>
                      {bio && <p className="about__team-bio">{bio}</p>}
                    </div>
                  </Reveal>
                ))}
              </div>
            ) : (
              <p className="about__team-empty">{t('about.team.empty')}</p>
            )}
          </div>
      </section>

      {/* Partenaires — affichés uniquement si la liste est non-vide */}
      {(content.partners || []).length > 0 && (
        <section className="section section--basil">
          <div className="container">
            <Reveal className="section__header">
              <span className="section__label">{t('about.partners.eyebrow')}</span>
              <h2 className="section__title">{t('about.partners.title')}</h2>
              <p className="section__subtitle">{t('about.partners.sub')}</p>
            </Reveal>
            <div className="about__partners">
              {content.partners.map((entry, index) => {
                const partner = typeof entry === 'string' ? { name: entry } : entry
                const badge = partner.logoUrl
                  ? <img src={partner.logoUrl} alt={partner.name} className="about__partner-logo" loading="lazy" />
                  : partner.name
                return partner.websiteUrl
                  ? <a key={`${partner.name}-${index}`} href={partner.websiteUrl} target="_blank" rel="noopener noreferrer" className="about__partner-badge">{badge}</a>
                  : <div key={`${partner.name}-${index}`} className="about__partner-badge">{badge}</div>
              })}
            </div>
            <div className="text-center mt-3">
              <Button to="/contact" variant="outline-white">{t('about.partners.cta')}</Button>
            </div>
          </div>
        </section>
      )}

    </div>
  )
}
