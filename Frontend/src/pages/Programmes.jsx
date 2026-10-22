import React from 'react'
import Button from '../components/Button'
import './Activities.css'   /* réutilise le CSS existant */

/* ── 5 objectifs spécifiques ── */
const OBJECTIVES = [
  {
    id: 1,
    icon: '📚',
    title: 'Formation en techniques agro-pastorales',
    desc:  'Former les jeunes et les femmes vulnérables aux techniques agro-pastorales modernes pour améliorer la productivité et assurer des moyens de subsistance durables.',
  },
  {
    id: 2,
    icon: '🌐',
    title: 'Échanges d\u2019expériences nationaux et internationaux',
    desc:  'Organiser des échanges d\'expériences aux niveaux national et international pour partager les bonnes pratiques agro-pastorales et renforcer les liens entre acteurs du secteur.',
  },
  {
    id: 3,
    icon: '🛠️',
    title: 'Renforcement des capacités et équipement',
    desc:  'Renforcer les compétences en gestion des stocks et équiper les bénéficiaires en matériel agro-pastoral adapté à leurs besoins et à leur contexte local.',
  },
  {
    id: 4,
    icon: '🏭',
    title: 'Micro-unités de transformation agroalimentaire',
    desc:  'Mettre en place des micro-unités de transformation agroalimentaire pour valoriser les productions locales, réduire les pertes post-récolte et créer de la valeur ajoutée.',
  },
  {
    id: 5,
    icon: '💡',
    title: 'Promotion des nouvelles technologies agro-pastorales',
    desc:  "Promouvoir l'utilisation des nouvelles technologies agro-pastorales à travers le pays pour moderniser les pratiques et améliorer les rendements.",
  },
]

/* ── 10 étapes de travail ── */
const STEPS = [
  'Ciblage et identification des bénéficiaires',
  'Formation des formateurs',
  'Renforcement des capacités en techniques agro-pastorales',
  'Implantation de points agro-pastoraux didactiques',
  'Distribution de semences sélectionnées et de bétail/volailles de qualité',
  'Encadrement de la population cible',
  'Initiation à la construction de stocks et à la conservation des récoltes',
  "Initiation à l\u2019effet boule de neige pour étendre la couverture à tout le pays",
  "Identification des marchés d\u2019écoulement",
  "Identification des sources d\u2019approvisionnement en semences et bétail de qualité",
]

export default function Programmes() {
  return (
    <div className="activities-page">

      <div className="page-hero">
        <div className="container page-hero__inner">
          <span className="page-hero__label">Nos activités</span>
          <h1 className="page-hero__title">Programmes</h1>
          <p className="page-hero__sub">
            Découvrez les cinq objectifs spécifiques de l&apos;IPJBU et les dix étapes
            de notre méthode d&apos;intervention sur le terrain.
          </p>
        </div>
      </div>

      {/* Objectifs spécifiques */}
      <section className="section section--white">
        <div className="container">
          <div className="section__header">
            <span className="section__label">Objectifs spécifiques</span>
            <h2 className="section__title">Ce que nous visons</h2>
          </div>
          <div className="act__grid">
            {OBJECTIVES.map(({ id, icon, title, desc }) => (
              <article key={id} className="act-card prog-obj-card">
                <div className="prog-obj-card__icon-wrap">
                  <span className="prog-obj-card__icon" aria-hidden="true">{icon}</span>
                  <span className="prog-obj-card__num">{id}</span>
                </div>
                <div className="act-card__body">
                  <h3 className="act-card__title">{title}</h3>
                  <p className="act-card__desc">{desc}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Comment nous travaillons */}
      <section className="section section--cream">
        <div className="container">
          <div className="section__header">
            <span className="section__label">Notre méthode</span>
            <h2 className="section__title">Comment nous travaillons</h2>
            <p className="section__subtitle">
              Dix étapes structurées pour maximiser l'impact sur le terrain.
            </p>
          </div>
          <ol className="prog-steps">
            {STEPS.map((step, i) => (
              <li key={i} className="prog-step">
                <span className="prog-step__num" aria-hidden="true">{i + 1}</span>
                <span className="prog-step__text">{step}</span>
              </li>
            ))}
          </ol>
          <p className="prog-steps__note">
            L&apos;IPJBU sert également de <strong>point de contact</strong> entre
            l&apos;administration territoriale et les services du Ministère de l&apos;Agriculture
            et de l&apos;Élevage du Burundi.
          </p>
        </div>
      </section>

      {/* CTA */}
      <section className="section section--green">
        <div className="container text-center">
          <h2 className="section__title" style={{ marginBottom: '0.75rem' }}>
            Intéressé par nos programmes&nbsp;?
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.78)', marginBottom: '1.5rem', fontSize: '1rem' }}>
            Contactez-nous pour en savoir plus sur nos formations et nos activités sur le terrain.
          </p>
          <Button to="/contact" size="lg">Contacter l'IPJBU</Button>
        </div>
      </section>

    </div>
  )
}
