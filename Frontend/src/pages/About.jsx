import React from 'react'
import Button from '../components/Button'
import { useData } from '../store/DataContext'
import './About.css'

const VALUES = [
  { icon: '🤝', title: 'Intégrité',    text: 'Nous agissons avec honnêteté et transparence dans toutes nos relations et engagements.' },
  { icon: '📊', title: 'Redevabilité', text: 'Nous rendons compte de nos actions aux bénéficiaires, aux partenaires et à la communauté.' },
  { icon: '🌍', title: 'Solidarité',   text: 'Nous unissons les efforts des jeunes et des femmes pour un développement collectif et durable.' },
  { icon: '💚', title: 'Empathie',     text: 'Nous plaçons au cœur de notre action les besoins réels des personnes les plus vulnérables.' },
]

const ORGANS = [
  { icon: '🏛️', title: "Assemblée Générale",    desc: "Organe souverain de l'association, réunit tous les membres pour les décisions stratégiques." },
  { icon: '⚙️',  title: 'Comité Exécutif',       desc: "Assure la gestion quotidienne et la mise en œuvre des décisions de l'Assemblée Générale." },
  { icon: '🔍', title: 'Comité de Surveillance', desc: "Contrôle la conformité des activités avec les statuts et les décisions associatives." },
]

const MEMBER_TYPES = [
  { type: 'Fondateurs',    desc: "Membres ayant participé à la création de l'association." },
  { type: 'Adhérents',     desc: "Membres actifs qui adhèrent aux objectifs et paient leur cotisation." },
  { type: "D'honneur",     desc: "Personnalités reconnues pour leur contribution exceptionnelle à la cause." },
  { type: 'Sympathisants', desc: "Personnes soutenant moralement ou financièrement l'association sans en être membres actifs." },
]

