import React from 'react'
import Button from '../components/Button'
import { useData } from '../store/DataContext'
import './Partners.css'

/* ─────────────────────────────────────────────────────────────
   PARTENAIRES — IPJBU – DUHINDURINGENDO
   Renders partners from the CMS (content.partners array).
   When the list is empty, shows a "become a partner" CTA.
───────────────────────────────────────────────────────────── */

/* Types of partnerships the association offers */
const PARTNERSHIP_TYPES = [
  {
    icon: '🌾',
    title: 'Partenariat technique',
    desc: 'Apporter une expertise agro-pastorale, des formations ou des équipements aux bénéficiaires de l\'IPJBU – DUHINDURINGENDO.',
  },
  {
    icon: '💰',
    title: 'Partenariat financier',
    desc: 'Soutenir les programmes et activités de terrain par un appui financier, sous forme de don ou de subvention de projet.',
  },
  {
    icon: '🤝',
    title: 'Partenariat institutionnel',
    desc: 'Établir une collaboration formelle entre votre organisation et l\'IPJBU – DUHINDURINGENDO pour des projets communs.',
  },
  {
    icon: '📢',
    title: 'Partenariat de communication',
    desc: 'Relayer les activités et messages de l\'IPJBU – DUHINDURINGENDO auprès de vos réseaux et communautés.',
  },
]

export default function Partners() {
  const { content } = useData()

  /* Normalise each partner entry: may be a plain string or an object */
  const rawPartners = content?.partners ?? []
  const partners = rawPartners.map((p, i) =>
    typeof p === 'string'
      ? { id: i, name: p, logoUrl: null, websiteUrl: null, description: null }
      : { id: i, name: p.name, logoUrl: p.logoUrl ?? null, websiteUrl: p.websiteUrl ?? null, description: p.description ?? null }
  )

  return (
    <div className="partners-page">

      {/* ── Page hero ── */}
      <div className="page-hero">
        <div className="container page-hero__inner">
          <span className="page-hero__label">IPJBU – DUHINDURINGENDO</span>
          <h1 className="page-hero__title">Partenaires</h1>
          <p className="page-hero__sub">
            L&apos;IPJBU – DUHINDURINGENDO avance grâce au soutien d&apos;organisations
            partageant la vision d&apos;une jeunesse burundaise autonome et prospère.
          </p>
        </div>
      </div>

      {/* ══ Current partners ══════════════════════════════════ */}
      <section className="section section--white" aria-label="Nos partenaires actuels">
        <div className="container">
          <div className="section__header">
            <span className="section__label">Ils nous accompagnent</span>
            <h2 className="section__title">Nos partenaires</h2>
          </div>

          {partners.length === 0 ? (
            /* Empty state — no partners in CMS yet */
            <div className="partners__empty">
              <span className="partners__empty-icon" aria-hidden="true">🤝</span>
              <h3>Des partenariats en cours de construction</h3>
              <p>
                L&apos;IPJBU – DUHINDURINGENDO est ouverte aux collaborations avec des
                organisations, institutions et individus partageant sa mission.
                Contactez-nous pour discuter d&apos;un partenariat.
              </p>
              <Button to="/contact">Devenir partenaire</Button>
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
                    {p.description && (
                      <p className="partner-card__desc">{p.description}</p>
                    )}
                    {p.websiteUrl && (
                      <a
                        href={p.websiteUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="partner-card__link"
                        aria-label={`Visiter le site de ${p.name}`}
                      >
                        Visiter le site ↗
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ══ Partnership types ══════════════════════════════════ */}
      <section className="section section--cream" aria-label="Types de partenariat">
        <div className="container">
          <div className="section__header">
            <span className="section__label">Comment collaborer</span>
            <h2 className="section__title">Types de partenariat</h2>
            <p className="section__subtitle">
              Plusieurs formes de collaboration sont possibles avec
              l&apos;IPJBU – DUHINDURINGENDO.
            </p>
          </div>
          <div className="partners__types-grid">
            {PARTNERSHIP_TYPES.map(({ icon, title, desc }) => (
              <div key={title} className="partners-type-card">
                <span className="partners-type-card__icon" aria-hidden="true">{icon}</span>
                <h3 className="partners-type-card__title">{title}</h3>
                <p className="partners-type-card__desc">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ Become a partner CTA ══════════════════════════════ */}
      <section className="section section--green" aria-label="Devenez partenaire">
        <div className="container text-center">
          <h2 className="section__title" style={{ marginBottom: '0.75rem' }}>
            Rejoignez notre réseau de partenaires
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.78)', marginBottom: '1.75rem', maxWidth: 560, margin: '0 auto 1.75rem', fontSize: '1.05rem', lineHeight: 1.7 }}>
            Vous souhaitez soutenir la mission de l&apos;IPJBU – DUHINDURINGENDO&nbsp;?
            Contactez-nous pour explorer les modalités d&apos;un partenariat adapté à votre organisation.
          </p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Button to="/contact" size="lg">Proposer un partenariat</Button>
            <Button to="/opportunities" size="lg" variant="outline-white">Voir les opportunités</Button>
          </div>
        </div>
      </section>

    </div>
  )
}
