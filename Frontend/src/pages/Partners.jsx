import React from 'react'
import Button from '../components/Button'
import { useData } from '../store/DataContext'
import { useLang } from '../store/LangContext'
import './Partners.css'

const TYPES_FR = [
  { icon: '🌾', title: 'Partenariat technique',         desc: "Apporter une expertise agro-pastorale, des formations ou des equipements aux beneficiaires de l'IPJBU." },
  { icon: '💰', title: 'Partenariat financier',          desc: "Soutenir les programmes et activites de terrain par un appui financier, sous forme de don ou de subvention." },
  { icon: '🤝', title: 'Partenariat institutionnel',     desc: "Etablir une collaboration formelle entre votre organisation et l'IPJBU pour des projets communs." },
  { icon: '📢', title: 'Partenariat de communication',   desc: "Relayer les activites et messages de l'IPJBU aupres de vos reseaux et communautes." },
]

const TYPES_EN = [
  { icon: '🌾', title: 'Technical partnership',         desc: "Provide agro-pastoral expertise, training or equipment to IPJBU beneficiaries." },
  { icon: '💰', title: 'Financial partnership',          desc: "Support field programmes and activities through financial backing, as a donation or project grant." },
  { icon: '🤝', title: 'Institutional partnership',     desc: "Establish a formal collaboration between your organisation and IPJBU for joint projects." },
  { icon: '📢', title: 'Communication partnership',     desc: "Relay IPJBU activities and messages to your networks and communities." },
]

export default function Partners() {
  const { content }     = useData()
  const { t, lang }     = useLang()
  const types           = lang === 'fr' ? TYPES_FR : TYPES_EN

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
          <div className="section__header">
            <span className="section__label">{lang === 'fr' ? 'Ils nous accompagnent' : 'Supporting us'}</span>
            <h2 className="section__title">{lang === 'fr' ? 'Nos partenaires' : 'Our partners'}</h2>
          </div>

          {partners.length === 0 ? (
            <div className="partners__empty">
              <span className="partners__empty-icon" aria-hidden="true">🤝</span>
              <h3>{t('partners.empty.title')}</h3>
              <p>
                {lang === 'fr'
                  ? "L'IPJBU est ouverte aux collaborations avec des organisations, institutions et individus partageant sa mission. Contactez-nous pour discuter d'un partenariat."
                  : "IPJBU is open to collaborations with organisations, institutions and individuals sharing its mission. Contact us to discuss a partnership."}
              </p>
              <Button to="/contact">{t('partners.cta.btn')}</Button>
            </div>
          ) : (
            <div className="partners__grid">
              {partners.map(p => (
                <div key={p.id} className="partner-card">
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
                        aria-label={`${lang === 'fr' ? 'Visiter le site de' : 'Visit website of'} ${p.name}`}>
                        {lang === 'fr' ? 'Visiter le site' : 'Visit website'} &uarr;
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Partnership types */}
      <section className="section section--cream">
        <div className="container">
          <div className="section__header">
            <span className="section__label">{lang === 'fr' ? 'Comment collaborer' : 'How to collaborate'}</span>
            <h2 className="section__title">{lang === 'fr' ? 'Types de partenariat' : 'Partnership types'}</h2>
          </div>
          <div className="partners__types-grid">
            {types.map(({ icon, title, desc }) => (
              <div key={title} className="partners-type-card">
                <span className="partners-type-card__icon" aria-hidden="true">{icon}</span>
                <h3 className="partners-type-card__title">{title}</h3>
                <p className="partners-type-card__desc">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section section--green">
        <div className="container text-center">
          <h2 className="section__title" style={{ marginBottom: '0.75rem' }}>
            {lang === 'fr' ? 'Rejoignez notre reseau de partenaires' : 'Join our partner network'}
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.78)', marginBottom: '1.75rem', maxWidth: 560, margin: '0 auto 1.75rem', fontSize: '1.05rem', lineHeight: 1.7 }}>
            {lang === 'fr'
              ? "Vous souhaitez soutenir la mission de l'IPJBU ? Contactez-nous pour explorer les modalites d'un partenariat adapte a votre organisation."
              : "Would you like to support the mission of IPJBU? Contact us to explore partnership options suited to your organisation."}
          </p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Button to="/contact" size="lg">{t('partners.cta.btn')}</Button>
            <Button to="/opportunities" size="lg" variant="outline-white">
              {lang === 'fr' ? 'Voir les opportunites' : 'View opportunities'}
            </Button>
          </div>
        </div>
      </section>

    </div>
  )
}