export default function About() {
  const { content, team } = useData()

  return (
    <div className="about-page">

      {/* Hero */}
      <div className="page-hero">
        <div className="container page-hero__inner">
          <span className="page-hero__label">À propos de l'IPJBU</span>
          <h1 className="page-hero__title">Qui sommes-nous&nbsp;?</h1>
          <p className="page-hero__sub">
            Une association burundaise agréée, dédiée à l'autopromotion de la jeunesse
            et des femmes vulnérables par le développement agro-pastoral durable.
          </p>
        </div>
      </div>

      {/* Présentation */}
      <section className="section section--white">
        <div className="container">
          <div className="about__intro-grid">
            <div className="about__intro-text">
              <span className="section__label">Présentation</span>
              <h2 className="section__title">IPJBU – DUHINDURINGENDO</h2>
              <p style={{ color: 'var(--text-light)', lineHeight: 1.75, marginTop: '1rem' }}>
                L'<strong>Initiative pour l'Autopromotion Socio-économique de la Jeunesse au Burundi</strong> (IPJBU – DUHINDURINGENDO)
                est une organisation de la société civile burundaise œuvrant dans le secteur agro-pastoral.
              </p>
              <p style={{ color: 'var(--text-light)', lineHeight: 1.75, marginTop: '0.75rem' }}>
                Elle cible en priorité <strong>la jeunesse, les orphelins et les femmes vulnérables</strong>,
                en leur offrant formation, équipement et accompagnement pour bâtir une autonomie durable.
              </p>
              <p style={{ color: 'var(--text-light)', lineHeight: 1.75, marginTop: '0.75rem' }}>
                Elle sert également de <strong>point de contact</strong> entre l'administration territoriale
                et les services du Ministère de l'Agriculture et de l'Élevage.
              </p>
            </div>
            <div className="about__intro-aside">
              <div className="about__legal-card">
                <span className="about__legal-icon" aria-hidden="true">📜</span>
                <h3>Statut juridique</h3>
                <p>Association agréée par Ordonnance Ministérielle</p>
                <p className="about__legal-ref"><strong>n° 530/1158 du 12/05/2025</strong></p>
                <p className="about__legal-motto">« Jeunesse Burundaise, faisons la différence »</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="section section--green about__mv-section">
        <div className="container">
          <div className="about__mv-grid">
            <div className="about__mv-card">
              <span className="about__mv-icon" aria-hidden="true">🎯</span>
              <h3>Notre Mission</h3>
              <p>{content.mission || 'Chargement…'}</p>
            </div>
            <div className="about__mv-card">
              <span className="about__mv-icon" aria-hidden="true">🌍</span>
              <h3>Notre Vision</h3>
              <p>{content.vision || 'Chargement…'}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Objectif principal */}
      <section className="section section--cream">
        <div className="container">
          <div className="section__header">
            <span className="section__label">Objectif principal</span>
            <h2 className="section__title">Notre raison d'agir</h2>
          </div>
          <div className="about__obj-block">
            <span className="about__obj-icon" aria-hidden="true">🚀</span>
            <p className="about__obj-text">
              Lutter contre la pauvreté par le développement agro-pastoral à travers
              des actions concrètes de <strong>formation</strong> et de <strong>soutien</strong> aux
              bénéficiaires sur l'ensemble du territoire burundais.
            </p>
          </div>
        </div>
      </section>

      {/* Valeurs */}
      <section className="section section--white">
        <div className="container">
          <div className="section__header">
            <span className="section__label">Ce qui nous guide</span>
            <h2 className="section__title">Nos valeurs</h2>
          </div>
          <div className="about__values-grid">
            {VALUES.map(({ icon, title, text }) => (
              <div key={title} className="about__val-card">
                <span className="about__val-icon" aria-hidden="true">{icon}</span>
                <h4 className="about__val-title">{title}</h4>
                <p className="about__val-text">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Public cible */}
      <section className="section section--cream">
        <div className="container">
          <div className="section__header">
            <span className="section__label">Bénéficiaires</span>
            <h2 className="section__title">Public cible</h2>
          </div>
          <div className="about__target-grid">
            {[
              { icon: '👩‍🌾', label: 'La jeunesse',                  desc: "Jeunes burundais en quête d'autonomie socio-économique." },
              { icon: '👦',   label: 'Les orphelins',                desc: 'Enfants et jeunes orphelins nécessitant un soutien structuré.' },
              { icon: '🤱',   label: 'Les femmes vulnérables',       desc: 'Femmes en situation de précarité économique et sociale.' },
            ].map(({ icon, label, desc }) => (
              <div key={label} className="about__target-card">
                <span className="about__target-icon" aria-hidden="true">{icon}</span>
                <h4>{label}</h4>
                <p>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Organes */}
      <section className="section section--white">
        <div className="container">
          <div className="section__header">
            <span className="section__label">Gouvernance</span>
            <h2 className="section__title">Organes de l'association</h2>
          </div>
          <div className="about__organs-grid">
            {ORGANS.map(({ icon, title, desc }) => (
              <div key={title} className="about__organ-card">
                <span className="about__organ-icon" aria-hidden="true">{icon}</span>
                <h4 className="about__organ-title">{title}</h4>
                <p className="about__organ-desc">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Types de membres */}
      <section className="section section--cream">
        <div className="container">
          <div className="section__header">
            <span className="section__label">Adhésion</span>
            <h2 className="section__title">Types de membres</h2>
          </div>
          <div className="about__members-grid">
            {MEMBER_TYPES.map(({ type, desc }) => (
              <div key={type} className="about__member-card">
                <h4 className="about__member-type">Membres {type}</h4>
                <p className="about__member-desc">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Équipe — affichée uniquement si des membres existent */}
      {team.length > 0 && (
        <section className="section section--white">
          <div className="container">
            <div className="section__header">
              <span className="section__label">Les personnes derrière le travail</span>
              <h2 className="section__title">Notre équipe</h2>
            </div>
            <div className="about__team-grid">
              {team.map(({ id, name, role, bio, photoUrl }) => (
                <article key={id} className="about__team-card">
                  <div className="about__team-photo-wrap">
                    <img src={photoUrl} alt={name} className="about__team-photo" loading="lazy" />
                  </div>
                  <div className="about__team-info">
                    <h3 className="about__team-name">{name}</h3>
                    <p className="about__team-role">{role}</p>
                    {bio && <p className="about__team-bio">{bio}</p>}
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Partenaires — affichés uniquement si la liste est non-vide */}
      {(content.partners || []).length > 0 && (
        <section className="section section--green">
          <div className="container">
            <div className="section__header">
              <span className="section__label">Travailler ensemble</span>
              <h2 className="section__title">Nos partenaires</h2>
              <p className="section__subtitle">
                L'IPJBU collabore avec des organisations nationales et internationales.
              </p>
            </div>
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
              <Button to="/contact">Devenir partenaire</Button>
            </div>
          </div>
        </section>
      )}

    </div>
  )
}
